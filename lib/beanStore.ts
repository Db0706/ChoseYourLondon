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

// ---- Visitor counting (no cookies, no stored IPs) ----
// Views are a plain counter per day. Unique visitors use a HyperLogLog of hashed IPs:
// it can estimate how many distinct visitors there were, but can't list or reveal them.
const day = (d = new Date()) => d.toISOString().slice(0, 10);
const memoryVisits = { views: new Map<string, number>(), uniq: new Map<string, Set<string>>() };

export async function recordVisit(who: string) {
  const d = day();
  if (redis) {
    const p = redis.pipeline();
    p.incr(`visits:views:${d}`);
    p.incr('visits:views:all');
    p.pfadd(`visits:uniq:${d}`, who);
    p.pfadd('visits:uniq:all', who);
    await p.exec();
    return;
  }
  for (const k of [d, 'all']) {
    memoryVisits.views.set(k, (memoryVisits.views.get(k) || 0) + 1);
    if (!memoryVisits.uniq.has(k)) memoryVisits.uniq.set(k, new Set());
    memoryVisits.uniq.get(k)!.add(who);
  }
}

export async function readVisits(days = 14) {
  const keys = Array.from({ length: days }, (_, i) => day(new Date(Date.now() - i * 86_400_000)));
  const one = async (k: string) => redis
    ? { views: Number(await redis.get(`visits:views:${k}`)) || 0, visitors: await redis.pfcount(`visits:uniq:${k}`) }
    : { views: memoryVisits.views.get(k) || 0, visitors: memoryVisits.uniq.get(k)?.size || 0 };
  const [all, ...perDay] = await Promise.all([one('all'), ...keys.map(one)]);
  return { allTime: all, days: keys.map((date, i) => ({ date, ...perDay[i] })) };
}
