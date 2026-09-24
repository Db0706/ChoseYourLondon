'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { CARD_COLOUR, LANDMARKS, MYSTERY, MYSTERY_COLOUR, randomLandmark, loadImage, renderCard } from './cyl-card';
import { SITE_URL } from './config';
import { cardFonts } from './fonts';

// Shown in the avatar circle until someone pulls from X or uploads their own.
const DEFAULT_PFP = '/assets/default-pfp.jpg';

const cleanHandle = (v: string) => v.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '').replace(/^@/, '').replace(/[^A-Za-z0-9_]/g, '').slice(0, 15);

export function useCardStudio() {
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  // null = still a mystery; set when they press "Choose Innit".
  const [landmarkId, setLandmarkId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  // null until mounted so server and client render the same markup.
  const [now, setNow] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tok = useRef(0);
  const blob = useRef<Blob | null>(null);
  // Set when a phone can't open the share sheet: the card is shown on the page to press-and-hold.
  const [saveUrl, setSaveUrl] = useState<string | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const landmark = LANDMARKS.find(l => l.id === landmarkId) || null;
  const cardName = name.trim() || handle || 'Your name';

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const t = ++tok.current;
    blob.current = null;
    renderCard(c, { landmark: landmark || MYSTERY, colour: landmark ? CARD_COLOUR : MYSTERY_COLOUR, name: cardName, handle, company, avatar: avatar || DEFAULT_PFP, fonts: cardFonts, isCurrent: () => t === tok.current })
      // Keep a ready-made PNG so a tap on Download can open the share sheet straight away
      // (phones only allow that while the tap is still "fresh").
      .then(drawn => { if (drawn && landmark) c.toBlob(b => { if (t === tok.current) blob.current = b; }, 'image/png'); });
  }, [landmark, cardName, handle, company, avatar]);

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

  const onAvatarFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { setAvatar(r.result as string); setStatus('Logo added.'); };
    r.readAsDataURL(f); e.target.value = '';
  };

  // Desktop: normal file download. Phones and in-app browsers (Telegram, X, Instagram…) often
  // ignore that and open the image as a new page, so there we use the share sheet ("Save Image"),
  // or show the image on this page to press-and-hold, instead of sending people away.
  const download = async () => {
    const c = canvasRef.current; if (!landmark || !c) return;
    const filename = `choose-your-london-${landmark.id}.png`;
    const png = blob.current || await new Promise<Blob | null>(res => c.toBlob(res, 'image/png'));
    if (!png) return;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (touch) {
      const file = new File([png], filename, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file] }); return; }
        catch (e) { if ((e as Error).name === 'AbortError') return; }
      }
      setSaveUrl(URL.createObjectURL(png));
      return;
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(png); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };
  const closeSave = () => { if (saveUrl) URL.revokeObjectURL(saveUrl); setSaveUrl(null); };
  const post = () => {
    if (!landmark) return;
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
    company, onCompany: (e: ChangeEvent<HTMLInputElement>) => setCompany(e.target.value.slice(0, 50)),
    pull, onAvatarFile,
    shuffleLandmark: () => setLandmarkId(p => randomLandmark(p).id),
    download, post, saveUrl, closeSave,
  };
}
