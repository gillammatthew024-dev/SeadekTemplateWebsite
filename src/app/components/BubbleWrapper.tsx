'use client';
import { ReactNode, useRef, useEffect, useState } from 'react';
import './BubbleWrapper.css';

interface BubbleWrapperProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glow' | 'iridescent' | 'subtle';
  size?: 'auto' | 'small' | 'medium' | 'large';
  animated?: boolean;
}

export default function BubbleWrapper({
  children,
  className = '',
  variant = 'default',
  size = 'auto',
  animated = true,
}: BubbleWrapperProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble || !animated) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = bubble.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };

    bubble.addEventListener('mousemove', handleMouseMove);
    return () => bubble.removeEventListener('mousemove', handleMouseMove);
  }, [animated]);

  const lightStyle = {
    '--light-x': `${mousePosition.x * 100}%`,
    '--light-y': `${mousePosition.y * 100}%`,
  } as React.CSSProperties;

  return (
    <div
      ref={bubbleRef}
      className={`bubble-wrapper bubble-${variant} bubble-${size} ${animated ? 'bubble-animated' : ''} ${className}`}
      style={lightStyle}
    >
      <div className="bubble-shine" />
      <div className="bubble-content">
        {children}
      </div>
      <div className="bubble-reflection" />
    </div>
  );
}