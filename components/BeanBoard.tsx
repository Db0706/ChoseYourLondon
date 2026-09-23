'use client';

import { useCallback, useEffect, useState } from 'react';
import { flushBeans, myBeans, onMyBeans } from '@/lib/beanTracker';
import s from './BeanBoard.module.css';

type Row = { id: string; name: string; flag: string; beans: number };
type Board = { total: number; board: Row[]; you: { id: string; name: string; flag: string } };

const fmt = (n: number) => n.toLocaleString('en-GB');

// The little bean hiding under the logo, and the leaderboard it opens.
export default function BeanBoard() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Board | null>(null);
  const [mine, setMine] = useState(0);

  useEffect(() => { setMine(myBeans()); return onMyBeans(setMine); }, []);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/beans', { cache: 'no-store' });
      if (r.ok) setData(await r.json());
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    flushBeans();
    const first = setTimeout(load, 300); // let the flushed beans land first
    const t = setInterval(load, 4000);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); } };
    window.addEventListener('keydown', onKey, true);
    return () => { clearTimeout(first); clearInterval(t); window.removeEventListener('keydown', onKey, true); };
  }, [open, load]);

  const max = Math.max(1, ...(data?.board.map(r => r.beans) || [0]));

  return (
    <>
      <button type="button" className={s.bean} onClick={() => setOpen(true)} aria-label="Bean leaderboard" title="🫘">
        <svg viewBox="0 0 24 16" width="18" height="12" aria-hidden>
          <ellipse cx="12" cy="8" rx="11" ry="7.2" fill="#D8661F" />
          <ellipse cx="12" cy="1.6" rx="3.6" ry="2" fill="rgba(90,25,5,.4)" />
          <ellipse cx="8.4" cy="9.4" rx="3.8" ry="1.8" fill="rgba(255,235,210,.6)" transform="rotate(-16 8.4 9.4)" />
        </svg>
      </button>

      <div className={s.overlay} data-open={open} onClick={() => setOpen(false)} />
      <div role="dialog" aria-modal="true" aria-label="The Great Bean Spill" className={s.modal} data-open={open} inert={!open}>
        <div className={s.head}>
          <span className={s.kicker}><span className={s.dot} />Classified · bean division</span>
          <button type="button" className={s.close} onClick={() => setOpen(false)} aria-label="Close leaderboard">Close</button>
        </div>
        <h3 className={s.title}>The Great <em>Bean Spill</em></h3>
        <p className={s.lede}>
          Every click on this site spills beans. They count for your local Superteam, so click for your country.
          {data && <> You&rsquo;re spilling for <strong>{data.you.flag} {data.you.name}</strong>.</>}
        </p>

        <div className={s.stats}>
          <div className={s.stat}><span className={s.statLabel}>Beans spilt worldwide</span><span className={s.statNum}>{data ? fmt(data.total) : '···'}</span></div>
          <div className={s.stat}><span className={s.statLabel}>Spilt by you</span><span className={s.statNum}>{fmt(mine)}</span></div>
        </div>

        <ol className={s.list}>
          {(data?.board || []).map((r, i) => (
            <li key={r.id} className={s.row} data-you={data?.you.id === r.id}>
              <span className={s.rank}>{String(i + 1).padStart(2, '0')}</span>
              <span className={s.flag}>{r.flag}</span>
              <span className={s.team}>
                <span className={s.name}>{r.name}</span>
                <span className={s.bar}><span style={{ width: `${(r.beans / max) * 100}%` }} /></span>
              </span>
              <span className={s.count}>{fmt(r.beans)}</span>
            </li>
          ))}
        </ol>
        <p className={s.foot}>Country comes from your connection, and nothing personal is stored. Not in the list? You&rsquo;re Rest of the world.</p>
      </div>
    </>
  );
}
