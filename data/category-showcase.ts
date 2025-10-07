export type CollageMediaType = "image" | "video";

export type CollageItem = {
  id: string;
  mediaType: CollageMediaType;
  title: string;
  src: string;
  sources?: Array<{ src: string; type?: string }>;
  thumbnail?: string;
  poster?: string;
  aspectRatio?: string;
  description?: string;
  year?: string;
  software?: string[];
};

export type CategoryGallery = {
  slug: string;
  title: string;
  description?: string;
  tagline?: string;
  items: CollageItem[];
};

const createPlaceholder = (label: string, width = 1280, height = 720) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
    <defs>
      <linearGradient id='gradient' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#0ea5e9'/>
        <stop offset='100%' stop-color='#8b5cf6'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#gradient)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Inter, system-ui' font-size='40'>${label}</text>
  </svg>`)}
`;

export const CATEGORY_SHOWCASE_GALLERIES: Record<string, CategoryGallery> = {
  products: {
    slug: "products",
    title: "Products",
    description:
      "Futuristic hard-surface explorations focused on lighting, materials, and storytelling for consumer tech.",
    tagline: "Immersive product visualisation",
    items: [
      {
        id: "prod-hero",
        mediaType: "image",
        title: "Orbiting Device Hero",
        src: "/images/projects/product-cover.webp",
        aspectRatio: "9 / 16",
        description: "Flagship render showcasing the final lighting setup and reflective materials.",
        year: "2024",
        software: ["Blender", "Octane"],
      },
      {
        id: "prod-detail",
        mediaType: "image",
        title: "Detail Exploded View",
        src: "/images/projects/product-bg.webp",
        aspectRatio: "4 / 5",
        description: "Exploded assembly emphasising motion mechanics and internal rigging.",
        year: "2024",
        software: ["Blender", "After Effects"],
      },
      {
        id: "prod-loop",
        mediaType: "video",
        title: "Rotation Loop",
        src: "/projects/products/videoOriginal.mp4",
        sources: [
          { src: "/projects/products/videoOriginal.mp4", type: "video/mp4" },
          { src: "/projects/products/videoOriginal.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "9 / 16",
        description: "Short marketing loop highlighting anodised metal transitions.",
        year: "2023",
        software: ["Cinema4D", "Redshift"],
      },
      {
        id: "prod-accessory",
        mediaType: "video",
        title: "Accessory Family",
        src: "/projects/products/iphone.mp4",
        sources: [
          { src: "/projects/products/iphone.mp4", type: "video/mp4" },
          { src: "/projects/products/iphone.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "9 / 16",
        description: "Supporting ecosystem of modular attachments for the product line.",
        year: "2022",
        software: ["Blender"],
      },
      {
        id: "prod-vertical",
        mediaType: "video",
        title: "Social Vertical",
        src: "/projects/products/VideoHoonColorato.mp4",
        sources: [
          { src: "/projects/products/VideoHoonColorato.mp4", type: "video/mp4" },
          { src: "/projects/products/VideoHoonColorato.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "9 / 16",
        description: "Vertical frame designed for social teasers and reels.",
        year: "2024",
        software: ["Blender", "Adobe Premiere"],
      },
      {
        id: "prod-exploded",
        mediaType: "video",
        title: "Camera Exploded",
        src: "/projects/products/camraesploso.mp4",
        sources: [
          { src: "/projects/products/camraesploso.mp4", type: "video/mp4" },
          { src: "/projects/products/camraesploso.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-bg.webp",
        aspectRatio: "9 / 16",
        description: "Exploded animation highlighting the internal components of a camera concept.",
        year: "2024",
        software: ["Blender", "Octane"],
      },
      {
        id: "prod-safety",
        mediaType: "video",
        title: "Safety Work",
        src: "/projects/products/safety_work.mp4",
        sources: [
          { src: "/projects/products/safety_work.mp4", type: "video/mp4" },
          { src: "/projects/products/safety_work.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "9 / 16",
        description: "Safety signage animation designed for workplace rollouts.",
        year: "2024",
        software: ["After Effects"],
      },
    ],
  },
  music: {
    slug: "music",
    title: "Music",
    description:
      "Audio-reactive visuals driven by generative shaders, volumetric lighting, and rhythm-aware camera moves.",
    tagline: "Sound-driven visual narratives",
    items: [
      {
        id: "music-hero",
        mediaType: "image",
        title: "Live Performance Visual",
        src: "/images/projects/music-cover.webp",
        aspectRatio: "21 / 9",
        description: "Stage backdrop designed for widescreen LED walls.",
        year: "2024",
        software: ["TouchDesigner", "Resolume"],
      },
      {
        id: "music-canvas-clara",
        mediaType: "video",
        title: "Canvas Clara Visual",
        src: "/projects/music/Canvas_clara.mp4",
        sources: [
          { src: "/projects/music/Canvas_clara.mp4", type: "video/mp4" },
          { src: "/projects/music/Canvas_clara.webm", type: "video/webm" },
        ],
        poster: "/images/projects/music-bg.webp",
        aspectRatio: "9 / 16",
        description: "Audio-reactive waveforms tailored for Clara's live canvas visuals.",
        year: "2024",
        software: ["TouchDesigner", "Resolume"],
      },
      {
        id: "music-canvas-fosca",
        mediaType: "video",
        title: "Canvas Fosca Visual",
        src: "/projects/music/Canvas_fosca.mp4",
        sources: [
          { src: "/projects/music/Canvas_fosca.mp4", type: "video/mp4" },
          { src: "/projects/music/Canvas_fosca.webm", type: "video/webm" },
        ],
        poster: "/images/projects/music-bg.webp",
        aspectRatio: "9 / 16",
        description: "Rhythmic particle bloom designed for Fosca's performance backdrop.",
        year: "2024",
        software: ["TouchDesigner", "Resolume"],
      },
      {
        id: "music-sequence-0001",
        mediaType: "video",
        title: "Sequence 0001 Visual",
        src: "/projects/music/0001-0151.mp4",
        sources: [
          { src: "/projects/music/0001-0151.mp4", type: "video/mp4" },
          { src: "/projects/music/0001-0151.webm", type: "video/webm" },
        ],
        poster: "/images/projects/music-bg.webp",
        aspectRatio: "9 / 16",
        description: "Granular glitch progression synced to a halftime break.",
        year: "2024",
        software: ["TouchDesigner"],
      },
      {
        id: "music-stomaco",
        mediaType: "video",
        title: "Stomaco Visual Loop",
        src: "/projects/music/StomacoInsta.mp4",
        sources: [
          { src: "/projects/music/StomacoInsta.mp4", type: "video/mp4" },
          { src: "/projects/music/StomacoInsta.webm", type: "video/webm" },
        ],
        poster: "/images/projects/music-bg.webp",
        aspectRatio: "9 / 16",
        description: "High-energy loop crafted for social teasers of the Stomaco project.",
        year: "2024",
        software: ["After Effects", "Premiere Pro"],
      },
      {
        id: "music-giorgio",
        mediaType: "video",
        title: "Giorgio Visual Loop",
        src: "/projects/music/Video_giorgio.mp4",
        sources: [
          { src: "/projects/music/Video_giorgio.mp4", type: "video/mp4" },
          { src: "/projects/music/Video_giorgio.webm", type: "video/webm" },
        ],
        poster: "/images/projects/music-bg.webp",
        aspectRatio: "9 / 16",
        description: "Chrome typography animation aligned to Giorgio's beat switch.",
        year: "2024",
        software: ["TouchDesigner", "After Effects"],
      },
      {
        id: "music-cuore",
        mediaType: "video",
        title: "Cuore Visual Loop",
        src: "/projects/music/cuoreinsta.mp4",
        sources: [
          { src: "/projects/music/cuoreinsta.mp4", type: "video/mp4" },
          { src: "/projects/music/cuoreinsta.webm", type: "video/webm" },
        ],
        poster: "/images/projects/music-bg.webp",
        aspectRatio: "9 / 16",
        description: "Heart-inspired motion graphics built for an upbeat segment.",
        year: "2024",
        software: ["TouchDesigner"],
      },
    ],
  },
  artistic: {
    slug: "artistic",
    title: "Artistic",
    description:
      "Experimental pieces blending AI, simulation, and hand-crafted motion for art installations and personal work.",
    tagline: "Explorations beyond brief",
    items: [
      {
        id: "artistic-hero",
        mediaType: "image",
        title: "Generative Bloom",
        src: "/images/projects/artistic-cover.webp",
        aspectRatio: "3 / 4",
        description: "Organic bloom series rendered with procedural brushes.",
        year: "2024",
        software: ["Procreate", "After Effects"],
      },
      {
        id: "artistic-motion",
        mediaType: "video",
        title: "Fluid Motion Study",
        src: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        poster: "/images/projects/artistic-bg.webp",
        aspectRatio: "16 / 9",
        description: "Liquid metal morph using signed-distance-field animations.",
        year: "2023",
        software: ["Houdini", "Octane"],
      },
      {
        id: "artistic-vertical",
        mediaType: "image",
        title: "Poster Study",
        src: createPlaceholder("Poster", 768, 1152),
        aspectRatio: "2 / 3",
        description: "Vertical poster exploring glitch typography.",
        year: "2022",
        software: ["Photoshop"],
      },
      {
        id: "artistic-square",
        mediaType: "image",
        title: "AI Collage",
        src: createPlaceholder("Collage", 1024, 1024),
        aspectRatio: "1 / 1",
        description: "Hybrid collage combining AI and matte painting techniques.",
        year: "2024",
        software: ["Midjourney", "Photoshop"],
      },
      {
        id: "artistic-panorama",
        mediaType: "image",
        title: "Immersive Installation",
        src: createPlaceholder("Installation", 1920, 1080),
        aspectRatio: "16 / 9",
        description: "Projection mapping overview from an experiential installation.",
        year: "2023",
        software: ["TouchDesigner", "Notch"],
      },
    ],
  },
};

export const CATEGORY_SHOWCASE_SLUGS = Object.keys(CATEGORY_SHOWCASE_GALLERIES);
