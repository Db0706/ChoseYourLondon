import { createHash } from 'node:crypto';
import { addBeans, allowBeans, readBeans } from '@/lib/beanStore';
import { BEANS_PER_MINUTE, MAX_PER_REQUEST } from '@/lib/beanLimits';
import { REST_OF_WORLD, TEAMS, teamById, teamForCountry } from '@/lib/teams';


// Vercel adds the visitor's country (from their IP) to every request. We only keep the team it maps to.
const countryOf = (req: Request) => req.headers.get('x-vercel-ip-country');

// Rate limiting needs to tell visitors apart without keeping their IP: hash it with a salt.
const SALT = process.env.BEAN_SALT || 'choose-your-london-beans';
const visitorOf = (req: Request) => {
  const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  return createHash('sha256').update(SALT + ip).digest('hex').slice(0, 24);
};

export async function GET(req: Request) {
  const { total, teams } = await readBeans();
  const board = [...TEAMS, REST_OF_WORLD]
    .map(t => ({ id: t.id, name: t.name, flag: t.flag, beans: teams[t.id] || 0 }))
    .sort((a, b) => b.beans - a.beans || a.name.localeCompare(b.name));
  const you = teamForCountry(countryOf(req));
  return Response.json({ total, board, you: { id: you.id, name: you.name, flag: you.flag } }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request) {
  let n = 0;
  try { n = Math.floor(Number((await req.json()).n)); } catch {}
  if (!Number.isFinite(n) || n <= 0) return Response.json({ ok: false }, { status: 400 });
  const team = teamForCountry(countryOf(req));
  if (!teamById(team.id)) return Response.json({ ok: false }, { status: 400 });
  const accepted = await allowBeans(visitorOf(req), Math.min(n, MAX_PER_REQUEST), BEANS_PER_MINUTE);
  if (accepted > 0) await addBeans(team.id, accepted);
  return Response.json({ ok: true, accepted });
}
