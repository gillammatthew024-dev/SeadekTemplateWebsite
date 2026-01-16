// supabase/functions/make-server-be0083bc/index.ts

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
import * as kv from "./kv_store.tsx";

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const BUCKET_NAME = 'make-be0083bc-project-images';
const TABLE_NAME = 'project-table';

// Pre-create middleware instances
const publicSecurity = createSecurityMiddleware({
  requireAuth: false,
  rateLimit: { windowMs: 60000, maxRequests: 100 }
});

const protectedSecurity = createSecurityMiddleware({
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 30 }
});

// Initialize storage bucket
async function initStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });
      console.log(`Created storage bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.error('Error initializing storage bucket:', error);
  }
}

initStorage()
// ... other setup code

// Enable logger
app.use('*', logger());

// CORS middleware
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
app.get("/make-server-be0083bc/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET all projects (public)
app.get("/make-server-be0083bc/projects", publicSecurity, async (c) => {
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

    return c.json({
      success: true,
      projects: projectsWithUrls,
      count: projectsWithUrls.length
    });

  } catch (error: any) {
    console.error("Error:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// GET single project (public)
app.get("/make-server-be0083bc/projects/:id", publicSecurity, async (c) => {
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
app.post("/make-server-be0083bc/projects", protectedSecurity, async (c) => {
  const clientIP = c.get('clientIP');
  
  try {
    const formData = await c.req.formData();
    
    const title = sanitizeString(formData.get('title') as string, 255);
    const details = sanitizeString(formData.get('details') as string, 10000);
    const images = formData.getAll('images');
    const services = formData.getAll('services').map(s => sanitizeString(s as string, 100));

    // Validation
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
    const imageUrls: string[] = [];
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
          console.error(`Error uploading image ${i}:`, uploadError);
          // Cleanup previously uploaded images
          if (imagePaths.length > 0) {
            await supabase.storage.from(BUCKET_NAME).remove(imagePaths);
          }
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          imageUrls.push(urlData.publicUrl);
        }
        imagePaths.push(fileName);
      }
    }

    // Prepare project metadata for KV (optional cache)
    const project = {
      id: projectId,
      title,
      details,
      imageUrls,
      services,
      createdAt: new Date().toISOString()
    };

    // Store in KV (optional)
    try {
      await kv.set(`project:${projectId}`, project);
    } catch (kvError) {
      console.warn('KV storage failed (non-critical):', kvError);
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
      console.error('Error inserting into project-table:', dbError);
      // Cleanup uploaded images
      if (imagePaths.length > 0) {
        await supabase.storage.from(BUCKET_NAME).remove(imagePaths);
      }
      throw dbError;
    }
    return c.json({ 
      success: true, 
      project: {
        id: insertedProject.id,
        title,
        description: details,
        imageUrls,
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

// PUT update project (protected)
app.put("/make-server-be0083bc/projects/:id", protectedSecurity, async (c) => {
  const clientIP = c.get('clientIP');
  
  try {
    const projectId = c.req.param("id");
    
    if (!validateUUID(projectId)) {
      return c.json({ error: "Invalid project ID format" }, 400);
    }

    // Verify project exists
    const { data: existingProject, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchError || !existingProject) {
      return c.json({ error: "Project not found" }, 404);
    }

    const formData = await c.req.formData();
    
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    const title = formData.get('title');
    if (title) {
      const sanitizedTitle = sanitizeString(title as string, 255);
      if (sanitizedTitle.length >= 3) {
        updateData.ProjectTitle = sanitizedTitle;
      }
    }

    const details = formData.get('details');
    if (details) {
      const sanitizedDetails = sanitizeString(details as string, 10000);
      if (sanitizedDetails.length >= 10) {
        updateData.ProjectDescription = sanitizedDetails;
      }
    }

    const services = formData.getAll('services');
    if (services.length > 0) {
      updateData.services = services.map(s => sanitizeString(s as string, 100));
    }

    // Handle image updates
    const newImages = formData.getAll('images');
    const deleteImages = formData.getAll('deleteImages').map(s => s as string);

    let currentImagePaths = [...(existingProject.ImageURLs || [])];
    
    // Delete specified images
    if (deleteImages.length > 0) {
      const validDeletions = deleteImages.filter(path => 
        path.startsWith(`${projectId}/`) && currentImagePaths.includes(path)
      );
      
      if (validDeletions.length > 0) {
        await supabase.storage.from(BUCKET_NAME).remove(validDeletions);
        currentImagePaths = currentImagePaths.filter(p => !validDeletions.includes(p));
      }
    }

    // Upload new images (up to 10 total)
    for (let i = 0; i < newImages.length && currentImagePaths.length < 10; i++) {
      const image = newImages[i] as File;
      
      if (image && image.size > 0) {
        const validation = validateImageFile(image);
        if (!validation.valid) {
          continue; // Skip invalid images in update
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

        if (!uploadError) {
          currentImagePaths.push(fileName);
        }
      }
    }

    updateData.ImageURLs = currentImagePaths;

    // Update database
    const { data: updatedProject, error: updateError } = await supabase
      .from(TABLE_NAME)
      .update(updateData)
      .eq("id", projectId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Update KV cache
    try {
      await kv.set(`project:${projectId}`, {
        id: updatedProject.id,
        title: updatedProject.ProjectTitle,
        details: updatedProject.ProjectDescription,
        services: updatedProject.services,
        updatedAt: updatedProject.updated_at
      });
    } catch (kvError) {
      console.warn('KV update failed (non-critical):', kvError);
    }

    // Generate public URLs
    const publicUrls = currentImagePaths.map((path: string) => {
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
      return data?.publicUrl ?? null;
    }).filter(Boolean);

    return c.json({
      success: true,
      project: {
        id: updatedProject.id,
        title: updatedProject.ProjectTitle,
        description: updatedProject.ProjectDescription,
        imageUrls: publicUrls,
        services: updatedProject.services || [],
        createdAt: updatedProject.created_at,
        updatedAt: updatedProject.updated_at
      }
    });

  } catch (error: any) {
    console.error("Error updating project:", error);
    return c.json({ error: "Failed to update project" }, 500);
  }
});

// DELETE project (protected)
app.delete("/make-server-be0083bc/projects/:id", publicSecurity, async (c) => {
  const clientIP = c.get('clientIP');
  
  try {
    const projectId = c.req.param("id");

    // Fetch project to get image paths
    const { data: projectData, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("id, ImageURLs, ProjectTitle")
      .eq("id", projectId)
      .single();

    if (fetchError) {
      console.error("Error fetching project for delete:", fetchError);
      return c.json({ error: "Project not found" }, 404);
    }

    const imagePaths: string[] = projectData?.ImageURLs || [];

    // Delete images from storage
    if (imagePaths.length > 0) {
      const { error: deleteImagesError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(imagePaths);

      if (deleteImagesError) {
        console.error("Error deleting images:", deleteImagesError);
        // Continue anyway
      }
    }

    // Delete from database
    const { error: deleteDbError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", projectId);

    if (deleteDbError) {
      console.error("Error deleting project from DB:", deleteDbError);
      return c.json({ error: "Failed to delete project" }, 500);
    }

    return c.json({ 
      success: true, 
      message: `Project ${projectId} deleted`,
      imagesRemoved: imagePaths.length
    });

  } catch (error: any) {
    console.error("Error deleting project:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

Deno.serve(app.fetch);