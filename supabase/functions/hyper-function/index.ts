// supabase/functions/hyper-function/index.ts

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

// Create Supabase client with service role key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Constants
const BUCKET_NAME = 'service-images';
const TABLE_NAME = 'service-table';

// Security middleware instances
const publicSecurity = createSecurityMiddleware({
  requireAuth: false,
  rateLimit: { windowMs: 60000, maxRequests: 100 }
});

const protectedSecurity = createSecurityMiddleware({
  requireAuth: true,
  rateLimit: { windowMs: 60000, maxRequests: 30 }
});

// Valid currencies
const VALID_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

// Initialize storage bucket on startup
async function initStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
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


// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format price from cents to display string
 */
function formatPrice(cents: number, currency: string): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Transform database row to API response format
 */
function transformService(row: any) {
  return {
    id: row.id,
    title: row.title,
    details: row.details,
    icon: row.icon,
    imageUrl: row.image_url
      ? supabase.storage.from(BUCKET_NAME).getPublicUrl(row.image_url).data?.publicUrl
      : null,
    price: row.price_cents ? {
      amount: row.price_cents,
      currency: row.currency || 'USD',
      formatted: formatPrice(row.price_cents, row.currency || 'USD')
    } : null,
    isBookable: row.is_bookable || false,
    durationMinutes: row.duration_minutes || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at || null
  };
}

/**
 * Parse and validate price input
 */
function parsePriceCents(value: string | null): number | null {
  if (!value) return null;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0) return null;
  return parsed;
}

/**
 * Parse and validate duration input
 */
function parseDuration(value: string | null): number | null {
  if (!value) return null;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0) return null;
  return parsed;
}

/**
 * Validate and normalize currency
 */
function validateCurrency(value: string | null): string {
  if (!value) return 'USD';
  const upper = value.toUpperCase().trim();
  return VALID_CURRENCIES.includes(upper) ? upper : 'USD';
}

// ============================================================================
// ROUTES
// ============================================================================

// Health check endpoint
app.get("/hyper-function/health", (c) => {
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "2.0.0"
  });
});

// ----------------------------------------------------------------------------
// GET /services - List all services (public)
// ----------------------------------------------------------------------------
app.get("/hyper-function/services", publicSecurity, async (c) => {
  try {
    // Parse query parameters for filtering
    const url = new URL(c.req.url);
    const bookableFilter = url.searchParams.get('bookable');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const limit = url.searchParams.get('limit');
    const offset = url.searchParams.get('offset');

    // Build query
    let query = supabase
      .from(TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (bookableFilter !== null) {
      query = query.eq('is_bookable', bookableFilter === 'true');
    }
    
    if (minPrice) {
      const min = parseInt(minPrice, 10);
      if (!isNaN(min)) {
        query = query.gte('price_cents', min);
      }
    }
    
    if (maxPrice) {
      const max = parseInt(maxPrice, 10);
      if (!isNaN(max)) {
        query = query.lte('price_cents', max);
      }
    }

    // Apply pagination
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0 && limitNum <= 100) {
        query = query.limit(limitNum);
      }
    }

    if (offset) {
      const offsetNum = parseInt(offset, 10);
      if (!isNaN(offsetNum) && offsetNum >= 0) {
        query = query.range(offsetNum, offsetNum + (parseInt(limit || '50', 10) - 1));
      }
    }

    const { data: services, error } = await query;

    if (error) {
      console.error("Error fetching services from DB:", error);
      throw error;
    }

    // Transform to API format
    const transformedServices = (services || []).map(transformService);

    return c.json({
      success: true,
      services: transformedServices,
      count: transformedServices.length
    });

  } catch (error: any) {
    console.error("Error fetching services:", error);
    return c.json({
      error: "Failed to fetch services",
      details: Deno.env.get('ENVIRONMENT') === 'development' ? error?.message : undefined
    }, 500);
  }
});

// ----------------------------------------------------------------------------
// GET /services/:id - Get single service (public)
// ----------------------------------------------------------------------------
app.get("/hyper-function/services/:id", publicSecurity, async (c) => {
  try {
    const serviceId = c.req.param("id");

    if (!validateUUID(serviceId)) {
      return c.json({ error: "Invalid service ID format" }, 400);
    }

    const { data: service, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", serviceId)
      .single();

    if (error || !service) {
      return c.json({ error: "Service not found" }, 404);
    }

    return c.json({
      success: true,
      service: transformService(service)
    });

  } catch (error: any) {
    console.error("Error fetching service:", error);
    return c.json({ error: "Failed to fetch service" }, 500);
  }
});

// ----------------------------------------------------------------------------
// POST /services - Create new service (protected)
// ----------------------------------------------------------------------------
app.post("/hyper-function/services", protectedSecurity, async (c) => {
  const clientIP = c.get('clientIP') || 'unknown';

  try {
    const formData = await c.req.formData();

    // Extract and validate required fields
    const title = sanitizeString(formData.get('title') as string, 255);
    const details = sanitizeString(formData.get('details') as string, 5000);

    if (!title || title.length < 3) {
      return c.json({ error: 'Title is required (min 3 characters)' }, 400);
    }

    if (!details || details.length < 10) {
      return c.json({ error: 'Details are required (min 10 characters)' }, 400);
    }

    // Extract optional fields
    const icon = sanitizeString(formData.get('icon') as string, 100) || null;
    const priceCents = parsePriceCents(formData.get('price_cents') as string);
    const currency = validateCurrency(formData.get('currency') as string);
    const isBookable = formData.get('is_bookable') === 'true';
    const durationMinutes = parseDuration(formData.get('duration_minutes') as string);
    const image = formData.get('image') as File | null;

    // Handle image upload
    let imagePath: string | null = null;

    if (image && image.size > 0) {
      const validation = validateImageFile(image);
      if (!validation.valid) {
        return c.json({ error: validation.error }, 400);
      }

      const serviceId = crypto.randomUUID();
      const ext = image.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext) ? ext : 'jpg';
      imagePath = `${serviceId}/${Date.now()}.${safeExt}`;

      const arrayBuffer = await image.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(imagePath, fileData, {
          contentType: image.type,
          upsert: false,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Error uploading service image:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
    }

    // Insert into database
    const { data: insertedService, error: dbError } = await supabase
      .from(TABLE_NAME)
      .insert([{
        title,
        details,
        icon,
        image_url: imagePath,
        price_cents: priceCents,
        currency,
        is_bookable: isBookable,
        duration_minutes: durationMinutes,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Error inserting into service-table:', dbError);
      // Cleanup uploaded image on DB failure
      if (imagePath) {
        await supabase.storage.from(BUCKET_NAME).remove([imagePath]);
      }
      throw dbError;
    }

    return c.json({
      success: true,
      service: transformService(insertedService)
    }, 201);

  } catch (error) {
    console.error('Error creating service:', error);
    return c.json({
      error: 'Failed to create service',
      details: Deno.env.get('ENVIRONMENT') === 'development'
        ? (error instanceof Error ? error.message : String(error))
        : undefined
    }, 500);
  }
});

// ----------------------------------------------------------------------------
// PUT /services/:id - Update service (protected)
// ----------------------------------------------------------------------------
app.put("/hyper-function/services/:id", protectedSecurity, async (c) => {
  const clientIP = c.get('clientIP') || 'unknown';

  try {
    const serviceId = c.req.param("id");

    if (!validateUUID(serviceId)) {
      return c.json({ error: "Invalid service ID format" }, 400);
    }

    // Verify service exists
    const { data: existingService, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", serviceId)
      .single();

    if (fetchError || !existingService) {
      return c.json({ error: "Service not found" }, 404);
    }

    const formData = await c.req.formData();

    // Build update object with only provided fields
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    // Title
    const title = formData.get('title');
    if (title !== null) {
      const sanitizedTitle = sanitizeString(title as string, 255);
      if (sanitizedTitle && sanitizedTitle.length >= 3) {
        updateData.title = sanitizedTitle;
      } else if (sanitizedTitle !== '') {
        return c.json({ error: 'Title must be at least 3 characters' }, 400);
      }
    }

    // Details
    const details = formData.get('details');
    if (details !== null) {
      const sanitizedDetails = sanitizeString(details as string, 5000);
      if (sanitizedDetails && sanitizedDetails.length >= 10) {
        updateData.details = sanitizedDetails;
      } else if (sanitizedDetails !== '') {
        return c.json({ error: 'Details must be at least 10 characters' }, 400);
      }
    }

    // Icon
    const icon = formData.get('icon');
    if (icon !== null) {
      updateData.icon = sanitizeString(icon as string, 100) || null;
    }

    // Price
    const priceCents = formData.get('price_cents');
    if (priceCents !== null) {
      if (priceCents === '' || priceCents === 'null') {
        updateData.price_cents = null;
      } else {
        const parsed = parsePriceCents(priceCents as string);
        if (parsed !== null) {
          updateData.price_cents = parsed;
        }
      }
    }

    // Currency
    const currency = formData.get('currency');
    if (currency !== null) {
      updateData.currency = validateCurrency(currency as string);
    }

    // Bookable
    const isBookable = formData.get('is_bookable');
    if (isBookable !== null) {
      updateData.is_bookable = isBookable === 'true';
    }

    // Duration
    const durationMinutes = formData.get('duration_minutes');
    if (durationMinutes !== null) {
      if (durationMinutes === '' || durationMinutes === 'null') {
        updateData.duration_minutes = null;
      } else {
        const parsed = parseDuration(durationMinutes as string);
        if (parsed !== null) {
          updateData.duration_minutes = parsed;
        }
      }
    }

    // Handle image update
    const image = formData.get('image') as File | null;
    const deleteImage = formData.get('delete_image') === 'true';

    if (deleteImage && existingService.image_url) {
      // Delete existing image
      await supabase.storage.from(BUCKET_NAME).remove([existingService.image_url]);
      updateData.image_url = null;
    } else if (image && image.size > 0) {
      // Upload new image
      const validation = validateImageFile(image);
      if (!validation.valid) {
        return c.json({ error: validation.error }, 400);
      }

      // Delete old image if exists
      if (existingService.image_url) {
        await supabase.storage.from(BUCKET_NAME).remove([existingService.image_url]);
      }

      const ext = image.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext) ? ext : 'jpg';
      const imagePath = `${serviceId}/${Date.now()}.${safeExt}`;

      const arrayBuffer = await image.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(imagePath, fileData, {
          contentType: image.type,
          upsert: false,
          cacheControl: '3600'
        });

      if (!uploadError) {
        updateData.image_url = imagePath;
      } else {
        console.error('Error uploading new image:', uploadError);
      }
    }

    // Update database
    const { data: updatedService, error: updateError } = await supabase
      .from(TABLE_NAME)
      .update(updateData)
      .eq("id", serviceId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating service:", updateError);
      throw updateError;
    }

    return c.json({
      success: true,
      service: transformService(updatedService)
    });

  } catch (error: any) {
    console.error("Error updating service:", error);
    return c.json({
      error: "Failed to update service",
      details: Deno.env.get('ENVIRONMENT') === 'development' ? error?.message : undefined
    }, 500);
  }
});

// ----------------------------------------------------------------------------
// DELETE /services/:id - Delete service (protected)
// ----------------------------------------------------------------------------
app.delete("/hyper-function/services/:id", protectedSecurity, async (c) => {
  const clientIP = c.get('clientIP') || 'unknown';

  try {
    const serviceId = c.req.param("id");

    // Fetch service to get image path and title for audit
    const { data: serviceData, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("id, image_url, title")
      .eq("id", serviceId)
      .single();

    if (fetchError) {
      console.error("Error fetching service for delete:", fetchError);
      return c.json({ error: "Service not found" }, 404);
    }

    // Delete image from storage if exists
    if (serviceData?.image_url) {
      const { error: deleteImageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([serviceData.image_url]);

      if (deleteImageError) {
        console.error("Error deleting image from storage:", deleteImageError);
        // Continue anyway - DB record deletion is more important
      }
    }

    // Delete from database
    const { error: deleteDbError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", serviceId);

    if (deleteDbError) {
      console.error("Error deleting service from DB:", deleteDbError);
      return c.json({ error: "Failed to delete service" }, 500);
    }

    return c.json({
      success: true,
      message: `Service ${serviceId} deleted`
    });

  } catch (error: any) {
    console.error("Error deleting service:", error);
    return c.json({
      error: "Failed to delete service",
      details: Deno.env.get('ENVIRONMENT') === 'development' ? error?.message : undefined
    }, 500);
  }
});

// Start server
Deno.serve(app.fetch);