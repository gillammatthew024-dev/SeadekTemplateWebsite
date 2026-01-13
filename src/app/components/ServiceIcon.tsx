// src/components/ServiceIcon.tsx
'use client';

import {
  Car,
  Sparkles,
  Shield,
  Droplets,
  Paintbrush,
  Star,
  Anchor,
  Waves,
  Wrench,
  Zap,
  CheckCircle,
  Award,
  LucideIcon,
} from 'lucide-react';

// Map of icon names to components
const iconMap: Record<string, LucideIcon> = {
  car: Car,
  sparkles: Sparkles,
  shield: Shield,
  droplets: Droplets,
  paintbrush: Paintbrush,
  star: Star,
  anchor: Anchor,
  waves: Waves,
  wrench: Wrench,
  zap: Zap,
  check: CheckCircle,
  award: Award,
};

interface ServiceIconProps {
  name: string;
  size?: number;
  className?: string;
  fallback?: string;
}

export function ServiceIcon({ 
  name, 
  size = 24, 
  className = '',
  fallback = 'star'
}: ServiceIconProps) {
  if (name) {
  const IconComponent = iconMap[name.toLowerCase()] || iconMap[fallback];
  return <IconComponent size={size} className={className} />;
  } else {
    const IconComponent = iconMap[fallback];
    return <IconComponent size={size} className={className} />;
  }
}

// Export list for your dashboard dropdown
export const availableIcons = Object.keys(iconMap);