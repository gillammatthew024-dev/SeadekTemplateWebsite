'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface Service {
  id: string;
  title: string;
  details: string;
  createdAt: string;
}

interface ServiceListProps {
  targetSource?: string;
}

export function ServiceList({ targetSource = 'hyper-function' }: ServiceListProps) {
  const { data: session } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, [targetSource]);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // ✅ Call Next.js API route (public GET)
      const res = await fetch(`/api/services/${targetSource}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      const received: any[] = data.services || [];

      const servicesWithIds: Service[] = received.map((s) => ({
        id: String(s.id),
        title: s.title ?? '',
        details: s.details ?? s.description ?? '',
        createdAt: s.createdAt ?? s.created_at ?? new Date().toISOString(),
      }));

      setServices(servicesWithIds);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!session) {
      setError('You must be logged in to delete services');
      return;
    }

    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    setDeleteLoading(id);
    setError(null);

    try {
      // ✅ Call Next.js API route (protected DELETE)
      const res = await fetch(`/api/services/${targetSource}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete service');
      }

      // Remove from local state
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete service');
    } finally {
      setDeleteLoading(null);
    }
  };

  const isAdmin = session?.user?.role === 'admin';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Services</CardTitle>
        <CardDescription>
          View all uploaded services
          {!isAdmin && ' (Login to manage)'}
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
            <div className="rounded-lg bg-red-50 p-4 mb-4">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-600 text-sm underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {!isLoading && !error && services.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">No services yet. Create your first one!</p>
            </div>
          )}

          {!isLoading && services.length > 0 && (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg mb-2">{service.title}</h3>

                    {/* ✅ Only show delete button for admin users */}
                    {isAdmin && (
                      <button
                        className="text-red-500 text-lg font-bold bg-transparent hover:bg-red-500 hover:text-white rounded px-2 py-1 transition disabled:opacity-50"
                        aria-label="Delete"
                        onClick={() => deleteService(service.id)}
                        disabled={deleteLoading === service.id}
                      >
                        {deleteLoading === service.id ? '...' : '×'}
                      </button>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {service.details}
                  </p>

                  <p className="text-xs text-gray-500">
                    Created: {new Date(service.createdAt).toLocaleString()}
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