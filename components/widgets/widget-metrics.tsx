'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { RiAddLine, RiLineChartLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import { useMetrics } from '@/hooks/use-metrics';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as SegmentedControl from '@/components/ui/segmented-control';
import IllustrationEmptyBudgetOverview from '@/components/empty-state-illustrations/budget-overview';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetMetrics({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const { metrics, loading } = useMetrics(address);

  // Group metrics into rows of 3 for display
  const metricRows = [];
  for (let i = 0; i < metrics.length; i += 3) {
    metricRows.push(metrics.slice(i, i + 3));
  }

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

        {!loading && metrics && metrics.length > 0 ? (
          <div className='space-y-4'>
            {metricRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className='grid grid-cols-1 gap-4 md:grid-cols-3'
              >
                {row.map((metric) => (
                  <div
                    key={metric.id}
                    className='bg-bg-soft-100 rounded-lg p-4'
                  >
                    <div className='mb-2'>
                      <h4 className='text-label-sm font-medium text-text-strong-950'>
                        {metric.label}
                      </h4>
                    </div>
                    <div className='mb-2 text-paragraph-lg font-semibold text-text-strong-950'>
                      {metric.value}
                    </div>
                    {metric.description && (
                      <div className='mb-2 text-paragraph-xs text-text-sub-600'>
                        {metric.description}
                      </div>
                    )}
                    <div className='flex items-center justify-between text-paragraph-xs text-text-sub-600'>
                      <span>
                        {new Date(metric.created_at).toLocaleDateString()}
                      </span>
                      {metric.source && (
                        <span className='text-right'>
                          Source: {metric.source}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
            <IllustrationEmptyBudgetOverview className='size-[108px]' />
            <div className='text-center text-paragraph-sm text-text-soft-400'>
              {loading ? 'Loading metrics...' : 'Metrics empty.'}
            </div>
          </div>
        )}
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
