'use client';

import { useState } from 'react';
import { ArrowRight, Grid3X3, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../../../lib/hooks/useProjects';
import { Project, PortfolioConfig } from '../../../lib/types/project';
import { PortfolioCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import ServiceCarousel from './ServiceCarousel';
import { myFont } from './MyFont';

interface PortfolioSectionProps {
  config: PortfolioConfig;
  onShowAll?: (projects: Project[]) => void;
  onClickCard?: (project: Project) => void; // New prop for card click handler
  selectedProject?: Project | null; // Optional: if parent wants to control selection
}

export function Portfolio({ 
  config, 
  onShowAll, 
  onClickCard,
  selectedProject: externalSelectedProject 
}: PortfolioSectionProps) {
  const {
    source,
    sectionid,
    title,
    subtitle,
    backgroundImage,
    showServiceFilter = true,
    maxPreviewItems = 2,
  } = config;

  // Internal state as fallback if no external handler provided
  const [internalSelectedProject, setInternalSelectedProject] = useState<Project | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string[]>([]);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const { projects, isLoading, error } = useProjects({
    source,
    serviceFilter,
  });

  const previewProjects = projects.slice(0, maxPreviewItems);
  const remainingCount = Math.max(0, projects.length - maxPreviewItems);

  // Use external handler if provided, otherwise use internal state
  const handleCardClick = (project: Project) => {
    if (onClickCard) {
      onClickCard(project);
    } else {
      setInternalSelectedProject(project);
    }
  };

  // Use external selected project if provided
  const selectedProject = externalSelectedProject !== undefined 
    ? externalSelectedProject 
    : internalSelectedProject;

  const handleShowAll = () => {
    if (onShowAll) {
      onShowAll(projects);
    }
  };

  const handleFilterChange = (titles: string[]) => {
    setServiceFilter(titles);
    setIsFilterActive(titles.length > 0);
  };

  return (
    <section
      id={sectionid}
      className="relative min-h-screen py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Modern gradient background with parallax effect */}
      <div className="absolute inset-0 -z-10">
        {backgroundImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-fixed"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-purple-900/80 to-slate-900/90 backdrop-blur-[1px]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />
          </>
        )}
      </div>

      {/* Animated background elements */}
      <div className="absolute top-1/4 -left-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float-delayed" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with animations */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-6 sm:mb-8 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 backdrop-blur-sm"
          >
            <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-xs sm:text-sm font-medium text-purple-300">Featured Work</span>
          </motion.div>

          {/* Title with gradient */}
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 ${myFont.className}`}>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-gradient break-words">
              {title}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed px-4 break-words">
            {subtitle}
          </p>
        </motion.div>

        {/* Service Filter Section */}
        {showServiceFilter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Filter className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isFilterActive ? 'text-purple-400' : 'text-gray-400'}`} />
              <span className="text-xs sm:text-sm font-medium text-gray-300 break-words text-center">
                {isFilterActive ? `Filtering by ${serviceFilter.length} service(s)` : 'Filter by service'}
              </span>
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <ServiceCarousel onChange={handleFilterChange} />
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-64 sm:h-96"
            >
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-500/20 rounded-full animate-spin border-t-purple-500" />
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-pink-500/20 rounded-full animate-spin border-t-pink-500 absolute inset-0 animate-reverse-spin" />
              </div>
              <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-400 animate-pulse">Loading amazing projects...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="inline-flex flex-col items-center p-6 sm:p-8 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                <p className="text-red-400 mb-2 sm:mb-4 text-sm sm:text-base">Failed to load projects</p>
                <p className="text-xs sm:text-sm text-gray-400">Please try again later</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Grid */}
        <AnimatePresence mode="wait">
          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 sm:space-y-12"
            >
              {/* Project Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {previewProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 shadow-xl hover:shadow-purple-500/10">
                      <PortfolioCard
                        project={project}
                        onClick={() => handleCardClick(project)}
                      />
                      {/* Hover gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/0 via-transparent to-transparent group-hover:from-purple-500/10 pointer-events-none transition-all duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats and CTA Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col items-center gap-6 sm:gap-8 pt-4 sm:pt-8"
              >
                {/* Project count indicator */}
                {remainingCount > 0 && (
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-purple-500/50" />
                    <span className="text-xs sm:text-sm text-gray-400 text-center px-2">
                      +{remainingCount} more {remainingCount === 1 ? 'project' : 'projects'} to explore
                    </span>
                    <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-purple-500/50" />
                  </div>
                )}

                {/* View All Button */}
                <motion.button
                  onClick={handleShowAll}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -top-2 -left-2 w-[calc(100%+4px)] h-[calc(100%+4px)] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className={`relative text-xs sm:text-sm tracking-wider ${myFont.className}`}>
                    View All Projects
                  </span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 sm:w-[18px] sm:h-[18px]" />
                </motion.button>

                {/* Alternative text link */}
                <button
                  onClick={handleShowAll}
                  className="text-xs sm:text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200 underline-offset-4 hover:underline px-4 text-center"
                >
                  or press <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 mx-1 text-[10px] sm:text-xs bg-slate-800 rounded border border-slate-700">G</kbd> to view gallery
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}