// Shared data + card renderer for the Choose Your London sites.
export const W = 2400, H = 1350;
const LOGO = '/assets/cyl-logo.png';

export type Landmark = { id: string; name: string; area: string; photo?: string; baked?: boolean };
export type Colour = { name: string; hex: string };

// Add a clean (no-text) photo path to any landmark to turn it into a photo card.
// `baked: true` = the photo already contains the CHOOSE YOUR LONDON wordmark.
export const LANDMARKS: Landmark[] = [
  { id: 'royal-exchange', name: 'Royal Exchange', area: 'Bank', photo: '/assets/royal-exchange.jpg', baked: true },
  { id: 'somerset-house', name: 'Somerset House', area: 'Strand', photo: '/assets/somerset-house.jpg', baked: true },
  { id: 'big-ben', name: 'Big Ben', area: 'Westminster' },
  { id: 'tower-bridge', name: 'Tower Bridge', area: 'Southwark' },
  { id: 'st-pauls', name: "St Paul's", area: 'City of London' },
  { id: 'the-shard', name: 'The Shard', area: 'London Bridge' },
  { id: 'london-eye', name: 'London Eye', area: 'South Bank' },
  { id: 'gherkin', name: 'The Gherkin', area: 'Aldgate' },
  { id: 'buckingham', name: 'Buckingham Palace', area: "St James's" },
  { id: 'trafalgar', name: 'Trafalgar Square', area: 'Charing Cross' },
  { id: 'piccadilly', name: 'Piccadilly Circus', area: 'West End' },
  { id: 'battersea', name: 'Battersea Power Station', area: 'Nine Elms' },
  { id: 'camden', name: 'Camden Lock', area: 'Camden' },
  { id: 'abbey-road', name: 'Abbey Road', area: "St John's Wood" },
  { id: 'canary-wharf', name: 'Canary Wharf', area: 'Docklands' },
  { id: 'olympia', name: 'Olympia London', area: 'Kensington · the venue' },
];

export const COLOURS: Colour[] = [
  { name: 'Pillar Box', hex: '#E3120B' },
  { name: 'Elizabeth', hex: '#7B2FE0' },
  { name: 'Racing Green', hex: '#0E5A3A' },
  { name: 'Thames', hex: '#1F3FAE' },
  { name: 'Black Cab', hex: '#15151A' },
  { name: 'Cab Light', hex: '#F2B705' },
];

// Weekly drops on Thursdays (UTC 16:00 ≈ 5pm London) up to Breakpoint.
export const EPISODES = [1, 2, 3, 4, 5].map(n => ({
  n, date: new Date(Date.UTC(2026, 8, 24 + 7 * (n - 1), 16, 0)),
  title: n === 1 ? 'The Premiere' : 'Under wraps',
}));

export const pad = (n: number) => String(n).padStart(2, '0');
export const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/London' });
export const fmtClock = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/London' });
export function countdown(ms: number, short?: boolean) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return short ? `${d}D ${pad(h)}:${pad(m)}:${pad(x)}` : `${pad(d)}d ${pad(h)}h ${pad(m)}m ${pad(x)}s`;
}
export function episodeInfo(now: Date) {
  const t = now.getTime();
  const next = EPISODES.find(e => e.date.getTime() > t) || null;
  return { next, list: EPISODES.map(e => ({ ...e, out: e.date.getTime() <= t, isNext: !!next && next.n === e.n, dateLabel: fmtDate(e.date) })) };
}

const imgCache = new Map<string, Promise<HTMLImageElement>>();
export function loadImage(src: string, cors?: boolean) {
  if (!imgCache.has(src)) imgCache.set(src, new Promise((res, rej) => {
    const i = new Image(); if (cors) i.crossOrigin = 'anonymous';
    i.onload = () => res(i); i.onerror = () => { imgCache.delete(src); rej(new Error('load ' + src)); };
    i.src = src;
  }));
  return imgCache.get(src)!;
}

let trimmed: HTMLCanvasElement | null = null;
async function trimmedLogo() {
  if (trimmed) return trimmed;
  const img = await loadImage(LOGO);
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const x = c.getContext('2d')!; x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
  for (let y = 0; y < c.height; y += 2) for (let xx = 0; xx < c.width; xx += 2) {
    if (d[(y * c.width + xx) * 4 + 3] > 40) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const t = document.createElement('canvas'); t.width = x1 - x0 + 4; t.height = y1 - y0 + 4;
  t.getContext('2d')!.drawImage(c, -x0 + 2, -y0 + 2);
  return (trimmed = t);
}
const tints = new Map<string, HTMLCanvasElement>();
function tint(src: HTMLCanvasElement, col: string) {
  if (tints.has(col)) return tints.get(col)!;
  const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
  const x = c.getContext('2d')!; x.drawImage(src, 0, 0);
  x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, c.width, c.height);
  tints.set(col, c); return c;
}
function lum(hex: string) {
  const n = parseInt(hex.slice(1), 16), ch = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * ch(n >> 16) + 0.7152 * ch((n >> 8) & 255) + 0.0722 * ch(n & 255);
}
export const inkOn = (hex: string) => (lum(hex) > 0.4 ? '#14120E' : '#F6F1E7');

type Drawable = HTMLImageElement | HTMLCanvasElement;
function cover(ctx: CanvasRenderingContext2D, img: Drawable, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / img.width, h / img.height), iw = img.width * s, ih = img.height * s;
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}
function spaced(ctx: CanvasRenderingContext2D, px: number) { if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = px + 'px'; }
function fit(ctx: CanvasRenderingContext2D, text: string, font: (s: number) => string, size: number, max: number) {
  let s = size; ctx.font = font(s);
  while (ctx.measureText(text).width > max && s > 40) { s -= 4; ctx.font = font(s); }
}
const initials = (n: string) => (n.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2) || 'CY').toUpperCase();

export type CardFonts = { serif: string; mono: string };
export type CardOptions = {
  landmark: Landmark;
  colour: string;
  name: string;
  handle: string;
  avatar: string | null;
  customPhoto: string | null;
  fonts: CardFonts;
  isCurrent?: () => boolean;
};

// Mix a hex colour towards white so it stays readable on the dark info panel.
function lighten(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16), m = (v: number) => Math.round(v + (255 - v) * amt);
  return `rgb(${m(n >> 16)},${m((n >> 8) & 255)},${m(n & 255)})`;
}
const accentOn = (hex: string) => { const l = lum(hex); return l < 0.02 ? '#F3EFE7' : l < 0.12 ? lighten(hex, 0.45) : hex; };

// Split layout: info panel on the left, a big photo panel on the right.
const PANEL = 1080, PAD = 110, BG = '#0A0A0C', TEXT_MAX = PANEL - PAD * 2;

export async function renderCard(canvas: HTMLCanvasElement, o: CardOptions) {
  const { serif, mono } = o.fonts;
  try { await Promise.all([`120px ${serif}`, `italic 120px ${serif}`, `500 32px ${mono}`].map(f => document.fonts.load(f))); } catch {}
  const logo = await trimmedLogo();
  const lm = o.landmark, col = o.colour;
  const photoSrc = o.customPhoto || lm.photo;
  const baked = !o.customPhoto && lm.baked;
  let photo: HTMLImageElement | null = null, avatar: HTMLImageElement | null = null;
  if (photoSrc) { try { photo = await loadImage(photoSrc); } catch {} }
  if (o.avatar) { try { avatar = await loadImage(o.avatar, /^https?:/.test(o.avatar)); } catch {} }
  if (o.isCurrent && !o.isCurrent()) return;

  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.save(); ctx.clearRect(0, 0, W, H);
  const accent = accentOn(col);
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

  // ---- right: the big image panel ----
  const rx = PANEL, rw = W - PANEL;
  ctx.save(); ctx.beginPath(); ctx.rect(rx, 0, rw, H); ctx.clip();
  if (avatar) {
    ctx.fillStyle = col; ctx.fillRect(rx, 0, rw, H);
    cover(ctx, avatar, rx, 0, rw, H);
  } else if (photo && baked) {
    // The wordmark is baked into these photos, so show the whole frame over a blurred fill.
    ctx.filter = 'blur(40px) brightness(.55)'; cover(ctx, photo, rx - 80, -80, rw + 160, H + 160); ctx.filter = 'none';
    const ih = rw * photo.height / photo.width;
    ctx.drawImage(photo, rx, (H - ih) / 2, rw, ih);
  } else if (photo) {
    cover(ctx, photo, rx, 0, rw, H);
  } else {
    const ink = inkOn(col);
    ctx.fillStyle = col; ctx.fillRect(rx, 0, rw, H);
    const r = ctx.createRadialGradient(rx + rw / 2, H * 0.42, 80, rx + rw / 2, H / 2, rw * 0.9);
    r.addColorStop(0, 'rgba(255,255,255,.12)'); r.addColorStop(1, 'rgba(0,0,0,.35)');
    ctx.fillStyle = r; ctx.fillRect(rx, 0, rw, H);
    ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; spaced(ctx, 0);
    ctx.font = `560px ${serif}`; ctx.fillText(initials(o.name), rx + rw / 2, H / 2 + 30);
  }
  // soft shade top and bottom so the tags stay legible
  let g = ctx.createLinearGradient(0, 0, 0, 240); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(rx, 0, rw, 240);
  g = ctx.createLinearGradient(0, H - 300, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.7)');
  ctx.fillStyle = g; ctx.fillRect(rx, H - 300, rw, 300);
  ctx.fillStyle = '#FFFFFF'; ctx.font = `500 26px ${mono}`; spaced(ctx, 5); ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = 0.9;
  ctx.textAlign = 'right'; ctx.fillText('A SUPERTEAM UK CAMPAIGN', W - 90, 100);
  ctx.fillText(('CHOSE ' + lm.name + ' · ' + lm.area).toUpperCase(), W - 90, H - 90);
  ctx.globalAlpha = 1;
  ctx.restore();

  // ---- divider with a few glitchy ticks ----
  ctx.fillStyle = 'rgba(243,239,231,.14)'; ctx.fillRect(PANEL - 1, 0, 2, H);
  ctx.fillStyle = accent;
  [[PANEL - 44, 300, 28, 12], [PANEL - 70, 390, 56, 5], [PANEL - 30, 820, 22, 10], [PANEL - 58, 1010, 40, 4]].forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));

  // ---- left: info panel ----
  const lw = 540, lh = lw * logo.height / logo.width;
  ctx.drawImage(tint(logo, accent), PAD, PAD, lw, lh);

  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; spaced(ctx, 0);
  ctx.fillStyle = '#F3EFE7';
  fit(ctx, o.name, s => `${s}px ${serif}`, 150, TEXT_MAX);
  ctx.fillText(o.name, PAD - 4, 700);
  let y = 700;
  if (o.handle) {
    ctx.fillStyle = accent; ctx.font = `500 36px ${mono}`; spaced(ctx, 2);
    ctx.fillText('@' + o.handle, PAD, (y += 78));
  }
  ctx.fillStyle = 'rgba(243,239,231,.55)'; ctx.font = `500 26px ${mono}`; spaced(ctx, 5);
  ctx.fillText('CHOSE', PAD, (y += 110));
  ctx.fillStyle = accent; spaced(ctx, 0);
  fit(ctx, lm.name, s => `italic ${s}px ${serif}`, 92, TEXT_MAX);
  ctx.fillText(lm.name, PAD - 2, (y += 90));

  ctx.fillStyle = accent; ctx.font = `500 27px ${mono}`; spaced(ctx, 4);
  ['SOLANA BREAKPOINT 2026', '15–17 NOVEMBER 2026', 'OLYMPIA LONDON ⊕ UNITED KINGDOM', '#CHOOSEYOURLONDON'].forEach((t, i) => ctx.fillText(t, PAD, 1098 + i * 48));
  ctx.restore();
}

export function download(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob(b => {
    if (!b) return;
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, 'image/png');
}

export type EpisodeInfo = ReturnType<typeof episodeInfo>;
