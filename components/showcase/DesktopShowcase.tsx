"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, ShowcaseProps, PH, prefetchProjectImages, prefetchAllProjectImages } from "./shared";
import { Boxes } from "lucide-react";

const CARD_WIDTH = 230;
const CARD_HEIGHT = 260;
const ACTIVE_CARD_SCALE = 1.13;
const INACTIVE_CARD_SCALE = 0.87;
const CARD_IMAGE_SIZE_HINT = `${Math.round(CARD_WIDTH * ACTIVE_CARD_SCALE)}px`;

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

  const isPriority = priority && !!src && src !== placeholder;
  const loadingMode = isPriority ? undefined : loading;

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      sizes={CARD_IMAGE_SIZE_HINT}
      priority={isPriority}
      loading={loadingMode}
      placeholder="blur"
      blurDataURL={placeholder}
      onError={() => {
        if (resolvedSrc !== placeholder) {
          setResolvedSrc(placeholder);
        }
      }}
      className="object-cover transition-opacity duration-300"
    />
  );
}

export default function DesktopShowcase({ initialIndex = 0, onOpen, className }: ShowcaseProps) {
  const [catIndex, setCatIndex] = useState(0);
  const currentCat = CATEGORIES[catIndex];
  const projectCount = currentCat.projects.length;
  const safeLen = Math.max(1, projectCount);
  const [index, setIndex] = useState(Math.min(Math.max(0, initialIndex), safeLen - 1));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const displayIndex = hoverIndex != null ? hoverIndex : index;
  const active = currentCat.projects[displayIndex % safeLen];

  const rootRef = useRef<HTMLDivElement | null>(null);
  const nextIndexRef = useRef<number | null>(null);
  const prevCatRef = useRef(catIndex);
  const [sectionActive, setSectionActive] = useState(false);

  useEffect(() => {
    prefetchProjectImages(currentCat.projects);
  }, [currentCat]);

  useEffect(() => {
    prefetchAllProjectImages();
  }, []);

  useEffect(() => {
    const catChanged = prevCatRef.current !== catIndex;
    prevCatRef.current = catIndex;
    setHoverIndex(null);
    setIndex((prev) => {
      if (projectCount === 0) {
        nextIndexRef.current = null;
        return 0;
      }
      if (nextIndexRef.current != null) {
        const target = Math.min(Math.max(nextIndexRef.current, 0), projectCount - 1);
        nextIndexRef.current = null;
        return target;
      }
      if (catChanged) {
        return 0;
      }
      return Math.min(prev, projectCount - 1);
    });
  }, [catIndex, projectCount]);

  useEffect(() => {
    const isTyping = (el: Element | null) => {
      if (!el) return false;
      const tag = (el as HTMLElement).tagName;
      const editable = (el as HTMLElement).isContentEditable;
      return editable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    };
    const isInViewport = (el: HTMLElement | null) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh * 0.9 && r.bottom > vh * 0.1;
    };
    const h = (e: KeyboardEvent) => {
      if (isTyping(e.target as Element)) return;
      const within = sectionActive || isInViewport(rootRef.current);
      if (!within) return;
      const totalCats = CATEGORIES.length;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setHoverIndex(null);
        const next = index + 1;
        if (next < projectCount) {
          setIndex(next);
        } else {
          const nextCat = (catIndex + 1) % totalCats;
          nextIndexRef.current = 0;
          setCatIndex(nextCat);
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setHoverIndex(null);
        const prev = index - 1;
        if (prev >= 0) {
          setIndex(prev);
        } else {
          const prevCat = (catIndex - 1 + totalCats) % totalCats;
          const prevCount = CATEGORIES[prevCat].projects.length;
          nextIndexRef.current = prevCount > 0 ? prevCount - 1 : 0;
          setCatIndex(prevCat);
        }
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndexRef.current = 0;
        setHoverIndex(null);
        setCatIndex((i)=> (i-1+totalCats)%totalCats);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndexRef.current = 0;
        setHoverIndex(null);
        setCatIndex((i)=> (i+1)%totalCats);
        return;
      }
      if (e.key === 'Enter' && active) {
        e.preventDefault();
        onOpen ? onOpen(active) : window.open(active.href || '#','_blank');
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [active, projectCount, sectionActive, onOpen, index, catIndex]);

  const bgGradient = useMemo(() => {
    const from = active?.palette?.from || '#0ea5e9';
    const to = active?.palette?.to || '#8b5cf6';
    return `linear-gradient(115deg, ${from}, ${to})`;
  }, [active]);

  const bgImageSrc = active?.tile || active?.cover || null;
  const hasBgImage = !!bgImageSrc;

  return (
    <div ref={rootRef} className={`relative w-full overflow-visible ${className || ''}`}
      onMouseEnter={()=>setSectionActive(true)} onMouseLeave={()=>setSectionActive(false)} onFocusCapture={()=>setSectionActive(true)} onBlurCapture={()=>setSectionActive(false)}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: bgGradient }} />
        <AnimatePresence mode="wait">
          {hasBgImage && (
            <motion.div
              key={`bg-${currentCat.id}-${active?.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('${bgImageSrc}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {!hasBgImage && (
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(1200px 400px at -10% 110%, rgba(255,255,255,0.14), transparent), radial-gradient(900px 360px at 120% -10%, rgba(255,255,255,0.12), transparent)"
            }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>

      <div className="relative min-h-[70vh] lg:min-h-[76vh] flex flex-col text-white pb-24">
        <div className="px-4 pt-3">
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
            {CATEGORIES.map((c,i)=>{
              const Icon = c.icon || Boxes; const activeCat = i===catIndex;
              return (
                <button key={c.id} onClick={()=>setCatIndex(i)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur ${activeCat ? 'border-white/40 bg-white/15' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}>
                  <Icon className="h-4 w-4" /><span className="text-sm whitespace-nowrap">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-3 sm:px-5 md:px-8 pt-2 flex-1 flex flex-col items-center">
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="flex items-end gap-4 flex-wrap justify-center" onMouseLeave={()=>setHoverIndex(null)}>
              {currentCat.projects.map((p,i)=>{
                const activeCard = i===displayIndex;
                const baseImage = p.cover || p.tile;
                const placeholder = PH(p.title, 640, 853);
                return (
                  <motion.div key={p.id} onMouseEnter={()=>setHoverIndex(i)}
                    className={`relative shrink-0 rounded-lg border border-white/15 bg-black/20 backdrop-blur-sm shadow-xl overflow-hidden ${activeCard ? 'ring-2 ring-white/50' : 'hover:border-white/30'}`}
                    style={{ width: CARD_WIDTH, height: CARD_HEIGHT, transformOrigin: 'bottom center' }}
                    initial={{opacity:0, y:16, scale: INACTIVE_CARD_SCALE}}
                    animate={{opacity:1, y:0, scale: activeCard ? ACTIVE_CARD_SCALE : INACTIVE_CARD_SCALE}}
                    transition={{delay: i*0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1]}}>
                    <ShowcaseCardImage
                      src={baseImage}
                      placeholder={placeholder}
                      alt={p.title}
                      priority={activeCard && !!baseImage}
                      loading={activeCard ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md shadow-lg overflow-hidden">
                        <div className="px-4 py-2">
                          <p className="text-sm font-semibold line-clamp-1">{p.title}</p>
                          <p className="text-[11px] text-white/70 line-clamp-1">{p.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-6">
          <div
            className="mx-auto w-full max-w-3xl rounded-full border border-white/10 px-6 py-3 backdrop-blur-sm"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)" }}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-white/80 text-xs sm:text-sm font-medium">
              <span>← → Cambia progetto</span>
              <span>↑ ↓ Cambia categoria</span>
              <span>⏎ Seleziona</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
