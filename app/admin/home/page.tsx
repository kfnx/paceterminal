'use client';

import Link from 'next/link';
import { RiOutletLine } from '@remixicon/react';

import { CURATED_TOKENS } from '@/lib/tokens';
import { useAuth } from '@/hooks/use-auth';
import * as Button from '@/components/ui/button';
import WidgetAdminTokens from '@/components/widgets/widget-admin-tokens';

export default function PageHome() {
  const { user } = useAuth();

  return (
    <div className='flex flex-col gap-6 overflow-hidden px-4 pb-6 lg:p-8'>
      <h3 className='text-2xl font-bold'>Token Management</h3>
      <WidgetAdminTokens />
    </div>
  );
}
