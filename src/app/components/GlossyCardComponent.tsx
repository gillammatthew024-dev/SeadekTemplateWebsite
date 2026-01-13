// src/components/GlossyCard.tsx
'use client';
import { ReactNode } from 'react';
import './GlossyCardComponent.css';

interface GlossyCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  accentColor?: string;
}

export default function GlossyCard({
  children,
  className = '',
  title,
  icon,
  accentColor = '#00d4ff',
}: GlossyCardProps) {
  return (
    <div 
      className={`glossy-card ${className}`}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div className="glossy-card-glow" />
      <div className="glossy-card-inner">
        {(icon || title) && (
          <div className="glossy-card-header">
            {icon && <div className="glossy-card-icon">{icon}</div>}
            {title && <h3 className="glossy-card-title">{title}</h3>}
          </div>
        )}
        <div className="glossy-card-body">
          {children}
        </div>
      </div>
      <div className="glossy-card-border" />
    </div>
  );
}