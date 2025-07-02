'use client';

import { RiNewsLine, RiVipDiamondLine } from '@remixicon/react';

import type { Token } from '@/hooks/use-tokens';
import AdModal from '@/components/ad-modal';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import { RightSideAd } from '@/components/RightSideAd';
import WidgetChart from '@/components/widgets/widget-chart';
import WidgetFlywheel from '@/components/widgets/widget-flywheel';
import WidgetMetrics from '@/components/widgets/widget-metrics';
import { WidgetPlaceholder } from '@/components/widgets/widget-placeholder';
import WidgetTeam from '@/components/widgets/widget-team';
import WidgetTechnicalAnalysis from '@/components/widgets/widget-technical-analysis';

interface ContentProps {
  token: Token;
}

export function Content({ token }: ContentProps) {
  return (
    <div className='flex flex-row gap-6 px-4 pb-6 lg:px-8 lg:pt-1' id='top'>
      <div className='flex flex-1 flex-col gap-6'>
        <WidgetChart />
        <WidgetMetrics />
        <WidgetTeam />
        <WidgetFlywheel />
        <WidgetTechnicalAnalysis />
        <WidgetPlaceholder title='Alpha' icon={RiVipDiamondLine}>
          <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
            <IllustrationEmptySavedActions className='size-[108px]' />
            <div className='text-center text-paragraph-sm text-text-soft-400'>
              Alpha empty.
            </div>
          </div>
        </WidgetPlaceholder>
        <WidgetPlaceholder title='Updates' icon={RiNewsLine}>
          <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
            <IllustrationEmptySavedActions className='size-[108px]' />
            <div className='text-center text-paragraph-sm text-text-soft-400'>
              Updates empty.
            </div>
          </div>
        </WidgetPlaceholder>
        <AdModal />
      </div>
      <RightSideAd />
    </div>
  );
}
