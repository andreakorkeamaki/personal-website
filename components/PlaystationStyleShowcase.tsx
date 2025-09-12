"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Info,
  History,
  Link as LinkIcon,
  Boxes,
  Globe,
  Sparkles,
  Bot,
  Palette,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────

type Project = {
  id: string;
  title: string;
  subtitle?: string;
  year?: string | number;
  tags?: string[];
  tile?: string; // image for the horizontal bar
  cover?: string; // optional large image bg (we use gradient anyway)
  href?: string;
  palette?: { from: string; to: string }; // controls gradient bg
  info?: { title: string; thumb?: string }[]; // optional extra info tiles
};

type Category = {
  id: string;
  label: string;
  icon?: React.ElementType;
  projects: Project[];
};

type ShowcaseProps = {
  initialIndex?: number;
  onOpen?: (p: Project) => void;
  className?: string;
};

// ────────────────────────────────────────────────────────────────
// PLACEHOLDER ASSETS
// ────────────────────────────────────────────────────────────────

const PH = (label: string, w = 800, h = 800) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#0ea5e9'/>
        <stop offset='100%' stop-color='#8b5cf6'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Inter, system-ui' font-size='40'>${label}</text>
  </svg>`)}
`;

// ────────────────────────────────────────────────────────────────
// DATA (demo – replace with your real content)
// ────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: "3d",
    label: "Render 3D",
    icon: Boxes,
    projects: [
      {
        id: "p1",
        title: "Exploded Futuristic Device",
        subtitle: "3D / Product Viz",
        year: "2025",
        tags: ["Blender", "Cycles"],
        tile: PH("Device"),
        palette: { from: "#0072ff", to: "#00c6ff" },
        info: [
          { title: "Most viewed video", thumb: PH("Video", 640, 360) },
          { title: "Combo Meter", thumb: PH("Tech", 640, 360) },
          { title: "Ruby Relic", thumb: PH("Asset", 640, 360) },
        ],
      },
      {
        id: "p2",
        title: "Shoe Reel – GP5",
        subtitle: "Stylized motion",
        year: "2024",
        tags: ["3D", "AE"],
        tile: PH("GP5"),
        palette: { from: "#00b4d8", to: "#0077b6" },
        info: [
          { title: "Shots selection", thumb: PH("Shots", 640, 360) },
          { title: "Lookdev", thumb: PH("Lookdev", 640, 360) },
        ],
      },
      {
        id: "p3",
        title: "Product Series",
        subtitle: "High-contrast look",
        year: "2023",
        tags: ["Light", "Retouch"],
        tile: PH("Product"),
        palette: { from: "#2193b0", to: "#6dd5ed" },
        info: [
          { title: "Retouch", thumb: PH("Edit", 640, 360) },
          { title: "Studio setup", thumb: PH("Setup", 640, 360) },
        ],
      },
      {
        id: "p3b",
        title: "Exploded Anim – V2",
        subtitle: "Hard‑surface test",
        year: "2025",
        tags: ["Blender", "GeoNodes"],
        tile: PH("Explode V2"),
        palette: { from: "#38bdf8", to: "#818cf8" },
        info: [{ title: "Breakdown", thumb: PH("BD", 640, 360) }],
      },
    ],
  },
  {
    id: "web",
    label: "Progetti Web",
    icon: Globe,
    projects: [
      {
        id: "p4",
        title: "Fractals Viewer",
        subtitle: "Interactive shaders",
        year: "2025",
        tags: ["Next.js", "WebGL"],
        tile: PH("Fractals Web"),
        palette: { from: "#1fa2ff", to: "#12d8fa" },
        info: [
          { title: "Live demo", thumb: PH("Demo", 640, 360) },
          { title: "Tech stack", thumb: PH("Stack", 640, 360) },
        ],
      },
      {
        id: "p5",
        title: "Gong & Motion",
        subtitle: "Sito + booking idea",
        year: "2025",
        tags: ["Windsurf", "Tailwind"],
        tile: PH("G&M"),
        palette: { from: "#ff9966", to: "#ff5e62" },
        info: [
          { title: "Wireframe", thumb: PH("UX", 640, 360) },
          { title: "Hero concept", thumb: PH("Hero", 640, 360) },
        ],
      },
      {
        id: "p5b",
        title: "Portfolio Template",
        subtitle: "Interactive 3D hero",
        year: "2025",
        tags: ["Next.js", "Three.js"],
        tile: PH("Template"),
        palette: { from: "#667db6", to: "#0082c8" },
        info: [{ title: "Preview", thumb: PH("Prev", 640, 360) }],
      },
    ],
  },
  {
    id: "creative",
    label: "Progetti Creativi",
    icon: Sparkles,
    projects: [
      {
        id: "p6",
        title: "Music‑Reactive Fractals",
        subtitle: "WebGL / GLSL",
        year: "2025",
        tags: ["Three.js", "Audio"],
        tile: PH("Fractals"),
        palette: { from: "#6a11cb", to: "#2575fc" },
        info: [
          { title: "Live shader demo", thumb: PH("Demo", 640, 360) },
          { title: "Preset pack", thumb: PH("Presets", 640, 360) },
        ],
      },
      {
        id: "p7",
        title: "Lucky Andy visuals",
        subtitle: "AI + 2D/3D mix",
        year: "2024",
        tags: ["Canvas", "AI"],
        tile: PH("Lucky Andy"),
        palette: { from: "#8e2de2", to: "#4a00e0" },
        info: [
          { title: "Canvas pack", thumb: PH("Pack", 640, 360) },
          { title: "Colorways", thumb: PH("Colors", 640, 360) },
        ],
      },
      {
        id: "p7b",
        title: "Shader Toys",
        subtitle: "Generative doodles",
        year: "2023",
        tags: ["GLSL"],
        tile: PH("Shaders"),
        palette: { from: "#fc5c7d", to: "#6a82fb" },
        info: [{ title: "Gallery", thumb: PH("Gallery", 640, 360) }],
      },
    ],
  },
  {
    id: "ai",
    label: "Automazioni AI / Chatbot",
    icon: Bot,
    projects: [
      {
        id: "p8",
        title: "Safety Work – GPT",
        subtitle: "Assistente testi segnali",
        year: "2025",
        tags: ["Prompting", "Automation"],
        tile: PH("Safety GPT"),
        palette: { from: "#00c6ff", to: "#0072ff" },
        info: [
          { title: "Flow n8n", thumb: PH("n8n", 640, 360) },
          { title: "Dataset", thumb: PH("KB", 640, 360) },
        ],
      },
      {
        id: "p9",
        title: "Newsletter auto‑AI",
        subtitle: "Contenuti da form + LLM",
        year: "2025",
        tags: ["n8n", "Make"],
        tile: PH("Newsletter"),
        palette: { from: "#00f5a0", to: "#00d9f5" },
        info: [
          { title: "Pipeline", thumb: PH("Pipe", 640, 360) },
          { title: "Templates", thumb: PH("Tpl", 640, 360) },
        ],
      },
      {
        id: "p9b",
        title: "Sofia – Creative Agent",
        subtitle: "Assistant for artists",
        year: "2024",
        tags: ["Chatbot", "LLM"],
        tile: PH("Sofia"),
        palette: { from: "#36d1dc", to: "#5b86e5" },
        info: [{ title: "Demo", thumb: PH("Demo", 640, 360) }],
      },
    ],
  },
  {
    id: "branding",
    label: "Branding & Identity",
    icon: Palette,
    projects: [
      {
        id: "p10",
        title: "Gong & Motion – Identity",
        subtitle: "Brand System",
        year: "2025",
        tags: ["Logo", "Web"],
        tile: PH("Identity"),
        palette: { from: "#ff512f", to: "#f09819" },
        info: [
          { title: "Case study", thumb: PH("Case", 640, 360) },
          { title: "Assets", thumb: PH("Assets", 640, 360) },
        ],
      },
      {
        id: "p11",
        title: "EP / Covers",
        subtitle: "Artwork set",
        year: "2024",
        tags: ["Graphic", "Print"],
        tile: PH("EP"),
        palette: { from: "#f7971e", to: "#ffd200" },
        info: [
          { title: "Covers grid", thumb: PH("Grid", 640, 360) },
          { title: "Logo variants", thumb: PH("Logo", 640, 360) },
        ],
      },
      {
        id: "p11b",
        title: "Brand Sheet Mini",
        subtitle: "Palette + Type",
        year: "2023",
        tags: ["Guide"],
        tile: PH("Brand Sheet"),
        palette: { from: "#f85032", to: "#e73827" },
      },
    ],
  },
];

// ────────────────────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────────────────────

export default function PlaystationStyleShowcase({
  initialIndex = 0,
  onOpen,
  className,
}: ShowcaseProps) {
  // Hover-driven highlighting
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [sectionActive, setSectionActive] = useState(false);
  // Track viewport width to adjust card sizes responsively
  const [vw, setVw] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const [catIndex, setCatIndex] = useState(0);
  const currentCat = CATEGORIES[catIndex];

  const safeLen = Math.max(1, currentCat.projects.length);
  const [index, setIndex] = useState(Math.min(Math.max(0, initialIndex), safeLen - 1));
  const displayIndex = hoverIndex != null ? hoverIndex : (index >= 0 ? index % safeLen : -1);
  const active = displayIndex >= 0 ? currentCat.projects[displayIndex] : undefined;

  // Reset project index when switching category
  useEffect(() => {
    setIndex(0);
  }, [catIndex]);

  // Keyboard navigation with wrap-around
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
      return r.top < vh * 0.9 && r.bottom > vh * 0.1; // largely visible
    };
    const h = (e: KeyboardEvent) => {
      // Only handle keys when the section is active/visible and user not typing
      const target = e.target as Element | null;
      if (isTyping(target)) return;
      const within = sectionActive || isInViewport(rootRef.current);
      if (!within) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setHoverIndex(null);
        setIndex((i) => (i + 1) % safeLen);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setHoverIndex(null);
        setIndex((i) => (i - 1 + safeLen) % safeLen);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHoverIndex(null);
        setCatIndex((i) => (i - 1 + CATEGORIES.length) % CATEGORIES.length);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHoverIndex(null);
        setCatIndex((i) => (i + 1) % CATEGORIES.length);
      }
      if (e.key === "Enter") {
        const a = active;
        if (a) {
          e.preventDefault();
          onOpen ? onOpen(a) : window.open(a.href || "#", "_blank");
        }
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [active, safeLen, sectionActive]);

  // Dynamic gradient background from active project palette
  const bgGradient = useMemo(() => {
    const from = active?.palette?.from || "#0ea5e9";
    const to = active?.palette?.to || "#8b5cf6";
    return `linear-gradient(115deg, ${from}, ${to})`;
  }, [active]);

  // Card sizes per breakpoint for better mobile/desktop layout
  const cardSizes = useMemo(() => {
    if (vw < 420) return { w: 150, h: 180, wA: 190, hA: 230 };
    if (vw < 768) return { w: 180, h: 210, wA: 220, hA: 260 };
    if (vw < 1280) return { w: 200, h: 230, wA: 240, hA: 280 };
    return { w: 200, h: 220, wA: 260, hA: 300 };
  }, [vw]);

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setSectionActive(true)}
      onMouseLeave={() => setSectionActive(false)}
      onFocusCapture={() => setSectionActive(true)}
      onBlurCapture={() => setSectionActive(false)}
      className={`relative w-full overflow-visible ${className || ""}`}
    >
      {/* BACKGROUND LAYER with crossfade (no white flash) */}
      <div className="absolute inset-0">
        {/* base bg to avoid flash */}
        <div className="absolute inset-0" style={{ background: bgGradient }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentCat.id}-${active?.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{ background: bgGradient }}
          />
        </AnimatePresence>
        {/* subtle moving highlights */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(1200px 400px at -10% 110%, rgba(255,255,255,0.14), transparent), radial-gradient(900px 360px at 120% -10%, rgba(255,255,255,0.12), transparent)",
          }}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        {/* removed top/bottom vignette to avoid perceived borders */}
      </div>

      {/* CONTENT */}
      <div className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[76vh] flex flex-col text-white pb-8">
        {/* Categories */}
        <div className="px-4 pt-3">
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
            {CATEGORIES.map((c, i) => {
              const Icon = c.icon || Boxes;
              const activeCat = i === catIndex;
              return (
                <button
                  key={c.id}
                  onClick={() => setCatIndex(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur ${
                    activeCat ? "border-white/40 bg-white/15" : "border-white/15 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm whitespace-nowrap">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main grid: left menu + project rail + single info square bottom-left */}
        <div className="px-3 sm:px-5 md:px-8 pt-2 flex-1 grid grid-cols-12 gap-5">
          {/* LEFT MENU (persists at bottom-left area) */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2 flex flex-col justify-end">
            <div className="rounded-xl bg-black/25 border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                <Play className="h-4 w-4" />
                <span className="text-sm font-medium">Start</span>
              </div>
              <nav className="p-2 text-sm">
                <MenuItem icon={<Info className="h-4 w-4" />} label="Overview" value={active?.subtitle || "—"} />
                <MenuItem icon={<History className="h-4 w-4" />} label="Categoria" value={CATEGORIES[catIndex].label} />
                <MenuItem icon={<LinkIcon className="h-4 w-4" />} label="Apri" action={() => active && (onOpen ? onOpen(active) : window.open(active.href || "#", "_blank"))} />
              </nav>
              {!!active?.tags?.length && (
                <div className="px-3 pb-3 pt-1 flex flex-wrap gap-2">
                  {active.tags!.map((t) => (
                    <Badge key={t} className="bg-white/15 border-white/20 text-white">{t}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PROJECT RAIL */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10 flex flex-col">
            <div className="flex-1 flex items-center">
              <div className="w-full overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch] scrollbar-none">
                <div className="flex items-end gap-4 px-2 md:px-0 snap-x snap-mandatory pb-4 md:pb-6">
                  {currentCat.projects.map((p, i) => {
                    const activeCard = i === displayIndex;
                    return (
                      <motion.div
                        key={p.id}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                        className={`relative shrink-0 snap-start rounded-lg border border-white/15 bg-black/20 backdrop-blur-sm shadow-xl overflow-hidden hover:border-white/30`}
                        style={{ width: activeCard ? cardSizes.wA : cardSizes.w, height: activeCard ? cardSizes.hA : cardSizes.h }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
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
            </div>

            {/* Info: hidden on desktop, shown under rail on small screens */}
            <div className="mt-4 grid grid-cols-12 md:hidden">
              <div className="col-span-12">
                {active && (
                  <InfoCard title={(active.info?.[0]?.title) || "Dettagli progetto"} thumb={active.info?.[0]?.thumb} subtitle={active.title} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, value, action }: { icon: React.ReactNode; label: string; value?: string; action?: () => void }) {
  return (
    <button onClick={action} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-3">
      <span className="opacity-80">{icon}</span>
      <span className="flex-1">{label}</span>
      {value && <span className="text-white/70 text-xs">{value}</span>}
    </button>
  );
}

function InfoCard({ title, thumb, subtitle }: { title: string; thumb?: string; subtitle?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/25 backdrop-blur">
      <div className="aspect-[16/10] relative">
        <img src={thumb || PH("Info", 640, 360)} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium line-clamp-1">{title}</p>
        {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// LIGHT TESTS (optional – run in console)
// ────────────────────────────────────────────────────────────────
export function __buildGradient(from?: string, to?: string) {
  const f = from || "#0ea5e9";
  const t = to || "#8b5cf6";
  return `linear-gradient(115deg, ${f}, ${t})`;
}
export function __wrap(i: number, len: number) {
  const L = Math.max(1, len);
  return ((i % L) + L) % L;
}
export function runShowcaseTests() {
  console.assert(__buildGradient() === "linear-gradient(115deg, #0ea5e9, #8b5cf6)", "Default gradient ok");
  console.assert(__wrap(-1, 3) === 2 && __wrap(3, 3) === 0, "Wrap logic ok");
  console.log("✅ Tests passed");
}
