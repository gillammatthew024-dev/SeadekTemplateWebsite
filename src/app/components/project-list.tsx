'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { useSession } from 'next-auth/react';

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL as string) ||
  (typeof window !== 'undefined' ? window.location.origin : '');

interface Project {
  id: string;
  title: string;
  details: string;
  imageUrls: string[];
  createdAt: string;
}

interface ProjectListProps {
  targetTable?: 'main-portfolio' | 'seadek-portfolio';
}

export function ProjectList({ targetTable = 'main-portfolio' }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchProjects();
  }, [targetTable]);

  const deleteProduct = async (id: string) => {
    if (!session) {
      alert('You must be logged in to delete projects');
      return;
    }

    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try { 
      const res = await fetch(`${API_BASE}/api/projects/${targetTable}/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Include session cookies
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete project');
      }

      // Remove from UI
      setProjects(prev => prev.filter(p => p.id !== id));
      
      // Optional: Show success message
      alert('Project deleted successfully');
    } catch (err) {
      console.error('Error deleting project:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use your existing Next.js API route for GET
      const res = await fetch(`${API_BASE}/api/projects/${targetTable}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      const received: any[] = data.projects || [];

      const projectsWithIds: Project[] = received.map((p) => ({
        id: String(p.id),
        title: p.title ?? '',
        details: p.details ?? p.description ?? '',
        imageUrls: Array.isArray(p.imageUrls)
          ? p.imageUrls
          : p.image_urls || p.images || [],
        createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
      }));

      setProjects(projectsWithIds);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>View all uploaded projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading projects...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {!isLoading && !error && projects.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">
                No projects yet. Create your first one!
              </p>
            </div>
          )}

          {!isLoading && !error && projects.length > 0 && (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    {session && (
                      <button
                        className="text-red-500 text-lg font-bold bg-transparent hover:bg-red-500 hover:text-white rounded px-2 py-1 transition"
                        aria-label="Delete"
                        onClick={() => deleteProduct(project.id)}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {project.details}
                  </p>

                  {project.imageUrls && project.imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {project.imageUrls.slice(0, 3).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`${project.title} - ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                      {project.imageUrls.length > 3 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded h-24">
                          <span className="text-sm text-gray-600">
                            +{project.imageUrls.length - 3} more
                          </span>
                        </div>
                      )}
                    </div>
                  )}

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