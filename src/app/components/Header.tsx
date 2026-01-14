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
      className="
        fixed top-0 left-0 right-0 z-50
        backdrop-blur-xl
        border-b border-white/10
        shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
      "
      style={{
        background:
          'linear-gradient(135deg, #050505 0%, #111111 40%, #1c1c1c 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="
              w-10 h-10 rounded-lg
              bg-gradient-to-br from-white/20 to-white/5
              border border-white/20
              flex items-center justify-center
              shadow-inner
              group-hover:scale-105 transition
            ">
              <span className="text-white font-bold tracking-widest">
                <Link href = "/">P</Link>
                </span>
            </div>
            <span className="
              hidden sm:inline
              text-white font-semibold tracking-[0.3em]
              text-sm
              opacity-90
            ">
              PORTFOLIO
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {['about', 'portfolio', 'services', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="
                  relative text-white/80 font-medium
                  hover:text-white transition
                  after:absolute after:left-0 after:-bottom-1
                  after:h-[2px] after:w-0
                  after:bg-white after:transition-all
                  hover:after:w-full
                "
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}

            <Link
              href="/checkout"
              className="
                relative inline-flex items-center justify-center
                px-7 py-3 rounded-full
                font-semibold text-white
                bg-gradient-to-r from-zinc-700 to-zinc-900
                border border-white/10
                shadow-[0_10px_30px_-10px_rgba(255,255,255,0.15)]
                hover:brightness-110 transition
              "
            >
              Get Quote
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Social Icons */}
            <div className="hidden lg:flex items-center gap-4">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="
                    text-white/70 hover:text-white
                    transition transform hover:scale-110
                  "
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav
            className="
              md:hidden py-6
              border-t border-white/10
              bg-gradient-to-b from-black/90 to-zinc-900/90
              backdrop-blur-xl
            "
          >
            <div className="flex flex-col gap-5">
              {['about', 'portfolio', 'services', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-white/80 hover:text-white font-medium text-left"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}

              <Link
                href="/checkout"
                className="
                  mt-4 px-6 py-3 rounded-lg
                  bg-white text-black font-semibold
                  text-center hover:bg-zinc-200 transition
                "
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
