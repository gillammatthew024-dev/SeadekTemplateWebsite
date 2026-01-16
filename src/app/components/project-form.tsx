import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import  { MultiSelectServiceList } from "./MultiSelectServiceList";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL as string) ||
  (typeof window !== "undefined" ? window.location.origin : "");

interface ProjectFormProps {
  onProjectCreated: () => void;
  targetTable?: 'main-portfolio' | 'seadek-portfolio';
}

export function ProjectForm({ onProjectCreated, targetTable = 'main-portfolio' }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !details.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('details', details);
      formData.append('targetTable', targetTable); // <-- tell server which table to use
      selectedServices.forEach(service => {
        formData.append("services", service);
        console.log("Appending service:", service);
      });
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

       const response = await fetch(`/api/projects/${targetTable}`, {
        method: 'POST',
        body: formData,
        credentials: "include"
      });


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
      setSelectedFiles([]);

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

          <div className="space-y-2">
            <Label htmlFor="images">Upload Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isSubmitting}
              required
            />
            {selectedFiles.length > 0 && (
              <p className="text-sm text-gray-600">
                {selectedFiles.length} file(s) selected
              </p>
            )}
          </div>
            <div>
            <MultiSelectServiceList onChange={(titles) => setSelectedServices(titles)} />
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
