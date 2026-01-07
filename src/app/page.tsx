import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Portfolio } from './components/Portfolio';
import { AboutSeadek } from './components/AboutSeadek';
import { PartnershipBanner } from './components/PartnershipBanner';
import { SeadekPortfolio } from './components/SeadekPortfolio';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Services } from './components/Services';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Services />
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
      />
      <PartnershipBanner />
      <Portfolio
        config={{
          source: 'seadek-portfolio',
          sectionid: 'portfolio',
          title: 'SELECTED WORK',
          subtitle: 'A curated collection of our recent projects showcasing our commitment to excellence and innovation',
          backgroundImage: '/IMG_0230.JPG',
          showServiceFilter: true,
          maxPreviewItems: 2,
        }}
      />
      <Contact />
      <Footer />
    </div>
  );
}