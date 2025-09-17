'use client';

import { useTranslation } from '@/contexts/translation-context';

import BurnChart from './burn-chart';

interface BurnScreenerContentProps {
  data: Array<{
    name: string;
    percentage: number | null;
  }>;
}

export default function BurnScreenerContent({
  data,
}: BurnScreenerContentProps) {
  const { locale } = useTranslation();

  return (
    <div className='flex-1 p-4'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-text-strong-950'>
            Burned/Buyback
          </h1>
          <p>
            {locale === 'id'
              ? 'Presentase Token Burned/Buyback dari semua token'
              : 'Token Burned/Buyback percentage for each tokens'}
          </p>
        </div>

        <BurnChart data={data} />
      </div>
    </div>
  );
}
