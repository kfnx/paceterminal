import { CURATED_TOKENS } from '@/lib/tokens';
import { WidgetsSection } from './widgets-section';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return CURATED_TOKENS.map((token) => ({
    address: token.address,
  }));
}

export default function PageHome({ params }: { params: { address: string } }) {
  const token = CURATED_TOKENS.find((token) => token.address === params.address);

  if (!token) {
    notFound();
  }

  return <WidgetsSection />;
}
