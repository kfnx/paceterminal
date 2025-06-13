'use client';

import { Suspense } from 'react';
import { RiFileChartLine } from '@remixicon/react';
import { useQueryState } from 'nuqs';

import { tokens } from '@/lib/tokens';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import * as WidgetBox from '@/components/widget-box';

const defaultToken = tokens.BUDDY;

function DexScreenerFrame() {
  const [token] = useQueryState('token');
  return (
    <iframe
      key={token || defaultToken}
      className='min-h-[800px] w-full [grid-column:1/-1]'
      src={`https://dexscreener.com/solana/${token || defaultToken}?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&chartStyle=0&chartType=usd&interval=15`}
    />
  );
}

export default function WidgetChart({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  return (
    <WidgetBox.Root {...rest} id='chart'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFileChartLine} />
        Chart
      </WidgetBox.Header>
      <Suspense fallback={<LoadingSpinner />}>
        <DexScreenerFrame />
      </Suspense>
    </WidgetBox.Root>
  );
}
