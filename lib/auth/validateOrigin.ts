import { NextRequest, NextResponse } from 'next/server';

export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ];
  
  // Check if request is from allowed origin
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return false;
  }
  
  // Additional check for referer
  if (referer) {
    const refererUrl = new URL(referer);
    if (!ALLOWED_ORIGINS.some(allowed => refererUrl.origin === allowed)) {
      return false;
    }
  }
  
  return true;
}