'use client';
//note use client fine for seo, use effect is more a problem. Since use client directive causes next 
//to send rendered html and js, the problem is if text needed by crawlers is fetched in use effect after render
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProjectModal } from './ProjectModal';
import { AllProjectsView } from './AllProjectsView';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import ServiceCarousel from './ServiceCarousel';
import { myFont } from './MyFont';

interface Project {
  id: string;
  title: string;
  description?: string;
  details?: string;
  imageUrls?: string[];
  createdAt?: string;
  services?: string[];
}
interface Service {
  id: string;
  title: string;
  details?: string;
  createdAt?: string;
}

export function SeadekPortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects(services);
  }, [services]);

  const fetchProjects = async (selectedServices: string[]) => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/clever-responder/projects`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
  
      const contentType = res.headers.get("content-type") || "";
      const raw = await res.text();
  
      if (!res.ok) {
        let msg = raw;
        if (contentType.includes("application/json")) {
          try {
            const parsed = JSON.parse(raw);
            msg =
              parsed.error ||
              parsed.message ||
              JSON.stringify(parsed);
          } catch {}
        }
        throw new Error(`Server error (${res.status}): ${msg}`);
      }
  
      if (!contentType.includes("application/json")) {
        throw new Error(
          "Expected JSON response but received: " +
            raw.slice(0, 1000)
        );
      }
  
      const data = JSON.parse(raw);
      const received: any[] = data.projects || [];
  
      const projectsWithIds: Project[] = received.map((p, i) => ({
        id:
          typeof p.id === "string" && p.id
            ? p.id
            : `fallback-${i}`,
  
        title: p.title ?? "",
  
        image:
          p.image ??
          (Array.isArray(p.imageUrls)
            ? p.imageUrls[0]
            : p.image_urls?.[0]) ??
          "",
  
        description: p.description ?? "",
        details: p.details ?? "",
  
        imageUrls: Array.isArray(p.imageUrls)
          ? p.imageUrls
          : p.gallery ??
            p.image_urls ??
            p.images ??
            [],
  
        createdAt:
          p.createdAt ??
          p.created_at ??
          new Date().toISOString(),
  
        /* ─── IMPORTANT ─── */
        services:
          (p.services ||
            p.service_keys ||
            p.services_titles) ??
          [],
      }));
  
      /* ─── FILTER BY SELECTED SERVICES ─── */
  
      const filteredProjects =
        selectedServices.length === 0
          ? projectsWithIds
          : projectsWithIds.filter((project) => {
              const projectServices =
                project.services as string[];
  
              return selectedServices.some((s) =>
                projectServices.includes(s)
              );
            });
  
      // sort newest first
      filteredProjects.sort((a, b) =>
        (b.createdAt || "").localeCompare(
          a.createdAt || ""
        )
      );
      console.log(projectsWithIds);
      console.log(filteredProjects)
      console.log(services)
      setProjects(filteredProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const selected = projects.slice(0, 2);
  const style: React.CSSProperties = {backgroundImage: 'url(/IMG_7178.JPG)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'};

  return (
    <section id="portfolio" className="py-20 bg-gray-50" style={style}>
      {/* Dark overlay for text visibility */}
      <div className="absolute inset-0 bg-black opacity-70"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`mb-4 tracking-wider mb-6 tracking-wider text-gray-100 bg-gradient-to-r from-indigo-500 to-pink-600
      bg-clip-text text-transparent ${myFont.className}`}>SELECTED WORK</h2>
          <p className="max-w-2xl mx-auto text-gray-100">
            A curated collection of our recent projects showcasing our commitment to excellence and innovation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {selected.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden bg-white cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-80 overflow-hidden">
                <ImageWithFallback
                  src={project.imageUrls?.[0] ?? '/placeholder.png'}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="tracking-wide">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div> <ServiceCarousel onChange = {(titles) => {setServices(titles)}}/></div>

        {/* View All Projects Button */}
        <div className="text-center">
          <button
            onClick={() => setShowAllProjects(true)}
           className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white hover:bg-orange-800 transition-colors group translate-y-4 rounded-lg"

          >
            <p className={`text-sm tracking-widest mb-3 text-gray-100 ${myFont.className}`}>View All Projects</p>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

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