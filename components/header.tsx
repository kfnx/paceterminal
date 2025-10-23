'use client';

import { usePathname } from 'next/navigation';

import { cnExt } from '@/utils/cn';
import { HeaderTitle } from '@/components/header-title';
import { NavigationTabWrapper } from '@/components/navigation-tab-wrapper';
import { ThemeToggler } from '@/components/theme-toggler';
import { WalletButton } from '@/components/wallet-button';

import { LanguageSelect } from './language-select';

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
  const pathname = usePathname();
  const showTitle = ['/updates', '/alpha', '/burn-screener'].some((path) =>
    pathname.startsWith(path),
  );
  const getHeaderSubtitle = () => {
    switch (pathname) {
      case '/updates':
        return 'All Token Updates';
      case '/alpha':
        return 'All Alpha';
      case '/burn-screener':
        return 'All Burn Screener';
      default:
        return '';
    }
  };

  return (
    <header
      className={cnExt(
        'flex min-h-[88px] flex-col justify-between gap-4 bg-transparent px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8',
        className,
      )}
      {...rest}
    >
      <HeaderTitle />
      <NavigationTabWrapper className='hidden lg:flex' />

      {showTitle ? (
        <div className='flex flex-col items-center'>
          <h1 className='font-display text-title-h4 font-semibold leading-none text-text-strong-950'>
            <span className='font-extrabold'>Pace</span>
            <span className='font-medium'>Terminal</span>
          </h1>
          <p className='paragraph-md mt-1 text-text-sub-600'>
            {getHeaderSubtitle()}
          </p>
        </div>
      ) : null}

      <div className={cnExt('flex items-center gap-3', contentClassName)}>
        {/* <SearchMenuButton className='hidden lg:flex' /> */}
        {/* <NotificationButton className='hidden lg:flex' /> */}
        <LanguageSelect className='hidden lg:flex' />
        <ThemeToggler className='hidden lg:flex' />
        <WalletButton className='hidden lg:flex' />
      </div>
    </header>
  );
}
