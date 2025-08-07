import * as React from 'react';
import { useTranslation } from '@/contexts/translation-context';
import {
  RiAddLine,
  RiCoinLine,
  RiDeleteBinLine,
  RiEditLine,
} from '@remixicon/react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { compactNumFormatter } from '@/utils/number-formatter';
import {
  useMetricsDynamic,
  type MetricDynamicWithValues,
} from '@/hooks/use-metrics-dynamic';
import * as Button from '@/components/ui/button';
import * as SegmentedControl from '@/components/ui/segmented-control';

import ChartStepLine from '../chart-step-line';
import { MetricsDynamicForm } from '../metrics-dynamic-form';

interface MetricsCardProps {
  address: string;
}

export function MetricsDynamicCard({ address }: MetricsCardProps) {
  const {
    metricsDynamic: metrics,
    loading,
    error,
    refetch,
  } = useMetricsDynamic(address);
  const { locale } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedMetric, setSelectedMetric] =
    React.useState<MetricDynamicWithValues | null>(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState<'id' | 'en'>(
    locale as 'id' | 'en',
  );

  // Update selected language when locale changes
  React.useEffect(() => {
    setSelectedLanguage(locale as 'id' | 'en');
  }, [locale]);

  const handleSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedMetric(null);
    refetch();
    toast.success('Metric Dynamic updated successfully!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this metric?')) {
      return;
    }

    try {
      const response = await fetch(`/api/metrics-dynamic/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete metric');
      }

      refetch();
      toast.success('Metric deleted successfully!');
    } catch (error) {
      console.error('Error deleting metric:', error);
      toast.error('Failed to delete metric');
    }
  };

  const getLocalizedLabel = (metric: MetricDynamicWithValues) => {
    if (selectedLanguage === 'en') {
      return metric.label_en || metric.label;
    }
    return metric.label;
  };

  return (
    <>
      <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
            Metrics Dynamic
          </h3>
          <Button.Root
            variant='neutral'
            mode='stroke'
            onClick={() => {
              setSelectedMetric(null);
              setIsEditModalOpen(true);
            }}
            size='xsmall'
          >
            <RiAddLine className='size-4' />
          </Button.Root>
        </div>

        {/* Language Tabs */}
        <SegmentedControl.Root
          value={selectedLanguage}
          onValueChange={(value) => setSelectedLanguage(value as 'id' | 'en')}
          className='mb-4 w-32'
        >
          <SegmentedControl.List>
            <SegmentedControl.Trigger value='id'>ID</SegmentedControl.Trigger>
            <SegmentedControl.Trigger value='en'>EN</SegmentedControl.Trigger>
          </SegmentedControl.List>
        </SegmentedControl.Root>

        {loading ? (
          <div className='text-paragraph-sm text-text-sub-600'>
            Loading metrics...
          </div>
        ) : error ? (
          <div className='text-paragraph-sm text-red-600'>
            Error loading metrics: {error}
          </div>
        ) : metrics.length > 0 ? (
          <div className='space-y-6'>
            {metrics.map((metric: MetricDynamicWithValues) => {
              const isLatestPositive = metric.last.percentChange >= 0;

              return (
                <div
                  key={metric.id}
                  className='flex items-start justify-between rounded-lg'
                >
                  <div className='flex-1'>
                    <div className='flex justify-between'>
                      <p className='pb-2 text-paragraph-lg text-text-strong-950'>
                        {getLocalizedLabel(metric)}
                      </p>
                      <span>Ordering: {metric.ordering}</span>
                    </div>
                    {metric.values.length > 0 ? (
                      <ChartStepLine
                        data={metric.values.map((value) => ({
                          time: format(new Date(value.time), 'MMM d'),
                          value: value.value,
                        }))}
                        index='time'
                        categories={['value']}
                        tooltipContent={(v: { payload: any }) => (
                          <div className='flex flex-col gap-1 p-1'>
                            <p className='text-text-sub-600'>
                              {v.payload[0].payload.time}
                            </p>
                            <b>{v.payload[0].payload.value}</b>
                          </div>
                        )}
                        xAxisProps={{
                          tickFormatter: (value) =>
                            format(
                              new Date(value),
                              'MMM d',
                            ).toLocaleUpperCase(),
                          tickMargin: 8,
                        }}
                        yAxisProps={{
                          tickFormatter: (value) =>
                            compactNumFormatter.format(value),
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
                      {selectedLanguage === 'en' ? 'Latest' : 'Terbaru'}:{' '}
                      <b>
                        {metric.last.value}{' '}
                        <span>
                          {selectedLanguage === 'en'
                            ? metric.unit_en
                            : metric.unit}
                        </span>
                      </b>
                      (
                      {metric.last.time &&
                        format(new Date(metric.last.time), 'MMM d, yyyy')}
                      )
                      <span
                        className={`text-paragraph-sm ${isLatestPositive ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {isLatestPositive ? '+' : ''}
                        {metric.last.percentChange.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className='ml-3 flex w-fit flex-col gap-2'>
                    <Button.Root
                      variant='neutral'
                      mode='stroke'
                      onClick={() => {
                        setSelectedMetric(metric);
                        setIsEditModalOpen(true);
                      }}
                      size='xsmall'
                    >
                      <RiEditLine className='size-4' />
                    </Button.Root>
                    <Button.Root
                      variant='error'
                      mode='stroke'
                      onClick={() => handleDelete(metric.id)}
                      size='xsmall'
                    >
                      <RiDeleteBinLine className='size-4' />
                    </Button.Root>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-4 py-8'>
            <div className='flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiCoinLine className='size-8 text-text-sub-600' />
            </div>
            <div className='text-center'>
              <p className='text-paragraph-sm text-text-sub-600'>
                No metrics found for this token.
              </p>
            </div>
          </div>
        )}
      </div>

      <MetricsDynamicForm
        metric={selectedMetric || undefined}
        tokenAddress={address}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMetric(null);
        }}
        onSuccess={handleSuccess}
      />
    </>
  );
}
