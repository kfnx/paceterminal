'use client';

import Link from 'next/link';
import MobileMenu from '@/app/[locale]/mobile-menu';
import { LanguageSelect } from './language-select';
import { ThemeToggler } from './theme-toggler';

export default function HeaderMobile() {
  return (
    <div className='flex h-[60px] w-full items-center justify-between border-b border-stroke-soft-200 px-4 lg:hidden'>
      <Link href='/' className='shrink-0'>
        <img src='/images/semar.png' alt='' className='size-9' />
      </Link>

      <div className='flex items-center gap-3'>
        <LanguageSelect />
        <ThemeToggler />
        <div className='flex w-1 shrink-0 items-center before:h-full before:w-px before:bg-stroke-soft-200' />
        <MobileMenu />
      </div>
    </div>
  );
}
