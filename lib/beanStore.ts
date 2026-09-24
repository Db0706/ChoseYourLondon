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

// Per-person allowance: returns how many of `n` beans still fit in this minute.
// `who` is a salted hash of the visitor's IP; the key expires after two minutes.
export async function allowBeans(who: string, n: number, perMinute: number) {
  const key = `beans:rl:${who}:${Math.floor(Date.now() / 60_000)}`;
  let used: number;
  if (redis) {
    const p = redis.pipeline();
    p.incrby(key, n);
    p.expire(key, 120);
    used = Number((await p.exec())[0]);
  } else {
    used = (memoryLimits.get(key) || 0) + n;
    memoryLimits.set(key, used);
  }
  return Math.max(0, Math.min(n, perMinute - (used - n)));
}

const memoryLimits = new Map<string, number>();

// Counts one use of `what` for visitor `who` today; true while they're within `perDay`.
export async function withinDailyLimit(what: string, who: string, perDay: number) {
  const key = `limit:${what}:${who}:${new Date().toISOString().slice(0, 10)}`;
  let used: number;
  if (redis) {
    const p = redis.pipeline();
    p.incr(key);
    p.expire(key, 60 * 60 * 26);
    used = Number((await p.exec())[0]);
  } else {
    used = (memoryLimits.get(key) || 0) + 1;
    memoryLimits.set(key, used);
  }
  return used <= perDay;
}

export async function readBeans(): Promise<{ total: number; teams: Record<string, number> }> {
  if (redis) {
    const [total, teams] = await Promise.all([redis.get<number>(TOTAL), redis.hgetall<Record<string, number>>(TEAMS)]);
    return { total: Number(total) || 0, teams: Object.fromEntries(Object.entries(teams || {}).map(([k, v]) => [k, Number(v) || 0])) };
  }
  return { total: memory.total, teams: Object.fromEntries(memory.teams) };
}
