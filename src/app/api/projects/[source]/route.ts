import { NextRequest, NextResponse } from 'next/server';
import { getEndpointConfig } from '../../../../../lib/config/endpoints';
import { needsAdmin } from '../../../../../lib/auth/getSession';
import { validateOrigin } from '../../../../../lib/auth/validateOrigin';


// ✅ GET - Public (no auth required)
export async function GET(
  request: NextRequest,
  { params }: { params: { source: string } }
) {
  const { source } = params;
  const config = getEndpointConfig(source);

  if (!config) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
  }

  if (!validateOrigin(request))
  {
    return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
  }

  try {
    const res = await fetch(`${config.url}/projects`, {
      headers: config.headers,
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
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching from ${source}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ POST - Protected (requires auth + signature)
export async function POST(
  request: NextRequest,
  { params }: { params: { source: string } }
) {
  try {
    if (!needsAdmin())
    {
      throw Error;
    }

    const { source } = params;
    const config = getEndpointConfig(source);

    if (!config) {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
    }

    const formData = await request.formData();

    // Extract data for signature
    const signatureBody = {
      title: formData.get('title'),
      details: formData.get('details'),
      services: formData.getAll('services'),
      imageCount: formData.getAll('images').length,
    };

    const timestamp = Date.now.toString();

    const response = await fetch(`${config.url}/projects`, {
      method: 'POST',
      headers: {
        ...config.headers,
        'X-Timestamp': timestamp,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}