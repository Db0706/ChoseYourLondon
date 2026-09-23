'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { CARD_COLOUR, LANDMARKS, download as downloadCanvas, loadImage, renderCard } from './cyl-card';
import { SITE_URL } from './config';
import { cardFonts } from './fonts';

const cleanHandle = (v: string) => v.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '').replace(/^@/, '').replace(/[^A-Za-z0-9_]/g, '').slice(0, 15);

type Options = { landmarkId: string; photoStatus?: string };

export function useCardStudio({ landmarkId: initialLandmark, photoStatus }: Options) {
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [landmarkId, setLandmarkId] = useState(initialLandmark);
  const [status, setStatus] = useState('');
  // null until mounted so server and client render the same markup.
  const [now, setNow] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tok = useRef(0);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const landmark = LANDMARKS.find(l => l.id === landmarkId) || LANDMARKS[0];
  const cardName = name.trim() || handle || 'Your community';

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const t = ++tok.current;
    renderCard(c, { landmark, colour: CARD_COLOUR, name: cardName, handle, avatar, customPhoto, fonts: cardFonts, isCurrent: () => t === tok.current });
  }, [landmark, cardName, handle, avatar, customPhoto]);

  const pull = useCallback(async () => {
    const h = handle;
    if (!h) { setStatus('Type a handle first.'); return; }
    setStatus('Pulling from X…');
    const src = `https://unavatar.io/x/${h}?fallback=false`;
    try {
      await loadImage(src, true);
      setAvatar(src); setName(p => p || h); setStatus(`Got @${h}’s photo.`);
    } catch {
      setStatus('Couldn’t fetch that one. Upload a logo instead.');
    }
  }, [handle]);

  const readInto = (key: 'avatar' | 'customPhoto') => (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const url = r.result as string;
      if (key === 'avatar') { setAvatar(url); setStatus('Logo added.'); }
      else { setCustomPhoto(url); if (photoStatus) setStatus(photoStatus); }
    };
    r.readAsDataURL(f); e.target.value = '';
  };

  const download = () => { if (canvasRef.current) downloadCanvas(canvasRef.current, `choose-your-london-${landmark.id}.png`); };
  const post = () => {
    const who = name.trim() || (handle ? '@' + handle : 'We');
    const url = SITE_URL || location.href.split('#')[0];
    const text = `${who} chose ${landmark.name}.\n\nChoose your London. See you at Solana Breakpoint, 15–17 Nov.\n\n(make yours: ${url})`;
    window.open('https://x.com/intent/tweet?text=' + encodeURIComponent(text), '_blank', 'noopener');
  };

  return {
    handle, name, status, now, landmark, landmarkId, canvasRef,
    onHandle: (e: ChangeEvent<HTMLInputElement>) => setHandle(cleanHandle(e.target.value)),
    onHandleKey: (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') pull(); },
    onName: (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value.slice(0, 40)),
    pull, onAvatarFile: readInto('avatar'), onPhotoFile: readInto('customPhoto'),
    pickLandmark: (id: string) => { setLandmarkId(id); setCustomPhoto(null); },
    download, post,
  };
}
