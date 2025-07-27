import * as React from 'react';
import { useTranslation } from '@/contexts/translation-context';
import {
  RiAddLine,
  RiCoinLine,
  RiDeleteBinLine,
  RiEditLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { useAlpha, type Alpha } from '@/hooks/use-alpha';
import * as Button from '@/components/ui/button';
import * as SegmentedControl from '@/components/ui/segmented-control';

import { AlphaForm } from '../alpha-form';

interface AlphaCardProps {
  address: string;
}

export function AlphaCard({ address }: AlphaCardProps) {
  const { alpha, loading, error, refetch } = useAlpha(address);
  const { locale } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedAlpha, setSelectedAlpha] = React.useState<Alpha | null>(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState<'id' | 'en'>(
    locale as 'id' | 'en',
  );

  // Update selected language when locale changes
  React.useEffect(() => {
    setSelectedLanguage(locale as 'id' | 'en');
  }, [locale]);

  const handleSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedAlpha(null);
    refetch();
    toast.success('Alpha updated successfully!');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this alpha?')) {
      return;
    }

    try {
      const response = await fetch(`/api/alpha/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete alpha');
      }

      refetch();
      toast.success('Alpha deleted successfully!');
    } catch (error) {
      console.error('Error deleting alpha:', error);
      toast.error('Failed to delete alpha');
    }
  };

  // Helper function to get the appropriate title and text based on selected language
  const getLocalizedContent = (alphaItem: Alpha) => {
    // For English language tab, try to use title_en and text_en if they exist
    if (selectedLanguage === 'en') {
      return {
        title: alphaItem.title_en || alphaItem.title || 'Untitled',
        text: alphaItem.text_en || alphaItem.text || '',
      };
    }

    // For Indonesian language tab, use the default title and text
    return {
      title: alphaItem.title || 'Untitled',
      text: alphaItem.text || '',
    };
  };

  return (
    <>
      <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
            Alpha
          </h3>
          <Button.Root
            variant='neutral'
            mode='stroke'
            onClick={() => {
              setSelectedAlpha(null);
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
            Loading alpha...
          </div>
        ) : error ? (
          <div className='text-paragraph-sm text-red-600'>
            Error loading alpha: {error}
          </div>
        ) : alpha.length > 0 ? (
          <div className='space-y-4'>
            {alpha.map((alphaItem) => {
              const localizedContent = getLocalizedContent(alphaItem);
              return (
                <div
                  key={alphaItem.id}
                  className='bg-bg-soft-100 relative rounded-lg'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center justify-between'>
                        <h4 className='text-label-sm font-medium text-text-strong-950'>
                          {localizedContent.title}
                        </h4>
                      </div>
                      {localizedContent.text && (
                        <div className='mb-2 whitespace-pre-wrap text-paragraph-sm text-text-strong-950'>
                          {localizedContent.text}
                        </div>
                      )}
                      <div className='text-paragraph-xs text-text-sub-600'>
                        Created:{' '}
                        {new Date(alphaItem.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className='ml-3 flex flex-col gap-2'>
                      <Button.Root
                        variant='neutral'
                        mode='stroke'
                        onClick={() => {
                          setSelectedAlpha(alphaItem);
                          setIsEditModalOpen(true);
                        }}
                        size='xsmall'
                      >
                        <RiEditLine className='size-4' />
                      </Button.Root>
                      <Button.Root
                        variant='error'
                        mode='stroke'
                        onClick={() => handleDelete(alphaItem.id)}
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
                No alpha found for this token.
              </p>
            </div>
          </div>
        )}
      </div>

      <AlphaForm
        alpha={selectedAlpha || undefined}
        tokenAddress={address}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAlpha(null);
        }}
        onSuccess={handleSuccess}
      />
    </>
  );
}
