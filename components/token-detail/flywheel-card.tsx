import * as React from 'react';
import { RiCoinLine, RiEditLine } from '@remixicon/react';
import { toast } from 'sonner';

import { useFlywheel } from '@/hooks/use-flywheel';
import * as Button from '@/components/ui/button';

import { FlywheelForm } from '../flywheel-form';

interface FlywheelCardProps {
  address: string;
}

export function FlywheelCard({ address }: FlywheelCardProps) {
  const { flywheel, loading, error, refetch } = useFlywheel(address);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleSuccess = () => {
    setIsEditModalOpen(false);
    refetch();
    toast.success('Flywheel updated successfully!');
  };

  return (
    <>
      <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
            Flywheel
          </h3>
          <Button.Root
            variant='neutral'
            mode='stroke'
            onClick={() => setIsEditModalOpen(true)}
            size='xsmall'
          >
            <RiEditLine className='size-4' />
          </Button.Root>
        </div>
        {loading ? (
          <div className='text-paragraph-sm text-text-sub-600'>
            Loading flywheel...
          </div>
        ) : error ? (
          <div className='text-paragraph-sm text-red-600'>
            Error loading flywheel: {error}
          </div>
        ) : flywheel && flywheel.image ? (
          <div className='w-full'>
            <img
              src={flywheel.image}
              alt='Flywheel'
              className='h-full w-full rounded-lg object-cover'
            />
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-4 py-8'>
            <div className='flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiCoinLine className='size-8 text-text-sub-600' />
            </div>
            <div className='text-center'>
              <p className='text-paragraph-sm text-text-sub-600'>
                No flywheel found for this token.
              </p>
            </div>
          </div>
        )}
      </div>

      <FlywheelForm
        flywheel={flywheel}
        tokenAddress={address}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
