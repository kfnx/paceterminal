'use client';

import { useParams } from 'next/navigation';

import { CURATED_TOKENS } from '@/lib/tokens';
import * as Avatar from '@/components/ui/avatar';

export function HeaderTitle() {
  const params = useParams();
  const address = params.address as string;
  const token = CURATED_TOKENS.find((t) => t.address === address);
  const subtitle = token?.name ? `Creator ${token?.name}` : 'Creator Buddy';

  if (!address) {
    return null
  }

  return (
    <div className='flex gap-4 lg:gap-3.5'>
      <Avatar.Root size='48' color='blue'>
        <Avatar.Image
          src={`/images/tokens/${token?.icon}`}
          alt='buddy'
        />
      </Avatar.Root>
      <div className='space-y-1'>
        <div className='text-label-md lg:text-label-lg'>{token?.name}</div>
        <div className='text-paragraph-sm text-text-sub-600'>{subtitle}</div>
      </div>
    </div>
  );
} 