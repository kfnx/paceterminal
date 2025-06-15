'use client';

import { Suspense } from 'react';
import { RiFileChartLine } from '@remixicon/react';

import { CURATED_TOKENS } from '@/lib/tokens';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import * as WidgetBox from '@/components/widget-box';
import { useParams } from 'next/navigation';

const defaultToken = CURATED_TOKENS[0].address;

function DexScreenerFrame() {
  const params = useParams();
  const token = params.address as string;

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
