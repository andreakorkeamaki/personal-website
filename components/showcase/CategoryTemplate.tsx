"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import type { CategoryGallery, CollageItem } from "@/data/category-showcase";

function formatAspectRatio(aspectRatio?: string) {
  if (!aspectRatio) return undefined;
  if (aspectRatio.includes("/")) return aspectRatio;
  if (aspectRatio.includes(":")) return aspectRatio.replace(":", " / ");
  return aspectRatio;
}

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 12 },
};

export type CategoryTemplateProps = {
  category: CategoryGallery;
};

export default function CategoryTemplate({ category }: CategoryTemplateProps) {
  const [activeItem, setActiveItem] = useState<CollageItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!activeItem) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveItem(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeItem]);

  useEffect(() => {
    if (!activeItem) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [activeItem]);

  const galleryItems = useMemo(() => category.items, [category.items]);

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] text-white">
      <header className="mx-auto max-w-6xl px-6 pb-12 pt-20 sm:pt-24">
        <div className="flex flex-col gap-3">
          {category.tagline && (
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-white/50">
              {category.tagline}
            </span>
          )}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl">{category.title}</h1>
          {category.description && (
            <p className="max-w-3xl text-base text-white/70 sm:text-lg">
              {category.description}
            </p>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {galleryItems.map((item) => {
            const aspect = formatAspectRatio(item.aspectRatio);
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative mb-6 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-sm transition duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                style={{ breakInside: "avoid" as const }}
              >
                <div
                  className="relative w-full"
                  style={aspect ? { aspectRatio: aspect } : undefined}
                >
                  {item.mediaType === "image" ? (
                    <img
                      src={item.thumbnail ?? item.src}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <video
                      src={item.src}
                      poster={item.poster ?? item.thumbnail}
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/35" />
                  <div className="pointer-events-none absolute inset-x-5 bottom-5 transform opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-medium">{item.title}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {isMounted && activeItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalBackdrop}
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-modal-title"
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                onClick={() => setActiveItem(null)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div
                className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black"
                style={activeItem.aspectRatio ? { aspectRatio: formatAspectRatio(activeItem.aspectRatio) } : undefined}
              >
                {activeItem.mediaType === "image" ? (
                  <img
                    src={activeItem.src}
                    alt={activeItem.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <video
                    key={activeItem.id}
                    src={activeItem.src}
                    poster={activeItem.poster ?? activeItem.thumbnail}
                    autoPlay
                    muted
                    loop
                    controls
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                <div className="flex flex-col gap-1">
                  <h2 id="gallery-modal-title" className="text-xl font-semibold text-white">
                    {activeItem.title}
                  </h2>
                  {activeItem.description && <p>{activeItem.description}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wide text-white/60">
                  {activeItem.year && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                      {activeItem.year}
                    </span>
                  )}
                  {activeItem.software && activeItem.software.length > 0 && (
                    <span className="flex flex-wrap gap-1 text-white/70">
                      <span className="font-semibold text-white">Software:</span>
                      {activeItem.software.join(" · ")}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
