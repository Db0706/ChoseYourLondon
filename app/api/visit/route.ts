import { recordVisit } from '@/lib/beanStore';
import { visitorOf } from '@/lib/visitor';

// Called once per page load from the browser, so bots that don't run JavaScript aren't counted.
export async function POST(req: Request) {
  try { await recordVisit(visitorOf(req)); } catch {}
  return new Response(null, { status: 204 });
}
