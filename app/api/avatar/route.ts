// Fetches an X profile photo server-side so "Pull from X" doesn't depend on each visitor's
// own rate limit with a third-party service. Responses are cached at Vercel's edge per handle.
import { withinDailyLimit } from '@/lib/beanStore';
import { visitorOf } from '@/lib/visitor';

const HANDLE = /^[A-Za-z0-9_]{1,15}$/;
// Cached handles never reach this code, so this only counts fresh lookups. Real people won't get close.
const PULLS_PER_DAY = 1000;
const TIMEOUT = 6000;

async function fromFxTwitter(h: string) {
  const r = await fetch(`https://api.fxtwitter.com/${h}`, { signal: AbortSignal.timeout(TIMEOUT) });
  if (!r.ok) return null;
  const url: string | undefined = (await r.json())?.user?.avatar_url;
  // X serves a 48px "_normal" image by default; ask for the 400px one.
  return url ? url.replace(/_normal(\.\w+)$/, '_400x400$1') : null;
}

async function fetchImage(url: string) {
  const r = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
  const type = r.headers.get('content-type') || '';
  return r.ok && type.startsWith('image/') ? { body: await r.arrayBuffer(), type } : null;
}

export async function GET(req: Request) {
  const h = new URL(req.url).searchParams.get('h') || '';
  if (!HANDLE.test(h)) return new Response('Bad handle', { status: 400 });
  if (!(await withinDailyLimit('avatar', visitorOf(req), PULLS_PER_DAY))) {
    return new Response('Too many lookups today', { status: 429, headers: { 'Cache-Control': 'no-store' } });
  }

  let img = null;
  try { const url = await fromFxTwitter(h); if (url) img = await fetchImage(url); } catch {}
  if (!img) { try { img = await fetchImage(`https://unavatar.io/x/${h}?fallback=false`); } catch {} }
  if (!img) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'public, s-maxage=600' } });

  return new Response(img.body, {
    headers: { 'Content-Type': img.type, 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
