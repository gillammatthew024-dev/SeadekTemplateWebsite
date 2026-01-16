// src/components/service-list.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ServicePrice {
  amount: number;
  currency: string;
  formatted: string;
}

interface Service {
  id: string;
  title: string;
  details: string;
  icon?: string;
  imageUrl?: string | null;
  price?: ServicePrice | null;
  isBookable: boolean;
  durationMinutes?: number | null;
  createdAt: string;
}

interface ServiceListProps {
  targetSource?: string;
  refreshTrigger?: number; // Increment to trigger refresh
}

export function ServiceList({ 
  targetSource = 'service-list',
  refreshTrigger = 0
}: ServiceListProps) {
  const { data: session } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    fetchServices();
  }, [targetSource, refreshTrigger]);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call Next.js API route (public GET)
      const res = await fetch(`/api/services/${targetSource}`, {
        // Add cache control for fresh data
        cache: 'no-store',
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      const received: any[] = data.services || [];

      // Map to typed Service objects
      const servicesWithIds: Service[] = received.map((s) => ({
        id: String(s.id),
        title: s.title ?? '',
        details: s.details ?? s.description ?? '',
        icon: s.icon,
        imageUrl: s.imageUrl || null,
        price: s.price || null,
        isBookable: s.isBookable ?? false,
        durationMinutes: s.durationMinutes || null,
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
      toast.error('You must be logged in to delete services');
      return;
    }

    if (!isAdmin) {
      toast.error('You must be an admin to delete services');
      return;
    }

    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(id);
    setError(null);

    try {
      // Call Next.js API route (protected DELETE)
      const res = await fetch(`/api/services/${targetSource}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete service');
      }

      // Remove from local state
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success('Service deleted successfully');
    } catch (err) {
      console.error('Error deleting service:', err);
      const message = err instanceof Error ? err.message : 'Failed to delete service';
      setError(message);
      toast.error(message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${remainingMinutes} min`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Services</CardTitle>
            <CardDescription>
              {isLoading 
                ? 'Loading...' 
                : `${services.length} service${services.length !== 1 ? 's' : ''} available`}
              {!isAdmin && session && ' (Admin access required to manage)'}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchServices}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="text-gray-500">Loading services...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      fetchServices();
                    }}
                    className="text-red-600 text-sm underline mt-1 hover:text-red-800"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && services.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No services yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Create your first service to get started
              </p>
            </div>
          )}

          {/* Services List */}
          {!isLoading && services.length > 0 && (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Service Image */}
                    {service.imageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-20 h-20 rounded-lg object-cover"
                          onError={(e) => {
                            // Hide broken images
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Service Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          {service.icon && (
                            <span className="text-xl" role="img" aria-label="icon">
                              {/* You can map icon names to actual icons here */}
                              {service.icon === 'star' && '⭐'}
                              {service.icon === 'heart' && '❤️'}
                              {service.icon === 'check' && '✅'}
                              {service.icon === 'bolt' && '⚡'}
                              {!['star', 'heart', 'check', 'bolt'].includes(service.icon) && '📋'}
                            </span>
                          )}
                          <h3 className="font-semibold text-lg truncate">{service.title}</h3>
                        </div>

                        {/* Admin Delete Button */}
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                            onClick={() => deleteService(service.id)}
                            disabled={deleteLoading === service.id}
                          >
                            {deleteLoading === service.id ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              '🗑️'
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {service.price && (
                          <Badge variant="secondary" className="font-semibold">
                            {service.price.formatted}
                          </Badge>
                        )}
                        {service.isBookable && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Bookable
                          </Badge>
                        )}
                        {service.durationMinutes && (
                          <Badge variant="outline">
                            ⏱️ {formatDuration(service.durationMinutes)}
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {service.details}
                      </p>

                      {/* Footer */}
                      <p className="text-xs text-gray-400 mt-3">
                        Created: {new Date(service.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}