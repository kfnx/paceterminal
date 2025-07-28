import * as React from 'react';
import { useTranslation } from '@/contexts/translation-context';
import {
  RiAddLine,
  RiCoinLine,
  RiDeleteBinLine,
  RiEditLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { useMetrics, type Metric } from '@/hooks/use-metrics';
import * as Button from '@/components/ui/button';
import * as SegmentedControl from '@/components/ui/segmented-control';

import { MetricsForm } from '../metrics-form';

interface MetricsCardProps {
  address: string;
}

export function MetricsCard({ address }: MetricsCardProps) {
  const { metrics, loading, error, refetch } = useMetrics(address);
  const { locale } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedMetric, setSelectedMetric] = React.useState<Metric | null>(
    null,
  );
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
    toast.success('Metric updated successfully!');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this metric?')) {
      return;
    }

    try {
      const response = await fetch(`/api/metrics/delete?id=${id}`, {
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

  // Helper function to get the appropriate label, value, and description based on selected language
  const getLocalizedContent = (metric: Metric) => {
    // For English language tab, try to use label_en, value_en, and description_en if they exist
    if (selectedLanguage === 'en') {
      return {
        label: metric.label_en || metric.label,
        value: metric.value_en || metric.value,
        description: metric.description_en || metric.description,
      };
    }

    // For Indonesian language tab, use the default label, value, and description
    return {
      label: metric.label,
      value: metric.value,
      description: metric.description,
    };
  };

  return (
    <>
      <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
            Metrics
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
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {metrics.map((metric: Metric, index: number) => {
              const localizedContent = getLocalizedContent(metric);
              return (
                <div key={metric.id} className='relative rounded-lg p-2'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center justify-between gap-2'>
                        <h4 className='text-label-sm font-medium text-text-strong-950'>
                          {localizedContent.label}
                        </h4>
                      </div>
                      <div className='mb-2 text-paragraph-lg font-semibold text-text-strong-950'>
                        {localizedContent.value}
                      </div>
                      {localizedContent.description && (
                        <div className='mb-2 text-paragraph-xs text-text-sub-600'>
                          {localizedContent.description}
                        </div>
                      )}
                      {metric.source && (
                        <p className='text-paragraph-xs text-text-sub-600'>
                          Source: {metric.source}
                        </p>
                      )}
                      <p className='text-paragraph-xs text-text-soft-400'>
                        {new Date(metric.created_at).toLocaleDateString()}
                      </p>

                      {metric.ordering && (
                        <p className='text-paragraph-xs text-text-soft-400'>
                          Order: {metric.ordering}
                        </p>
                      )}
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

      <MetricsForm
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
