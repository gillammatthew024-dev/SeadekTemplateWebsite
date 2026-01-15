'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { myFont } from './MyFont';
import { SeadekShowcase } from './SeadekShowcase';
import './ResponsiveTitle.css';
import './About.css';

export function PartnershipBanner() {
  const [isRevealed, setIsRevealed] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation when coming into view
        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
          setIsRevealed(true);
        } else if (!entry.isIntersecting) {
          // Reset animation when going out of view
          setIsRevealed(false);
        }
      },
      { 
        threshold: [0, 0.2, 0.5, 1],
        rootMargin: '-50px 0px' // Start animation slightly before fully in view
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <section ref={containerRef} className="relative flex flex-col overflow-hidden">
      {/* Original collaboration section - stays on top */}
      <div className="relative h-80 flex items-center justify-center overflow-hidden z-20 bg-white">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1605472074915-e1406eda66bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjBib2F0JTIwZGVja3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Partnership banner"
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0" 
            style={{
              background: 'linear-gradient(135deg, #0c4a7e 0%, #1a6fa0 50%, #1e7ab3 100%)',
            }}
          />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <p className={`p-4 brand-title brand-title-medium tracking-widest mt-8 mb-3 text-gray-100 ${myFont.className}`}>
             COLLABORATION 
          </p>
          <div className="w-screen flex flex-row justify-center items-center gap-8 mb-4 p-4">
            <img 
              className="rounded-lg shadow-sm" 
              width={250} 
              height={110} 
              src="https://conceptmarinedesign.com/wp-content/uploads/2023/10/marine-logo-bleu-fr_uid62d576c52a616.svg" 
              alt="CMD Produits Nautiques"
            />
          </div>
        </div>

        {/* Bottom edge shadow to create depth */}
        <div className="response-text absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/20 to-transparent z-30" />
      </div>

      {/* SeaDek Showcase section - slides down from underneath */}
      <div 
        ref={showcaseRef}
        className={`relative transition-all duration-1000 ease-out ${
          isRevealed 
            ? 'transform translate-y-0 opacity-100' 
            : 'transform -translate-y-full opacity-0'
        }`}
        style={{
          marginTop: isRevealed ? '0' : '-500px', // Starts hidden under the collaboration section
          zIndex: 10
        }}
      >
        <SeadekShowcase 
          // Replace with your boat image:
          // boatImageSrc="/your-boat-image.png"
          className="min-h-[500px] rounded-none"
        />
      </div>
    </section>
  );
}