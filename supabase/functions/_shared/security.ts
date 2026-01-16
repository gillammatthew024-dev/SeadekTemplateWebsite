// supabase/functions/_shared/security.ts

import { Context, Next, MiddlewareHandler } from "npm:hono";

// Environment variables
const EDGE_SECRET = Deno.env.get('EDGE_FUNCTION_SECRET') || '';
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',');

// Rate limiting store (in-memory, resets on cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface SecurityConfig {
  requireAuth: boolean;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  allowedMethods?: string[];
}

// Extend Hono's context variables
declare module 'npm:hono' {
  interface ContextVariableMap {
    clientIP: string;
    requestTime: number;
  }
}

function validateServerAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  const expectedKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  // Skip auth for GET requests (public reads)
  if (c.req.method === 'GET') {
    return next();
  }
  
  const internalSecret = c.req.header('X-Internal-Secret');
  
  if (!expectedKey) {
    console.error('INTERNAL_API_SECRET not configured in edge function');
    return c.json({ error: 'Server configuration error' }, 500);
  }

  if (internalSecret !== expectedKey) {
    return c.json({ error: 'Unauthorized: Invalid credentials' }, 401);
  }

  return next();
}

/**
 * Async signature verification using Web Crypto
 */
export async function verifySignatureAsync(
  signature: string | null,
  timestamp: string | null,
  body: string,
  method: string,
  path: string
): Promise<{ valid: boolean; error?: string }> {
  if (!EDGE_SECRET) {
    console.error('EDGE_FUNCTION_SECRET not configured');
    return { valid: false, error: 'Server configuration error' };
  }

  if (!signature || !timestamp) {
    return { valid: false, error: 'Missing security headers' };
  }

  // Check timestamp freshness (5 minute window)
  const requestTime = parseInt(timestamp, 10);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (isNaN(requestTime) || Math.abs(now - requestTime) > fiveMinutes) {
    return { valid: false, error: 'Request timestamp expired or invalid' };
  }

  try {
    const payload = `${timestamp}.${method}.${path}.${body}`;
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(EDGE_SECRET);
    const messageData = encoder.encode(payload);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

    // Constant-time comparison
    if (signature.length !== expectedSignature.length) {
      return { valid: false, error: 'Invalid signature' };
    }

    let mismatch = 0;
    for (let i = 0; i < signature.length; i++) {
      mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }

    if (mismatch !== 0) {
      return { valid: false, error: 'Invalid signature' };
    }

    return { valid: true };
  } catch (error) {
    console.error('Signature verification error:', error);
    return { valid: false, error: 'Signature verification failed' };
  }
}

/**
 * Rate limiting check
 */
export function checkRateLimit(
  ip: string,
  windowMs: number = 60000,
  maxRequests: number = 100
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (record.count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: record.resetTime - now 
    };
  }

  record.count++;
  return { 
    allowed: true, 
    remaining: maxRequests - record.count, 
    resetIn: record.resetTime - now 
  };
}

/**
 * Get client IP from request
 */
export function getClientIP(c: Context): string {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim() 
    || c.req.header('x-real-ip') 
    || 'unknown';
}

/**
 * Security middleware factory - returns proper Hono MiddlewareHandler
 */
export function createSecurityMiddleware(config: SecurityConfig): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const method = c.req.method;
    const path = c.req.path;
    const ip = getClientIP(c);

    // 1. Rate limiting
    if (config.rateLimit) {
      const { allowed, remaining, resetIn } = checkRateLimit(
        ip,
        config.rateLimit.windowMs,
        config.rateLimit.maxRequests
      );

      c.header('X-RateLimit-Remaining', remaining.toString());
      c.header('X-RateLimit-Reset', Math.ceil(resetIn / 1000).toString());

      if (!allowed) {
        return c.json(
          {
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil(resetIn / 1000),
          },
          429
        );
      }
    }

    // 2. Method check
    if (config.allowedMethods && !config.allowedMethods.includes(method)) {
      return c.json({ error: 'Method not allowed' }, 405);
    }

    // 3. Authentication (ONLY if enabled)
    if (config.requireAuth) {
      const authResult = await validateServerAuth(c, next);

      // If validateServerAuth returned a response, stop here
      if (authResult !== undefined) {
        return authResult;
      }
    }

    // 4. Set context variables
    c.set('clientIP', ip);
    c.set('requestTime', Date.now());

    await next();
  };
}


/**
 * Input validation helpers
 */
export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function sanitizeString(input: string | null, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}` };
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File too large: ${file.size} bytes` };
  }

  return { valid: true };
}