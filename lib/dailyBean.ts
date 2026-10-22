// "The Daily Bean" attendee card: a newspaper front page with the visitor's chosen headline,
// photo (printed as halftone), quote and caption dropped into a blank template.
import { loadImage } from './cyl-card';

export const W = 2752, H = 1536;
const TEMPLATE = '/cards/daily-bean.jpg';
const FRAME_MASK = '/cards/daily-bean-frame-mask.png'; // where the starburst overlaps the photo frame
const INK_WEAR = '/cards/ink-wear.png';                 // worn-ink speckle for the headline

// Areas on the 2752×1536 template.
const PHOTO = { x: 1917, y: 433, w: 732, h: 867 };
const QUOTE = { x: 105, y: 1158, w: 1285, h: 126 };
const CAPTION = { x: 1910, y: 1326, w: 740 };
const HEADLINE = { x: 105, baseline: 637, maxW: 1540, capH: 188 }; // maxW stops short of the starburst (x≈1690)
const INK = '#181513';

export const HEADLINES = [
  'Bossman', 'Roadman', 'Local Royal', 'Sweetheart', 'Top Geezer',
  'Absolute Unit', 'Duke of Degen', 'Tube Veteran', 'Queue Champion', 'Cheeky Chappie',
];

export type BeanCard = {
  headline: string;
  name: string;
  company: string;
  handle: string;
  avatar: string;
  fonts: { slab: string; news: string };
  isCurrent?: () => boolean;
};

function cover(ctx: CanvasRenderingContext2D, img: CanvasImageSource & { width: number; height: number }, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / img.width, h / img.height), iw = img.width * s, ih = img.height * s;
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}
const canvas = (w: number, h: number) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

// Turn a photo into newspaper halftone dots (dark dots on white), sized to the frame.
function halftone(img: HTMLImageElement, w: number, h: number, step = 12) {
  const src = canvas(w, h), s = src.getContext('2d')!;
  cover(s, img, 0, 0, w, h);
  const px = s.getImageData(0, 0, w, h).data;
  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) lum[i] = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
  // auto-contrast (ignore the darkest/lightest 2%)
  const sorted = Array.from(lum).sort((a, b) => a - b);
  const lo = sorted[Math.floor(sorted.length * 0.02)], hi = sorted[Math.floor(sorted.length * 0.98)] || 255;
  const out = canvas(w, h), o = out.getContext('2d')!;
  o.fillStyle = '#fff'; o.fillRect(0, 0, w, h); o.fillStyle = 'rgb(40,40,40)';
  for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
    const sx = Math.min(w - 1, x + step / 2), sy = Math.min(h - 1, y + step / 2);
    const v = 1 - Math.min(1, Math.max(0, (lum[sy * w + sx] - lo) / Math.max(1, hi - lo)));
    const r = step * 0.74 * Math.sqrt(v);
    if (r > 0.6) { o.beginPath(); o.arc(x + step / 2, y + step / 2, r, 0, Math.PI * 2); o.fill(); }
  }
  return out;
}

// Word-wrap into at most `lines` lines, shrinking the font until it fits.
function fitText(ctx: CanvasRenderingContext2D, text: string, font: (s: number) => string, maxW: number, maxH: number, lines: number, start: number) {
  for (let size = start; size > 18; size -= 2) {
    ctx.font = font(size);
    const out: string[] = []; let cur = '';
    for (const word of text.split(' ')) {
      const t = cur ? cur + ' ' + word : word;
      if (ctx.measureText(t).width <= maxW) cur = t; else { out.push(cur); cur = word; }
    }
    out.push(cur);
    if (out.length <= lines && size * 1.18 * out.length <= maxH) return { size, lines: out };
  }
  return { size: 18, lines: [text] };
}

export async function renderBeanCard(c: HTMLCanvasElement, o: BeanCard) {
  const { slab, news } = o.fonts;
  try { await Promise.all([`200px ${slab}`, `44px ${news}`, `italic 44px ${news}`].map(f => document.fonts.load(f))); } catch {}
  const [tpl, mask, wear] = await Promise.all([loadImage(TEMPLATE), loadImage(FRAME_MASK), loadImage(INK_WEAR)]);
  let avatar: HTMLImageElement | null = null;
  try { avatar = await loadImage(o.avatar, /^https?:/.test(o.avatar)); } catch {}
  if (o.isCurrent && !o.isCurrent()) return false;

  if (c.width !== W) c.width = W;
  if (c.height !== H) c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(tpl, 0, 0, W, H);

  // 1 · photo, printed into the frame, with the starburst kept on top
  if (avatar) {
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(halftone(avatar, PHOTO.w, PHOTO.h), PHOTO.x, PHOTO.y);
    ctx.globalCompositeOperation = 'source-over';
    const keep = canvas(PHOTO.w, PHOTO.h), k = keep.getContext('2d')!;
    k.drawImage(tpl, PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h, 0, 0, PHOTO.w, PHOTO.h);
    k.globalCompositeOperation = 'destination-in'; k.drawImage(mask, 0, 0, PHOTO.w, PHOTO.h);
    ctx.drawImage(keep, PHOTO.x, PHOTO.y);
  }

  // 2 · chosen headline line, in worn slab capitals to match the printed headline
  const text = o.headline.toUpperCase();
  const fontSize = HEADLINE.capH / 0.778; // Alfa Slab One cap height ≈ 0.778 em
  const head = canvas(HEADLINE.maxW + 40, Math.ceil(fontSize * 1.3)), h = head.getContext('2d')!;
  h.font = `${fontSize}px ${slab}`;
  const natural = h.measureText(text).width;
  const squeeze = Math.min(0.8, HEADLINE.maxW / natural);
  h.save(); h.scale(squeeze, 1); h.fillStyle = INK; h.textBaseline = 'alphabetic';
  h.fillText(text, 0, fontSize); h.restore();
  h.globalCompositeOperation = 'destination-out'; h.drawImage(wear, 0, 0, head.width, head.height);
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(head, HEADLINE.x, HEADLINE.baseline - fontSize);
  ctx.globalCompositeOperation = 'source-over';

  // 3 · quote under BREAKPOINT
  const name = o.name.trim() || 'Your name', company = o.company.trim();
  const quote = `“I’m going,” says ${name}${company ? ` of ${company}` : ''}, as London braces itself for Nov 15–17`;
  const q = fitText(ctx, quote, s => `italic ${s}px ${news}`, QUOTE.w - 16, QUOTE.h, 2, 72);
  ctx.font = `italic ${q.size}px ${news}`; ctx.fillStyle = INK; ctx.textBaseline = 'top';
  let y = QUOTE.y + (QUOTE.h - q.size * 1.18 * q.lines.length) / 2;
  for (const line of q.lines) { ctx.fillText(line, QUOTE.x + 8, y); y += q.size * 1.18; }

  // 4 · photo caption and credit
  const cap = `${name}${company ? ` (${company})` : ''}, pictured yesterday`;
  const cf = fitText(ctx, cap, s => `italic ${s}px ${news}`, CAPTION.w - 26, 60, 1, 44);
  ctx.font = `italic ${cf.size}px ${news}`; ctx.fillText(cap, CAPTION.x + 6, CAPTION.y + 8);
  if (o.handle) {
    ctx.font = `30px ${news}`; ctx.fillStyle = '#5f5a54';
    ctx.fillText(`PHOTO: @${o.handle.toUpperCase()}`, CAPTION.x + 6, CAPTION.y + 70);
  }
  return true;
}
