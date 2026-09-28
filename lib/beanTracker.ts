'use client';

import { BEANS_PER_MINUTE, MAX_PER_REQUEST } from './beanLimits';

// Counts beans spilt in this browser and sends them to /api/beans in small batches.
// Beans over the per-minute allowance are still drawn on screen, they just don't count.
const FLUSH_MS = 3000;
const MINE_KEY = 'cyl-beans-mine-v2'; // v2: resets the old uncapped personal counts
let windowStart = 0, usedThisMinute = 0;

let pending = 0;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<(mine: number) => void>();

function readMine() { try { return Number(localStorage.getItem(MINE_KEY)) || 0; } catch { return 0; } }
let mine = typeof window === 'undefined' ? 0 : readMine();

function flush() {
  timer = null;
  if (!pending) return;
  const n = pending; pending = 0;
  fetch('/api/beans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ n }), keepalive: true }).catch(() => {});
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
}

// Auto-clickers tap on a near-perfect beat; people don't. Keep the gaps between recent taps
// and stop counting while they're suspiciously even (or impossibly fast).
const gaps: number[] = [];
let lastTap = 0;
export function isHumanTap(now = performance.now()) {
  const gap = lastTap ? now - lastTap : Infinity;
  lastTap = now;
  if (gap < 60) return false;                        // > ~16 taps a second
  if (gap < 3000) { gaps.push(gap); if (gaps.length > 20) gaps.shift(); } else gaps.length = 0;
  if (gaps.length < 12) return true;
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const sd = Math.sqrt(gaps.reduce((a, b) => a + (b - mean) ** 2, 0) / gaps.length);
  return sd / mean > 0.08;                           // humans vary far more than 8%
}

export function spillBeans(n: number) {
  const now = Date.now();
  if (now - windowStart >= 60_000) { windowStart = now; usedThisMinute = 0; }
  n = Math.min(n, BEANS_PER_MINUTE - usedThisMinute);
  if (n <= 0) return;
  usedThisMinute += n;
  pending += n;
  mine += n;
  try { localStorage.setItem(MINE_KEY, String(mine)); } catch {}
  listeners.forEach(l => l(mine));
  if (pending >= MAX_PER_REQUEST) flushBeans();
  else if (!timer) timer = setTimeout(flush, FLUSH_MS);
}

export function flushBeans() { if (timer) clearTimeout(timer); flush(); }
export function myBeans() { return mine; }
export function onMyBeans(l: (mine: number) => void) { listeners.add(l); return () => { listeners.delete(l); }; }
