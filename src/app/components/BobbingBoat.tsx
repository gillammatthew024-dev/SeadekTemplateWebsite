// components/BobbingBoat.tsx
'use client';

import { FC } from 'react';
import Image from 'next/image';

interface BobbingBoatProps {
  /** Path to your boat image - replace with your own */
  boatImageSrc?: string;
  /** Alt text for the boat image */
  boatAlt?: string;
  /** Width of the boat image */
  width?: number;
  /** Height of the boat image */
  height?: number;
  className?: string;
}

export const BobbingBoat: FC<BobbingBoatProps> = ({
  // Replace this placeholder with your actual boat image path
  boatImageSrc = '/boat-placeholder.png',
  boatAlt = 'Boat with SeaDek flooring',
  width = 280,
  height = 180,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Boat container with bobbing animation */}
      <div className="animate-boat-bob">
        {/* Boat shadow/reflection */}
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 
                     bg-black/20 rounded-full blur-md animate-shadow-scale"
        />
        
        {/* 
          BOAT IMAGE - Replace the src prop with your own boat image
          Example: boatImageSrc="/your-boat-image.png"
        */}
        <div className="relative">
          {boatImageSrc.startsWith('/') && boatImageSrc !== '/boat-placeholder.png' ? (
            <Image
              src={boatImageSrc}
              alt={boatAlt}
              width={width}
              height={height}
              className="object-contain drop-shadow-2xl"
              priority
            />
          ) : (
            // Placeholder SVG boat - will be replaced with your image
            <PlaceholderBoat width={width} height={height} />
          )}
        </div>
      </div>

      {/* Water spray effects */}
      <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 bg-white/70 rounded-full animate-spray"
            style={{
              animationDelay: `${i * 0.2}s`,
              transform: `translateY(${Math.sin(i) * 5}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Placeholder boat SVG - will be replaced with your actual image
const PlaceholderBoat: FC<{ width: number; height: number }> = ({ width, height }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 280 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-2xl"
  >
    {/* Hull */}
    <path
      d="M20 140 Q30 160 140 165 Q250 160 260 140 L240 100 Q140 95 40 100 Z"
      fill="#1e3a5f"
      stroke="#0f2744"
      strokeWidth="2"
    />
    {/* Hull stripe */}
    <path
      d="M35 130 Q140 135 245 130"
      stroke="#3b82f6"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Deck */}
    <path
      d="M40 100 Q140 95 240 100 L230 85 Q140 80 50 85 Z"
      fill="#8B4513"
      stroke="#5D3A1A"
      strokeWidth="1"
    />
    {/* SeaDek pattern on deck */}
    <rect x="60" y="82" width="160" height="15" rx="2" fill="#4a5568" opacity="0.8" />
    <line x1="80" y1="82" x2="80" y2="97" stroke="#2d3748" strokeWidth="1" />
    <line x1="100" y1="82" x2="100" y2="97" stroke="#2d3748" strokeWidth="1" />
    <line x1="120" y1="82" x2="120" y2="97" stroke="#2d3748" strokeWidth="1" />
    <line x1="140" y1="82" x2="140" y2="97" stroke="#2d3748" strokeWidth="1" />
    <line x1="160" y1="82" x2="160" y2="97" stroke="#2d3748" strokeWidth="1" />
    <line x1="180" y1="82" x2="180" y2="97" stroke="#2d3748" strokeWidth="1" />
    <line x1="200" y1="82" x2="200" y2="97" stroke="#2d3748" strokeWidth="1" />
    {/* Cabin */}
    <path
      d="M100 85 L100 50 Q140 45 180 50 L180 85"
      fill="#e5e7eb"
      stroke="#9ca3af"
      strokeWidth="2"
    />
    {/* Windows */}
    <rect x="110" y="55" width="25" height="20" rx="3" fill="#0ea5e9" opacity="0.6" />
    <rect x="145" y="55" width="25" height="20" rx="3" fill="#0ea5e9" opacity="0.6" />
    {/* Windshield */}
    <path
      d="M100 50 L115 30 Q140 25 165 30 L180 50"
      fill="#0ea5e9"
      fillOpacity="0.4"
      stroke="#0284c7"
      strokeWidth="2"
    />
    {/* Antenna */}
    <line x1="140" y1="25" x2="140" y2="10" stroke="#374151" strokeWidth="2" />
    <circle cx="140" cy="8" r="3" fill="#ef4444" />
  </svg>
);