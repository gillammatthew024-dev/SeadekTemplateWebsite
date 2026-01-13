// Home.tsx

import { Header } from './components/Header';
import { About } from './components/About';
import { Portfolio } from './components/Portfolio';
import { PartnershipBanner } from './components/PartnershipBanner';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Services } from './components/Services';
import Hero3DBackground from './components/Hero3DBackground';
import BubbleWrapper from './components/BubbleWrapper';

export default function Home() {
  return (
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
          <Portfolio
            config={{
              source: 'main-portfolio',
              sectionid: 'portfolio',
              title: 'SELECTED WORK',
              subtitle:
                'A curated collection of our recent projects showcasing our commitment to excellence and innovation',
              backgroundImage: '/IMG_0230.JPG',
              showServiceFilter: true,
              maxPreviewItems: 2,
            }}
          />
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
                subtitle:
                  'Premium marine flooring installations showcasing our partnership excellence',
                backgroundImage: '/IMG_0230.JPG',
                showServiceFilter: true,
                maxPreviewItems: 2,
              }}
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
  );
}
