"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, History, Link as LinkIcon, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, InfoCard, MenuItem, ShowcaseProps } from "./shared";
import { Boxes } from "lucide-react";

export default function DesktopShowcase({ initialIndex = 0, onOpen, className }: ShowcaseProps) {
  const [catIndex, setCatIndex] = useState(0);
  const currentCat = CATEGORIES[catIndex];
  const safeLen = Math.max(1, currentCat.projects.length);
  const [index, setIndex] = useState(Math.min(Math.max(0, initialIndex), safeLen - 1));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const displayIndex = hoverIndex != null ? hoverIndex : index;
  const active = currentCat.projects[displayIndex % safeLen];

  useEffect(() => setIndex(0), [catIndex]);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [sectionActive, setSectionActive] = useState(false);

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
      if (e.key === 'ArrowRight') { e.preventDefault(); setHoverIndex(null); setIndex((i)=> (i+1)%safeLen); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); setHoverIndex(null); setIndex((i)=> (i-1+safeLen)%safeLen); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); setHoverIndex(null); setCatIndex((i)=> (i-1+CATEGORIES.length)%CATEGORIES.length); }
      if (e.key === 'ArrowDown')  { e.preventDefault(); setHoverIndex(null); setCatIndex((i)=> (i+1)%CATEGORIES.length); }
      if (e.key === 'Enter' && active) { e.preventDefault(); onOpen ? onOpen(active) : window.open(active.href || '#','_blank'); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [active, safeLen, sectionActive]);

  const bgGradient = useMemo(() => {
    const from = active?.palette?.from || '#0ea5e9';
    const to = active?.palette?.to || '#8b5cf6';
    return `linear-gradient(115deg, ${from}, ${to})`;
  }, [active]);

  return (
    <div ref={rootRef} className={`relative w-full overflow-visible ${className || ''}`}
      onMouseEnter={()=>setSectionActive(true)} onMouseLeave={()=>setSectionActive(false)} onFocusCapture={()=>setSectionActive(true)} onBlurCapture={()=>setSectionActive(false)}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: bgGradient }} />
        <AnimatePresence mode="wait">
          <motion.div key={`bg-${currentCat.id}-${active?.id}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.5, ease:[0.22,1,0.36,1]}} className="absolute inset-0" style={{ background: bgGradient }} />
        </AnimatePresence>
        <motion.div aria-hidden className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(1200px 400px at -10% 110%, rgba(255,255,255,0.14), transparent), radial-gradient(900px 360px at 120% -10%, rgba(255,255,255,0.12), transparent)"
        }} animate={{ backgroundPosition: ['0% 0%','100% 100%'] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
      </div>

      <div className="relative min-h-[70vh] lg:min-h-[76vh] flex flex-col text-white pb-8">
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

        <div className="px-3 sm:px-5 md:px-8 pt-2 flex-1 grid grid-cols-12 gap-5">
          <div className="hidden md:flex col-span-12 md:col-span-3 lg:col-span-2 flex-col justify-end">
            <div className="rounded-xl bg-black/25 border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2"><Play className="h-4 w-4" /><span className="text-sm font-medium">Start</span></div>
              <nav className="p-2 text-sm">
                <MenuItem icon={<Info className="h-4 w-4" />} label="Overview" value={active?.subtitle || '—'} />
                <MenuItem icon={<History className="h-4 w-4" />} label="Categoria" value={CATEGORIES[catIndex].label} />
                <MenuItem icon={<LinkIcon className="h-4 w-4" />} label="Apri" action={() => active && (onOpen ? onOpen(active) : window.open(active.href || '#','_blank'))} />
              </nav>
              {!!active?.tags?.length && (<div className="px-3 pb-3 pt-1 flex flex-wrap gap-2">{active.tags!.map(t=> (<Badge key={t} className="bg-white/15 border-white/20 text-white">{t}</Badge>))}</div>)}
            </div>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-end gap-4">
                {currentCat.projects.map((p,i)=>{
                  const activeCard = i===displayIndex;
                  return (
                    <motion.div key={p.id} onMouseEnter={()=>setHoverIndex(i)} onMouseLeave={()=>setHoverIndex(null)}
                      className={`relative shrink-0 rounded-lg border border-white/15 bg-black/20 backdrop-blur-sm shadow-xl overflow-hidden ${activeCard ? 'ring-2 ring-white/50' : 'hover:border-white/30'}`}
                      style={{ width: activeCard ? 260 : 200, height: activeCard ? 300 : 220 }}
                      initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{delay: i*0.04}}>
                      <img src={p.tile || p.cover} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-semibold line-clamp-1">{p.title}</p>
                        <p className="text-[11px] text-white/70 line-clamp-1">{p.subtitle}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-12">
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <InfoCard title={(active?.info?.[0]?.title) || 'Dettagli progetto'} thumb={active?.info?.[0]?.thumb} subtitle={active?.title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

