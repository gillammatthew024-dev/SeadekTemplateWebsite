import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useEffect, useState } from 'react';
import { ProjectModal } from './ProjectModal';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  details: string;
  client?: string;
  year?: string;
  gallery: string[];
}

interface AllProjectsViewProps {
  isOpen: boolean;
  onClose: () => void;
  allProjects: Project[];
}

export function AllProjectsView({ isOpen, onClose, allProjects }: AllProjectsViewProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/90 z-40"
              onClick={onClose}
            />

            {/* Full Projects View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-4 md:inset-8 z-40 bg-white overflow-hidden"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                <div>
                  <h2 className="tracking-wider text-gray-900">ALL PROJECTS</h2>
                  <p className="text-gray-600 mt-1">Browse our complete portfolio</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Projects Grid */}
              <div className="h-full overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                    {allProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative overflow-hidden bg-white cursor-pointer border border-gray-200 hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedProject(project)}
                      >
                        <div className="relative h-64 overflow-hidden">
                          <ImageWithFallback
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>
                        </div>
                        
                        <div className="p-6">
                          <p className="text-sm tracking-wider text-gray-500 mb-2">{project.category}</p>
                          <h3 className="tracking-wide mb-2">{project.title}</h3>
                          <p className="text-gray-600 line-clamp-2">{project.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
