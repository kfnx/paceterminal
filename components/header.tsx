'use client';

import { usePathname } from 'next/navigation';
import { useTranslation } from '@/contexts/translation-context';

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
  const { locale } = useTranslation();
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/(id|en)(?=\/|$)/, '') || '/';
  const tokenPage = ['/solana'].some((path) => normalizedPath.startsWith(path));

  const getHeaderSubtitle = () => {
    switch (normalizedPath) {
      case '/':
        return locale === 'id' ? 'Ikhtisar Pasar' : 'Market Overview';
      case '/updates':
        return locale === 'id' ? 'Semua Update Token' : 'All Token Updates';
      case '/alpha':
        return locale === 'id' ? 'Insight Alpha' : 'Alpha Insights';
      case '/burn-screener':
        return locale === 'id' ? 'Penjualan dan Pembelian' : 'Burn Screener';
      default:
        return '';
    }
  };

  return (
    <header
      className={cnExt(
        'flex min-h-[88px] flex-col justify-center gap-4 bg-transparent px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8',
        className,
      )}
      {...rest}
    >
      <HeaderTitle />
      {tokenPage && <NavigationTabWrapper className='hidden lg:flex' />}
      {/* <NavigationTabWrapper /> */}

      {!tokenPage ? (
        <div className='flex flex-1 flex-col items-center justify-center text-center'>
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
