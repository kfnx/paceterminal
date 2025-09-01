'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/translation-context';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCalendarLine,
} from '@remixicon/react';

import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

type AlphaWithToken = Database['public']['Tables']['alpha']['Row'] & {
  tokens: {
    name: string;
    image: string | null;
    tier: number | null;
  } | null;
};

export default function BurnScreenerPage() {
  return (
    <div className='flex-1 p-4'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-text-strong-950'>
            Burn Screener
          </h1>
          <p className='mt-2 text-text-sub-600'>durukk</p>
        </div>
        TBD
      </div>
    </div>
  );
}
