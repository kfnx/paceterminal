'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/translation-context';

import { getTokenImageUrl } from '@/utils/image-url';
import * as Avatar from '@/components/ui/avatar';

interface TokenTagProps {
  token: {
    name: string;
    image: string | null;
    address: string;
  };
  size?: '20' | '24' | '32';
  className?: string;
}

export function TokenTag({
  token,
  size = '20',
  className = '',
}: TokenTagProps) {
  const { locale } = useTranslation();

  const tokenPath =
    locale === 'id'
      ? `/id/solana/${token.address}`
      : `/solana/${token.address}`;

  return (
    <Link
      href={tokenPath}
      className={`hover:bg-bg-weak-100 flex w-fit items-center gap-2 rounded bg-bg-weak-50 px-2 py-1 text-paragraph-xs font-medium text-text-strong-950 transition-colors ${className}`}
    >
      <Avatar.Root size={size}>
        <Avatar.Image src={getTokenImageUrl(token.image)} alt={token.name} />
      </Avatar.Root>
      {token.name}
    </Link>
  );
}
