'use client';

import { Suspense } from 'react';
import { useQueryState } from 'nuqs';

import { getTokenFromAddress, tokens } from '@/lib/tokens';
import { cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LanguageSelect } from '@/components/language-select';
import { NavigationTabs } from '@/components/navigation-tabs';
import { SearchMenuButton } from '@/components/search';
import { WalletButton } from '@/components/wallet';

function Title() {
  const [tokenParam] = useQueryState('token');
  const token = getTokenFromAddress(tokenParam || tokens.BUDDY);
  const subtitle = token?.name ? `Creator ${token?.name}` : 'Creator Buddy';

  return (
    <div className='flex gap-4 lg:gap-3.5'>
      <Avatar.Root size='48' color='blue'>
        <Avatar.Image
          src={`/images/placeholder/${token?.icon}.svg`}
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

export default function Header({
  children,
  className,
  icon,
  title,
  description,
  contentClassName,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  contentClassName?: string;
}) {
  return (
    <header
      className={cnExt(
        'flex min-h-[88px] flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8',
        className,
      )}
      {...rest}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <Title />
      </Suspense>
      <NavigationTabs className='hidden lg:flex' />
      <div className={cnExt('flex items-center gap-3', contentClassName)}>
        <SearchMenuButton className='hidden lg:flex' />
        {/* <NotificationButton className='hidden lg:flex' /> */}
        <LanguageSelect className='hidden lg:flex' />
        <WalletButton className='hidden lg:flex' />
      </div>
    </header>
  );
}
