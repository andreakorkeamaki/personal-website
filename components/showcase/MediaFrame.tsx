"use client";

import React from "react";

import type { CollageItem } from "@/data/category-showcase";

type MediaFrameVariant = "card" | "modal";
type ObjectFit = "cover" | "contain";
type ObjectPosition = "center" | "top" | "bottom" | "left" | "right";

export type MediaFrameProps = {
  item: CollageItem;
  variant?: MediaFrameVariant;
  fit?: ObjectFit;
  position?: ObjectPosition;
  className?: string;
  allowFullScreen?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  autoPlayInline?: boolean;
  onImageLoad?: (width?: number, height?: number) => void;
  onVideoMetadata?: (width?: number, height?: number) => void;
};

function getMediaSources(item: CollageItem) {
  if (item.mediaType !== "video") return [];
  if (item.sources && item.sources.length > 0) return item.sources;
  if (item.src) return [{ src: item.src }];
  return [] as Array<{ src: string; type?: string }>;
}

const MediaFrame = React.forwardRef<HTMLVideoElement | null, MediaFrameProps>(function MediaFrame(
  {
    item,
    variant = "card",
    fit = "cover",
    position = "center",
    className = "",
    allowFullScreen = true,
    autoPlay = variant === "card",
    loop = true,
    muted = true,
    playsInline = true,
    controls = variant === "modal",
    autoPlayInline = variant === "card",
    onImageLoad,
    onVideoMetadata,
  },
  ref
) {
  const objectFit = fit === "contain" ? "object-contain" : "object-cover";
  const interactionClass = variant === "card" ? "pointer-events-none select-none" : "";
  const objectPosition =
    position === "top"
      ? "object-top"
      : position === "bottom"
        ? "object-bottom"
        : position === "left"
          ? "object-left"
          : position === "right"
            ? "object-right"
            : "object-center";
  const commonClass =
    `absolute inset-0 block h-full w-full ${objectFit} ${objectPosition} ${interactionClass} ${className}`.trim();

  if (item.mediaType === "image") {
    const src = variant === "card" ? item.thumbnail ?? item.src : item.src;
    return (
      <img
        src={src}
        alt={item.title}
        loading={variant === "card" ? "lazy" : "eager"}
        decoding="async"
        className={commonClass}
        onLoad={(event) => onImageLoad?.(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)}
      />
    );
  }

  if (item.mediaType === "youtube") {
    return (
      <iframe
        src={(item.embedUrl ?? item.src) || ""}
        title={item.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen={allowFullScreen}
        loading={variant === "card" ? "lazy" : "eager"}
        className={`${commonClass} border-0`}
      />
    );
  }

  const sources = getMediaSources(item);
  const poster = item.poster ?? item.thumbnail;

  return (
    <video
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      playsInline={playsInline}
      preload={variant === "card" ? "metadata" : "auto"}
      data-inline-autoplay={autoPlayInline ? "true" : undefined}
      className={commonClass}
      ref={ref}
      onLoadedMetadata={(event) => onVideoMetadata?.(event.currentTarget.videoWidth, event.currentTarget.videoHeight)}
    >
      {sources.map((source) => (
        <source key={`${item.id}-${source.src}`} src={source.src} type={source.type} />
      ))}
    </video>
  );
});

export default MediaFrame;
