// supabase/functions/clever-responder/index.ts

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import {
  createSecurityMiddleware,
  validateUUID,
  sanitizeString,
  validateImageFile,
} from "../_shared/security.ts";

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const BUCKET_NAME = 'make-be0083bc-project-images';
const TABLE_NAME = 'project-table-seadek';

// Security configs
const publicSecurity = createSecurityMiddleware({
  requireAuth: false,
  rateLimit: { windowMs: 60000, maxRequests: 100 }
});

const protectedSecurity = createSecurityMiddleware({
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 30 }
});

// Initialize storage
async function initStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 52428800,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });
      console.log(`Created storage bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.error('Error initializing storage bucket:', error);
  }
}

initStorage();

// Middleware
app.use('*', logger());

app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // or '*'
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-signature, x-timestamp');
  c.header('Access-Control-Allow-Credentials', 'true');

  // Preflight requests must respond with 200
  if (c.req.method === 'OPTIONS') {
    return c.text('OK', 200);
  }

  await next();
});


// Health check
app.get("/clever-responder/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET all projects (public)
app.get("/clever-responder/projects", async (c) => {
  try {
    const { data: projects, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }

    const projectsWithUrls = (projects || []).map((p: any) => {
      const paths = p.ImageURLs || [];
      const publicUrls = paths.map((path: string) => {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
        return data?.publicUrl ?? null;
      }).filter(Boolean);

      return {
        id: p.id,
        title: p.ProjectTitle,
        description: p.ProjectDescription,
        createdAt: p.created_at,
        imageUrls: publicUrls,
        services: p.services || []
      };
    });

    return c.json({ success: true, projects: projectsWithUrls });
  } catch (error: any) {
    console.error("Error:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// GET single project (public)
app.get("/clever-responder/projects/:id", publicSecurity, async (c) => {
  try {
    const projectId = c.req.param("id");
    
    if (!validateUUID(projectId)) {
      return c.json({ error: "Invalid project ID format" }, 400);
    }

    const { data: project, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      return c.json({ error: "Project not found" }, 404);
    }

    const paths = project.ImageURLs || [];
    const publicUrls = paths.map((path: string) => {
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
      return data?.publicUrl ?? null;
    }).filter(Boolean);

    return c.json({
      success: true,
      project: {
        id: project.id,
        title: project.ProjectTitle,
        description: project.ProjectDescription,
        createdAt: project.created_at,
        imageUrls: publicUrls,
        services: project.services || []
      }
    });
  } catch (error: any) {
    console.error("Error:", error);
    return c.json({ error: "Failed to fetch project" }, 500);
  }
});

// POST create project (protected)
app.post("/clever-responder/projects", protectedSecurity, async (c) => {
  const clientIP = c.get('clientIP');
  
  try {
    const formData = await c.req.formData();
    
    const title = sanitizeString(formData.get('title') as string, 255);
    const details = sanitizeString(formData.get('details') as string, 10000);
    const images = formData.getAll('images');
    const services = formData.getAll('services').map(s => sanitizeString(s as string, 100));

    if (!title || title.length < 3) {
      return c.json({ error: 'Title is required (min 3 characters)' }, 400);
    }

    if (!details || details.length < 10) {
      return c.json({ error: 'Details are required (min 10 characters)' }, 400);
    }

    if (images.length > 10) {
      return c.json({ error: 'Maximum 10 images allowed' }, 400);
    }

    const projectId = crypto.randomUUID();
    const imagePaths: string[] = [];

    // Upload images
    for (let i = 0; i < images.length; i++) {
      const image = images[i] as File;
      
      if (image && image.size > 0) {
        const validation = validateImageFile(image);
        if (!validation.valid) {
          return c.json({ error: validation.error }, 400);
        }

        const ext = image.name.split('.').pop()?.toLowerCase() || 'jpg';
        const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
        const fileName = `${projectId}/${Date.now()}-${i}.${safeExt}`;
        
        const arrayBuffer = await image.arrayBuffer();
        const fileData = new Uint8Array(arrayBuffer);

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, fileData, {
            contentType: image.type,
            upsert: false
          });

        if (uploadError) {
          // Cleanup on failure
          if (imagePaths.length > 0) {
            await supabase.storage.from(BUCKET_NAME).remove(imagePaths);
          }
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        imagePaths.push(fileName);
      }
    }

    // Insert into database
    const { data: insertedProject, error: dbError } = await supabase
      .from(TABLE_NAME)
      .insert([{
        ProjectTitle: title,
        ProjectDescription: details,
        ImageURLs: imagePaths,
        services: services,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (dbError) {
      if (imagePaths.length > 0) {
        await supabase.storage.from(BUCKET_NAME).remove(imagePaths);
      }
      throw dbError;
    }

    // Generate public URLs for response
    const publicUrls = imagePaths.map((path: string) => {
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
      return data?.publicUrl ?? null;
    }).filter(Boolean);

    return c.json({ 
      success: true, 
      project: {
        id: insertedProject.id,
        title,
        description: details,
        imageUrls: publicUrls,
        services,
        createdAt: insertedProject.created_at
      }
    }, 201);

  } catch (error) {
    console.error('Error creating project:', error);
    return c.json({ 
      error: 'Failed to create project', 
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// DELETE project (protected)
app.delete("/clever-responder/projects/:id", protectedSecurity, async (c) => {
  const clientIP = c.get('clientIP');
  
  try {
    const projectId = c.req.param("id");


    // Fetch project
    const { data: projectData, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("id, ImageURLs, ProjectTitle")
      .eq("id", projectId)
      .single();

    if (fetchError) {
      return c.json({ error: "Project not found" }, 404);
    }

    const imagePaths: string[] = projectData?.ImageURLs || [];

    // Delete images
    if (imagePaths.length > 0) {
      await supabase.storage.from(BUCKET_NAME).remove(imagePaths);
    }

    // Delete from database
    const { error: deleteDbError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", projectId);

    if (deleteDbError) {
      return c.json({ error: "Failed to delete project" }, 500);
    }

    return c.json({ success: true, message: `Project ${projectId} deleted` });

  } catch (error: any) {
    console.error("Error deleting project:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

Deno.serve(app.fetch);