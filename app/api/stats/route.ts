import { readBeans, readVisits } from '@/lib/beanStore';

// Private stats: /api/stats?key=YOUR_STATS_KEY (set STATS_KEY in Vercel's environment variables).
export async function GET(req: Request) {
  const key = process.env.STATS_KEY;
  if (!key || new URL(req.url).searchParams.get('key') !== key) return new Response('Not found', { status: 404 });
  const [visits, beans] = await Promise.all([readVisits(), readBeans()]);
  return Response.json({ ...visits, beansTotal: beans.total }, { headers: { 'Cache-Control': 'no-store' } });
}
