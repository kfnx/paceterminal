'use client';

import { cnExt } from '@/utils/cn';
import { NavigationTabs } from '@/components/navigation-tabs';
import { ThemeToggler } from '@/components/theme-toggler';
import { HeaderTitle } from '@/components/header-title';
import { WalletButton } from '@/components/wallet-button';

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
        'flex min-h-[88px] flex-col justify-between gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8',
        className,
      )}
      {...rest}
    >
      <HeaderTitle />
      <NavigationTabs className='fixed left-[40%] hidden lg:flex' />
      <div className={cnExt('flex items-center gap-3', contentClassName)}>
        {/* <SearchMenuButton className='hidden lg:flex' /> */}
        {/* <NotificationButton className='hidden lg:flex' /> */}
        {/* <LanguageSelect className='hidden lg:flex' /> */}
        <ThemeToggler className='hidden lg:flex' />
        <WalletButton />
      </div>
    </header>
  );
}
