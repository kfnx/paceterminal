'use client';

import {
  RiFlashlightLine,
  RiTeamLine,
  RiTwitterLine,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import * as WidgetBox from '@/components/widget-box';
import { useParams } from 'next/navigation';
import { CURATED_TOKENS } from '@/lib/tokens';
import Link from 'next/link';

type TeamMemberProps = {
  name: string;
  description?: string;
  image: string;
  role: string;
  x?: string;
};

function TeamMember({ name, description, image, role, x }: TeamMemberProps) {
  return (
    <div className='flex flex-col items-center gap-3 space-x-2 text-center'>
      <div className='flex items-center gap-1'>
        <img src={image} alt={name} className='max-h-32 max-w-32 rounded-full object-cover' />
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-label-sm text-text-strong-950'>{name}</div>
        <div className='text-paragraph-xs text-text-sub-600'>{role}</div>
      </div>
      {x && <div className='flex flex-row items-center gap-1 text-paragraph-xs text-text-sub-600'>
        <RiTwitterLine />
        <Link href={`https://x.com/${x}`} target='_blank'>
          @{x}
        </Link>
      </div>}
      <div className='text-paragraph-xs text-text-sub-600'>{description}</div>
    </div>
  );
}

export default function WidgetTechnicalAnalysis({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const token = CURATED_TOKENS.find((token) => token.address === address);

  return (
    <WidgetBox.Root {...rest} id='team'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTeamLine} />
        Technical Analysis
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />

        <div className='flex w-full flex-col items-center justify-center gap-2 pb-1'>
          <img src='/images/tradingtown.jpg' alt='Trading Town' className='h-32 w-32 object-cover' />
          <span className='pb-4 text-text-sub-600'>Powered By Trading Town</span>
          {token?.technicalAnalysis && token?.technicalAnalysis?.length > 0 ? token?.technicalAnalysis?.map((technicalAnalysis, index) => (
            <div key={index} className='flex flex-col gap-4'>
              <img src={`/images/technical-analysis/${technicalAnalysis.image}`} alt={technicalAnalysis.image} className='h-full w-full object-cover pb-8' />
              <div className='flex items-center justify-center gap-2 space-x-12'>
                <div className='rounded-md border border-text-sub-600 px-2 py-1 text-text-sub-600'>Support: ${technicalAnalysis.support}</div>
                <div className='rounded-md border border-text-sub-600 px-2 py-1 text-text-sub-600'>Resistance: ${technicalAnalysis.resistance}</div>
                <div className='rounded-md border border-text-sub-600 px-2 py-1 text-text-sub-600'>Bullish Meter: {technicalAnalysis.bullishMeter}%</div>
              </div>
              {('description' in technicalAnalysis) && <div className='px-8 pt-4 text-text-sub-600'>{technicalAnalysis.description}</div>}
              {('date' in technicalAnalysis) && <div className='text-right text-paragraph-xs text-text-sub-600'>Added {technicalAnalysis.date}</div>}
            </div>
          )) : <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
            <IllustrationEmptySavedActions className='size-[108px]' />
            <div className='text-center text-paragraph-sm text-text-soft-400'>
              Technical Analysis empty.
            </div>
          </div>}
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
