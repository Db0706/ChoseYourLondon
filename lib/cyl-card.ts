// Shared data + card renderer for the Choose Your London sites.
export const W = 2400, H = 1350;
const LOGO = '/assets/cyl-logo.png';

export type Landmark = { id: string; name: string; area: string; photo?: string; thumb?: string; baked?: boolean };

// Each card gets one of these at random. The photos already contain the CHOOSE YOUR LONDON wordmark (`baked`).
export const LANDMARKS: Landmark[] = [
  { id: 'somerset-house', name: 'Somerset House', area: 'Strand', photo: '/landmarks/somerset-house.jpg', thumb: '/landmarks/thumbs/somerset-house.jpg', baked: true },
  { id: 'buckingham-palace', name: 'Buckingham Palace', area: "St James's", photo: '/landmarks/buckingham-palace.jpg', thumb: '/landmarks/thumbs/buckingham-palace.jpg', baked: true },
  { id: 'millennium-bridge', name: 'Millennium Bridge', area: 'Bankside', photo: '/landmarks/millennium-bridge.jpg', thumb: '/landmarks/thumbs/millennium-bridge.jpg', baked: true },
  { id: 'the-gherkin', name: 'The Gherkin', area: 'City of London', photo: '/landmarks/the-gherkin.jpg', thumb: '/landmarks/thumbs/the-gherkin.jpg', baked: true },
  { id: 'somerset-house-skate', name: 'Somerset House Skate', area: 'Strand', photo: '/landmarks/somerset-house-skate.jpg', thumb: '/landmarks/thumbs/somerset-house-skate.jpg', baked: true },
  { id: 'royal-exchange', name: 'Royal Exchange', area: 'Bank', photo: '/landmarks/royal-exchange.jpg', thumb: '/landmarks/thumbs/royal-exchange.jpg', baked: true },
  { id: 'vauxhall-cross', name: 'Vauxhall Cross', area: 'Vauxhall', photo: '/landmarks/vauxhall-cross.jpg', thumb: '/landmarks/thumbs/vauxhall-cross.jpg', baked: true },
  { id: 'the-shard', name: 'The Shard', area: 'London Bridge', photo: '/landmarks/the-shard.jpg', thumb: '/landmarks/thumbs/the-shard.jpg', baked: true },
  { id: 'piccadilly-circus', name: 'Piccadilly Circus', area: 'West End', photo: '/landmarks/piccadilly-circus.jpg', thumb: '/landmarks/thumbs/piccadilly-circus.jpg', baked: true },
  { id: 'battersea-power-station', name: 'Battersea Power Station', area: 'Nine Elms', photo: '/landmarks/battersea-power-station.jpg', thumb: '/landmarks/thumbs/battersea-power-station.jpg', baked: true },
  { id: 'royal-albert-hall', name: 'Royal Albert Hall', area: 'Kensington', photo: '/landmarks/royal-albert-hall.jpg', thumb: '/landmarks/thumbs/royal-albert-hall.jpg', baked: true },
  { id: 'bt-tower', name: 'BT Tower', area: 'Fitzrovia', photo: '/landmarks/bt-tower.jpg', thumb: '/landmarks/thumbs/bt-tower.jpg', baked: true },
  { id: 'canary-wharf', name: 'Canary Wharf', area: 'Docklands', photo: '/landmarks/canary-wharf.jpg', thumb: '/landmarks/thumbs/canary-wharf.jpg', baked: true },
  { id: 'trafalgar-square', name: 'Trafalgar Square', area: 'Charing Cross', photo: '/landmarks/trafalgar-square.jpg', thumb: '/landmarks/thumbs/trafalgar-square.jpg', baked: true },
  { id: 'olympic-park', name: 'Olympic Park', area: 'Stratford', photo: '/landmarks/olympic-park.jpg', thumb: '/landmarks/thumbs/olympic-park.jpg', baked: true },
  { id: 'natural-history-museum', name: 'Natural History Museum', area: 'South Kensington', photo: '/landmarks/natural-history-museum.jpg', thumb: '/landmarks/thumbs/natural-history-museum.jpg', baked: true },
  { id: 'the-thames', name: 'The Thames', area: 'Westminster', photo: '/landmarks/the-thames.jpg', thumb: '/landmarks/thumbs/the-thames.jpg', baked: true },
  { id: 'downing-street', name: 'Downing Street', area: 'Westminster', photo: '/landmarks/downing-street.jpg', thumb: '/landmarks/thumbs/downing-street.jpg', baked: true },
  { id: 'tower-of-london', name: 'Tower of London', area: 'Tower Hill', photo: '/landmarks/tower-of-london.jpg', thumb: '/landmarks/thumbs/tower-of-london.jpg', baked: true },
  { id: 'big-ben', name: 'Big Ben', area: 'Westminster', photo: '/landmarks/big-ben.jpg', thumb: '/landmarks/thumbs/big-ben.jpg', baked: true },
  { id: 'westminster-abbey', name: 'Westminster Abbey', area: 'Westminster', photo: '/landmarks/westminster-abbey.jpg', thumb: '/landmarks/thumbs/westminster-abbey.jpg', baked: true },
  { id: 'tower-bridge', name: 'Tower Bridge', area: 'Southwark', photo: '/landmarks/tower-bridge.jpg', thumb: '/landmarks/thumbs/tower-bridge.jpg', baked: true },
  { id: 'marble-arch', name: 'Marble Arch', area: 'Mayfair', photo: '/landmarks/marble-arch.jpg', thumb: '/landmarks/thumbs/marble-arch.jpg', baked: true },
  { id: 'london-eye', name: 'London Eye', area: 'South Bank', photo: '/landmarks/london-eye.jpg', thumb: '/landmarks/thumbs/london-eye.jpg', baked: true },
  { id: 'houses-of-parliament', name: 'Houses of Parliament', area: 'Westminster', photo: '/landmarks/houses-of-parliament.jpg', thumb: '/landmarks/thumbs/houses-of-parliament.jpg', baked: true },
  { id: 'st-pauls', name: "St Paul's Cathedral", area: 'City of London', photo: '/landmarks/st-pauls.jpg', thumb: '/landmarks/thumbs/st-pauls.jpg', baked: true },
  { id: 'london-streets', name: 'London Streets', area: 'Central London', photo: '/landmarks/london-streets.jpg', thumb: '/landmarks/thumbs/london-streets.jpg', baked: true },
  { id: 'olympia', name: 'Olympia London', area: 'Kensington · the venue', photo: '/landmarks/olympia.jpg', thumb: '/landmarks/thumbs/olympia.jpg', baked: true },
];

export const randomLandmark = (excludeId?: string) => {
  const pool = LANDMARKS.filter(l => l.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
};

// Pillar-box red, used for the no-photo cards and the avatar ring.
export const CARD_COLOUR = '#E3120B';

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
  const ink = inkOn(col);
  let fg = '#FFFFFF';

  if (photo) {
    cover(ctx, photo, 0, 0, W, H);
    if (!baked) {
      ctx.fillStyle = 'rgba(8,8,10,.22)'; ctx.fillRect(0, 0, W, H);
      const lw = W * 0.72, lh = lw * logo.height / logo.width;
      ctx.drawImage(tint(logo, col), (W - lw) / 2, 150, lw, lh);
    }
    let g = ctx.createLinearGradient(0, 0, 0, 260); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 260);
    g = ctx.createLinearGradient(0, H * 0.5, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.88)');
    ctx.fillStyle = g; ctx.fillRect(0, H * 0.5, W, H * 0.5);
  } else {
    fg = ink;
    ctx.fillStyle = col; ctx.fillRect(0, 0, W, H);
    const r = ctx.createRadialGradient(W / 2, H * 0.42, 100, W / 2, H / 2, W * 0.72);
    r.addColorStop(0, 'rgba(255,255,255,.10)'); r.addColorStop(1, 'rgba(0,0,0,.30)');
    ctx.fillStyle = r; ctx.fillRect(0, 0, W, H);
    const lw = W * 0.62, lh = lw * logo.height / logo.width;
    ctx.drawImage(tint(logo, ink), (W - lw) / 2, 150, lw, lh);
    ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; spaced(ctx, 0);
    fit(ctx, lm.name, s => `italic ${s}px ${serif}`, 120, W * 0.7);
    ctx.fillText(lm.name, W / 2, 150 + lh + 110);
    ctx.globalAlpha = 0.35; ctx.fillRect(130, 150 + lh + 150, W - 260, 3); ctx.globalAlpha = 1;
  }

  // top tags
  ctx.fillStyle = fg; ctx.font = `500 28px ${mono}`; spaced(ctx, 5); ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = 0.9;
  ctx.textAlign = 'left'; ctx.fillText('#CHOOSEYOURLONDON', 130, 110);
  ctx.textAlign = 'right'; ctx.fillText('A SUPERTEAM UK CAMPAIGN', W - 130, 110);
  ctx.globalAlpha = 1;

  // footer: big avatar + name
  const R = 150, ax = 130 + R, fy = H - 100 - R;
  // soft drop shadow only, no coloured ring
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 14;
  ctx.beginPath(); ctx.arc(ax, fy, R, 0, Math.PI * 2); ctx.fillStyle = 'rgba(10,10,12,.55)'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(ax, fy, R, 0, Math.PI * 2); ctx.closePath();
  if (avatar) { ctx.clip(); cover(ctx, avatar, ax - R, fy - R, 2 * R, 2 * R); }
  else {
    ctx.fillStyle = fg; spaced(ctx, 0);
    ctx.font = `170px ${serif}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(initials(o.name), ax, fy + 12);
  }
  ctx.restore();

  const tx = ax + R + 64;
  ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; spaced(ctx, 0);
  fit(ctx, o.name, s => `${s}px ${serif}`, 120, 1080);
  ctx.fillText(o.name, tx, fy + 20);
  ctx.font = `500 29px ${mono}`; spaced(ctx, 4); ctx.globalAlpha = 0.88;
  ctx.fillText(((o.handle ? '@' + o.handle + '  ·  ' : '') + 'MY STOP: ' + lm.name).toUpperCase(), tx + 3, fy + 84);

  ctx.textAlign = 'right';
  ctx.fillText('SOLANA BREAKPOINT 2026', W - 130, fy + 20);
  ctx.fillText('OLYMPIA LONDON · 15–17 NOV', W - 130, fy + 84);
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
