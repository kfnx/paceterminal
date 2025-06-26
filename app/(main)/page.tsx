'use client';

import { useParams } from 'next/navigation';
import {
  RiFileChartLine,
  RiFlowChart,
  RiNewsLine,
  RiVipDiamondLine,
} from '@remixicon/react';

import WidgetChart from '@/components/widgets/widget-chart';
import WidgetMetrics from '@/components/widgets/widget-metrics';
import { WidgetPlaceholder } from '@/components/widgets/widget-placeholder';
import WidgetTeam from '@/components/widgets/widget-team';

export default function PageHome() {
  const params = useParams();
  const address = params.address as string;

  if (!address) {
    return (
      <div className='-mt-32 flex h-screen flex-col items-center justify-center space-y-4'>
        <img src='/images/semar.png' alt='logo' className='h-64 w-64' />
        <h1 className='text-2xl font-bold'>Monggo Dipilih</h1>
        <p className='text-sm text-gray-500'>
          Monggo Klik Token Yang Jenengan Ingin Pelajari
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 overflow-hidden px-4 pb-6 lg:px-8 lg:pt-1'>
      <WidgetChart />
      <WidgetMetrics />
      <WidgetTeam />
      <WidgetPlaceholder title='Flywheel' icon={RiFlowChart}>
        <div>Flywheel</div>
      </WidgetPlaceholder>
      <WidgetPlaceholder title='Technical' icon={RiFileChartLine}>
        <div>Technical</div>
      </WidgetPlaceholder>
      <WidgetPlaceholder title='Alpha' icon={RiVipDiamondLine}>
        <div>Alpha</div>
      </WidgetPlaceholder>
      <WidgetPlaceholder title='Updates' icon={RiNewsLine}>
        <div>Updates</div>
      </WidgetPlaceholder>
    </div>
  );
}
