import { addBeans, readBeans } from '@/lib/beanStore';
import { REST_OF_WORLD, TEAMS, teamById, teamForCountry } from '@/lib/teams';

// Each click spills at most 6 beans and the client batches every few seconds,
// so anything bigger than this in one request is someone poking the API.
const MAX_PER_REQUEST = 150;

// Vercel adds the visitor's country (from their IP) to every request. We only keep the team it maps to.
const countryOf = (req: Request) => req.headers.get('x-vercel-ip-country');

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
  await addBeans(team.id, Math.min(n, MAX_PER_REQUEST));
  return Response.json({ ok: true });
}
