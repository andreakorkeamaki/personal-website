"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, ShowcaseProps } from "./shared";
import { Boxes } from "lucide-react";

export default function MobileShowcase({ initialIndex = 0, className }: ShowcaseProps) {
  const [catIndex, setCatIndex] = useState(0);
  const currentCat = CATEGORIES[catIndex];
  const safeLen = Math.max(1, currentCat.projects.length);
  const [index, setIndex] = useState(Math.min(Math.max(0, initialIndex), safeLen - 1));

  // Scroll rail refs and proximity for picker effect
  const railScrollRef = useRef<HTMLDivElement | null>(null);
  const railInnerRef = useRef<HTMLDivElement | null>(null);
  const [proximities, setProximities] = useState<number[]>([]);

  useEffect(() => setIndex(0), [catIndex]);

  // Keep center card selected and compute proximity
  useEffect(() => {
    const scroller = railScrollRef.current; const inner = railInnerRef.current; if (!scroller || !inner) return;
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      const center = scroller.scrollLeft + scroller.clientWidth/2;
      let best=0, bestDist=Infinity; const children = Array.from(inner.children) as HTMLElement[]; const prox:number[] = new Array(children.length).fill(0);
      for (let i=0;i<children.length;i++){ const el=children[i]; const elCenter = el.offsetLeft + el.offsetWidth/2; const d=Math.abs(elCenter-center); const dn=Math.min(1, d/(scroller.clientWidth*0.5)); prox[i]=1-dn; if(d<bestDist){bestDist=d; best=i;} }
      setIndex(best % safeLen); setProximities(prox);
    }); };
    scroller.addEventListener('scroll', onScroll, { passive: true } as any);
    onScroll();
    return ()=>{ scroller.removeEventListener('scroll', onScroll as any); cancelAnimationFrame(raf); };
  }, [safeLen, currentCat.id]);

  const active = currentCat.projects[index];
  const bgGradient = useMemo(() => {
    const from = active?.palette?.from || '#0ea5e9';
    const to = active?.palette?.to || '#8b5cf6';
    return `linear-gradient(115deg, ${from}, ${to})`;
  }, [active]);

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
        <div className="px-3 pt-2 flex-1">
          <div ref={railScrollRef} className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch] scrollbar-none">
            <div ref={railInnerRef} className="flex items-end gap-4 px-2 snap-x snap-mandatory pb-6">
              {currentCat.projects.map((p,i)=>{
                const pxy = proximities[i] ?? (i===index?1:0);
                const scale = 0.88 + pxy*0.17; const opacity = 0.7 + pxy*0.3;
                return (
                  <div key={p.id} className="relative shrink-0 snap-center rounded-lg border border-white/15 bg-black/20 backdrop-blur-sm shadow-xl overflow-hidden" style={{ width: 180, height: 210, transform: `scale(${scale})`, opacity, transition: 'transform 160ms ease-out, opacity 160ms ease-out' }}>
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

