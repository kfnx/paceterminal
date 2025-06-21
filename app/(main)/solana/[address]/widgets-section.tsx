'use client';

import {
  RiNewsLine,
  RiVipDiamondLine,
} from '@remixicon/react';

import WidgetChart from '@/components/widgets/widget-chart';
import WidgetMetrics from '@/components/widgets/widget-metrics';
import { WidgetPlaceholder } from '@/components/widgets/widget-placeholder';
import WidgetTeam from '@/components/widgets/widget-team';
import WidgetFlywheel from '@/components/widgets/widget-flywheel';
import WidgetTechnicalAnalysis from '@/components/widgets/widget-technical-analysis';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import AdModal from '@/components/ad-modal';

export function WidgetsSection() {
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
      <div
        className={'flex h-[600px] w-[240px] min-w-0 cursor-pointer flex-col gap-2'}
        onClick={(e) => {
          window?.open('https://x.com/PaceTerminal', '_blank');
        }}
      >
        <img src='/images/ads/placeholder.png' alt='ad' className='w-full' />
        <img src='/images/ads/placeholder.png' alt='ad' className='w-full' />
        <img src='/images/ads/placeholder.png' alt='ad' className='w-full' />
        <img src='/images/ads/placeholder.png' alt='ad' className='w-full' />
        <img src='/images/ads/placeholder.png' alt='ad' className='w-full' />
      </div>
    </div>
  );
} 