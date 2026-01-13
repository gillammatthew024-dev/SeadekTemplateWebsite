'use client';
import { Header } from './components/Header';
import { About } from './components/About';
import { Portfolio } from './components/Portfolio';
import { PartnershipBanner } from './components/PartnershipBanner';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Services } from './components/Services';
import Hero3DBackground from './components/Hero3DBackground';
import BubbleWrapper from './components/BubbleWrapper';
import { AllProjectsView } from './components/AllProjectsView';
import { ProjectModal } from './components/ProjectModal';
import { useState } from 'react';
import { Project } from '../../lib/types/project';

export default function Home() {
  const [showMainPortfolio, setShowMainPortfolio] = useState(false);
  const [showSeadekPortfolio, setShowSeadekPortfolio] = useState(false);
  const [mainProjects, setMainProjects] = useState<Project[]>([]);
  const [seadekProjects, setSeadekProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Handler for card clicks from main portfolio
  const handleMainPortfolioCardClick = (project: Project) => {
    setSelectedProject(project);
  };

  // Handler for card clicks from seadek portfolio
  const handleSeadekPortfolioCardClick = (project: Project) => {
    setSelectedProject(project);
  };

  // Handler to close the project modal
  const handleCloseProjectModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      {/* Render ALL modals at root level */}
      <AllProjectsView
        isOpen={showMainPortfolio}
        onClose={() => setShowMainPortfolio(false)}
        allProjects={mainProjects}
        onProjectClick={(project) => {
          setSelectedProject(project);
          setShowMainPortfolio(false);
        }}
      />
      
      <AllProjectsView
        isOpen={showSeadekPortfolio}
        onClose={() => setShowSeadekPortfolio(false)}
        allProjects={seadekProjects}
        onProjectClick={(project) => {
          setSelectedProject(project);
          setShowSeadekPortfolio(false);
        }}
      />

      {/* Project Detail Modal - at root level */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseProjectModal}
        />
      )}

      <div className="min-h-screen">
        <Hero3DBackground>
          {/* Header stays at top */}
          <Header />
          
          {/* About Section */}
          <section className="relative z-10 px-4 md:px-8 lg:px-16 py-16">
            <BubbleWrapper variant="subtle" size="large">
              <About />
            </BubbleWrapper>
          </section>

          {/* Services Section */}
          <section className="relative z-10 px-4 md:px-8 lg:px-16 py-16">
            <BubbleWrapper variant="glow" size="large">
              <Services />
            </BubbleWrapper>
          </section>

          {/* Main Portfolio */}
          <section className="relative z-10 px-4 md:px-8 lg:px-16 py-16">
            <BubbleWrapper variant="iridescent" size="large">
              <Portfolio
                config={{
                  source: 'main-portfolio',
                  sectionid: 'portfolio',
                  title: 'SELECTED WORK',
                  subtitle: 'A curated collection of our recent projects showcasing our commitment to excellence and innovation',
                  backgroundImage: '/IMG_0230.JPG',
                  showServiceFilter: true,
                  maxPreviewItems: 2,
                }}
                onShowAll={(projects) => {
                  setMainProjects(projects);
                  setShowMainPortfolio(true);
                }}
                onClickCard={handleMainPortfolioCardClick}
                selectedProject={selectedProject}
              />
            </BubbleWrapper>
          </section>

          {/* Partnership Banner */}
          <section className="relative z-10 px-4 md:px-8 lg:px-16 py-16">
            <BubbleWrapper variant="glow" size="large">
              <PartnershipBanner />
            </BubbleWrapper>
          </section>

          {/* Seadek Portfolio */}
          <section className="relative z-10 px-4 md:px-8 lg:px-16 py-16">
            <BubbleWrapper variant="subtle" size="large">
              <Portfolio
                config={{
                  source: 'seadek-portfolio',
                  sectionid: 'seadek-portfolio',
                  title: 'SEADEK PROJECTS',
                  subtitle: 'Premium marine flooring installations showcasing our partnership excellence',
                  backgroundImage: '/IMG_0230.JPG',
                  showServiceFilter: true,
                  maxPreviewItems: 2,
                }}
                onShowAll={(projects) => {
                  setSeadekProjects(projects);
                  setShowSeadekPortfolio(true);
                }}
                onClickCard={handleSeadekPortfolioCardClick}
                selectedProject={selectedProject}
              />
            </BubbleWrapper>
          </section>

          {/* Contact Section */}
          <section className="relative z-10 px-4 md:px-8 lg:px-16 py-16">
            <BubbleWrapper variant="glow" size="large">
              <Contact />
            </BubbleWrapper>
          </section>

          {/* Footer */}
          <Footer />
        </Hero3DBackground>
      </div>
    </>
  );
}