'use client';

import { FC, JSX, useEffect, useRef, useState } from 'react';
import { AnimatedWaves } from './AnimatedWaves';
import { BobbingBoat } from './BobbingBoat';
import { myFont } from './MyFont';
import './About.css';


interface SeaDekBenefit {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface SeaDekShowcaseProps {
  /** Replace with your boat image path */
  boatImageSrc?: string;
  className?: string;
}

export const SeadekShowcase: FC<SeaDekShowcaseProps> = ({
  boatImageSrc,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [benefitsVisible, setBenefitsVisible] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const benefitsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBenefitsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    if (benefitsRef.current) {
      benefitsObserver.observe(benefitsRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
      if (benefitsRef.current) {
        benefitsObserver.unobserve(benefitsRef.current);
      }
    };
  }, []);

  const benefits: SeaDekBenefit[] = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Superior Traction',
      description: 'Non-slip surface keeps you safe in wet conditions',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'UV Resistant',
      description: 'Maintains color and integrity under harsh sun',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Custom Fit',
      description: 'Precision-cut templates for your exact vessel',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Easy Maintenance',
      description: 'Simple cleaning keeps your deck looking new',
    },
  ];

  return (
    <div ref={componentRef} className={`relative w-full ${className}`}>
      {/* Background gradient */}
      <div 
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #0c4a7e 50%, #1a6fa0 100%)',
        }}
      />

      {/* Stars/particles in the sky */}
      <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 py-12 md:py-16 gap-8 lg:gap-12">
        {/* Left side - Boat animation */}
        <div className={`relative w-full lg:w-1/2 flex justify-center items-end min-h-[280px] md:min-h-[320px] transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Moon/ambient light */}
          <div className="absolute top-4 right-8 w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full opacity-80 blur-sm animate-pulse-slow" />
          
          {/* Boat with fade in animation */}
          <div className={`relative z-10 mb-8 transition-all duration-1500 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}>
            <BobbingBoat 
              boatImageSrc={boatImageSrc}
              width={300}
              height={200}
            />
          </div>

          {/* Reflection on water */}
          <div 
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-8 
                       bg-gradient-to-b from-white/10 to-transparent rounded-full blur-md"
          />
        </div>

        {/* Right side - Benefits */}
        <div ref={benefitsRef} className="w-full lg:w-1/2 text-white">
          <div className={`mb-6 transition-all duration-1000 delay-500 ${
            benefitsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <p className={`text-sm tracking-widest text-cyan-300 mb-2 ${myFont.className}`}>
              PREMIUM MARINE FLOORING
            </p>
            <h2 className="brand-title text-3xl md:text-4xl font-bold mb-3">
              Seadek Boat Flooring
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Transform your vessel with industry-leading EVA foam decking. 
              SeaDek offers unmatched comfort, durability, and style for 
              discerning boat owners.
            </p>
          </div>

          {/* Benefits grid with staggered animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`group flex items-start gap-3 p-3 rounded-lg 
                           bg-white/5 backdrop-blur-sm border border-white/10
                           hover:bg-white/10 hover:border-cyan-400/30 
                           transition-all duration-700 
                           ${benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  transitionDelay: benefitsVisible ? `${700 + (index * 150)}ms` : '0ms'
                }}
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-cyan-500/20 text-cyan-300 
                                group-hover:bg-cyan-500/30 transition-colors">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated waves at bottom */}
      <AnimatedWaves className="z-20" />
    </div>
  );
};