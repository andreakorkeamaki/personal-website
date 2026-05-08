import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://andreakorkeamaki.com';
const siteTitle = 'Andrea Korkeamaki — Creative Developer';
const siteDescription =
  'Portfolio of Andrea Korkeamaki, a creative developer crafting interactive 3D, motion, web, and AI-powered experiences.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Andrea Korkeamaki Portfolio',
  title: {
    default: siteTitle,
    template: '%s — Andrea Korkeamaki',
  },
  description: siteDescription,
  keywords: [
    'Andrea Korkeamaki',
    'creative developer',
    '3D web developer',
    'motion design',
    'interactive portfolio',
    'AI automations',
    'Next.js portfolio',
    'Three.js',
  ],
  authors: [{ name: 'Andrea Korkeamaki' }],
  creator: 'Andrea Korkeamaki',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: siteTitle,
    description: siteDescription,
    siteName: 'Andrea Korkeamaki Portfolio',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0F0E0E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
