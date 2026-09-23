import type { Metadata } from 'next';
import Night from '@/components/Night';

export const metadata: Metadata = { title: 'Choose Your London · Night' };

export default function NightPage() {
  return <Night />;
}
