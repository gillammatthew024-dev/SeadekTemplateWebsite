// src/components/service-form.tsx
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { IconPicker } from './IconPicker';
import { toast } from 'sonner';

interface ServiceFormProps {
  onServiceCreated: () => void;
  targetSource?: string;
}

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
];

export function ServiceForm({ 
  onServiceCreated, 
  targetSource = 'service-list' 
}: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Basic fields
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [icon, setIcon] = useState('star');
  
  // New pricing fields
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isBookable, setIsBookable] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState('');
  
  // Image field
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please use JPEG, PNG, WebP, or SVG.');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 10MB.');
        return;
      }
      
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || title.length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }

    if (!details.trim() || details.length < 10) {
      toast.error('Details must be at least 10 characters');
      return;
    }

    // Validate price if provided
    if (price && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
      toast.error('Please enter a valid price');
      return;
    }

    // Validate duration if provided
    if (durationMinutes && (isNaN(parseInt(durationMinutes)) || parseInt(durationMinutes) < 0)) {
      toast.error('Please enter a valid duration');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('details', details.trim());
      formData.append('icon', icon);
      
      // Add pricing fields
      if (price) {
        // Convert dollars to cents for storage
        const priceCents = Math.round(parseFloat(price) * 100);
        formData.append('price_cents', priceCents.toString());
      }
      formData.append('currency', currency);
      formData.append('is_bookable', isBookable.toString());
      
      if (durationMinutes) {
        formData.append('duration_minutes', durationMinutes);
      }
      
      // Add image if selected
      if (image) {
        formData.append('image', image);
      }

      // Call Next.js API route (which handles auth and signing)
      const response = await fetch(`/api/services/${targetSource}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
        // Don't set Content-Type - browser will set it with boundary for FormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create service (${response.status})`);
      }

      const data = await response.json();
      console.log('Service created successfully:', data);

      toast.success('Service created successfully!');

      // Reset form
      setTitle('');
      setDetails('');
      setIcon('star');
      setPrice('');
      setCurrency('USD');
      setIsBookable(false);
      setDurationMinutes('');
      setImage(null);
      setImagePreview(null);

      onServiceCreated();
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
          Add a new service with title, details, pricing, and optional image
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Service Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter service title (min 3 characters)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
              minLength={3}
              maxLength={255}
            />
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Service Details *</Label>
            <Textarea
              id="details"
              placeholder="Enter service details (min 10 characters)..."
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              disabled={isSubmitting}
              required
              minLength={10}
              maxLength={5000}
            />
            <p className="text-xs text-gray-500">
              {details.length}/5000 characters
            </p>
          </div>

          {/* Icon Picker */}
          <IconPicker value={icon} onChange={setIcon} />

          {/* Pricing Section */}
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <h3 className="font-medium text-sm text-gray-700">Pricing (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {currency === 'USD' || currency === 'CAD' || currency === 'AUD' ? '$' : 
                     currency === 'EUR' ? '€' : '£'}
                  </span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={isSubmitting}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={currency} 
                  onValueChange={setCurrency}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                placeholder="e.g., 60"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Bookable Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="bookable">Bookable Service</Label>
                <p className="text-xs text-gray-500">
                  Allow customers to book this service online
                </p>
              </div>
              <Switch
                id="bookable"
                checked={isBookable}
                onCheckedChange={setIsBookable}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Service Image (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 mx-auto rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearImage}
                    disabled={isSubmitting}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-500"
                    >
                      Upload an image
                    </label>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                      className="sr-only"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG, WebP, or SVG up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
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