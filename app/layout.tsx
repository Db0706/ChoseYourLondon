import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/lib/config';
import { mono, sans, serif } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : process.env.VERCEL_PROJECT_PRODUCTION_URL ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) : undefined,
  title: 'Choose Your London',
  alternates: { canonical: '/' },
  description: 'Pick your London landmark, make your card, and see you at Solana Breakpoint 2026 · Olympia London, 15–17 November. A Superteam UK campaign.',
  openGraph: {
    title: 'Choose Your London',
    description: 'Pick your corner of London for Solana Breakpoint 2026. A Superteam UK campaign.',
    images: ['/assets/royal-exchange.jpg'],
  },
  twitter: { card: 'summary_large_image', images: ['/assets/royal-exchange.jpg'] },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${mono.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
