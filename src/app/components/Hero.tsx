'use client';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { myFont } from './MyFont';

export function Hero() {
console.log('myFont className:', myFont.className);
  return (
    <section id="hero" className=" inset-0 relative max-h-[850px] overflow-hidden">
      {/* Fixed background image (parallax effect via CSS) */}
      <div className="fixed inset-0 -z-10">
        <ImageWithFallback
          src="/IMG_0062.JPG"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Sticky centered content — stays visually fixed while hero is in view */}
      
      <div className="relative w-screen h-screen flex items-center justify-start">
        <div className="absolute bottom-0 h-1/2 w-screen -translate-y-0 z-10 text-left px-6 md:px-16 lg:px-24">
          <h1
            className={`
    mb-6
    leading-tight
    font-bold
    text-[1.75rem] md:text-[2.75rem] lg:text-[4rem]
    bg-gradient-to-r from-indigo-500 to-pink-600
    bg-clip-text text-transparent
    ${myFont.className}
  `}
            style={{
              background: 'linear-gradient(90deg, #a85507ff 0%, #c0bd0bff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            CREATIVE EXCELLENCE
          </h1>

          <p className="max-w-2xl mb-8 text-lg md:text-xl text-white/90 font-light">
            Crafting exceptional experiences through innovative design and meticulous attention to detail.
          </p>
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-white shadow-2xl transition transform hover:brightness-105 active:translate-y-0.5"
            style={{
              background: 'linear-gradient(90deg,#2563eb 0%,#1e40af 100%)',
            }}
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}