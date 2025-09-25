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
    const visibilityState = {
      intersection: true,
      page: typeof document === 'undefined' ? true : !document.hidden,
    };

    const updateActive = () => {
      setInView(visibilityState.intersection && visibilityState.page);
    };

    let fallbackHandler: (() => void) | null = null;
    let observer: IntersectionObserver | null = null;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries.find((item) => item.target === target);
          if (entry) {
            visibilityState.intersection = entry.isIntersecting && entry.intersectionRatio > 0.15;
            updateActive();
          }
        },
        { threshold: [0, 0.15, 0.35, 0.6, 0.85, 1] }
      );
      observer.observe(target);
    } else {
      fallbackHandler = () => {
        const rect = target.getBoundingClientRect();
        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        const fullyOffscreen = rect.bottom <= viewHeight * 0.05 || rect.top >= viewHeight * 0.95;
        const mostlyVisible = rect.top < viewHeight * 0.85 && rect.bottom > viewHeight * 0.15;
        visibilityState.intersection = !fullyOffscreen && mostlyVisible;
        updateActive();
      };
      fallbackHandler();
      window.addEventListener('scroll', fallbackHandler, { passive: true });
      window.addEventListener('resize', fallbackHandler);
    }

    const handlePageVisibility = () => {
      visibilityState.page = !document.hidden;
      updateActive();
    };

    document.addEventListener('visibilitychange', handlePageVisibility);
    updateActive();

    return () => {
      observer?.disconnect();
      if (fallbackHandler) {
        window.removeEventListener('scroll', fallbackHandler);
        window.removeEventListener('resize', fallbackHandler);
      }
      document.removeEventListener('visibilitychange', handlePageVisibility);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#0F0E0E]">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas
          gl={{ powerPreference: 'high-performance', antialias: true, alpha: false }}
          dpr={inView ? [1, 2] : 1}
          frameloop={inView ? 'always' : 'demand'}
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
