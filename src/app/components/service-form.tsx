// src/components/service-form.tsx
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { IconPicker } from './IconPicker';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info'

interface ServiceFormProps {
  onProjectCreated: () => void;
}

export function ServiceForm({ onProjectCreated }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [icon, setIcon] = useState('star');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !details.trim() || !icon.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('details', details);
      formData.append('icon', icon);

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
        throw new Error(msg || 'Failed to create service');
      }

      if (!contentType.includes('application/json')) {
        throw new Error('Expected JSON response from server: ' + raw.slice(0, 1000));
      }

      const data = JSON.parse(raw);
      console.log('Service created successfully:', data);

      toast.success('Service created successfully!');

      // Reset form
      setTitle('');
      setDetails('');
      setIcon('star');

      onProjectCreated();
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Service</CardTitle>
        <CardDescription>
          Add a new service with title, details, and icon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter service title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Service Details</Label>
            <Textarea
              id="details"
              placeholder="Enter service details..."
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <IconPicker value={icon} onChange={setIcon} />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Service...' : 'Create Service'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}