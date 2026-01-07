'use client';
import { Menu, X, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-blue-200/30"
      style={{
        background: 'linear-gradient(135deg, #0c4a7e 0%, #1a6fa0 50%, #1e7ab3 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="cursor-pointer flex items-center" onClick={() => scrollToSection('hero')}>
            <div className="w-10 h-10 bg-white/20 flex items-center justify-center rounded">
              <span className="text-white tracking-widest font-bold">P</span>
            </div>
            <span className="ml-3 tracking-widest hidden sm:inline text-white font-semibold">PORTFOLIO</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button onClick={() => scrollToSection('about')} className="text-white/90 hover:text-white transition-colors font-medium">
              About
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="text-white/90 hover:text-white transition-colors font-medium">
              Portfolio
            </button>
            <button onClick={() => scrollToSection('services')} className="text-white/90 hover:text-white transition-colors font-medium">
              Services
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-white/90 hover:text-white transition-colors font-medium">
              Contact
            </button>
            <Link
              href = "/checkout" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-white shadow-2xl transition transform hover:brightness-105 active:translate-y-0.5"
              style={{
              background: 'linear-gradient(90deg,#2563eb 0%,#1e40af 100%)',
            }}
            >
              Get Quote
            </Link>
          </nav>

          {/* Social Media Icons & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Social Icons - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-blue-200/30">
            <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('about')} className="text-white/90 hover:text-white transition-colors font-medium">
                About
              </button>
              <button onClick={() => scrollToSection('portfolio')} className="text-white/90 hover:text-white transition-colors font-medium">
                Portfolio
              </button>
              <button onClick={() => scrollToSection('services')} className="text-white/90 hover:text-white transition-colors font-medium">
                Services
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-white/90 hover:text-white transition-colors font-medium">
                Contact
              </button>
              <Link
                href = "checkout" 
                className="px-6 py-2 bg-white text-blue-900 hover:bg-blue-50 transition-colors font-semibold rounded text-center"
              >
                Get Quote
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}