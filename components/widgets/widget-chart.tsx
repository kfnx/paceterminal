'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { RiFileChartLine } from '@remixicon/react';
import { useTheme } from 'next-themes';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import * as WidgetBox from '@/components/widget-box';

function DexScreenerFrame() {
  const params = useParams();
  const tokenAddress = params.address as string;
  const { theme } = useTheme();

  return (
    <iframe
      className='min-h-[800px] w-full [grid-column:1/-1]'
      src={`https://dexscreener.com/solana/${tokenAddress}?embed=1&loadChartSettings=0&chartLeftToolbar=0&theme=${theme}&chartTheme=${theme}&chartStyle=1&chartType=usd&interval=15`}
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
