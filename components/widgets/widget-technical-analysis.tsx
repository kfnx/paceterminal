'use client';

import {
  RiFlashlightLine,
  RiTeamLine,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import * as WidgetBox from '@/components/widget-box';
export default function WidgetTechnicalAnalysis({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {

  return (
    <WidgetBox.Root {...rest} id='technical-analysis'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTeamLine} />
        Technical Analysis
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />

        <div className='flex w-full flex-col items-center justify-center gap-2 p-2'>
          <img src='/images/tradingtown.jpg' alt='Trading Town' className='h-32 w-32 object-cover' />
          <span className='pb-4 text-text-sub-600'>Powered By Trading Town</span>
          <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
            <IllustrationEmptySavedActions className='size-[108px]' />
            <div className='text-center text-paragraph-sm text-text-soft-400'>
              Technical Analysis will be available when database schema is updated.
            </div>
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetTechnicalAnalysisEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
      id='team'
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFlashlightLine} />
        Technical Analysis
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptySavedActions className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            Technical Analysis empty.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
