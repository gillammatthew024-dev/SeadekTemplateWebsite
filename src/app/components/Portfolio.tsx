'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useProjects } from '../../../lib/hooks/useProjects';
import { Project, PortfolioConfig } from '../../../lib/types/project';
import { PortfolioCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { AllProjectsView } from './AllProjectsView';
import ServiceCarousel from './ServiceCarousel';
import { myFont } from './MyFont';

interface PortfolioSectionProps {
  config: PortfolioConfig;
}

export function Portfolio({ config }: PortfolioSectionProps) {
  const {
    source,
    sectionid,
    title,
    subtitle,
    backgroundImage,
    showServiceFilter = true,
    maxPreviewItems = 2,
  } = config;

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<string[]>([]);

  const { projects, isLoading, error } = useProjects({
    source,
    serviceFilter,
  });

  const previewProjects = projects.slice(0, maxPreviewItems);

  const sectionStyle: React.CSSProperties = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  };

  return (
    <section id={sectionId} className="py-20 bg-gray-50" style={sectionStyle}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className={`mb-6 tracking-wider text-gray-100 bg-gradient-to-r from-indigo-500 to-pink-600 bg-clip-text text-transparent ${myFont.className}`}
          >
            {title}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-100 text-sm">{subtitle}</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-400 mb-8">
            <p>Failed to load projects. Please try again later.</p>
          </div>
        )}

        {/* Project Cards */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {previewProjects.map((project) => (
              <PortfolioCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}

        {/* Service Filter & Button */}
        <div className="flex flex-col items-center justify-center gap-5">
          {showServiceFilter && (
            <div className="w-full max-w-2xl flex justify-center">
              <ServiceCarousel onChange={(titles) => setServiceFilter(titles)} />
            </div>
          )}

          <button
            onClick={() => setShowAllProjects(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black/80 backdrop-blur-sm text-white hover:bg-amber-700 transition-all duration-300 group rounded-lg border border-white/10 hover:border-amber-500/50 shadow-lg hover:shadow-amber-500/20"
          >
            <span className={`text-xs tracking-widest ${myFont.className}`}>
              View All Projects
            </span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>

      {/* Modals */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <AllProjectsView
        isOpen={showAllProjects}
        onClose={() => setShowAllProjects(false)}
        allProjects={projects}
      />
    </section>
  );
}