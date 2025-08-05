'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/contexts/translation-context';
import { RiAddLine, RiLineChartLine } from '@remixicon/react';
import { format } from 'date-fns';

import { cnExt } from '@/utils/cn';
import { useMetrics } from '@/hooks/use-metrics';
import { useMetricsDynamic } from '@/hooks/use-metrics-dynamic';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as SegmentedControl from '@/components/ui/segmented-control';
import IllustrationEmptyBudgetOverview from '@/components/empty-state-illustrations/budget-overview';
import * as WidgetBox from '@/components/widget-box';

import ChartStepLine from '../chart-step-line';

export default function WidgetMetrics({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const { metrics, loading } = useMetrics(address);
  const { metricsDynamic, loading: loadingDynamic } =
    useMetricsDynamic(address);
  const { locale } = useTranslation();
  const [selectedMetric, setSelectedMetric] = React.useState('static');

  // Group metrics into rows of 3 for display
  const metricRows = [];
  for (let i = 0; i < metrics.length; i += 3) {
    metricRows.push(metrics.slice(i, i + 3));
  }

  // Helper function to get the appropriate field based on locale
  const getLocalizedField = (metric: any, field: string) => {
    if (locale === 'en') {
      const englishField = `${field}_en`;
      return metric[englishField] || metric[field];
    }
    return metric[field];
  };

  return (
    <WidgetBox.Root {...rest} id='metrics'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiLineChartLine} />
        Metrics
        <SegmentedControl.Root
          defaultValue='static'
          value={selectedMetric}
          onValueChange={(value) => setSelectedMetric(value)}
        >
          <SegmentedControl.List>
            <SegmentedControl.Trigger value='static'>
              Static
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger value='dynamic'>
              Dynamic
            </SegmentedControl.Trigger>
          </SegmentedControl.List>
        </SegmentedControl.Root>
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />
        {selectedMetric === 'static' ? (
          <div className='flex flex-col'>
            {!loading && metrics && metrics.length > 0 ? (
              <div className='space-y-2'>
                {metricRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className='grid grid-cols-1 gap-4 md:grid-cols-3'
                  >
                    {row.map((metric) => (
                      <div
                        key={metric.id}
                        className='bg-bg-soft-100 flex flex-col rounded-lg px-4 py-3'
                      >
                        <div className='mb-2'>
                          <h4 className='text-label-sm font-medium text-text-strong-950'>
                            {getLocalizedField(metric, 'label')}
                          </h4>
                        </div>
                        <div className='mb-2 flex-1 text-paragraph-lg font-semibold text-text-strong-950'>
                          {getLocalizedField(metric, 'value')}
                        </div>
                        {getLocalizedField(metric, 'description') && (
                          <div className='mb-2 text-paragraph-xs text-text-sub-600'>
                            {getLocalizedField(metric, 'description')}
                          </div>
                        )}
                        {metric.source && (
                          <span className='text-paragraph-xs text-text-sub-600'>
                            Source: {metric.source}
                          </span>
                        )}
                        <span className='text-paragraph-xs text-text-sub-600'>
                          {new Date(metric.created_at).toLocaleDateString()}
                        </span>
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
        ) : (
          <div className='flex flex-col'>
            {!loadingDynamic && metricsDynamic && metricsDynamic.length > 0 ? (
              <div className='space-y-6 p-5'>
                {metricsDynamic.map((metric) => {
                  // Transform the values data for the chart
                  const chartData = metric.values.map((value) => ({
                    date: new Date(value.time).toISOString(),
                    value: value.value,
                  }));

                  // Get localized label
                  const getLocalizedLabel = (metric: any) => {
                    if (locale === 'en') {
                      return metric.label_en || metric.label_id;
                    }
                    return metric.label_id;
                  };

                  return (
                    <div key={metric.id} className='space-y-2'>
                      <p className='pb-2 text-paragraph-lg text-text-strong-950'>
                        {getLocalizedLabel(metric)}
                      </p>
                      {chartData.length > 0 ? (
                        <ChartStepLine
                          data={chartData}
                          index='date'
                          categories={['value']}
                          xAxisProps={{
                            tickFormatter: (value) =>
                              format(
                                new Date(value),
                                'MMM d',
                              ).toLocaleUpperCase(),
                            tickMargin: 8,
                          }}
                        />
                      ) : (
                        <div className='border-border-200 bg-bg-soft-100 flex h-[200px] items-center justify-center rounded-lg border'>
                          <div className='text-center text-paragraph-sm text-text-soft-400'>
                            No data available
                          </div>
                        </div>
                      )}
                      <div className='flex items-center gap-2'>
                        Latest:{' '}
                        <b>{metric.values[metric.values.length - 1].value}</b>(
                        {format(
                          new Date(
                            metric.values[metric.values.length - 1].time,
                          ),
                          'MMM d, yyyy',
                        )}
                        )
                        {(() => {
                          const currentValue =
                            metric.values[metric.values.length - 1].value;
                          const previousValue =
                            metric.values[metric.values.length - 2].value;
                          const percentageChange =
                            previousValue !== 0
                              ? ((currentValue - previousValue) /
                                  previousValue) *
                                100
                              : 0;
                          const isPositive = percentageChange >= 0;
                          return (
                            <span
                              className={`text-paragraph-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {isPositive ? '+' : ''}
                              {percentageChange.toFixed(2)}%
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
                <IllustrationEmptyBudgetOverview className='size-[108px]' />
                <div className='text-center text-paragraph-sm text-text-soft-400'>
                  {loadingDynamic
                    ? 'Loading dynamic metrics...'
                    : 'No dynamic metrics available.'}
                </div>
              </div>
            )}
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
