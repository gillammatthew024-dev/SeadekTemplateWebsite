import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL as string) ||
  (typeof window !== "undefined" ? window.location.origin : "");

interface ProjectFormProps {
  onProjectCreated: () => void;
}

export function ServiceForm({ onProjectCreated }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !details.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('details', details);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/hyper-function/services`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: formData
        }
      );

      const contentType = response.headers.get('content-type') || '';
      const raw = await response.text();

      if (!response.ok) {
        let msg = raw;
        if (contentType.includes('application/json')) {
          try {
            const err = JSON.parse(raw);
            msg = err.error || err.message || JSON.stringify(err);
          } catch {}
        }
        throw new Error(msg || 'Failed to create project');
      }

      // expect JSON response
      if (!contentType.includes('application/json')) {
        throw new Error('Expected JSON response from server: ' + raw.slice(0, 1000));
      }

      const data = JSON.parse(raw);
      console.log('Project created successfully:', data);

      toast.success('Project created successfully!');

      // Reset form
      setTitle('');
      setDetails('');

      const fileInput = document.getElementById('images') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      onProjectCreated();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Add a new project with title, details, and images
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Project Details</Label>
            <Textarea
              id="details"
              placeholder="Enter project details..."
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Project...' : 'Create Project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
