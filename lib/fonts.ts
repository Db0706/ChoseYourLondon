import { Hanken_Grotesk, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

export const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--serif', display: 'swap' });
export const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--mono', display: 'swap' });
export const sans = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--sans', display: 'swap' });

// Font-family strings the <canvas> card renderer uses.
export const cardFonts = { serif: serif.style.fontFamily, mono: mono.style.fontFamily };
