'use server';

import { createHash, timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { withinDailyLimit } from '@/lib/beanStore';
import { visitorOf } from '@/lib/visitor';

// The stats page is protected by the STATS_KEY password. After a correct login we store a
// hash of it in an http-only cookie, so the password never appears in a link.
const COOKIE = 'cyl_stats';
const token = (key: string) => createHash('sha256').update('cyl-stats:' + key).digest('hex');

export async function isSignedIn() {
  const key = process.env.STATS_KEY;
  const got = (await cookies()).get(COOKIE)?.value;
  if (!key || !got) return false;
  const want = token(key);
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function signIn(formData: FormData) {
  const key = process.env.STATS_KEY;
  const h = await headers();
  // 20 attempts per person per day, so the password can't be guessed by brute force.
  const req = new Request('http://local', { headers: h });
  if (!(await withinDailyLimit('stats-login', visitorOf(req), 20))) redirect('/stats?e=limit');
  const pass = String(formData.get('password') || '');
  if (!key || pass !== key) redirect('/stats?e=wrong');
  (await cookies()).set(COOKIE, token(key), { httpOnly: true, secure: true, sameSite: 'strict', path: '/stats', maxAge: 60 * 60 * 24 * 30 });
  redirect('/stats');
}

export async function signOut() {
  (await cookies()).delete({ name: COOKIE, path: '/stats' });
  redirect('/stats');
}
