'use client';

/* eslint-disable @next/next/no-img-element */
import { COLOURS, LANDMARKS, type EpisodeInfo, countdown, episodeInfo, fmtClock, fmtDate, pad } from '@/lib/cyl-card';
import { LUMA_URL, WATCH_URL } from '@/lib/config';
import { useCardStudio } from '@/lib/useCardStudio';
import s from './Daylight.module.css';

// Set to false to keep the line on the Elizabeth purple regardless of the chosen card colour.
const LINE_FOLLOWS_COLOUR = true;

export default function Daylight() {
  const st = useCardStudio({ landmarkId: 'somerset-house', colourIdx: 1, photoStatus: 'Landmark photo added.' });
  const now = st.now === null ? null : new Date(st.now);
  const info: EpisodeInfo = now ? episodeInfo(now) : { list: [], next: null };
  const next = info.next;
  const lineColour = LINE_FOLLOWS_COLOUR ? st.colour.hex : '#7B2FE0';

  const boardFooter = !now ? '' : next ? `Next: EP ${pad(next.n)} · ${fmtDate(next.date)}` : 'All five episodes out now';
  const tickerText = !now ? '' : next ? `EP ${pad(next.n)} in ${countdown(next.date.getTime() - now.getTime(), true)}` : 'All episodes out';

  return (
    <div id="top" className={s.root} data-theme="day">
      <header className={s.header}>
        <div className={s.brand}>
          <a href="#top" aria-label="Choose Your London" className={s.logoSmall}><img src="/assets/cyl-logo.png" alt="Choose Your London" className={s.logoImg} /></a>
          <span className={s.kicker}>Superteam UK × Solana Breakpoint 2026</span>
        </div>
        <nav className={s.nav}>
          <a href="#line">The line</a>
          <a href="#departures">Departures</a>
          <a href={LUMA_URL} target="_blank" rel="noopener" className={s.navCta}>Get notified</a>
        </nav>
      </header>

      <section className={s.masthead}>
        <div className={s.dateline}>
          <span>The London Edition · No. 01</span>
          <span>Olympia London · 15–17 November 2026</span>
          <span>Price: free, obviously</span>
        </div>
        <div className={s.logoBig}>
          <img src="/assets/cyl-logo.png" alt="Choose Your London" className={s.logoImg} />
        </div>
        <div className={s.standfirst}>
          <p className={s.lede}>Eight thousand people are coming to London this November. <em>Claim your corner of it</em> before someone else does.</p>
          <a href="#line" className={s.ledeCta}>Pick your stop ↓</a>
        </div>
      </section>

      <section id="line" className={s.line}>
        <div className={s.lineHead}>
          <h2 className={s.h2}><span className={s.h2Num}>01</span>Pick your stop</h2>
          <span className={s.scrollHint}>Scroll the line →</span>
        </div>
        <div className={s.lineScroll}>
          <div className={s.lineTrack}>
            <div className={s.lineBar} style={{ background: lineColour }} />
            {LANDMARKS.map((lm, i) => {
              const on = lm.id === st.landmarkId;
              const dot = on ? 40 : 28;
              return (
                <button key={lm.id} type="button" className={s.stop} onClick={() => st.pickLandmark(lm.id)} aria-pressed={on}>
                  <span className={s.stopNum}>{pad(i + 1)}{lm.photo && <span className={s.stopPhoto}>· photo</span>}</span>
                  <span className={s.stopDotWrap}><span className={s.stopDot} style={{ width: dot, height: dot, background: on ? '#E3120B' : '#FFFFFF' }} /></span>
                  <span className={s.stopName} style={{ fontStyle: on ? 'italic' : 'normal', color: on ? '#E3120B' : '#16140F' }}>{lm.name}</span>
                  <span className={s.stopArea}>{lm.area}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="studio" className={s.studio}>
        <div className={s.studioRow}>
          <div className={s.preview}>
            <div className={s.frame}>
              <canvas ref={st.canvasRef} width={2400} height={1350} className={s.canvas} />
            </div>
            <div className={s.previewMeta}>
              <span>Live preview · download is 2400 × 1350</span>
              <span className={s.previewNow}>Now at: {st.landmark.name}</span>
            </div>
          </div>

          <div className={s.controls}>
            <h2 className={s.h2}><span className={s.h2Num}>02</span>Make it yours</h2>
            <div className={s.handleRow}>
              <label className={s.field}>
                <span className={s.label}>X handle</span>
                <span className={s.handleBox}>
                  <span className={s.at}>@</span>
                  <input value={st.handle} onChange={st.onHandle} onKeyDown={st.onHandleKey} placeholder="SuperteamUK" spellCheck={false} className={s.handleInput} />
                </span>
              </label>
              <button type="button" onClick={st.pull} className={s.ghostBtn}>Pull from X</button>
            </div>
            <label className={s.nameField}>
              <span className={s.label}>Name on the card</span>
              <input value={st.name} onChange={st.onName} placeholder="Superteam UK" className={s.nameInput} />
            </label>
            <div className={s.uploads}>
              <label className={s.upload}>Upload logo or photo<input type="file" accept="image/*" onChange={st.onAvatarFile} className={s.hidden} /></label>
              <label className={s.upload}>Own landmark photo<input type="file" accept="image/*" onChange={st.onPhotoFile} className={s.hidden} /></label>
              <span className={s.status}>{st.status}</span>
            </div>
            <div className={s.colourBlock}>
              <span className={s.label}>Line colour · {st.colour.name}</span>
              <div className={s.swatches}>
                {COLOURS.map((c, i) => (
                  <button key={c.hex} type="button" onClick={() => st.pickColour(i)} title={c.name} aria-label={c.name} className={s.swatch}
                    style={{ background: c.hex, boxShadow: i === st.colourIdx ? '0 0 0 3px #F3EEE4, 0 0 0 5px #16140F' : 'none' }} />
                ))}
                <button type="button" onClick={st.shuffle} className={s.smallBtn}>Shuffle</button>
              </div>
            </div>
            <div className={s.actions}>
              <button type="button" onClick={st.download} className={s.primary}>Download card (PNG)</button>
              <button type="button" onClick={st.post} className={s.secondary}>Post on X</button>
            </div>
            <p className={s.note}>Post, then attach the PNG. Unofficial and just for fun, your photo never leaves your browser.</p>
          </div>
        </div>
      </section>

      <section id="departures" className={s.departures}>
        <div className={s.depInner}>
          <div className={s.depHead}>
            <div className={s.depTitleWrap}>
              <span className={s.depKicker}>03 · The series</span>
              <h2 className={s.depTitle}>Departures</h2>
            </div>
            <p className={s.depBlurb}>Five satirical skits telling the London story, one a week until Breakpoint. Each premieres on the Solana Ecosystem Call, then lands on X. Sign up on Luma and it reaches you first.</p>
          </div>

          <div className={s.board}>
            <div className={s.boardInner}>
              <div className={s.boardTop}>
                <span>Choose Your London Line · Westbound to Olympia</span>
                <span>{now ? 'London ' + fmtClock(now) : ''}</span>
              </div>
              <div className={s.boardCols}>
                <span>Ep</span><span>Title</span><span>Calling at</span><span className={s.right}>Due</span>
              </div>
              {now && info.list.map(e => (
                <div key={e.n} className={s.boardRow} style={{ opacity: e.out || e.isNext ? 1 : 0.62 }}>
                  <span>{pad(e.n)}</span>
                  <span>{e.title}</span>
                  <span className={s.calling}>Ecosystem Call · X</span>
                  <span className={s.right} style={{ color: e.out ? '#FFE08A' : e.isNext ? '#FFB81C' : 'rgba(255,184,28,.75)' }}>
                    {e.out ? 'Now showing' : e.isNext ? countdown(e.date.getTime() - now.getTime(), true) : e.dateLabel}
                  </span>
                </div>
              ))}
              <div className={s.boardFoot}>
                <span>{boardFooter}</span>
                <span>Mind the gap</span>
              </div>
            </div>
          </div>

          <div className={s.depCtas}>
            <a href={LUMA_URL} target="_blank" rel="noopener" className={s.amberBtn}>Get notified on Luma</a>
            <a href={WATCH_URL} target="_blank" rel="noopener" className={s.outlineBtn}>Watch on X</a>
          </div>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.footerRow}>
          <span>A Superteam UK campaign for Solana Breakpoint 2026 · Unofficial</span>
          <span>Built by <a href="https://x.com/deandev10" target="_blank" rel="noopener" className={s.footerLink}>@deandev10</a> for <a href="https://x.com/SuperteamUK" target="_blank" rel="noopener" className={s.footerLink}>Superteam UK</a></span>
        </div>
      </footer>

      <a href="#departures" className={s.ticker}>
        <span className={s.tickerDot} />{tickerText}
      </a>
    </div>
  );
}
