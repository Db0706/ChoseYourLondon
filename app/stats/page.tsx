import type { Metadata } from 'next';
import { readBeans, readVisits } from '@/lib/beanStore';
import { REST_OF_WORLD, TEAMS } from '@/lib/teams';
import { isSignedIn, signIn, signOut } from './auth';
import s from './stats.module.css';

// Private stats page at /stats, behind the STATS_KEY password (set in Vercel's environment variables).
export const metadata: Metadata = { title: 'Stats · Choose Your London', robots: { index: false, follow: false } };

const fmt = (n: number) => n.toLocaleString('en-GB');
const dayLabel = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

export default async function StatsPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  if (!(await isSignedIn())) {
    const e = (await searchParams).e;
    return (
      <main className={s.page} data-theme="night">
        <form action={signIn} className={s.login}>
          <h1 className={s.title}>Choose Your London <em>stats</em></h1>
          <label className={s.field}>
            <span className={s.label}>Password</span>
            <input type="password" name="password" autoFocus required autoComplete="current-password" className={s.input} />
          </label>
          {e && <span className={s.error}>{e === 'limit' ? 'Too many attempts today. Try again tomorrow.' : 'Wrong password.'}</span>}
          <button type="submit" className={s.button}>Sign in</button>
        </form>
      </main>
    );
  }

  const [visits, beans] = await Promise.all([readVisits(), readBeans()]);
  const today = visits.days[0];
  // Only show days since counting started (drop the empty days before it).
  const lastWithData = visits.days.findLastIndex(d => d.views > 0);
  const days = visits.days.slice(0, Math.max(1, lastWithData + 1));
  const maxVisitors = Math.max(1, ...days.map(d => d.visitors));
  const teams = [...TEAMS, REST_OF_WORLD]
    .map(t => ({ ...t, beans: beans.teams[t.id] || 0 }))
    .filter(t => t.beans > 0)
    .sort((a, b) => b.beans - a.beans)
    .slice(0, 8);
  const updated = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });

  return (
    <main className={s.page} data-theme="night">
      <header className={s.head}>
        <h1 className={s.title}>Choose Your London <em>stats</em></h1>
        <span className={s.updated}>Live · updated {updated} London time · refresh for latest</span>
        <form action={signOut}><button type="submit" className={s.signOut}>Sign out</button></form>
      </header>

      <section className={s.tiles}>
        <div className={s.tile}><span className={s.label}>People today</span><span className={s.big}>{fmt(today.visitors)}</span><span className={s.sub}>unique visitors</span></div>
        <div className={s.tile}><span className={s.label}>Visits today</span><span className={s.big}>{fmt(today.views)}</span><span className={s.sub}>page loads (incl. repeat visits)</span></div>
        <div className={s.tile}><span className={s.label}>People all time</span><span className={s.big}>{fmt(visits.allTime.visitors)}</span><span className={s.sub}>{fmt(visits.allTime.views)} page loads</span></div>
        <div className={s.tile}><span className={s.label}>Beans spilt</span><span className={s.big}>{fmt(beans.total)}</span><span className={s.sub}>all time</span></div>
      </section>

      <section className={s.panel}>
        <h2 className={s.h2}>Day by day</h2>
        <ul className={s.days}>
          {days.map(d => (
            <li key={d.date} className={s.day}>
              <span className={s.date}>{dayLabel(d.date)}</span>
              <span className={s.bar}><span style={{ width: `${(d.visitors / maxVisitors) * 100}%` }} /></span>
              <span className={s.dayNums}><strong>{fmt(d.visitors)}</strong> people · {fmt(d.views)} visits</span>
            </li>
          ))}
        </ul>
      </section>

      {teams.length > 0 && (
        <section className={s.panel}>
          <h2 className={s.h2}>Bean battle · top teams</h2>
          <ol className={s.teams}>
            {teams.map((t, i) => (
              <li key={t.id} className={s.team}><span className={s.rank}>{i + 1}</span><span>{t.flag} {t.name}</span><span className={s.teamNum}>{fmt(t.beans)}</span></li>
            ))}
          </ol>
        </section>
      )}

      <p className={s.note}>
        <strong>People</strong> = different visitors (counted by connection, so a household on one Wi-Fi may count once).
        <strong> Visits</strong> = every time the page is opened. Visitor counting started on 24 Sept 2026 in the evening, so earlier traffic isn&rsquo;t included.
        No cookies and no IP addresses are stored.
      </p>
    </main>
  );
}
