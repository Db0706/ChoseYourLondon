'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { COLOURS, LANDMARKS, type EpisodeInfo, countdown, episodeInfo, fmtDate, pad } from '@/lib/cyl-card';
import { LUMA_URL, WATCH_URL } from '@/lib/config';
import { useCardStudio } from '@/lib/useCardStudio';
import s from './Night.module.css';

export default function Night() {
  const st = useCardStudio({ landmarkId: 'royal-exchange', colourIdx: 0 });
  const [drawer, setDrawer] = useState(false);
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
      <header className={s.header}>
        <a href="#top" aria-label="Choose Your London" className={s.logoSmall}><img src="/assets/cyl-logo.png" alt="Choose Your London" className={`${s.logoImg} ${s.logoWhite}`} /></a>
        <div className={s.kicker}>Solana Breakpoint · Olympia London · 15–17 Nov 2026</div>
        <nav className={s.nav}>
          <button type="button" onClick={openDrawer} className={s.episodesBtn}>Episodes<span className={s.liveDot} /></button>
          <a href="#studio" className={s.navCta}>Make yours</a>
        </nav>
      </header>

      <section className={s.hero}>
        <img src="/assets/royal-exchange.jpg" alt="Choose Your London over the Royal Exchange at dusk" className={s.heroImg} />
        <div className={s.heroShade} />
        <div className={s.heroBottom}>
          <a href="#intro" className={s.scrollCue}><span className={s.red}>A Superteam UK campaign</span><span>Scroll to make your card ↓</span></a>
          <button type="button" onClick={openDrawer} className={s.heroChip}>
            <span className={s.chipTitle}><span className={s.dot} />{heroChipTitle}</span>
            <span className={s.chipCount}>{count}</span>
            <span className={s.chipSub}>Solana Ecosystem Call, then X</span>
          </button>
        </div>
      </section>

      <section id="intro" className={s.intro}>
        <h1 className={s.h1}>Everyone’s coming to London. <em>Pick your corner of it.</em></h1>
        <div className={s.introSide}>
          <p className={s.introText}>Choose a landmark, add your community, download the card. Then post it and tag the friend who still hasn’t booked.</p>
          <div className={s.btnRow}>
            <a href="#studio" className={s.primary}>Make your card</a>
            <button type="button" onClick={openDrawer} className={s.secondary}>Watch the series</button>
          </div>
        </div>
      </section>

      <section id="studio" className={s.studio}>
        <div className={s.studioHead}>
          <h2 className={s.h2}>The card <em>studio</em></h2>
          <p className={s.studioIntro}>Three steps. It all happens in your browser, and nothing gets posted until you post it.</p>
        </div>

        <div className={s.studioRow}>
          <div className={s.controls}>
            <div className={s.step}>
              <div className={s.stepLabel}><span className={s.red}>01</span>Who’s choosing</div>
              <div className={s.handleRow}>
                <label className={s.field}>
                  <span className={s.fieldLabel}>X handle</span>
                  <span className={s.handleBox}>
                    <span className={s.at}>@</span>
                    <input value={st.handle} onChange={st.onHandle} onKeyDown={st.onHandleKey} placeholder="SuperteamUK" spellCheck={false} className={s.handleInput} />
                  </span>
                </label>
                <button type="button" onClick={st.pull} className={s.ghostBtn}>Pull from X</button>
              </div>
              <label className={s.nameField}>
                <span className={s.fieldLabel}>Name on the card</span>
                <input value={st.name} onChange={st.onName} placeholder="Superteam UK" className={s.nameInput} />
              </label>
              <div className={s.uploads}>
                <label className={s.upload}>Upload logo or photo<input type="file" accept="image/*" onChange={st.onAvatarFile} className={s.hidden} /></label>
                <span className={s.muted}>{st.status}</span>
              </div>
            </div>

            <div className={s.stepTight}>
              <div className={s.stepLabelSplit}><span className={s.stepLabelLeft}><span className={s.red}>02</span>Your landmark</span><span>{LANDMARKS.length} stops</span></div>
              <div className={s.landmarkGrid}>
                {LANDMARKS.map((lm, i) => {
                  const on = lm.id === st.landmarkId;
                  return (
                    <button key={lm.id} type="button" onClick={() => st.pickLandmark(lm.id)} aria-pressed={on} className={s.landmark} style={{ color: on ? '#F2140F' : '#F3EFE7' }}>
                      <span className={s.lmNum}>{pad(i + 1)}</span>
                      <span className={s.lmText}>
                        <span className={s.lmName} style={{ fontStyle: on ? 'italic' : 'normal' }}>{lm.name}</span>
                        <span className={s.lmArea}>{lm.area}{lm.photo && <span className={s.lmPhoto}>· photo</span>}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className={s.photoRow}>
                <label className={s.photoUpload}>Use your own landmark photo<input type="file" accept="image/*" onChange={st.onPhotoFile} className={s.hidden} /></label>
                <span>Otherwise it prints as a colour card.</span>
              </div>
            </div>

            <div className={s.stepTight}>
              <div className={s.stepLabel}><span className={s.red}>03</span>Colour</div>
              <div className={s.swatches}>
                {COLOURS.map((c, i) => (
                  <button key={c.hex} type="button" onClick={() => st.pickColour(i)} title={c.name} aria-label={c.name} className={s.swatch}
                    style={{ background: c.hex, boxShadow: i === st.colourIdx ? '0 0 0 3px #0A0A0C, 0 0 0 5px #F3EFE7' : 'none' }} />
                ))}
                <button type="button" onClick={st.shuffle} className={s.smallBtn}>Shuffle</button>
                <span className={s.colourName}>{st.colour.name}</span>
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
              <button type="button" onClick={st.download} className={s.primary}>Download card (PNG)</button>
              <button type="button" onClick={st.post} className={s.secondary}>Post on X, then attach it</button>
            </div>
            <p className={s.note}>Preview. The download is the full 2400 × 1350 image. Unofficial and just for fun, your photo never leaves your browser.</p>
          </div>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.logoBig}><img src="/assets/cyl-logo.png" alt="Choose Your London" className={s.logoImg} /></div>
        <div className={s.footerRow}>
          <span>A Superteam UK campaign for Solana Breakpoint 2026 · Unofficial</span>
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
          <h3 className={s.h3}>Five weeks, five skits, one very long commute to <em>Breakpoint.</em></h3>
          <p className={s.drawerText}>A satirical weekly series telling the London story. Each episode premieres on the Solana Ecosystem Call, then lands on X.</p>
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
                    filter: e.out ? 'none' : 'blur(5px) brightness(.4) saturate(.5)',
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
