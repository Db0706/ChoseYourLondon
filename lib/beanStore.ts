import 'server-only';
import { Redis } from '@upstash/redis';

// Bean counts live in Upstash Redis in production (Vercel → Storage → Upstash for Redis).
// Without credentials (local dev) they're kept in memory so everything still works.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const TOTAL = 'beans:total';
const TEAMS = 'beans:teams';

const memory = { total: 0, teams: new Map<string, number>() };

export async function addBeans(teamId: string, n: number) {
  if (redis) {
    const p = redis.pipeline();
    p.incrby(TOTAL, n);
    p.hincrby(TEAMS, teamId, n);
    await p.exec();
    return;
  }
  memory.total += n;
  memory.teams.set(teamId, (memory.teams.get(teamId) || 0) + n);
}

export async function readBeans(): Promise<{ total: number; teams: Record<string, number> }> {
  if (redis) {
    const [total, teams] = await Promise.all([redis.get<number>(TOTAL), redis.hgetall<Record<string, number>>(TEAMS)]);
    return { total: Number(total) || 0, teams: Object.fromEntries(Object.entries(teams || {}).map(([k, v]) => [k, Number(v) || 0])) };
  }
  return { total: memory.total, teams: Object.fromEntries(memory.teams) };
}
