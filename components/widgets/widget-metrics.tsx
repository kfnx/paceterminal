'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiArrowLeftDownFill,
  RiArrowRightUpFill,
  RiCalendarCheckFill,
  RiLineChartLine,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Select from '@/components/ui/select';
import IllustrationEmptyBudgetOverview from '@/components/empty-state-illustrations/budget-overview';
import * as WidgetBox from '@/components/widget-box';
import { useParams } from 'next/navigation';
import { CURATED_TOKENS } from '@/lib/tokens';

export default function WidgetMetrics({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const token = CURATED_TOKENS.find((token) => token.address === address);

  // const metrics = [];
  // for (let i = 0; i < (token?.metrics?.length ?? 0); i += 3) {
  //   metrics.push(token?.metrics?.slice(i, i + 3) ?? []);
  // }

  return (
    <WidgetBox.Root {...rest} id='metrics'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiLineChartLine} />
        Metrics
        <SegmentedControl.Root defaultValue='static'>
          <SegmentedControl.List>
            <SegmentedControl.Trigger value='static'>
              Static
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger value='dynamic' disabled>
              Dynamic
            </SegmentedControl.Trigger>
          </SegmentedControl.List>
        </SegmentedControl.Root>
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />
        <div className='-my-1 flex flex-wrap gap-4 lg:my-0'>
          {token?.metrics?.map((metric, index) => (
            <div
              key={metric.label + index}
              className='flex w-full min-w-0 gap-3 py-3 first:pt-0 last:pb-0 lg:w-[calc(33.333%-1rem)] lg:py-0'
            >
              <div className='space-y-1'>
                <div className='text-subheading-2xs uppercase text-text-soft-400'>
                  {metric.label}
                </div>
                <div className='flex items-center gap-1'>
                  <span className='text-label-md'>{metric.value}</span>
                </div>
                <div className='text-paragraph-sm text-text-sub-600'>
                  {metric.description}
                </div>
                <div className='text-paragraph-sm text-text-sub-600'>
                  {metric.added}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetMetricsEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
      id='metrics'
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiLineChartLine} />
        Metrics
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex h-[284px] flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptyBudgetOverview className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            You do not have any cards yet.
            <br />
            Click the button to add one.
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xsmall'>
            <Button.Icon as={RiAddLine} />
            Add Card
          </Button.Root>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
