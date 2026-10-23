import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/lib/config';
import { mono, news, serif, slab } from '@/lib/fonts';
import './globals.css';

// Absolute www URL: the bare domain redirects, and X's crawler won't always follow that for images.
const OG_IMAGE = 'https://www.chooseyourlondon.com/og-daily-bean.jpg';

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : process.env.VERCEL_PROJECT_PRODUCTION_URL ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) : undefined,
  title: 'Choose Your London',
  alternates: { canonical: '/' },
  description: 'Pick your headline, make your Daily Bean front page, and see you at Solana Breakpoint 2026 · Olympia London, 15–17 November. A Superteam UK campaign.',
  openGraph: {
    title: 'Choose Your London',
    description: 'Make your Daily Bean front page for Solana Breakpoint 2026. A Superteam UK campaign.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'The Daily Bean: You confirmed for Breakpoint' }],
  },
  twitter: { card: 'summary_large_image', images: [OG_IMAGE] },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${mono.variable} ${slab.variable} ${news.variable}`}>
      <body>{children}</body>
    </html>
  );
}
