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
    const res = await fetch(`${config.url}/services`, {
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
    const loggedIn = await needsAdmin();

    if (!validateOrigin(request))
  {
    return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
  }

    if (!loggedIn)
    {
        throw Error();
    }

    const { source } = params;
    const config = getEndpointConfig(source);

    if (!config) {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
    }

    const formData = await request.formData();

    const timestamp = Date.now().toString();

    const response = await fetch(`${config.url}/services`, {
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
        { error: 'Failed to create service' },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}