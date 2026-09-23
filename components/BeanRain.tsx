'use client';

import { useEffect, useRef } from 'react';

// A one-off shower of baked beans when the page loads. Purely decorative.
const COUNT = 140;          // beans in the shower
const SPAWN_MS = 2200;      // how long new beans keep appearing
const SETTLE_MS = 2600;     // how long they sit on the floor before fading
const FADE_MS = 900;
const SHADES = ['#C9561B', '#D8661F', '#B94A15', '#E07328'];

type Bean = {
  x: number; y: number; vx: number; vy: number;
  a: number; va: number; r: number; shade: string;
  born: number; landed: number | null;
};

export default function BeanRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const start = performance.now();
    const beans: Bean[] = Array.from({ length: COUNT }, () => {
      const r = 7 + Math.random() * 5;
      return {
        x: Math.random() * w, y: -20 - Math.random() * 120,
        vx: (Math.random() - 0.5) * 80, vy: 60 + Math.random() * 140,
        a: Math.random() * Math.PI * 2, va: (Math.random() - 0.5) * 8,
        r, shade: SHADES[(Math.random() * SHADES.length) | 0],
        born: start + Math.random() * SPAWN_MS, landed: null,
      };
    });

    const drawBean = (b: Bean) => {
      ctx.save();
      ctx.translate(b.x, b.y); ctx.rotate(b.a);
      const rx = b.r * 1.35, ry = b.r;
      // kidney-ish body
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = b.shade; ctx.fill();
      // the little dent on one side
      ctx.beginPath();
      ctx.ellipse(0, -ry * 0.95, rx * 0.35, ry * 0.28, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(90,25,5,.35)'; ctx.fill();
      // saucy shine
      ctx.beginPath();
      ctx.ellipse(-rx * 0.3, ry * 0.15, rx * 0.35, ry * 0.22, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,235,210,.55)'; ctx.fill();
      ctx.restore();
    };

    let raf = 0, last = start;
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const b of beans) {
        if (now < b.born) { alive++; continue; }
        let alpha = 1;
        if (b.landed !== null) {
          const t = now - b.landed - SETTLE_MS;
          if (t > FADE_MS) continue;
          if (t > 0) alpha = 1 - t / FADE_MS;
        }
        alive++;
        b.vy += 1400 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt;
        const floor = h - b.r;
        if (b.y > floor) {
          b.y = floor;
          if (Math.abs(b.vy) > 120) { b.vy *= -0.38; b.vx *= 0.7; b.va *= 0.6; }
          else { b.vy = 0; b.vx *= 0.85; b.va *= 0.8; if (b.landed === null) b.landed = now; }
        }
        ctx.globalAlpha = alpha; drawBean(b); ctx.globalAlpha = 1;
      }
      if (alive) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} aria-hidden style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 70, pointerEvents: 'none' }} />;
}
