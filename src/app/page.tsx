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
      <Portfolio />
      <AboutSeadek />
      <PartnershipBanner />
      <SeadekPortfolio />
      <Contact />
      <Footer />
    </div>
  );
}