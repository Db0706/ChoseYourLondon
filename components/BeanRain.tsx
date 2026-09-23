'use client';

import { useEffect, useRef } from 'react';
import { spillBeans } from '@/lib/beanTracker';

// Every click/tap pops a few baked beans out of the cursor. Purely decorative.
const MIN_BEANS = 3, MAX_BEANS = 6;
const GRAVITY = 1500;
const SHADES = ['#C9561B', '#D8661F', '#B94A15', '#E07328'];

type Bean = { x: number; y: number; vx: number; vy: number; a: number; va: number; r: number; shade: string };

export default function BeanRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const drawBean = (b: Bean) => {
      ctx.save();
      ctx.translate(b.x, b.y); ctx.rotate(b.a);
      const rx = b.r * 1.35, ry = b.r;
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = b.shade; ctx.fill();
      // the little dent on one side
      ctx.beginPath(); ctx.ellipse(0, -ry * 0.95, rx * 0.35, ry * 0.28, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(90,25,5,.35)'; ctx.fill();
      // saucy shine
      ctx.beginPath(); ctx.ellipse(-rx * 0.3, ry * 0.15, rx * 0.35, ry * 0.22, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,235,210,.55)'; ctx.fill();
      ctx.restore();
    };

    let beans: Bean[] = [];
    let raf = 0, last = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, w, h);
      beans = beans.filter(b => b.y < h + 30);
      for (const b of beans) {
        b.vy += GRAVITY * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt;
        drawBean(b);
      }
      raf = beans.length ? requestAnimationFrame(tick) : 0;
    };

    const onDown = (e: PointerEvent) => {
      const n = MIN_BEANS + Math.floor(Math.random() * (MAX_BEANS - MIN_BEANS + 1));
      for (let i = 0; i < n; i++) {
        beans.push({
          x: e.clientX, y: e.clientY,
          vx: (Math.random() - 0.5) * 260, vy: -120 - Math.random() * 260,
          a: Math.random() * Math.PI * 2, va: (Math.random() - 0.5) * 14,
          r: 6 + Math.random() * 4, shade: SHADES[(Math.random() * SHADES.length) | 0],
        });
      }
      spillBeans(n);
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    window.addEventListener('pointerdown', onDown, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 90, pointerEvents: 'none' }} />;
}
