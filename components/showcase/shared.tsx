"use client";
import React from "react";
import { Boxes } from "lucide-react";

// Types
export type Project = {
  id: string;
  title: string;
  subtitle?: string;
  year?: string | number;
  tags?: string[];
  tile?: string;
  cover?: string;
  href?: string;
  palette?: { from: string; to: string };
  info?: { title: string; thumb?: string }[];
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

export function prefetchProjectImages(projects: Project[]) {
  if (typeof window === 'undefined') return;
  projects.forEach((project) => {
    const src = project.tile || project.cover;
    if (!src || preloadedProjectImages.has(src)) return;
    const img = new Image();
    img.src = src;
    preloadedProjectImages.add(src);
  });
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
      { id: "p1", title: "Exploded Futuristic Device", subtitle: "3D / Product Viz", year: "2025", tags: ["Blender", "Cycles"], tile: "/images/projects/device-bg.webp", cover: "/images/projects/device-cover.webp", palette: { from: "#0072ff", to: "#00c6ff" }, info: [ { title: "Most viewed video", thumb: PH("Video", 640, 360) }, { title: "Combo Meter", thumb: PH("Tech", 640, 360) }, { title: "Ruby Relic", thumb: PH("Asset", 640, 360) } ] },
      { id: "p2", title: "Shoe Reel – GP5", subtitle: "Stylized motion", year: "2024", tags: ["3D", "AE"], tile: "/images/projects/gp5-bg.webp", palette: { from: "#00b4d8", to: "#0077b6" }, info: [ { title: "Shots selection", thumb: PH("Shots", 640, 360) }, { title: "Lookdev", thumb: PH("Lookdev", 640, 360) } ] },
      { id: "p3", title: "Product Series", subtitle: "High-contrast look", year: "2023", tags: ["Light", "Retouch"], tile: "/images/projects/product-bg.webp", palette: { from: "#2193b0", to: "#6dd5ed" }, info: [ { title: "Retouch", thumb: PH("Edit", 640, 360) }, { title: "Studio setup", thumb: PH("Setup", 640, 360) } ] },
      { id: "p3b", title: "Exploded Anim – V2", subtitle: "Hard‑surface test", year: "2025", tags: ["Blender", "GeoNodes"], tile: "/images/projects/explode-v2-bg.webp", palette: { from: "#38bdf8", to: "#818cf8" }, info: [ { title: "Breakdown", thumb: PH("BD", 640, 360) } ] },
    ],
  },
  {
    id: "web",
    label: "Progetti Web",
    icon: Globe,
    projects: [
      { id: "p4", title: "Fractals Viewer", subtitle: "Interactive shaders", year: "2025", tags: ["Next.js", "WebGL"], tile: "/images/projects/fractals-bg.webp", cover: "/images/projects/fractals-cover.webp", palette: { from: "#1fa2ff", to: "#12d8fa" }, info: [ { title: "Live demo", thumb: PH("Demo", 640, 360) }, { title: "Tech stack", thumb: PH("Stack", 640, 360) } ] },
      { id: "p5", title: "Gong & Motion", subtitle: "Sito + booking idea", year: "2025", tags: ["Windsurf", "Tailwind"], tile: "/images/projects/gm-bg.webp", palette: { from: "#ff9966", to: "#ff5e62" }, info: [ { title: "Wireframe", thumb: PH("UX", 640, 360) }, { title: "Hero concept", thumb: PH("Hero", 640, 360) } ] },
      { id: "p5b", title: "Portfolio Template", subtitle: "Interactive 3D hero", year: "2025", tags: ["Next.js", "Three.js"], tile: "/images/projects/template-bg.webp", cover: "/images/projects/template-cover.webp", palette: { from: "#667db6", to: "#0082c8" }, info: [ { title: "Preview", thumb: PH("Prev", 640, 360) } ] },
    ],
  },
  {
    id: "creative",
    label: "Progetti Creativi",
    icon: Sparkles,
    projects: [
      { id: "p6", title: "Music‑Reactive Fractals", subtitle: "WebGL / GLSL", year: "2025", tags: ["Three.js", "Audio"], tile: "/images/projects/music-fractals-bg.webp", palette: { from: "#6a11cb", to: "#2575fc" }, info: [ { title: "Live shader demo", thumb: PH("Demo", 640, 360) }, { title: "Preset pack", thumb: PH("Presets", 640, 360) } ] },
      { id: "p7", title: "Lucky Andy visuals", subtitle: "AI + 2D/3D mix", year: "2024", tags: ["Canvas", "AI"], tile: "/images/projects/lucky-andy-bg.webp", palette: { from: "#8e2de2", to: "#4a00e0" }, info: [ { title: "Canvas pack", thumb: PH("Pack", 640, 360) }, { title: "Colorways", thumb: PH("Colors", 640, 360) } ] },
      { id: "p7b", title: "Shader Toys", subtitle: "Generative doodles", year: "2023", tags: ["GLSL"], tile: "/images/projects/shader-toys-bg.webp", palette: { from: "#fc5c7d", to: "#6a82fb" }, info: [ { title: "Gallery", thumb: PH("Gallery", 640, 360) } ] },
    ],
  },
  {
    id: "ai",
    label: "Automazioni AI / Chatbot",
    icon: Bot,
    projects: [
      { id: "p8", title: "Safety Work – GPT", subtitle: "Assistente testi segnali", year: "2025", tags: ["Prompting", "Automation"], tile: "/images/projects/safety-gpt-bg.webp", palette: { from: "#00c6ff", to: "#0072ff" }, info: [ { title: "Flow n8n", thumb: PH("n8n", 640, 360) }, { title: "Dataset", thumb: PH("KB", 640, 360) } ] },
      { id: "p9", title: "Newsletter auto‑AI", subtitle: "Contenuti da form + LLM", year: "2025", tags: ["n8n", "Make"], tile: "/images/projects/newsletter-bg.webp", palette: { from: "#00f5a0", to: "#00d9f5" }, info: [ { title: "Pipeline", thumb: PH("Pipe", 640, 360) }, { title: "Templates", thumb: PH("Tpl", 640, 360) } ] },
      { id: "p9b", title: "Sofia – Creative Agent", subtitle: "Assistant for artists", year: "2024", tags: ["Chatbot", "LLM"], tile: "/images/projects/sofia-bg.webp", palette: { from: "#36d1dc", to: "#5b86e5" }, info: [ { title: "Demo", thumb: PH("Demo", 640, 360) } ] },
    ],
  },
  {
    id: "branding",
    label: "Branding & Identity",
    icon: Palette,
    projects: [
      { id: "p10", title: "Gong & Motion – Identity", subtitle: "Brand System", year: "2025", tags: ["Logo", "Web"], tile: "/images/projects/identity-bg.webp", palette: { from: "#ff512f", to: "#f09819" }, info: [ { title: "Case study", thumb: PH("Case", 640, 360) }, { title: "Assets", thumb: PH("Assets", 640, 360) } ] },
      { id: "p11", title: "EP / Covers", subtitle: "Artwork set", year: "2024", tags: ["Graphic", "Print"], tile: "/images/projects/ep-bg.webp", palette: { from: "#f7971e", to: "#ffd200" }, info: [ { title: "Covers grid", thumb: PH("Grid", 640, 360) }, { title: "Logo variants", thumb: PH("Logo", 640, 360) } ] },
      { id: "p11b", title: "Brand Sheet Mini", subtitle: "Palette + Type", year: "2023", tags: ["Guide"], tile: "/images/projects/brand-sheet-bg.webp", palette: { from: "#f85032", to: "#e73827" } },
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
