import { CURATED_TOKENS } from '@/lib/tokens';
import { Content } from './content';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return CURATED_TOKENS.map((token) => ({
    address: token.address,
  }));
}

export default function SolanaTokenPage({ params }: { params: { address: string } }) {
  const token = CURATED_TOKENS.find((token) => token.address === params.address);

  if (!token) {
    notFound();
  }

  return <Content />;
}
