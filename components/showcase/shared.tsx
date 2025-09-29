"use client";
import React from "react";
import { Boxes } from "lucide-react";

// Types
export type Project = {
  id: string;
  title: string;
  subtitle?: string;
  tile?: string;
  cover?: string;
  href?: string;
  palette?: { from: string; to: string };
};

export type Category = {
  id: string;
  label: string;
  icon?: React.ElementType;
  projects: Project[];
};

export type ShowcaseProps = {
  initialIndex?: number;
  onOpen?: (p: Project) => void;
  onSelect?: (p: Project, index: number) => void;
  className?: string;
};

// Placeholder asset helper
export const PH = (label: string, w = 800, h = 800) =>
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

const preloadedProjectImages = new Set<string>();
const preloadingProjectImages = new Set<string>();
const prefetchListeners = new Set<() => void>();
let prefetchVersion = 0;

function notifyPrefetchListeners() {
  prefetchVersion += 1;
  prefetchListeners.forEach((listener) => listener());
}

function queuePrefetch(src?: string | null) {
  if (!src || preloadedProjectImages.has(src) || preloadingProjectImages.has(src)) return;
  preloadingProjectImages.add(src);
  const img = new Image();
  img.loading = "eager";
  img.decoding = "async";
  const finish = () => {
    preloadingProjectImages.delete(src);
    preloadedProjectImages.add(src);
    notifyPrefetchListeners();
  };
  img.onload = () => {
    if (typeof img.decode === "function") {
      img
        .decode()
        .catch(() => undefined)
        .finally(finish);
    } else {
      finish();
    }
  };
  img.onerror = () => {
    preloadingProjectImages.delete(src);
  };
  img.src = src;
}

export function prefetchProjectImages(projects: Project[]) {
  if (typeof window === "undefined") return;
  projects.forEach((project) => {
    queuePrefetch(project.tile);
    queuePrefetch(project.cover);
  });
}

let allImagesPrefetched = false;

export function hasPrefetchedProjectImage(src?: string | null) {
  if (!src) return false;
  return preloadedProjectImages.has(src);
}

export function subscribeToPrefetchedImages(listener: () => void) {
  prefetchListeners.add(listener);
  return () => {
    prefetchListeners.delete(listener);
  };
}

export function getPrefetchVersion() {
  return prefetchVersion;
}

export function prefetchAllProjectImages() {
  if (typeof window === "undefined" || allImagesPrefetched) return;
  allImagesPrefetched = true;
  // Start prefetching immediately on mount for instant switching.
  prefetchProjectImages(CATEGORIES.flatMap((category) => category.projects));
}

// Demo data (same as before)
import { Globe, Sparkles, Bot, Palette } from "lucide-react";
export const CATEGORIES: Category[] = [
  // NOTE: To add background images for projects, place them in /public/images/projects/
  // and use the naming convention: {lowercase-project-name}-bg.webp
  // Example: "device-bg.webp", "gp5-bg.webp", "fractals-bg.webp", etc.
  // The system will automatically use these as blurred overlays on the project backgrounds.
  {
    id: "3d",
    label: "Render 3D",
    icon: Boxes,
    projects: [
      {
        id: "p1",
        title: "Exploded Futuristic Device",
        subtitle: "3D / Product Viz",
        tile: "/images/projects/device-bg.webp",
        cover: "/images/projects/device-cover.webp",
        palette: { from: "#0072ff", to: "#00c6ff" },
      },
      {
        id: "p2",
        title: "Shoe Reel – GP5",
        subtitle: "Stylized motion",
        tile: "/images/projects/gp5-bg.webp",
        palette: { from: "#00b4d8", to: "#0077b6" },
      },
      {
        id: "p3",
        title: "Product Series",
        subtitle: "High-contrast look",
        tile: "/images/projects/product-bg.webp",
        palette: { from: "#2193b0", to: "#6dd5ed" },
      },
      {
        id: "p3b",
        title: "Exploded Anim – V2",
        subtitle: "Hard-surface test",
        tile: "/images/projects/explode-v2-bg.webp",
        palette: { from: "#38bdf8", to: "#818cf8" },
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
        tile: "/images/projects/fractals-bg.webp",
        cover: "/images/projects/fractals-cover.webp",
        palette: { from: "#1fa2ff", to: "#12d8fa" },
        href: "https://fractals.andrekork.online",
      },
      {
        id: "p5",
        title: "Gong & Motion",
        subtitle: "Sito + booking idea",
        tile: "/images/projects/gm-bg.webp",
        palette: { from: "#ff9966", to: "#ff5e62" },
        href: "https://gongandmotion.com/en",
      },
      {
        id: "p5b",
        title: "Portfolio Template",
        subtitle: "Interactive 3D hero",
        tile: "/images/projects/template-bg.webp",
        cover: "/images/projects/template-cover.webp",
        palette: { from: "#667db6", to: "#0082c8" },
        href: "https://alessio-portfolio.vercel.app",
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
        title: "Music-Reactive Fractals",
        subtitle: "WebGL / GLSL",
        tile: "/images/projects/music-fractals-bg.webp",
        palette: { from: "#6a11cb", to: "#2575fc" },
      },
      {
        id: "p7",
        title: "Lucky Andy visuals",
        subtitle: "AI + 2D/3D mix",
        tile: "/images/projects/lucky-andy-bg.webp",
        palette: { from: "#8e2de2", to: "#4a00e0" },
      },
      {
        id: "p7b",
        title: "Shader Toys",
        subtitle: "Generative doodles",
        tile: "/images/projects/shader-toys-bg.webp",
        palette: { from: "#fc5c7d", to: "#6a82fb" },
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
        tile: "/images/projects/safety-gpt-bg.webp",
        palette: { from: "#00c6ff", to: "#0072ff" },
      },
      {
        id: "p9",
        title: "Newsletter auto-AI",
        subtitle: "Contenuti da form + LLM",
        tile: "/images/projects/newsletter-bg.webp",
        palette: { from: "#00f5a0", to: "#00d9f5" },
      },
      {
        id: "p9b",
        title: "Sofia – Creative Agent",
        subtitle: "Assistant for artists",
        tile: "/images/projects/sofia-bg.webp",
        palette: { from: "#36d1dc", to: "#5b86e5" },
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
        tile: "/images/projects/identity-bg.webp",
        palette: { from: "#ff512f", to: "#f09819" },
      },
      {
        id: "p11",
        title: "EP / Covers",
        subtitle: "Artwork set",
        tile: "/images/projects/ep-bg.webp",
        palette: { from: "#f7971e", to: "#ffd200" },
      },
      {
        id: "p11b",
        title: "Brand Sheet Mini",
        subtitle: "Palette + Type",
        tile: "/images/projects/brand-sheet-bg.webp",
        palette: { from: "#f85032", to: "#e73827" },
      },
    ],
  },
];

// Small shared UI bits
export function MenuItem({ icon, label, value, action }: { icon: React.ReactNode; label: string; value?: string; action?: () => void }) {
  return (
    <button onClick={action} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-3">
      <span className="opacity-80">{icon}</span>
      <span className="flex-1">{label}</span>
      {value && <span className="text-white/70 text-xs">{value}</span>}
    </button>
  );
}

export function InfoCard({ title, thumb, subtitle }: { title: string; thumb?: string; subtitle?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/25 backdrop-blur">
      <div className="aspect-[16/10] relative">
        <img
          src={thumb || PH("Info", 640, 360)}
          alt={title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium line-clamp-1">{title}</p>
        {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
      </div>
    </div>
  );
}
