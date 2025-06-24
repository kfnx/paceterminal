'use client';

import { useState, useEffect } from 'react';
import {
  RiNewsLine,
  RiVipDiamondLine,
  RiCloseLine,
} from '@remixicon/react';

import WidgetChart from '@/components/widgets/widget-chart';
import WidgetMetrics from '@/components/widgets/widget-metrics';
import { WidgetPlaceholder } from '@/components/widgets/widget-placeholder';
import WidgetTeam from '@/components/widgets/widget-team';
import WidgetFlywheel from '@/components/widgets/widget-flywheel';
import WidgetTechnicalAnalysis from '@/components/widgets/widget-technical-analysis';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import AdModal from '@/components/ad-modal';
import { useMemberStatus } from '@/hooks/use-member-status';

export function WidgetsSection() {
  const { isMember } = useMemberStatus();
  const [showAds, setShowAds] = useState(true);
  const [canClose, setCanClose] = useState(30000); // 30 seconds in milliseconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCanClose((prev) => {
        if (prev <= 0) return 0;
        return prev - 1000; // Decrease by 1 second
      });
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const handleCloseAds = () => {
    if (canClose <= 0) {
      setShowAds(false);
    }
  };

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
      {showAds && !isMember && (
        <div
          className={'relative hidden h-[600px] w-[240px] min-w-0 cursor-pointer flex-col gap-2 lg:flex'}
          onClick={() => {
            window?.open('https://x.com/PaceTerminal', '_blank');
          }}
        >
          <div className='z-10 flex items-center justify-between gap-2 rounded-md'>
            <span className='px-2 text-paragraph-xs'>
              {canClose > 0
                ? `Please wait ${Math.ceil(canClose / 1000)} seconds to close the Sponsored Ad`
                : 'Sponsored Ad'}
            </span>
            {canClose <= 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseAds();
                }}
                className='flex h-6 w-6 items-center justify-center rounded-full bg-white/20 hover:bg-white/30'
              >
                <RiCloseLine className='size-4' />
              </button>
            )}
          </div>
          <img src='/images/ads/placeholder.png' alt='ad' className='w-full' />
          <img src='/images/ads/placeholder.png' alt='ad' className='w-full' />
          <img src='/images/ads/placeholder.png' alt='ad' className='w-full' />
          <img src='/images/ads/placeholder.png' alt='ad' className='w-full' />
          <img src='/images/ads/placeholder.png' alt='ad' className='w-full' />
        </div>
      )}
    </div>
  );
} 