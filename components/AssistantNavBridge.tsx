"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const DEBUG_NAV = false;
const DEDUPE_WINDOW_MS = 2500;

const anchors: Record<string, string> = {
  projects: "#projects",
  about: "#about",
  contact: "#contact",
};

const routes: Record<string, string> = {
  showcase_web: "/showcase/products",
  showcase_visuals: "/showcase/artistic",
  showcase_music: "/showcase/music",
};

const NAV_REGEX = /\[\[NAV:([a-z_]+)\]\]/i;

function debug(...args: unknown[]) {
  if (!DEBUG_NAV) return;
  // eslint-disable-next-line no-console
  console.debug("[AssistantNavBridge]", ...args);
}

function extractKey(text: string | null | undefined) {
  if (!text) return null;
  const match = text.match(NAV_REGEX);
  return match?.[1]?.toLowerCase() ?? null;
}

function stripTagFromRoot(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeValue && NAV_REGEX.test(node.nodeValue)) {
      node.nodeValue = node.nodeValue.replace(NAV_REGEX, "").trim();
    }
    node = walker.nextNode();
  }
}

export default function AssistantNavBridge() {
  const router = useRouter();
  const lastTriggerRef = useRef<{ key: string; at: number } | null>(null);
  const isHandlingRef = useRef(false);

  useEffect(() => {
    const handleKey = (key: string) => {
      if (isHandlingRef.current) return;
      const now = Date.now();
      const last = lastTriggerRef.current;
      if (last && last.key === key && now - last.at < DEDUPE_WINDOW_MS) {
        debug("dedupe", key);
        return;
      }

      lastTriggerRef.current = { key, at: now };
      isHandlingRef.current = true;

      if (anchors[key]) {
        const target = document.querySelector(anchors[key]);
        if (target) {
          debug("scroll", key, anchors[key]);
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          debug("anchor not found", key, anchors[key]);
        }
      } else if (routes[key]) {
        debug("route", key, routes[key]);
        router.push(routes[key]);
      } else {
        debug("blocked key", key);
      }

      window.setTimeout(() => {
        isHandlingRef.current = false;
      }, 300);
    };

    const scan = () => {
      const host = document.querySelector("elevenlabs-convai");
      if (host) {
        const directKey = extractKey(host.textContent);
        if (directKey) {
          stripTagFromRoot(host);
          handleKey(directKey);
          return;
        }
        const shadow = (host as HTMLElement).shadowRoot;
        if (shadow) {
          const shadowKey = extractKey(shadow.textContent);
          if (shadowKey) {
            stripTagFromRoot(shadow);
            handleKey(shadowKey);
            return;
          }
        }
      }

      const fallbackKey = extractKey(document.body?.textContent);
      if (fallbackKey) {
        stripTagFromRoot(document.body);
        handleKey(fallbackKey);
      }
    };

    const observer = new MutationObserver(() => scan());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    scan();

    return () => {
      observer.disconnect();
    };
  }, [router]);

  return null;
}
