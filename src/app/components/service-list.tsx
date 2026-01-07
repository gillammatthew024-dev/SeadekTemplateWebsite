'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL as string) ||
  (typeof window !== 'undefined' ? window.location.origin : '');

interface Service {
  id: bigint;
  title: string;
  details: string;
  createdAt: string;
}
export function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);
  
  const deleteProduct = async (id: bigint) => {
    console.log(id);
    try {
      const res = await fetch(
   `https://${projectId}.supabase.co/functions/v1/hyper-function/services/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
    },
  }
);      if (!res.ok) {
        throw new Error("Failed deleting project");
      }
  } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
   `https://${projectId}.supabase.co/functions/v1/hyper-function/services`,
    {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
    },
  }
);
      const contentType = res.headers.get('content-type') || '';
      const raw = await res.text();

      if (!res.ok) {
        let msg = raw;
        if (contentType.includes('application/json')) {
          try {
            const parsed = JSON.parse(raw);
            msg = parsed.error || parsed.message || JSON.stringify(parsed);
          } catch {}
        }
        throw new Error(`Server error (${res.status}): ${msg}`);
      }

      if (!contentType.includes('application/json')) {
        throw new Error('Expected JSON response but received: ' + raw.slice(0, 1000));
      }

      const data = JSON.parse(raw);
      const received: any[] = data.services || [];

      const servicesWithIds: Service[] = received.map((p, i) => ({
        id: p.id, 
        title: p.title ?? '',
        details: p.details ?? '',
        imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : (p.image_urls || p.images || []),
        createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
      }));

      setServices(servicesWithIds);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Services</CardTitle>
        <CardDescription>
          View all uploaded services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading services...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {!isLoading && !error && services.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">No services yet. Create your first one!</p>
            </div>
          )}

          {!isLoading && !error && services.length > 0 && (
            <div className="space-y-4">
              {services.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <button className="text-red-500 text-lg font-bold bg-transparent hover:bg-red-500 hover:text-white rounded px-2 py-1 transition" aria-label="Delete" onClick={() => deleteProduct(project.id)}> &times;</button>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {project.details}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    Created: {new Date(project.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
