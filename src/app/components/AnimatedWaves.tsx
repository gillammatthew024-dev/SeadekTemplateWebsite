// components/AnimatedWaves.tsx
'use client';

import { FC } from 'react';

interface AnimatedWavesProps {
  className?: string;
  waveColor?: string;
  waveColorLight?: string;
}

export const AnimatedWaves: FC<AnimatedWavesProps> = ({
  className = '',
  waveColor = '#0c4a7e',
  waveColorLight = '#1a6fa0',
}) => {
  return (
    <div className={`absolute bottom-0 left-0 w-full overflow-hidden ${className}`}>
      {/* Back wave - slowest */}
      <svg
        className="absolute bottom-0 w-[200%] animate-wave-slow"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ height: '80px' }}
      >
        <path
          fill={waveColor}
          fillOpacity="0.4"
          d="M0,64 C120,80 240,96 360,88 C480,80 600,48 720,40 C840,32 960,48 1080,56 C1200,64 1320,64 1380,64 L1440,64 L1440,120 L0,120 Z"
        />
      </svg>

      {/* Middle wave - medium speed */}
      <svg
        className="absolute bottom-0 w-[200%] animate-wave-medium"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ height: '70px' }}
      >
        <path
          fill={waveColorLight}
          fillOpacity="0.6"
          d="M0,80 C160,60 320,40 480,48 C640,56 800,88 960,88 C1120,88 1280,56 1360,40 L1440,24 L1440,120 L0,120 Z"
        />
      </svg>

      {/* Front wave - fastest */}
      <svg
        className="absolute bottom-0 w-[200%] animate-wave-fast"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ height: '60px' }}
      >
        <path
          fill={waveColor}
          fillOpacity="0.8"
          d="M0,96 C80,80 160,64 320,64 C480,64 640,80 800,80 C960,80 1120,64 1280,56 C1360,52 1400,52 1440,56 L1440,120 L0,120 Z"
        />
      </svg>

      {/* Foam/sparkle effects */}
      <div className="absolute bottom-[50px] left-0 w-full">
        <div className="flex justify-around">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 bg-white rounded-full opacity-60 animate-sparkle"
              style={{
                animationDelay: `${i * 0.3}s`,
                marginLeft: `${Math.random() * 20}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};