"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { CATEGORY_SHOWCASE_GALLERIES, type CategoryGallery, type CollageItem } from "@/data/category-showcase";
import MediaFrame from "./MediaFrame";

function formatAspectRatio(aspectRatio?: string) {
  if (!aspectRatio) return undefined;
  if (aspectRatio.includes("/")) return aspectRatio;
  if (aspectRatio.includes(":")) return aspectRatio.replace(":", " / ");
  return aspectRatio;
}

function parseAspectRatioValue(aspectRatio?: string) {
  if (!aspectRatio) return undefined;
  const cleaned = aspectRatio.replace(/\s+/g, "");
  if (!cleaned) return undefined;
  if (cleaned.includes("/")) {
    const [w, h] = cleaned.split("/").map((value) => Number.parseFloat(value));
    if (!Number.isFinite(w) || !Number.isFinite(h) || h === 0) return undefined;
    return w / h;
  }
  const numeric = Number.parseFloat(cleaned);
  if (!Number.isFinite(numeric) || numeric === 0) return undefined;
  return numeric;
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

type InlineSlideshowProps = {
  item: CollageItem;
  onAspect?: (id: string, w?: number, h?: number) => void;
};

function InlineSlideshow({ item, onAspect }: InlineSlideshowProps) {
  const slides = item.slides ?? [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  useEffect(() => {
    setIndex(0);
  }, [total]);

  useEffect(() => {
    if (!total) return;
    const id = window.setInterval(() => {
      if (!paused) setIndex((prev) => (prev + 1) % total);
    }, 3600);
    return () => window.clearInterval(id);
  }, [paused, total]);

  if (total === 0) {
    return null;
  }

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const isActive = i === index;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
            aria-hidden={!isActive}
          >
            <MediaFrame
              item={slide}
              variant="card"
              fit="cover"
              className="transition duration-500 group-hover:scale-[1.03]"
              onImageLoad={(w, h) => onAspect?.(slide.id, w, h)}
              onVideoMetadata={(w, h) => onAspect?.(slide.id, w, h)}
            />
          </div>
        );
      })}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
      <div className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-2">
        {slides.map((_slide, i) => {
          const isActive = i === index;
          return (
            <button
              key={`dot-${item.id}-${i}`}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIndex(i);
              }}
              className={`h-2.5 w-2.5 rounded-full border border-white/30 bg-white/40 transition ${isActive ? "bg-white shadow" : "hover:bg-white/70"}`}
              aria-label={`Vai alla slide ${i + 1} di ${total}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export type CategoryTemplateProps = {
  category: CategoryGallery;
};

export default function CategoryTemplate({ category }: CategoryTemplateProps) {
  const [activeItem, setActiveItem] = useState<CollageItem | null>(null);
  const [modalSlideIndex, setModalSlideIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const galleryItems = useMemo(() => {
    return category.items
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const orderA = Number.isFinite(a.item.order) ? (a.item.order as number) : Number.POSITIVE_INFINITY;
        const orderB = Number.isFinite(b.item.order) ? (b.item.order as number) : Number.POSITIVE_INFINITY;
        if (orderA === orderB) return a.index - b.index;
        return orderA - orderB;
      })
      .map(({ item }) => item);
  }, [category.items]);
  const [dynamicAspectRatios, setDynamicAspectRatios] = useState<Record<string, string>>({});

  const registerAspectRatio = useCallback((id: string, width?: number, height?: number) => {
    if (!id || !width || !height || Number.isNaN(width) || Number.isNaN(height) || height === 0) {
      return;
    }
    const ratioValue = Number((width / height).toFixed(5)).toString();
    setDynamicAspectRatios((prev) => (prev[id] === ratioValue ? prev : { ...prev, [id]: ratioValue }));
  }, []);

  const resolveAspectRatio = useCallback(
    (item: CollageItem) => formatAspectRatio(dynamicAspectRatios[item.id] ?? item.aspectRatio),
    [dynamicAspectRatios]
  );
  const navCategories = useMemo(
    () => Object.values(CATEGORY_SHOWCASE_GALLERIES).map(({ slug, title }) => ({ slug, title })),
    []
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!activeItem) return;
    setModalSlideIndex(0);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveItem(null);
      }
      const slides = activeItem.slides ?? [];
      if (slides.length > 0 && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
        event.preventDefault();
        setModalSlideIndex((prev) => {
          const len = slides.length;
          if (len === 0) return 0;
          return event.key === "ArrowRight" ? (prev + 1) % len : (prev - 1 + len) % len;
        });
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

  useEffect(() => {
    const autoplayInline = () => {
      document
        .querySelectorAll<HTMLVideoElement>("video[data-inline-autoplay='true']")
        .forEach((video) => {
          if (video.dataset.autoplayBound === "true") return;
          video.dataset.autoplayBound = "true";
          video.muted = true;
          video.play().catch(() => undefined);
        });
    };

    autoplayInline();

    const timeout = window.setTimeout(autoplayInline, 120);
    return () => window.clearTimeout(timeout);
  }, [galleryItems]);

  useEffect(() => {
    if (!activeItem || activeItem.mediaType !== "video") return;
    const video = modalVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => undefined);
    }
  }, [activeItem]);

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] text-white">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0d0d]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <Link
            href="/#projects"
            className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            ← Torna ai progetti
          </Link>
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {navCategories.map(({ slug, title }) => {
              const isActive = slug === category.slug;
              return (
                <Link
                  key={slug}
                  href={`/showcase/${slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full border px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                    isActive
                      ? "border-white bg-white text-black"
                      : "border-white/20 bg-white/5 text-white/80 hover:bg-white/15"
                  }`}
                >
                  {title}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
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
      <div className="grid grid-cols-1 gap-6 grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         {galleryItems.map((item) => {
            const primaryMedia = item.slides?.[0] ?? item;
            const aspect = resolveAspectRatio(primaryMedia);
            const aspectValue = parseAspectRatioValue(aspect);
            const isLandscape = aspectValue ? aspectValue >= 1.1 : false;
            const isUltraWide = aspectValue ? aspectValue >= 1.9 : false;
            const gridSpanClass = isLandscape
              ? isUltraWide
                ? "lg:col-span-3 xl:col-span-3"
                : "lg:col-span-2"
              : "";
            return (
              <div
                role="button"
                tabIndex={0}
                key={item.id}
                onClick={() => setActiveItem(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveItem(item);
                  }
                }}
                className={`group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-sm transition duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${gridSpanClass}`}
              >
                <div
                  className="relative w-full"
                  style={aspect ? { aspectRatio: aspect } : undefined}
                >
                  {item.slides && item.slides.length > 0 ? (
                    <InlineSlideshow item={item} onAspect={(id, w, h) => registerAspectRatio(id, w, h)} />
                  ) : (
                    <MediaFrame
                      item={item}
                      variant="card"
                      fit="cover"
                      className="transition duration-500 group-hover:scale-[1.03]"
                      onImageLoad={(w, h) => registerAspectRatio(item.id, w, h)}
                      onVideoMetadata={(w, h) => registerAspectRatio(item.id, w, h)}
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/35" />
                  <div className="pointer-events-none absolute inset-x-5 bottom-5 transform opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-medium">{item.title}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {isMounted && activeItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalBackdrop}
            style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 overflow-y-auto px-4 py-8 sm:px-6 sm:py-12"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-modal-title"
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              style={{
                maxHeight: "92vh",
                paddingTop: "max(1.5rem, env(safe-area-inset-top, 0px))",
                paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
              }}
            >
              <div
                className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black"
                style={{
                  aspectRatio:
                    resolveAspectRatio((activeItem.slides && activeItem.slides[modalSlideIndex]) || activeItem) ??
                    undefined,
                  maxHeight: "75vh",
                }}
              >
                <MediaFrame
                  key={
                    activeItem.slides && activeItem.slides[modalSlideIndex]
                      ? activeItem.slides[modalSlideIndex].id
                      : activeItem.id
                  }
                  item={
                    activeItem.slides && activeItem.slides[modalSlideIndex]
                      ? activeItem.slides[modalSlideIndex]
                      : activeItem
                  }
                  variant="modal"
                  fit="contain"
                  className="bg-black"
                  ref={
                    activeItem.slides && activeItem.slides[modalSlideIndex]
                      ? activeItem.slides[modalSlideIndex].mediaType === "video"
                        ? modalVideoRef
                        : null
                      : activeItem.mediaType === "video"
                        ? modalVideoRef
                        : null
                  }
                  onImageLoad={(w, h) =>
                    registerAspectRatio(
                      activeItem.slides && activeItem.slides[modalSlideIndex]
                        ? activeItem.slides[modalSlideIndex].id
                        : activeItem.id,
                      w,
                      h
                    )
                  }
                  onVideoMetadata={(w, h) =>
                    registerAspectRatio(
                      activeItem.slides && activeItem.slides[modalSlideIndex]
                        ? activeItem.slides[modalSlideIndex].id
                        : activeItem.id,
                      w,
                      h
                    )
                  }
                />
                {activeItem.slides && activeItem.slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                      onClick={() =>
                        setModalSlideIndex((prev) => {
                          const len = activeItem.slides?.length ?? 0;
                          if (len === 0) return 0;
                          return (prev - 1 + len) % len;
                        })
                      }
                      aria-label="Slide precedente"
                    >
                      <span className="sr-only">Previous</span>
                      {"<"}
                    </button>
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                      onClick={() =>
                        setModalSlideIndex((prev) => {
                          const len = activeItem.slides?.length ?? 0;
                          if (len === 0) return 0;
                          return (prev + 1) % len;
                        })
                      }
                      aria-label="Slide successiva"
                    >
                      <span className="sr-only">Next</span>
                      {">"}
                    </button>
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
                      {activeItem.slides.map((slide, i) => {
                        const active = i === modalSlideIndex;
                        return (
                          <button
                            key={`${slide.id}-dot`}
                            type="button"
                            className={`h-2.5 w-2.5 rounded-full border border-white/30 transition ${active ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
                            onClick={() => setModalSlideIndex(i)}
                            aria-label={`Vai alla slide ${i + 1} di ${activeItem.slides?.length ?? 0}`}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80 backdrop-blur-sm">
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
              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:hidden"
                onClick={() => setActiveItem(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
