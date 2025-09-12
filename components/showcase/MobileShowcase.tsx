"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, ShowcaseProps } from "./shared";
import { Boxes } from "lucide-react";

export default function MobileShowcase({ initialIndex = 0, className, onSelect }: ShowcaseProps) {
  const [catIndex, setCatIndex] = useState(0);
  const currentCat = CATEGORIES[catIndex];
  const safeLen = Math.max(1, currentCat.projects.length);
  const [index, setIndex] = useState(Math.min(Math.max(0, initialIndex), safeLen - 1));

  // Scroll rail refs and proximity for picker effect
  const railScrollRef = useRef<HTMLDivElement | null>(null);
  const railInnerRef = useRef<HTMLDivElement | null>(null);
  const [proximities, setProximities] = useState<number[]>([]);
  const velocityRef = useRef(0); // px/s (approx)
  const lastRef = useRef({ x: 0, t: 0 });
  const [sidePad, setSidePad] = useState(24); // dynamic padding so first/last center

  useEffect(() => setIndex(0), [catIndex]);
  // re-center when index reset due to category change
  useEffect(() => {
    const scroller = railScrollRef.current; const inner = railInnerRef.current; if (!scroller || !inner) return;
    const children = inner.children as any; const el: HTMLElement | undefined = children?.[0]; if (!el) return;
    const target = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior: 'smooth' });
  }, [catIndex]);

  // Helper to compute dynamic side padding so first/last can center perfectly
  useEffect(() => {
    const scroller = railScrollRef.current; const inner = railInnerRef.current; if (!scroller || !inner) return;
    const computePad = () => {
      const itemEl = inner.querySelector('[data-item-index="0"]') as HTMLElement | null;
      const cardW = itemEl?.offsetWidth || 180;
      const gap = 16; // gap-4
      const fudge = 10; // extra to ensure last fully centers on iOS
      const pad = Math.max(12, Math.round(scroller.clientWidth / 2 - cardW / 2 + gap / 2 + fudge));
      setSidePad(pad);
    };
    computePad();
    window.addEventListener('resize', computePad);
    return () => window.removeEventListener('resize', computePad);
  }, [catIndex]);

  // Keep center card selected and snap to it when scrolling stops
  useEffect(() => {
    const scroller = railScrollRef.current; const inner = railInnerRef.current; if (!scroller || !inner) return;
    let raf = 0; let endTimer: any = null; let userDragging = false;

    const compute = () => {
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let bestIdx = 0, bestDist = Infinity; const itemEls = Array.from(inner.querySelectorAll('[data-item-index]')) as HTMLElement[];
      const prox:number[] = new Array(itemEls.length).fill(0);
      for (let i = 0; i < itemEls.length; i++) {
        const el = itemEls[i]; const elCenter = el.offsetLeft + el.offsetWidth / 2; const d = Math.abs(elCenter - center);
        const dn = Math.min(1, d / (scroller.clientWidth * 0.5)); prox[i] = 1 - dn;
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      }
      setIndex(bestIdx % safeLen); setProximities(prox);
      return bestIdx;
    };

    const snapToIndex = (i: number, behavior: ScrollBehavior = 'auto') => {
      const el = inner.querySelector(`[data-item-index="${i}"]`) as HTMLElement | null; if (!el) return;
      const raw = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const target = Math.max(0, Math.min(raw, max));
      scroller.scrollTo({ left: target, behavior });
    };

    const onScroll = () => {
      const now = performance.now();
      const x = scroller.scrollLeft;
      const dt = Math.max(1, now - lastRef.current.t);
      velocityRef.current = ((x - lastRef.current.x) / dt) * 1000; // px/s
      lastRef.current = { x, t: now };

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const best = compute();
        // Debounced snap when user stops scrolling (more friction)
        clearTimeout(endTimer);
        endTimer = setTimeout(() => { if (!userDragging) snapToIndex(best, 'smooth'); }, 60);
      });
    };

    const onDown = () => { userDragging = true; clearTimeout(endTimer); };
    const onUp = () => {
      userDragging = false;
      const v = velocityRef.current;
      const base = compute();
      // High friction: overshoot rarely kicks in
      const absV = Math.abs(v);
      const dir = v > 0 ? 1 : -1;
      const extra = absV > 2000 ? 1 : 0;
      const target = Math.max(0, Math.min(safeLen - 1, base + dir * extra));
      // cancel inertia immediately and lock to center
      snapToIndex(target, 'auto');
    };

    scroller.addEventListener('scroll', onScroll, { passive: true } as any);
    scroller.addEventListener('pointerdown', onDown, { passive: true } as any);
    window.addEventListener('pointerup', onUp, { passive: true } as any);

    // Center initial item and record initial pos
    const initial = Math.min(Math.max(0, index), safeLen - 1);
    setTimeout(() => { snapToIndex(initial, 'auto'); lastRef.current = { x: scroller.scrollLeft, t: performance.now() }; }, 0);

    return () => {
      scroller.removeEventListener('scroll', onScroll as any);
      scroller.removeEventListener('pointerdown', onDown as any);
      window.removeEventListener('pointerup', onUp as any);
      cancelAnimationFrame(raf); clearTimeout(endTimer);
    };
  }, [safeLen, currentCat.id]);

  // Re-center on resize
  useEffect(() => {
    const scroller = railScrollRef.current; const inner = railInnerRef.current; if (!scroller || !inner) return;
    const onR = () => {
      const el = inner.querySelector(`[data-item-index="${index}"]`) as HTMLElement | null; if (!el) return;
      const raw = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const target = Math.max(0, Math.min(raw, max));
      scroller.scrollTo({ left: target, behavior: 'auto' });
    };
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, [index]);

  // Re-center when dynamic side padding changes (e.g., on first layout or rotation)
  useEffect(() => {
    const scroller = railScrollRef.current; const inner = railInnerRef.current; if (!scroller || !inner) return;
    const el = inner.querySelector(`[data-item-index="${index}"]`) as HTMLElement | null; if (!el) return;
    const target = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior: 'smooth' });
  }, [sidePad]);

  const active = currentCat.projects[index];
  // Notify selection changes
  useEffect(() => {
    if (active) onSelect?.(active, index);
  }, [index, active, onSelect]);
  const bgGradient = useMemo(() => {
    const from = active?.palette?.from || '#0ea5e9';
    const to = active?.palette?.to || '#8b5cf6';
    return `linear-gradient(115deg, ${from}, ${to})`;
  }, [active]);

  const hasProjects = currentCat.projects && currentCat.projects.length > 0;

  return (
    <div className={`relative w-full overflow-visible ${className || ''}`}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: bgGradient }} />
        <AnimatePresence mode="wait">
          <motion.div key={`bg-${currentCat.id}-${active?.id}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.5, ease:[0.22,1,0.36,1]}} className="absolute inset-0" style={{ background: bgGradient }} />
        </AnimatePresence>
        <motion.div aria-hidden className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(1200px 400px at -10% 110%, rgba(255,255,255,0.14), transparent), radial-gradient(900px 360px at 120% -10%, rgba(255,255,255,0.12), transparent)"
        }} animate={{ backgroundPosition: ['0% 0%','100% 100%'] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
      </div>

      <div className="relative min-h-[60vh] flex flex-col text-white pb-6">
        {/* Categories */}
        <div className="px-4 pt-3">
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
            {CATEGORIES.map((c,i)=>{ const Icon=c.icon||Boxes; const activeCat=i===catIndex; return (
              <button key={c.id} onClick={()=>setCatIndex(i)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur ${activeCat ? 'border-white/40 bg-white/15' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}>
                <Icon className="h-4 w-4" />
                <span className="text-sm whitespace-nowrap">{c.label}</span>
              </button>
            );})}
          </div>
        </div>

        {/* Rail */}
        <div className="px-3 pt-8 flex-1 relative">
          {/* Center band indicator (fixed over the rail) */}
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-24 bottom-24 rounded-xl bg-white/5 ring-1 ring-white/10" style={{ width: '60%', maxWidth: 320, minWidth: 160, backdropFilter: 'blur(2px)' }} />
          <div ref={railScrollRef} className="w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] scrollbar-none touch-pan-x snap-x snap-mandatory" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' as any }}>
            <div ref={railInnerRef} className="flex items-end gap-4 pb-10" style={{ paddingLeft: sidePad, paddingRight: sidePad, perspective: 1000 }}>
              {!hasProjects && (
                <div className="mx-auto my-10 text-center text-white/80">
                  <div className="mx-auto h-36 w-64 rounded-xl border border-white/15 bg-black/20 backdrop-blur-sm flex items-center justify-center">Nessun progetto</div>
                  <p className="mt-3 text-sm">Aggiungi progetti per vedere il carosello.</p>
                </div>
              )}
              {hasProjects && currentCat.projects.map((p,i)=>{
                const pxy = proximities[i] ?? (i===index?1:0);
                const scale = 0.85 + pxy*0.25; // grow more when centered
                const opacity = 0.65 + pxy*0.35;
                // rotation for wheel effect: left positive, right negative
                const dir = i < index ? 1 : i > index ? -1 : 0;
                const angle = dir * (12 * (1 - pxy));
                const ty = 8 + (1 - pxy) * 0 + pxy * 10; // drop a bit when centered
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      // tap to center
                      const scroller = railScrollRef.current; const inner = railInnerRef.current; if (!scroller || !inner) return;
                      const el = inner.querySelector(`[data-item-index="${i}"]`) as HTMLElement | null; if (!el) return;
                      const target = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
                      scroller.scrollTo({ left: Math.max(0, Math.min(target, Math.max(0, scroller.scrollWidth - scroller.clientWidth))), behavior: 'auto' });
                      setIndex(i);
                    }}
                    className="relative shrink-0 snap-center rounded-lg border border-white/15 bg-black/20 backdrop-blur-sm shadow-xl overflow-hidden"
                    data-item-index={i}
                    style={{ width: 180, height: 210, transform: `perspective(1000px) translateY(${ty}px) rotateY(${angle}deg) scale(${scale})`, opacity, transition: 'transform 160ms ease-out, opacity 160ms ease-out', scrollSnapAlign: 'center', scrollSnapStop: 'always' as any, boxShadow: pxy>0.95 ? '0 20px 50px rgba(0,0,0,0.35)' : '0 8px 20px rgba(0,0,0,0.25)' }}
                  >
                    <img src={p.tile || p.cover} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-semibold line-clamp-1">{p.title}</p>
                      <p className="text-[11px] text-white/70 line-clamp-1">{p.subtitle}</p>
                    </div>
                  </div>
                );
              })}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
