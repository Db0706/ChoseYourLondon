'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { pad } from '@/lib/cyl-card';
import { HEADLINES } from '@/lib/dailyBean';
import s from './HeadlinePicker.module.css';

type Props = { value: string; onChange: (headline: string) => void };

export default function HeadlinePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selectedIdx = Math.max(0, HEADLINES.indexOf(value));
  const [active, setActive] = useState(selectedIdx);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();

  // Close when clicking anywhere else.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const toggle = () => { setActive(selectedIdx); setOpen(o => !o); };
  const choose = (i: number) => { onChange(HEADLINES[i]); setOpen(false); };

  const onKey = (e: KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); setActive(selectedIdx); setOpen(true); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(HEADLINES.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(HEADLINES.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape' || e.key === 'Tab') { if (e.key === 'Escape') e.stopPropagation(); setOpen(false); }
  };

  return (
    <div ref={root} className={s.root}>
      <button type="button" className={s.trigger} onClick={toggle} onKeyDown={onKey}
        aria-haspopup="listbox" aria-expanded={open} aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}>
        <span className={s.num}>{pad(selectedIdx + 1)}</span>
        <span className={s.text}><span className={s.name}>{HEADLINES[selectedIdx]}</span></span>
        <span className={s.chevron} data-open={open} aria-hidden />
      </button>

      <ul ref={list} id={listId} role="listbox" aria-label="Your headline" className={s.list} data-open={open}>
        {HEADLINES.map((h, i) => {
          const on = i === selectedIdx;
          return (
            <li key={h} id={`${listId}-${i}`} role="option" aria-selected={on}
              className={s.option} data-active={i === active} data-selected={on}
              onPointerEnter={() => setActive(i)} onClick={() => choose(i)}>
              <span className={s.num}>{pad(i + 1)}</span>
              <span className={s.text}><span className={s.optName}>{h}</span></span>
              {on && <span className={s.check} aria-hidden>●</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
