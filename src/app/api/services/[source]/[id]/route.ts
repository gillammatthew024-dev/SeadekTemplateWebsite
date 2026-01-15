// app/api/projects/[source]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {authOptions} from '../../../../../../lib/auth/options';
import { getEndpointConfig } from '../../../../../../lib/config/endpoints';
import { getSession, needsAdmin } from '../../../../../../lib/auth/getSession';
import { validateOrigin } from '../../../../../../lib/auth/validateOrigin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { source: string; id: string } }
) {
  try {
    const loggedIn = await needsAdmin();

    if (!loggedIn)
    {
        throw Error();
    }
    if (!validateOrigin(request))
      {
        return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
      }

    const { source, id } = params;
    const config = getEndpointConfig(source);
    
    if (!config) {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
    }
    const timestamp = Date.now().toString();

    const response = await fetch(`${config.url}/services/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Timestamp': timestamp,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delete error:', errorText);
      return NextResponse.json(
        { error: 'Failed to delete service' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}