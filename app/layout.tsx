import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/lib/config';
import { mono, news, serif, slab } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : process.env.VERCEL_PROJECT_PRODUCTION_URL ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) : undefined,
  title: 'Choose Your London',
  alternates: { canonical: '/' },
  description: 'Pick your headline, make your Daily Bean front page, and see you at Solana Breakpoint 2026 · Olympia London, 15–17 November. A Superteam UK campaign.',
  // No preview image: people attach their own Daily Bean card when they post the link.
  openGraph: {
    title: 'Choose Your London',
    description: 'Make your Daily Bean front page for Solana Breakpoint 2026. A Superteam UK campaign.',
  },
  twitter: { card: 'summary' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${mono.variable} ${slab.variable} ${news.variable}`}>
      <body>{children}</body>
    </html>
  );
}
