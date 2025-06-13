'use client';

import {
  RiFileChartLine,
  RiFlowChart,
  RiNewsLine,
  RiVipDiamondLine,
} from '@remixicon/react';

import Header from '@/components/header';
import WidgetChart from '@/components/widgets/widget-chart';
import WidgetMetrics from '@/components/widgets/widget-metrics';
import { WidgetPlaceholder } from '@/components/widgets/widget-placeholder';
import WidgetTeam from '@/components/widgets/widget-team';

export default function PageHome() {
  return (
    <>
      <Header />

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
    </>
  );
}
