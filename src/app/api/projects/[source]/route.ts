import { NextRequest, NextResponse } from 'next/server';
import { getEndpointConfig } from '../../../../../lib/config/endpoints';

export async function GET(
  request: NextRequest,
  { params }: { params: { source: string } }
) {
  const { source } = params;
  
  // Validate source
  const config = getEndpointConfig(source);
  
  if (!config) {
    return NextResponse.json(
      { error: 'Invalid source' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(config.url, {
      headers: config.headers,
      // Cache for 60 seconds on the server
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Upstream error for ${source}:`, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Normalize the data structure
    const projects = normalizeProjects(data.projects || []);

    return NextResponse.json({ projects });
  } catch (error) {
    console.error(`Error fetching from ${source}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function normalizeProjects(raw: any[]): any[] {
  return raw.map((p, i) => ({
    id: typeof p.id === 'string' && p.id ? p.id : `fallback-${i}`,
    title: p.title ?? '',
    description: p.description ?? '',
    details: p.details ?? '',
    imageUrls: Array.isArray(p.imageUrls)
      ? p.imageUrls
      : p.gallery ?? p.image_urls ?? p.images ?? [],
    createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
    services: p.services || p.service_keys || p.services_titles || [],
  }));
}