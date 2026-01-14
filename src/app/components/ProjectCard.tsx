'use client';

import { ArrowRight, Tag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Project } from '../../../lib/types/project';
import { myFont } from './MyFont';
interface PortfolioCardProps {
  project: Project;
  onClick: () => void;
}

export function PortfolioCard({ project, onClick }: PortfolioCardProps) {
  return (
    <article
      className="group relative overflow-hidden rounded-xl cursor-pointer shadow-2xl hover:shadow-3xl transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="relative h-80 overflow-hidden">
        <ImageWithFallback
          src={project.imageUrls?.[0] ?? '/placeholder.png'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          {/* Service Tags */}
          {project.services && project.services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.services.slice(0, 4).map((service, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-medium text-white/90 border border-white/20 hover:bg-white/25 transition-colors"
                >
                  <Tag size={10} className="text-amber-400" />
                  <span>{service}</span>
                </span>
              ))}
              {project.services.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-medium text-white/90 border border-white/20">
                  +{project.services.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3
            className={`text-base md:text-lg font-bold leading-tight mb-1.5 drop-shadow-2xl ${myFont.className}`}
            style={{
              background:
                'linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #ef4444 50%, #ec4899 75%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          {project.description && (
            <p className="text-white/70 text-xs line-clamp-2 max-w-md">
              {project.description}
            </p>
          )}

          {/* Hover indicator */}
          <div className="mt-3 flex items-center gap-1.5 text-amber-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>View Project</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </article>
  );
}