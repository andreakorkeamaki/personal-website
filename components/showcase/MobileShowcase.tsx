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

  useEffect(() => setIndex(0), [catIndex]);
  // re-center when index reset due to category change
  useEffect(() => {
    const scroller = railScrollRef.current; const inner = railInnerRef.current; if (!scroller || !inner) return;
    const children = inner.children as any; const el: HTMLElement | undefined = children?.[0]; if (!el) return;
    const target = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior: 'smooth' });
  }, [catIndex]);

  // Keep center card selected and snap to it when scrolling stops
  useEffect(() => {
    const scroller = railScrollRef.current; const inner = railInnerRef.current; if (!scroller || !inner) return;
    let raf = 0; let endTimer: any = null; let userDragging = false;

    const compute = () => {
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let best = 0, bestDist = Infinity; const children = Array.from(inner.children) as HTMLElement[]; const prox:number[] = new Array(children.length).fill(0);
      for (let i = 0; i < children.length; i++) {
        const el = children[i]; const elCenter = el.offsetLeft + el.offsetWidth / 2; const d = Math.abs(elCenter - center);
        const dn = Math.min(1, d / (scroller.clientWidth * 0.5)); prox[i] = 1 - dn;
        if (d < bestDist) { bestDist = d; best = i; }
      }
      setIndex(best % safeLen); setProximities(prox);
      return best;
    };

    const snapToIndex = (i: number) => {
      const children = inner.children as any;
      const el: HTMLElement | undefined = children?.[i]; if (!el) return;
      const target = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
      scroller.scrollTo({ left: target, behavior: 'smooth' });
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
        // Debounced snap when user stops scrolling
        clearTimeout(endTimer);
        endTimer = setTimeout(() => { if (!userDragging) snapToIndex(best); }, 110);
      });
    };

    const onDown = () => { userDragging = true; clearTimeout(endTimer); };
    const onUp = () => {
      userDragging = false;
      const v = velocityRef.current;
      const base = compute();
      // Speed-based overshoot (allow skipping)
      const absV = Math.abs(v);
      const dir = v > 0 ? 1 : -1;
      let extra = 0;
      if (absV > 1600) extra = 2; else if (absV > 900) extra = 1; // tuneable
      const target = Math.max(0, Math.min(safeLen - 1, base + dir * extra));
      snapToIndex(target);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true } as any);
    scroller.addEventListener('pointerdown', onDown, { passive: true } as any);
    window.addEventListener('pointerup', onUp, { passive: true } as any);

    // Center initial item and record initial pos
    const initial = Math.min(Math.max(0, index), safeLen - 1);
    setTimeout(() => { snapToIndex(initial); lastRef.current = { x: scroller.scrollLeft, t: performance.now() }; }, 0);

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
      const children = inner.children as any; const el: HTMLElement | undefined = children?.[index]; if (!el) return;
      const target = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
      scroller.scrollTo({ left: target, behavior: 'smooth' });
    };
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, [index]);

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
        <div className="px-3 pt-2 flex-1 relative">
          {/* Center band indicator (fixed over the rail) */}
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-16 bottom-16 rounded-xl bg-white/5 ring-1 ring-white/10" style={{ width: '58%', maxWidth: 300, minWidth: 160, backdropFilter: 'blur(2px)' }} />
          <div ref={railScrollRef} className="w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] scrollbar-none touch-pan-x" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' as any }}>
            <div ref={railInnerRef} className="flex items-end gap-4 px-6 snap-x snap-mandatory pb-6" style={{ scrollPaddingLeft: 24, scrollPaddingRight: 24, perspective: 1000 }}>
              {!hasProjects && (
                <div className="mx-auto my-10 text-center text-white/80">
                  <div className="mx-auto h-36 w-64 rounded-xl border border-white/15 bg-black/20 backdrop-blur-sm flex items-center justify-center">Nessun progetto</div>
                  <p className="mt-3 text-sm">Aggiungi progetti per vedere il carosello.</p>
                </div>
              )}
              {hasProjects && currentCat.projects.map((p,i)=>{
                const pxy = proximities[i] ?? (i===index?1:0);
                const scale = 0.88 + pxy*0.17; const opacity = 0.7 + pxy*0.3;
                // rotation for wheel effect: left positive, right negative
                const dir = i < index ? 1 : i > index ? -1 : 0;
                const angle = dir * (12 * (1 - pxy));
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      // tap to center
                      const scroller = railScrollRef.current; const inner = railInnerRef.current; if (!scroller || !inner) return;
                      const children = inner.children as any; const el: HTMLElement | undefined = children?.[i]; if (!el) return;
                      const target = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
                      scroller.scrollTo({ left: target, behavior: 'smooth' });
                      setIndex(i);
                    }}
                    className="relative shrink-0 snap-center rounded-lg border border-white/15 bg-black/20 backdrop-blur-sm shadow-xl overflow-hidden"
                    style={{ width: 180, height: 210, transform: `perspective(1000px) rotateY(${angle}deg) scale(${scale})`, opacity, transition: 'transform 160ms ease-out, opacity 160ms ease-out', scrollSnapAlign: 'center', scrollSnapStop: 'always' as any }}
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
