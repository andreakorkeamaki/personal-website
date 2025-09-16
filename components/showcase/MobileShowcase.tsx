"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, ShowcaseProps } from "./shared";
import { Boxes, ChevronLeft, ChevronRight } from "lucide-react";

export default function MobileShowcase({ initialIndex = 0, className, onSelect }: ShowcaseProps) {
  const [catIndex, setCatIndex] = useState(0);
  const currentCat = CATEGORIES[catIndex];
  const projects = currentCat.projects;
  const safeLen = projects.length;
  const hasProjects = safeLen > 0;
  const initialSafeIndex = hasProjects ? Math.min(Math.max(0, initialIndex), safeLen - 1) : 0;
  const [index, setIndex] = useState(initialSafeIndex);

  useEffect(() => {
    if (!hasProjects) {
      setIndex(0);
      return;
    }
    setIndex((prev) => Math.min(prev, safeLen - 1));
  }, [safeLen]);

  useEffect(() => {
    if (!hasProjects) {
      setIndex(0);
      return;
    }
    setIndex(0);
  }, [catIndex, hasProjects]);

  const goPrev = () => {
    if (!hasProjects) return;
    setIndex((prev) => (prev - 1 + safeLen) % safeLen);
  };

  const goNext = () => {
    if (!hasProjects) return;
    setIndex((prev) => (prev + 1) % safeLen);
  };

  const active = hasProjects ? projects[index] : undefined;

  useEffect(() => {
    if (active) onSelect?.(active, index);
  }, [active, index, onSelect]);

  const bgGradient = useMemo(() => {
    const from = active?.palette?.from || "#0ea5e9";
    const to = active?.palette?.to || "#8b5cf6";
    return `linear-gradient(115deg, ${from}, ${to})`;
  }, [active]);

  const swipeRef = useRef<{ pointerId: number; startX: number; lastX: number; fired: boolean } | null>(null);

  const swipeThreshold = 45;

  const triggerSwipe = (dx: number) => {
    if (Math.abs(dx) <= swipeThreshold) return false;
    if (dx < 0) {
      goNext();
    } else {
      goPrev();
    }
    return true;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasProjects) return;
    swipeRef.current = { pointerId: event.pointerId, startX: event.clientX, lastX: event.clientX, fired: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = swipeRef.current;
    if (!state || state.pointerId !== event.pointerId || state.fired) {
      if (state && state.pointerId === event.pointerId) {
        state.lastX = event.clientX;
      }
      return;
    }
    const dx = event.clientX - state.startX;
    state.lastX = event.clientX;
    if (triggerSwipe(dx)) {
      state.fired = true;
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = swipeRef.current;
    if (!state || state.pointerId !== event.pointerId) {
      swipeRef.current = null;
    } else {
      const dx = (state.fired ? state.lastX : event.clientX) - state.startX;
      if (!state.fired) {
        triggerSwipe(dx);
      }
      swipeRef.current = null;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    swipeRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const computeOffset = (i: number) => {
    if (!hasProjects) return 0;
    let offset = i - index;
    if (offset > safeLen / 2) offset -= safeLen;
    if (offset < -safeLen / 2) offset += safeLen;
    return offset;
  };

  return (
    <div className={`relative w-full overflow-visible ${className || ""}`}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: bgGradient }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentCat.id}-${active?.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{ background: bgGradient }}
          />
        </AnimatePresence>
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(1200px 400px at -10% 110%, rgba(255,255,255,0.14), transparent), radial-gradient(900px 360px at 120% -10%, rgba(255,255,255,0.12), transparent)"
          }}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative min-h-[60vh] flex flex-col text-white pb-10">
        <div className="px-4 pt-3">
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
            {CATEGORIES.map((category, i) => {
              const Icon = category.icon || Boxes;
              const isActiveCat = i === catIndex;
              return (
                <button
                  key={category.id}
                  onClick={() => setCatIndex(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur ${
                    isActiveCat ? "border-white/40 bg-white/15" : "border-white/15 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm whitespace-nowrap">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 px-4 pt-6 flex flex-col items-center">
          {!hasProjects && (
            <div className="flex-1 w-full flex flex-col items-center justify-center text-center text-white/80">
              <div className="h-40 w-64 rounded-2xl border border-white/15 bg-black/25 backdrop-blur-sm flex items-center justify-center">
                Nessun progetto
              </div>
              <p className="mt-4 text-sm">Aggiungi progetti per vedere lo slider.</p>
            </div>
          )}

          {hasProjects && (
            <>
              <div className="relative flex-1 w-full flex items-center justify-center">
                <div
                  className="relative w-full max-w-[280px] aspect-[3/4]"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerCancel}
                  style={{ touchAction: "pan-y" }}
                >
                  {projects.map((project, i) => {
                    const offset = computeOffset(i);
                    const depth = Math.abs(offset);
                    if (depth > 2) return null;
                    const isActive = offset === 0;
                    const scale = Math.max(0.74, 1 - depth * 0.11);
                    const translateX = offset * 36;
                    const translateY = depth * 22;
                    const rotate = offset * -6;
                    const opacity = Math.max(0.35, 1 - depth * 0.26);

                    return (
                      <motion.div
                        key={project.id}
                        initial={false}
                        animate={{
                          x: translateX,
                          y: translateY,
                          scale,
                          rotate,
                          opacity
                        }}
                        transition={{ type: "spring", stiffness: 240, damping: 26, mass: 0.9 }}
                        className={`absolute inset-0 rounded-3xl border border-white/15 bg-black/25 backdrop-blur-sm overflow-hidden shadow-2xl ${
                          isActive ? "ring-2 ring-white/40" : ""
                        }`}
                        style={{ zIndex: 200 - depth * 10 }}
                        onClick={() => setIndex(i)}
                      >
                        <img src={project.tile || project.cover} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-base font-semibold line-clamp-1">{project.title}</p>
                          {project.subtitle && <p className="mt-1 text-xs text-white/70 line-clamp-1">{project.subtitle}</p>}
                        </div>
                      </motion.div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Progetto precedente"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-black/35 p-2 backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Progetto successivo"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full border border-white/30 bg-black/35 p-2 backdrop-blur-sm"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {active && (
                <div className="mt-6 text-center px-4">
                  <p className="text-lg font-semibold">{active.title}</p>
                  {active.subtitle && <p className="mt-1 text-sm text-white/70">{active.subtitle}</p>}
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-2">
                {projects.map((project, i) => {
                  const isActiveDot = i === index;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setIndex(i)}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        isActiveDot ? "bg-white" : "bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`Vai al progetto ${project.title}`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
