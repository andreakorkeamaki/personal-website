"use client";

import type { SVGProps } from "react";
import { Instagram, Linkedin, Mail } from "lucide-react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

const XLogo = ({ size = 24, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path
      fill="currentColor"
      d="M18.9 3H23l-8.2 9.4L23.3 21h-6.6l-4.7-5.1L7.2 21H1L9.7 11.1 1.5 3h6.7l4.2 4.5 6.5-4.5Z"
    />
  </svg>
);

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/andrea-korkeamaki-620661318',
    Icon: Linkedin
  },
  {
    label: 'X',
    href: 'https://x.com/andrea_kork',
    Icon: XLogo
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/kork_xyz/',
    Icon: Instagram
  }
] as const;

export default function ContactForm() {
  return (
    <div className="mt-6 flex min-h-[420px] flex-col items-center text-center">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-white/70">Let&apos;s create</p>
        <h3 className="font-display text-4xl md:text-5xl">Bold ideas, fast.</h3>
        <p className="max-w-2xl font-body text-lg text-white/70">
          Drop me a line and let&apos;s shape immersive digital experiences together.
        </p>
      </div>

      <button
        type="button"
        className="mt-20 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-15 py-8  text-lg font-medium text-white transition hover:bg-white/20"
        onClick={() => {
          window.location.href = "mailto:andreakorkeamaki@gmail.com";
        }}
      >
        <Mail size={18} />
        andreakorkeamaki@gmail.com
      </button>

      <div className="mt-auto flex flex-wrap justify-center gap-4 pt-10">
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white hover:bg-white/10"
          >
            <Icon size={20} />
            <span className="sr-only">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
