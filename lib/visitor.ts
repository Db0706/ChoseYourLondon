import 'server-only';
import { createHash } from 'node:crypto';

// Tells visitors apart for rate limiting without keeping their IP: a salted hash of it.
const SALT = process.env.BEAN_SALT || 'choose-your-london-beans';
export function visitorOf(req: Request) {
  const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  return createHash('sha256').update(SALT + ip).digest('hex').slice(0, 24);
}
