"use client";
import React from "react";
import { Boxes, Globe, Palette } from "lucide-react";

// Types
export type Project = {
  id: string;
  title: string;
  subtitle?: string;
  tile?: string;
  cover?: string;
  href?: string;
  palette?: { from: string; to: string };
  hidden?: boolean;
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
export const PH = (label = "", w = 800, h = 800, from = "#0ea5e9", to = "#8b5cf6") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${from}'/>
        <stop offset='100%' stop-color='${to}'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    ${label ? `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Inter, system-ui' font-size='40'>${label}</text>` : ""}
  </svg>`)}
`;

export const getVisibleProjects = (projects: Project[]) => projects.filter((project) => !project.hidden);

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
    if (!project || project.hidden) return;
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
  prefetchProjectImages(CATEGORIES.flatMap((category) => getVisibleProjects(category.projects)));
}

// Demo data (same as before)
export const CATEGORIES: Category[] = [
  // NOTE: To add background images for projects, place them in /public/images/projects/
  // and use the naming convention: {lowercase-project-name}-bg.webp
  // Example: "device-bg.webp", "gp5-bg.webp", "fractals-bg.webp", etc.
  // The system will automatically use these as blurred overlays on the project backgrounds.
  {
    id: "visual-render",
    label: "Visual e Render",
    icon: Boxes,
    projects: [
      {
        id: "products",
        title: "Products",
        subtitle: "Product visualization",
        tile: "/images/projects/product-bg.webp",
        cover: "/images/projects/product-cover.webp",
        palette: { from: "#0072ff", to: "#00c6ff" },
        href: "/showcase/products",
      },
      {
        id: "music",
        title: "Music",
        subtitle: "Music-driven 3D scenes",
        tile: "/images/projects/music-bg.webp",
        cover: "/images/projects/music-cover.webp",
        palette: { from: "#1fa2ff", to: "#12d8fa" },
        href: "/showcase/music",
      },
      {
        id: "artistic",
        title: "Artistic",
        subtitle: "Experimental visuals",
        tile: "/images/projects/artistic-bg.webp",
        cover: "/images/projects/artistic-cover.webp",
        palette: { from: "#667db6", to: "#0082c8" },
        href: "/showcase/artistic",
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
        subtitle: "Wellness service landing page",
        tile: "/images/projects/gm-bg.webp",
        cover: "images/projects/gm-cover.webp",
        palette: { from: "#ff9966", to: "#ff5e62" },
        href: "https://gongandmotion.com/en",
      },
      {
        id: "p5b",
        title: "Portfolio",
        subtitle: "Photographer portfolio",
        tile: "/images/projects/template-bg.webp",
        cover: "/images/projects/template-cover.webp",
        palette: { from: "#667db6", to: "#0082c8" },
        href: "https://alessio-portfolio.vercel.app",
      },
      {
        id: "p6",
        title: "Attiva",
        subtitle: "Consulting company website",
        tile: "/images/projects/Attiva_bg.webp",
        cover: "/images/projects/Attiva_cover.webp",
        palette: { from: "#ff9a44", to: "#fc6076" },
        href: "https://www.atti-va.it",
      },
    ],
  },
  {
    id: "case-studies",
    label: "Case Studies",
    icon: Palette,
    projects: [
      {
        id: "case-wip",
        title: "Work in progress",
        subtitle: "Nuovi case study in arrivo",
        tile: PH("", 900, 900, "#ff8a00", "#ff3d00"),
        palette: { from: "#ff8a00", to: "#ff3d00" },
      },
      {
        id: "p10",
        title: "Gong & Motion – Identity",
        subtitle: "Brand System",
        tile: "/images/projects/identity-bg.webp",
        palette: { from: "#ff512f", to: "#f09819" },
        hidden: true,
      },
      {
        id: "p11",
        title: "EP / Covers",
        subtitle: "Artwork set",
        tile: "/images/projects/ep-bg.webp",
        palette: { from: "#f7971e", to: "#ffd200" },
        hidden: true,
      },
      {
        id: "p11b",
        title: "Brand Sheet Mini",
        subtitle: "Palette + Type",
        tile: "/images/projects/brand-sheet-bg.webp",
        palette: { from: "#f85032", to: "#e73827" },
        hidden: true,
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
