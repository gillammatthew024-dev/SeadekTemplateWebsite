import * as React from "react";
import { X } from "lucide-react";
const AnimatePresence = React.lazy(() =>
  import("motion/react").then((m) => ({ default: m.AnimatePresence })),
);
const MotionDiv = React.lazy(() =>
  import("motion/react").then((m) => ({ default: m.motion.div })),
);
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Project {
  id: string;
  title: string;
  description?: string;
  details?: string;
  imageUrls?: string[];
  createdAt?: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  React.useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [project]);

  return (
    <React.Suspense fallback={null}>
      <AnimatePresence>
        {project && (
          <>
            {/* Backdrop */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 z-50"
              onClick={onClose}
            />

            {/* Modal */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-white overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="h-full overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
                  {/* Image Gallery */}
                  <div className="bg-gray-100 p-4 md:p-8 space-y-4">
                    {project.imageUrls?.map((img, index) => (
                      <MotionDiv
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className="relative h-64 md:h-80"
                      >
                        <ImageWithFallback
                          src={img}
                          alt={`${project.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </MotionDiv>
                    ))}
                  </div>

                  {/* Project Details */}
                  <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <MotionDiv
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-sm tracking-widest text-gray-500 mb-4">
                        {project.category}
                      </p>
                      <h2 className="mb-6 tracking-wide">{project.title}</h2>
                      <p className="mb-8 text-gray-600 leading-relaxed">
                        {project.description}
                      </p>
                      <p className="mb-8 text-gray-600 leading-relaxed">
                        {project.details}
                      </p>

                      {/* Meta Information */}
                      <div className="space-y-4 border-t border-gray-200 pt-8">
                        {project.client && (
                          <div>
                            <p className="text-sm tracking-wider text-gray-500 mb-1">
                              CLIENT
                            </p>
                            <p className="text-gray-900">{project.client}</p>
                          </div>
                        )}
                        {project.year && (
                          <div>
                            <p className="text-sm tracking-wider text-gray-500 mb-1">
                              YEAR
                            </p>
                            <p className="text-gray-900">{project.year}</p>
                          </div>
                        )}
                      </div>
                    </MotionDiv>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    </React.Suspense>
  );
}
