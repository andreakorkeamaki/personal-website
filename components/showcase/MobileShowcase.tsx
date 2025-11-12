"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, ShowcaseProps, PH, prefetchProjectImages, prefetchAllProjectImages, getVisibleProjects } from "./shared";
import { Boxes, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const MOBILE_CARD_IMAGE_SIZE_HINT = "280px";

type ShowcaseCardImageProps = {
  src?: string | null;
  placeholder: string;
  alt: string;
  priority: boolean;
  loading: "eager" | "lazy";
};

function ShowcaseCardImage({ src, placeholder, alt, priority, loading }: ShowcaseCardImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState(src || placeholder);

  useEffect(() => {
    setResolvedSrc(src || placeholder);
  }, [src, placeholder]);

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      sizes={MOBILE_CARD_IMAGE_SIZE_HINT}
      priority={priority}
      loading={loading}
      placeholder="empty"
      onError={() => {
        if (resolvedSrc !== placeholder) {
          setResolvedSrc(placeholder);
        }
      }}
      className="object-cover"
      unoptimized
    />
  );
}

export default function MobileShowcase({ initialIndex = 0, className, onSelect, onOpen }: ShowcaseProps) {
  const flattened = useMemo(() => {
    const entries: { project: typeof CATEGORIES[number]["projects"][number]; catIdx: number; projectIdx: number }[] = [];
    CATEGORIES.forEach((category, catIdx) => {
      const visible = getVisibleProjects(category.projects);
      visible.forEach((project, projectIdx) => {
        entries.push({ project, catIdx, projectIdx });
      });
    });
    return entries;
  }, []);

  const safeLen = flattened.length;
  const hasProjects = safeLen > 0;
  const boundedInitialIndex = hasProjects ? Math.min(Math.max(0, initialIndex), safeLen - 1) : 0;
  const [index, setIndex] = useState(boundedInitialIndex);
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    prefetchProjectImages(flattened.map((entry) => entry.project));
  }, [flattened]);

  useEffect(() => {
    prefetchAllProjectImages();
  }, []);

  useEffect(() => {
    if (!hasProjects) {
      setIndex(0);
      setCategoryOpen(false);
      return;
    }
    setIndex((prev) => {
      const next = Math.min(Math.max(prev, 0), safeLen - 1);
      return next;
    });
  }, [hasProjects, safeLen]);

  useEffect(() => {
    if (!hasProjects) return;
    setIndex(Math.min(Math.max(initialIndex, 0), safeLen - 1));
  }, [initialIndex, hasProjects, safeLen]);

  const goPrev = () => {
    if (!hasProjects) return;
    setIndex((prev) => (prev - 1 + safeLen) % safeLen);
  };

  const goNext = () => {
    if (!hasProjects) return;
    setIndex((prev) => (prev + 1) % safeLen);
  };

  const activeEntry = hasProjects ? flattened[index] : undefined;
  const activeProject = activeEntry?.project;
  const activeCatIdx = activeEntry?.catIdx ?? 0;
  const activeCategory = CATEGORIES[activeCatIdx];

  const categoryOffsets = useMemo(() => {
    return CATEGORIES.map((category, catIdx) => {
      const found = flattened.findIndex((entry) => entry.catIdx === catIdx);
      return found;
    });
  }, [flattened]);

  const jumpToCategory = (catIdx: number) => {
    const target = categoryOffsets[catIdx];
    if (target >= 0) {
      setIndex(target);
      setCategoryOpen(false);
    }
  };

  useEffect(() => {
    if (activeEntry) {
      onSelect?.(activeEntry.project, activeEntry.projectIdx);
    }
  }, [activeEntry, onSelect]);

  const bgGradient = useMemo(() => {
    const from = activeProject?.palette?.from || "#0ea5e9";
    const to = activeProject?.palette?.to || "#8b5cf6";
    return `linear-gradient(115deg, ${from}, ${to})`;
  }, [activeProject]);

  const bgImageSrc = activeProject?.tile || activeProject?.cover || null;
  const hasBgImage = !!bgImageSrc;

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
    if (event.cancelable) event.preventDefault();
    swipeRef.current = { pointerId: event.pointerId, startX: event.clientX, lastX: event.clientX, fired: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.cancelable) event.preventDefault();
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
    if (event.cancelable) event.preventDefault();
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
    <div className={`relative w-full overflow-visible ${className || ""}`} style={{ overscrollBehavior: "contain" }}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: bgGradient }} />
        {hasBgImage && (
          <div className="absolute inset-0">
            <Image
              src={bgImageSrc}
              alt={activeProject?.title ? `${activeProject.title} background` : "Project background"}
              fill
              sizes="100vw"
              className="object-cover"
              loading="eager"
              priority
              placeholder="empty"
              unoptimized
              aria-hidden={true}
            />
          </div>
        )}
        {!hasBgImage && (
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
        )}
      </div>

      <div className="relative min-h-screen flex flex-col text-white pb-16 pt-8">
        {hasProjects && (
          <div className="px-4 relative z-20">
            <button
              type="button"
              onClick={() => hasProjects && setCategoryOpen((open) => !open)}
              className="mx-auto flex w-full max-w-[320px] items-center justify-between gap-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-left backdrop-blur-md shadow-lg"
            >
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Categoria</p>
                <p className="text-lg font-semibold leading-tight line-clamp-1">{activeCategory?.label}</p>
                {activeProject && (
                  <p className="mt-1 text-xs text-white/70 line-clamp-1">{activeProject.title}</p>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}

        <AnimatePresence>
          {categoryOpen && hasProjects && (
            <motion.div
              key="category-overlay"
              className="absolute inset-0 z-40 flex flex-col px-4 pt-24 pb-28 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCategoryOpen(false)}
            >
              <motion.div
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 32, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-full max-w-[360px] rounded-3xl border border-white/20 bg-black/55 backdrop-blur-lg shadow-2xl overflow-hidden"
                onClick={(event) => event.stopPropagation()}
              >
                {CATEGORIES.map((category, i) => {
                  const Icon = category.icon || Boxes;
                  const isActiveCat = i === activeCatIdx;
                  const hasCatProjects = categoryOffsets[i] !== -1;
                  const count = getVisibleProjects(category.projects).length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => jumpToCategory(i)}
                      disabled={!hasCatProjects}
                      className={`w-full flex items-center gap-3 px-4 py-4 text-left border-b border-white/12 last:border-b-0 ${
                        isActiveCat ? "bg-white/18" : "hover:bg-white/10"
                      } ${hasCatProjects ? "" : "opacity-50"}`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-tight">{category.label}</p>
                        <p className="text-xs text-white/60">{count} progetti</p>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 px-4 pt-6 flex flex-col items-center relative z-10">
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
                  style={{ touchAction: "none" }}
                >
                  {flattened.map((entry, i) => {
                    const project = entry.project;
                    const cat = CATEGORIES[entry.catIdx] as (typeof CATEGORIES)[number] | undefined;
                    const catLabel = cat?.label || "";
                    const offset = computeOffset(i);
                    const depth = Math.abs(offset);
                    if (depth > 2) return null;
                    const isActive = offset === 0;
                    const scale = Math.max(0.74, 1 - depth * 0.11);
                    const translateX = offset * 36;
                    const translateY = depth * 22;
                    const rotate = offset * -6;
                    const opacity = Math.max(0.35, 1 - depth * 0.26);

                    const baseImage = project.cover || project.tile;
                    const placeholder = PH(project.title, 640, 853);
                    return (
                      <motion.button
                        key={project.id}
                        type="button"
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
                        } cursor-pointer`}
                        style={{ zIndex: 200 - depth * 10 }}
                        onClick={() => {
                          if (!isActive) {
                            setIndex(i);
                            return;
                          }
                          if (onOpen) {
                            onOpen(project);
                          } else if (project.href) {
                            window.open(project.href, "_blank", "noopener,noreferrer");
                          }
                        }}
                        aria-label={isActive ? `Apri ${project.title}` : `Mostra ${project.title}`}
                      >
                        <ShowcaseCardImage
                          src={baseImage}
                          placeholder={placeholder}
                          alt={project.title}
                          priority={isActive && !!baseImage}
                          loading={isActive ? 'eager' : 'lazy'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md shadow-lg overflow-hidden">
                            <div className="px-4 py-2">
                              <p className="text-base font-semibold line-clamp-1">{project.title}</p>
                              {project.subtitle && <p className="mt-1 text-xs text-white/70 line-clamp-1">{project.subtitle}</p>}
                              {catLabel && <p className="text-[11px] text-white/60 mt-1 uppercase tracking-wide">{catLabel}</p>}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Progetto precedente"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[150%] rounded-full border border-white/30 bg-black/35 p-2 backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Progetto successivo"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[150%] rounded-full border border-white/30 bg-black/35 p-2 backdrop-blur-sm"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 px-4">
                <div className="flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md shadow-lg px-4 py-2">
                  {flattened.map((entry, i) => {
                    const isActiveDot = i === index;
                    return (
                      <button
                        key={`dot-${i}`}
                        onClick={() => setIndex(i)}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                          isActiveDot ? "bg-white shadow-lg scale-125" : "bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Vai al progetto ${entry.project.title}`}
                        style={{
                          transform: isActiveDot ? 'scale(1.25)' : 'scale(1)',
                          opacity: isActiveDot ? 1 : 0.6
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
