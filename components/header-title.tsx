'use client';

import { getTokenImageUrl } from '@/utils/image-url';
import { useCurrentToken } from '@/hooks/use-current-token';
import * as Avatar from '@/components/ui/avatar';

export function HeaderTitle() {
  const { data: token, isLoading } = useCurrentToken();

  if (isLoading) {
    return (
      <div className='flex gap-4 lg:gap-3.5'>
        <div className='h-12 w-12 animate-pulse rounded-full bg-bg-weak-50' />
        <div className='space-y-1'>
          <div className='h-5 w-24 animate-pulse rounded bg-bg-weak-50' />
          <div className='h-4 w-32 animate-pulse rounded bg-bg-weak-50' />
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className='flex gap-4 lg:gap-3.5'>
      <Avatar.Root size='48' color='blue'>
        <Avatar.Image src={getTokenImageUrl(token.image)} alt={token.name} />
      </Avatar.Root>
      <div className='space-y-1 md:hidden xl:block'>
        <div className='text-label-md lg:text-label-lg'>{token.name}</div>
        <div className='text-paragraph-sm text-text-sub-600'>{token.label}</div>
      </div>
    </div>
  );
}
