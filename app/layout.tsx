import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400','500','600'] });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['700'] });

export const metadata: Metadata = {
  title: 'Andrea Korkeamaki — Portfolio',
  description: '3D • Motion • Web • AI',
};

export const viewport: Viewport = {
  themeColor: '#0F0E0E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
