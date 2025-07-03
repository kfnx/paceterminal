import Link from 'next/link';
import { RiArrowLeftLine, RiCoinLine } from '@remixicon/react';

import type { Token } from '@/hooks/use-tokens';
import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';

interface TokenHeaderProps {
  token: Token;
}

const getTierLabel = (tier: number) => {
  switch (tier) {
    case 1:
      return { label: 'S Tier', color: 'purple' as const };
    case 2:
      return { label: 'A Tier', color: 'blue' as const };
    case 3:
      return { label: 'B Tier', color: 'green' as const };
    case 4:
      return { label: 'C Tier', color: 'yellow' as const };
    default:
      return { label: 'Unknown', color: 'gray' as const };
  }
};

export function TokenHeader({ token }: TokenHeaderProps) {
  const tierInfo = getTierLabel(token.tier || 0);

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        {token.image ? (
          <Avatar.Root size='64'>
            <Avatar.Image src={token.image} />
          </Avatar.Root>
        ) : (
          <div className='flex size-16 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiCoinLine className='size-8 text-text-sub-600' />
          </div>
        )}
        <div>
          <h1 className='text-heading-lg font-semibold text-text-strong-950'>
            {token.name}
          </h1>
          {token.label && (
            <p className='mt-1 text-paragraph-sm text-text-sub-600'>
              {token.label}
            </p>
          )}
          <div className='mt-2 flex items-center gap-2'>
            <Badge.Root variant='filled' color={tierInfo.color}>
              {tierInfo.label}
            </Badge.Root>
            {token.ordering !== null && (
              <Badge.Root variant='stroke' color='gray'>
                Order: {token.ordering}
              </Badge.Root>
            )}
          </div>
        </div>
      </div>

      <Link
        href='/admin/tokens'
        className='flex items-center gap-2 text-text-sub-600 hover:text-text-strong-950 transition-colors p-6'
      >
        <RiArrowLeftLine className='size-4' />
        Back to Manage Token
      </Link>
    </div>
  );
}