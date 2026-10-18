import localFont from 'next/font/local';

// Fonts are self-hosted (files in ./font-files, OFL licensed) so builds never depend on
// downloading them from Google Fonts at build time.
export const serif = localFont({
  src: [
    { path: './font-files/instrument-serif-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './font-files/instrument-serif-latin-400-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--serif',
  display: 'swap',
});
export const mono = localFont({
  src: './font-files/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  variable: '--mono',
  display: 'swap',
});

// Font-family strings the <canvas> card renderer uses.
export const cardFonts = { serif: serif.style.fontFamily, mono: mono.style.fontFamily };
