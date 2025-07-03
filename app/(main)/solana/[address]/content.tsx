'use client';

import { RiLockLine, RiNewsLine, RiVipDiamondLine } from '@remixicon/react';

import { useMemberStatus } from '@/hooks/use-member-status';
import type { Token } from '@/hooks/use-tokens';
import AdModal from '@/components/ad-modal';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import { LeftSideAd } from '@/components/LeftSideAd';
import { RightSideAd } from '@/components/RightSideAd';
import WidgetChart from '@/components/widgets/widget-chart';
import WidgetFlywheel from '@/components/widgets/widget-flywheel';
import WidgetMetrics from '@/components/widgets/widget-metrics';
import { WidgetPlaceholder } from '@/components/widgets/widget-placeholder';
import WidgetTeam from '@/components/widgets/widget-team';
import WidgetTechnicalAnalysis from '@/components/widgets/widget-technical-analysis';
import WidgetUpdates from '@/components/widgets/widget-updates';

interface ContentProps {
  token: Token;
}

function MemberOnlyPlaceholder({
  title,
  icon,
}: {
  title: string;
  icon: React.ComponentType<any>;
}) {
  return (
    <WidgetPlaceholder title={title} icon={icon}>
      <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
        <div className='flex size-16 items-center justify-center rounded-full bg-primary-base/10'>
          <RiLockLine className='size-8 text-primary-base' />
        </div>
        <div className='text-center'>
          <div className='text-paragraph-sm font-medium text-text-strong-950'>
            Members Only Content
          </div>
          <div className='mt-1 text-paragraph-xs text-text-sub-600'>
            Unlock premium {title.toLowerCase()} insights with a membership
          </div>
        </div>
      </div>
    </WidgetPlaceholder>
  );
}

export function Content({ token }: ContentProps) {
  const { isMember } = useMemberStatus();

  return (
    <div className='flex flex-row gap-6 px-4 pb-6 lg:px-8 lg:pt-1' id='top'>
      <LeftSideAd />
      <div className='flex flex-1 flex-col gap-6'>
        <WidgetChart />
        <WidgetMetrics />
        <WidgetTeam />
        <WidgetFlywheel />
        {/* Technical Analysis Section - Members Only */}
        {isMember ? (
          <WidgetTechnicalAnalysis />
        ) : (
          <MemberOnlyPlaceholder title='Technical Analysis' icon={RiNewsLine} />
        )}

        {/* Alpha Section - Members Only */}
        {isMember ? (
          <WidgetPlaceholder title='Alpha' icon={RiVipDiamondLine}>
            <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
              <IllustrationEmptySavedActions className='size-[108px]' />
              <div className='text-center text-paragraph-sm text-text-soft-400'>
                Alpha empty.
              </div>
            </div>
          </WidgetPlaceholder>
        ) : (
          <MemberOnlyPlaceholder title='Alpha' icon={RiVipDiamondLine} />
        )}

        {/* Updates Section - Public */}
        <WidgetUpdates />

        <AdModal />
      </div>
      <RightSideAd />
    </div>
  );
}
