'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { LANDMARKS, type EpisodeInfo, countdown, episodeInfo, fmtDate, pad } from '@/lib/cyl-card';
import { LUMA_URL, WATCH_URL } from '@/lib/config';
import { useCardStudio } from '@/lib/useCardStudio';
import BeanBoard from './BeanBoard';
import BeanRain from './BeanRain';
import s from './Night.module.css';

export default function Night() {
  const st = useCardStudio();
  const [drawer, setDrawer] = useState(false);
  // Name flicker while shuffling, like a departure board.
  const [rolling, setRolling] = useState<string | null>(null);
  const shuffle = () => {
    if (rolling) return;
    let n = 0;
    const t = setInterval(() => {
      if (++n > 8) { clearInterval(t); setRolling(null); st.shuffleLandmark(); return; }
      setRolling(LANDMARKS[Math.floor(Math.random() * LANDMARKS.length)].name);
    }, 70);
  };
  const openDrawer = () => setDrawer(true);
  const closeDrawer = () => setDrawer(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const now = st.now === null ? null : new Date(st.now);
  const info: EpisodeInfo = now ? episodeInfo(now) : { list: [], next: null };
  const next = info.next;
  const anyOut = info.list.some(e => e.out);

  const tabLabel = !now ? '' : next && next.n === 1 ? 'Premieres ' + fmtDate(next.date) : 'EP ' + pad(next ? next.n - 1 : 5) + ' out now';
  const heroChipTitle = !now ? '' : !next ? 'All five episodes out now' : next.n === 1 ? 'EP 01 premieres ' + fmtDate(next.date) : 'EP ' + pad(next.n) + ' drops ' + fmtDate(next.date);
  const count = !now ? '' : next ? countdown(next.date.getTime() - now.getTime()) : (anyOut ? 'Binge away' : '');
  const nextLabel = next ? 'EP ' + pad(next.n) : 'All out';
  const nextDate = next ? fmtDate(next.date) : '';

  return (
    <div id="top" className={s.root} data-theme="night">
      <BeanRain />
      <header className={s.header}>
        <div className={s.brand}>
          <a href="#top" aria-label="Superteam UK" className={s.logoSmall}><img src="/assets/stuk-logo-white.png" alt="Superteam UK" className={s.stukLogo} /></a>
          <BeanBoard />
        </div>
        <div className={s.kicker}>Solana Breakpoint · Olympia London · 15–17 Nov 2026</div>
        <nav className={s.nav}>
          <button type="button" onClick={openDrawer} className={s.episodesBtn}>Episodes<span className={s.liveDot} /></button>
          <a href="#studio" className={s.navCta}>Choose yours</a>
        </nav>
      </header>

      <section className={s.hero}>
        <img src="/assets/hero-big-ben-red.jpg" alt="Choose Your London in red over Big Ben and the Houses of Parliament" className={s.heroImg} />
        <div className={s.heroShade} />
        <div className={s.heroBottom}>
          <a href="#intro" className={s.scrollCue}><span className={s.red}>A Superteam UK campaign</span><span>Scroll to make your card ↓</span></a>
          <button type="button" onClick={openDrawer} className={s.heroChip}>
            <span className={s.chipTitle}><span className={s.dot} />{heroChipTitle}</span>
            <span className={s.chipCount}>{count}</span>
            <span className={s.chipSub}>Every Thursday · 4PM BST on X</span>
          </button>
        </div>
      </section>

      <section id="intro" className={s.intro}>
        <h1 className={s.h1}>Everyone’s coming to London. <em>Pick your corner of it.</em></h1>
        <div className={s.introSide}>
          <p className={s.introText}>London picks your stop, you add your community, then download the card. Then post it and tag the friend who still hasn’t booked.</p>
          <div className={s.btnRow}>
            <a href="#studio" className={s.primary}>Make your card</a>
            <button type="button" onClick={openDrawer} className={s.secondary}>Watch the series</button>
          </div>
        </div>
      </section>

      <section id="studio" className={s.studio}>
        <div className={s.studioRow}>
          <div className={s.controls}>
            <div className={s.step}>
              <div className={s.handleRow}>
                <label className={s.field}>
                  <span className={s.fieldLabel}>Your X handle</span>
                  <span className={s.handleBox}>
                    <span className={s.at}>@</span>
                    <input value={st.handle} onChange={st.onHandle} onKeyDown={st.onHandleKey} placeholder="SuperteamUK" spellCheck={false} className={s.handleInput} />
                  </span>
                </label>
                <button type="button" onClick={st.pull} className={s.ghostBtn}>Pull from X</button>
              </div>
              <label className={s.nameField}>
                <span className={s.fieldLabel}>Name</span>
                <input value={st.name} onChange={st.onName} placeholder="Your name" className={s.nameInput} />
              </label>
              <label className={s.nameField}>
                <span className={s.fieldLabel}>Company/community or title</span>
                <input value={st.company} onChange={st.onCompany} placeholder="Superteam UK" className={s.nameInput} />
              </label>
              <div className={s.uploads}>
                <label className={s.upload}>Upload logo or photo<input type="file" accept="image/*" onChange={st.onAvatarFile} className={s.hidden} /></label>
                <span className={s.muted}>{st.status}</span>
              </div>
            </div>

            <div className={s.stepTight}>
              <div className={s.stopRow}>
                {st.landmark && !rolling
                  ? <span className={s.stopThumb} style={{ backgroundImage: `url(${st.landmark.thumb})` }} />
                  : <span className={`${s.stopThumb} ${s.stopMystery}`}>?</span>}
                <span className={s.stopText}>
                  <span className={s.stopKicker}>{st.landmark ? 'London picked' : 'Mystery stop'}</span>
                  <span className={s.stopName}>{rolling ?? st.landmark?.name ?? '???'}</span>
                  <span className={s.stopArea}>{rolling ? '· · ·' : st.landmark?.area ?? 'Let London choose for you'}</span>
                </span>
                <button type="button" onClick={shuffle} disabled={!!rolling} className={st.landmark ? s.ghostBtn : s.chooseBtn}>{st.landmark ? 'Shuffle Innit ↻' : 'Choose Innit'}</button>
              </div>
            </div>

          </div>

          <div className={s.preview}>
            <div>
              <div className={s.frame}>
                <canvas ref={st.canvasRef} width={2400} height={1350} className={s.canvas} />
              </div>
            </div>
            <div className={s.btnRow}>
              <button type="button" onClick={st.download} disabled={!st.landmark} className={s.primary}>Download card (PNG)</button>
              <button type="button" onClick={st.post} disabled={!st.landmark} className={s.secondary}>Post on X, then attach it</button>
            </div>
            <p className={s.note}>{st.landmark
              ? 'Preview. The download is the full 2400 × 1350 image. Your photo never leaves your browser.'
              : 'Hit Choose Innit to find out where London sends you, then download your card.'}</p>
          </div>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.logoBig}><img src="/assets/cyl-logo.png" alt="Choose Your London" className={s.logoImg} /></div>
        <div className={s.footerRow}>
          <span>A Superteam UK campaign for Solana Breakpoint 2026 · <a href="https://dub.sh/chooselondoninnit" target="_blank" rel="noopener" className={s.ticketLink}>Get your tickets</a></span>
          <span>Built by <a href="https://x.com/deandev10" target="_blank" rel="noopener" className={s.footerLink}>@deandev10</a> for <a href="https://x.com/SuperteamUK" target="_blank" rel="noopener" className={s.footerLink}>Superteam UK</a></span>
        </div>
      </footer>

      <button type="button" onClick={openDrawer} className={s.sideTab}>Episodes · {tabLabel}</button>

      <div onClick={closeDrawer} className={s.overlay} style={{ opacity: drawer ? 1 : 0, pointerEvents: drawer ? 'auto' : 'none' }} />
      <aside aria-label="Episodes" inert={!drawer} className={s.drawer} style={{ transform: drawer ? 'translateX(0)' : 'translateX(105%)' }}>
        <div className={s.drawerHead}>
          <span className={s.drawerKicker}><span className={s.dot} />The series</span>
          <button type="button" onClick={closeDrawer} aria-label="Close episodes" className={s.closeBtn}>Close</button>
        </div>
        <div className={s.drawerBody}>
          <h3 className={s.h3}>Watch the <em>Choose Your London</em> Skits Series</h3>
          <p className={s.drawerText}>A satirical series featuring 5 exclusive episodes, all telling the story of ‘Why London?’</p>
          <p className={s.drawerText}>1 episode drops every week for the next 5 weeks.</p>
          <p className={s.drawerText}>Be the first to watch each premiere episode.</p>
          <div className={s.nextBox}>
            <span className={s.nextLabel}>Next up · {nextLabel} · {nextDate}</span>
            <span className={s.nextCount}>{count}</span>
          </div>
          <div className={s.epList}>
            {info.list.map(e => (
              <a key={e.n} href={e.out ? WATCH_URL : LUMA_URL} target="_blank" rel="noopener" className={s.ep}>
                <span className={s.thumb}>
                  <span className={s.thumbImg} style={{
                    backgroundImage: e.n % 2 ? 'url(/assets/royal-exchange.jpg)' : 'url(/assets/somerset-house.jpg)',
                    filter: 'blur(5px) brightness(.4) saturate(.5)', // thumbnails stay hidden
                  }} />
                  <span className={s.thumbNum}>EP {pad(e.n)}</span>
                </span>
                <span className={s.epText}>
                  <span className={s.epTitle}>{e.title}</span>
                  <span className={s.epDate}>{e.dateLabel}</span>
                  <span className={s.chip} style={{
                    background: e.out ? '#F2140F' : e.isNext ? '#F3EFE7' : 'rgba(243,239,231,.08)',
                    color: e.out ? '#fff' : e.isNext ? '#0A0A0C' : '#9C978F',
                  }}>{e.out ? 'Out now' : e.isNext ? 'Up next · notify me' : 'Locked'}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className={s.drawerFoot}>
          <a href={LUMA_URL} target="_blank" rel="noopener" className={s.lumaBtn}>Get notified on Luma</a>
          <span className={s.drawerNote}>Be first to watch every drop.</span>
        </div>
      </aside>
    </div>
  );
}
