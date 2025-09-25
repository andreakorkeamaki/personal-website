"use client";
import { Canvas } from '@react-three/fiber';
import GalaxyPoints from './GalaxyPoints';
import { Suspense, useEffect, useRef, useState } from 'react';

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const handleVisibility = () => {
      const rect = target.getBoundingClientRect();
      const viewHeight = window.innerHeight || document.documentElement.clientHeight;
      const fullyOffscreen = rect.bottom <= viewHeight * 0.05 || rect.top >= viewHeight * 0.95;
      const mostlyVisible = rect.top < viewHeight * 0.85 && rect.bottom > viewHeight * 0.15;
      setInView(!fullyOffscreen && mostlyVisible);
    };

    handleVisibility();

    window.addEventListener('scroll', handleVisibility, { passive: true });
    window.addEventListener('resize', handleVisibility);

    return () => {
      window.removeEventListener('scroll', handleVisibility);
      window.removeEventListener('resize', handleVisibility);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#0F0E0E]">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas
          gl={{ powerPreference: 'high-performance', antialias: true, alpha: false }}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 10], fov: 60 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#0F0E0E');
          }}
        >
          <Suspense fallback={null}>
            <GalaxyPoints active={inView} />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient accent glow */}
      <div className="gradient-accent pointer-events-none absolute inset-0" />

      {/* Subtle hint */}
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#F5EDCE]/50">
          Double click
        </span>
      </div>

      {/* Centered Text */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6 pointer-events-none">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FFFDF6] text-shadow-soft">
          Andrea Korkeamaki
        </h1>
        <p className="mt-4 font-body text-[#F5EDCE] text-base sm:text-lg md:text-xl">
          3D • Motion • Web • AI
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center text-[#F5EDCE]/80">
          <div className="h-6 w-[2px] bg-[#F5EDCE]/40 rounded-full overflow-hidden">
            <span className="block h-2 w-[2px] bg-[#F5EDCE] animate-bounceSlow" />
          </div>
          <span className="mt-2 text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </div>
    </section>
  );
}
