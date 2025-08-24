'use client';

import { useTranslation } from '@/contexts/translation-context';

export default function PageHome() {
  const { t, locale } = useTranslation();

  return (
    <div className='mt-20 flex w-full flex-col items-center justify-center space-y-4'>
      <img src='/images/semar.png' alt='logo' className='h-64 w-64' />
      <h1 className='text-2xl font-bold'>
        {locale === 'id' ? 'Monggo Dipilih' : 'Please Choose'}
      </h1>
      <p className='text-sm text-gray-500'>
        {locale === 'id'
          ? 'Klik Token Yang Jenengan Ingin Pelajari'
          : 'Click the token you want to learn about'}
      </p>
    </div>
  );
}
