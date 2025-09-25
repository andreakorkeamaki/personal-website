# Image Preparation Guidelines

These notes explain how to prepare project artwork so the showcases stay crisp while remaining lightweight. Follow the sizes below when exporting assets.

## 1. File Formats & Compression
- **Primary format:** WebP (lossy) at quality 70–80. Keeps transparency support and small payloads.
- **Optional hi-end:** Provide an AVIF version if you already export in that format. Keep the WebP copy for browsers without AVIF.
- **Fallbacks:** Only supply JPEG/PNG if absolutely needed (e.g. heavy transparency) and keep them under 350 KB.
- Strip metadata (EXIF, color profiles) unless color management is required.

## 2. File Naming & Location
- Place showcase assets under `public/images/projects/`.
- Use lowercase kebab-case names. Example: `exploded-device-tile.webp`.
- When you add blurred background variants, suffix them with `-bg` (e.g. `exploded-device-bg.webp`).
- Remove spaces and special characters to avoid URL issues.

## 3. Required Artworks
| Use case | Purpose | Recommended dimensions | Notes |
| --- | --- | --- | --- |
| **Tile / Cover** (`project.tile` / `project.cover`) | Hero card image in desktop/mobile showcase | 640 × 853 px (3:4) @1x, 960 × 1280 px @2x | Keep important content centred; export two sizes if possible. Smaller (480 × 640) thumbnails are fine for low-detail art. |
| **Background glow** (`*-bg.webp`) | Blurred full-screen backdrop | 1600 × 1000 px landscape | Pre-blur before export (8 px Gaussian) and darken ~40%. This lets us drop expensive CSS filters. |
| **Info thumbs** (`project.info[].thumb`) | Small cards in detail drawers | 480 × 270 px (16:9) | Keep below 120 KB; static captures are ideal. |
| **Hero canvas fallback** | Optional static hero fallback | 1920 × 1080 px | Used only if WebGL fails. Keep dark palette. |

## 4. Export Workflow Tips
1. Finish artwork at full resolution.
2. Duplicate and crop to the aspect ratio above.
3. Create downsized copies:
   - 1x (base) size for mobile and standard displays.
   - 2x size for retina/4K (optional but recommended for hero pieces).
4. Run through an optimizer (Squoosh, ImageOptim, or `cwebp`) and verify the final size stays under 250 KB for tiles and 350 KB for backgrounds.

## 5. Delivery Checklist
- [ ] File lives in `public/images/projects/`.
- [ ] Name matches the project slug or category.
- [ ] Correct WebP/AVIF format and compressed.
- [ ] Dimensions match the target use case.
- [ ] Background variant already pre-blurred & darkened.
- [ ] Previewed on mobile once to confirm readability.

Keeping to these specs ensures the showcase can enable aggressive lazy-loading and skip runtime blur filters, giving you the 30–40% rendering win without sacrificing visuals.
