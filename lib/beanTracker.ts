'use client';

// Counts beans spilt in this browser and sends them to /api/beans in small batches.
const FLUSH_MS = 3000;
const MINE_KEY = 'cyl-beans-mine';

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

export function spillBeans(n: number) {
  pending += n;
  mine += n;
  try { localStorage.setItem(MINE_KEY, String(mine)); } catch {}
  listeners.forEach(l => l(mine));
  if (!timer) timer = setTimeout(flush, FLUSH_MS);
}

export function flushBeans() { if (timer) clearTimeout(timer); flush(); }
export function myBeans() { return mine; }
export function onMyBeans(l: (mine: number) => void) { listeners.add(l); return () => { listeners.delete(l); }; }
