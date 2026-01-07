'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types/project';

interface UseProjectsOptions {
  source: string;
  serviceFilter?: string[];
}

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProjects({ source, serviceFilter = [] }: UseProjectsOptions): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch from our internal API route (endpoint is hidden)
      const res = await fetch(`/api/projects/${source}`);
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to fetch (${res.status})`);
      }

      const data = await res.json();
      let fetchedProjects: Project[] = data.projects || [];

      // Apply service filter if provided
      if (serviceFilter.length > 0) {
        fetchedProjects = fetchedProjects.filter((project) =>
          serviceFilter.some((s) => project.services?.includes(s))
        );
      }

      // Sort by date (newest first)
      fetchedProjects.sort((a, b) =>
        (b.createdAt || '').localeCompare(a.createdAt || '')
      );

      setProjects(fetchedProjects);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, [source, serviceFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, error, refetch: fetchProjects };
}