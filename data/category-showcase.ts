export type CollageMediaType = "image" | "video" | "youtube";

type CollageItemBase = {
  id: string;
  mediaType: CollageMediaType;
  title: string;
  src: string;
  sources?: Array<{ src: string; type?: string }>;
  thumbnail?: string;
  poster?: string;
  embedUrl?: string;
  aspectRatio?: string;
  description?: string;
  year?: string;
  software?: string[];
  order?: number;
  gridRowStart?: number;
  gridAlign?: "start" | "center" | "end";
};

export type CollageSlide = Omit<CollageItemBase, "slides">;

export type CollageItem = CollageItemBase & {
  slides?: CollageSlide[];
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
      "Cinematic product stories blending animation, packaging, and experiential design across tech and brand worlds.",
    tagline: "Immersive product visualisation",
    items: [
      {
        id: "prod-loop",
        mediaType: "video",
        title: "CD Rotation",
        src: "/projects/products/videoOriginal.mp4",
        sources: [
          { src: "/projects/products/videoOriginal.mp4", type: "video/mp4" },
          { src: "/projects/products/videoOriginal.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "9 / 16",
        description: "Rotating CD loop crafted for Aissela, focusing on reflective surfaces and music-inspired lighting.",
        year: "2023",
        software: ["Blender"],
        order: 1,
      },
      {
        id: "prod-accessory",
        mediaType: "video",
        title: "iPhone Inspired Animation",
        src: "/projects/products/iphone.mp4",
        sources: [
          { src: "/projects/products/iphone.mp4", type: "video/mp4" },
          { src: "/projects/products/iphone.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "16 / 9",
        description: "iPhone-inspired motion study focusing on animation and lighting .",
        year: "2022",
        software: ["Blender"],
        order: 2,
        gridRowStart: 2,
      },
      {
        id: "prod-vertical",
        mediaType: "video",
        title: "Jumper Motion",
        src: "/projects/products/VideoHoonColorato.mp4",
        sources: [
          { src: "/projects/products/VideoHoonColorato.mp4", type: "video/mp4" },
          { src: "/projects/products/VideoHoonColorato.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "360 / 527",
        description: "Energetic sweater animation designed as a vertical piece for social storytelling.",
        year: "2024",
        software: ["Blender"],
        order: 3,
        gridAlign: "center",
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
        aspectRatio: "16 / 9",
        description: "Exploded animation highlighting the internal components of a camera concept.",
        year: "2024",
        software: ["Blender"],
        order: 6,
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
        description: "3d modeling texturing and animation of Safety work packaging.",
        year: "2024",
        software: ["Blender"],
        order: 5,
      },
      {
        id: "prod-cardboard",
        mediaType: "video",
        title: "Cardboard Concept",
        src: "/projects/products/cardboard.mp4",
        sources: [
          { src: "/projects/products/cardboard.mp4", type: "video/mp4" },
          { src: "/projects/products/cardboard.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "16 / 9",
        description: "Sustainable cardboard packaging reveal with layered motion design.",
        year: "2024",
        software: ["Blender"],
        order: 11,
        gridAlign: "end",
      },
      {
        id: "prod-loop-alt",
        mediaType: "video",
        title: "Cardboard Website Loop",
        src: "/projects/products/0001-0120.mp4",
        sources: [
          { src: "/projects/products/0001-0120.mp4", type: "video/mp4" },
          { src: "/projects/products/0001-0120.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "16 / 9",
        description: "Cardboard-inspired looping animation created as an interactive highlight for the website.",
        year: "2024",
        software: ["Blender"],
        order: 7,
        gridAlign: "end",
      },
      {
        id: "prod-cd-campaign",
        mediaType: "video",
        title: "Spotify Campaign Disc",
        src: "/projects/products/CD_spotifyb.mp4",
        sources: [
          { src: "/projects/products/CD_spotifyb.mp4", type: "video/mp4" },
          { src: "/projects/products/CD_spotifyb.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "540 / 847",
        description: "Compact disc concept exploring Spotify-inspired lighting and reflections.",
        year: "2024",
        software: ["Blender"],
        order: 8,
      },
      {
        id: "prod-assembly",
        mediaType: "video",
        title: "AI Perfume Short",
        src: "/projects/products/montaggio_1.mp4",
        sources: [
          { src: "/projects/products/montaggio_1.mp4", type: "video/mp4" },
          { src: "/projects/products/montaggio_1.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "1 / 1",
        description: "AI-generated perfume ad with motion and lighting design.",
        year: "2024",
        software: ["AI image generation, AI video generation"],
        order: 9,
      },
      {
        id: "prod-safety-table",
        mediaType: "video",
        title: "Safety Work Tabletop",
        src: "/projects/products/safetywork%20tavolomp4.mp4",
        sources: [
          { src: "/projects/products/safetywork%20tavolomp4.mp4", type: "video/mp4" },
          { src: "/projects/products/safetywork%20tavolomp4.webm", type: "video/webm" },
        ],
        poster: "/images/projects/product-cover.webp",
        aspectRatio: "16 / 9",
        description: "Safetywork signage package animation in a workplace setting.",
        year: "2024",
        software: ["Blender"],
        order: 10,
      },
      {
        id: "prod-slideshow-hoon",
        mediaType: "image",
        title: "Hoon Render Series",
        src: "/projects/products/slideshow/hoon/Render_1.webp",
        thumbnail: "/projects/products/slideshow/hoon/Render_1.webp",
        aspectRatio: "9 / 16",
        description: "Set di render (hero, mid, wireframe) del concept Hoon.",
        year: "2024",
        software: ["Blender"],
        order: 4,
        slides: [
          {
            id: "prod-slideshow-hoon-1",
            mediaType: "image",
            title: "Hoon Render 1",
            src: "/projects/products/slideshow/hoon/Render_1.webp",
            aspectRatio: "9 / 16",
          },
          {
            id: "prod-slideshow-hoon-2",
            mediaType: "image",
            title: "Hoon Render 2",
            src: "/projects/products/slideshow/hoon/Render_2.webp",
            aspectRatio: "9 / 16",
          },
          {
            id: "prod-slideshow-hoon-3",
            mediaType: "image",
            title: "Hoon Render 3",
            src: "/projects/products/slideshow/hoon/Render_3.webp",
            aspectRatio: "9 / 16",
          },
        ],
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
        mediaType: "youtube",
        title: "Dispersione",
        src: "https://www.youtube.com/embed/PTy5jRM5Mk8",
        embedUrl: "https://www.youtube.com/embed/PTy5jRM5Mk8?rel=0",
        thumbnail: "https://img.youtube.com/vi/PTy5jRM5Mk8/hqdefault.jpg",
        aspectRatio: "16 / 9",
        description: "Creative abstract music video.",
        year: "2024",
        software: ["Runway", "After Effects"],
        order: 2,
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
        aspectRatio: "359 / 640",
        description: "3d animation for Aissela Clara.",
        year: "2024",
        software: ["Blender", "Runway", "After Effects"],
        order: 1,
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
        description: "3d animation for Aissela Fosca.",
        year: "2024",
        software: ["Blender."],
        order: 3,
      },
      {
        id: "music-sequence-0001",
        mediaType: "video",
        title: "Spotify visual concept",
        src: "/projects/music/0001-0151.mp4",
        sources: [
          { src: "/projects/music/0001-0151.mp4", type: "video/mp4" },
          { src: "/projects/music/0001-0151.webm", type: "video/webm" },
        ],
        poster: "/images/projects/music-bg.webp",
        aspectRatio: "9 / 16",
        description: "3d animation for Spotify visual concept playing with fracture and lighting.",
        year: "2024",
        software: ["Blender", "After Effects"],
        order: 4,
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
        aspectRatio: "45 / 79",
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
        description: "3D animation for Giorgio's visual loop, playing with smoke simultions and light",
        year: "2024",
        software: ["Blender", "After Effects"],
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
        description: "Social campaign for the Fosca project, using models from Cd cover.",
        year: "2024",
        software: ["Blender", "After Effects"],
      },
      {
        id: "music-short-horizon",
        mediaType: "youtube",
        title: "Aissong #1",
        src: "https://www.youtube.com/embed/vTw7R5DUdFU",
        embedUrl: "https://www.youtube.com/embed/vTw7R5DUdFU?rel=0",
        thumbnail: "https://img.youtube.com/vi/vTw7R5DUdFU/hqdefault.jpg",
        aspectRatio: "9 / 16",
        description: "Concept of AI beat, with vfx based on real footage.",
        year: "2024",
        software: ["Blender", "After Effects"],
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
        order: 2,
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
        order: 3,
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
        order: 4,
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
        order: 5,
      },
    ],
  },
};

export const CATEGORY_SHOWCASE_SLUGS = Object.keys(CATEGORY_SHOWCASE_GALLERIES);
