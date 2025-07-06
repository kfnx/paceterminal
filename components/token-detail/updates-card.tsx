import * as React from 'react';
import {
  RiAddLine,
  RiCoinLine,
  RiDeleteBinLine,
  RiEditLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { useUpdates, type Update } from '@/hooks/use-updates';
import * as Button from '@/components/ui/button';

import { UpdatesForm } from '../updates-form';

interface UpdatesCardProps {
  address: string;
}

export function UpdatesCard({ address }: UpdatesCardProps) {
  const { updates, loading, error, refetch } = useUpdates(address);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedUpdates, setSelectedUpdates] = React.useState<Update | null>(
    null,
  );

  const handleSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedUpdates(null);
    refetch();
    toast.success('Update saved successfully!');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this update?')) {
      return;
    }

    try {
      const response = await fetch(`/api/updates/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete update');
      }

      refetch();
      toast.success('Update deleted successfully!');
    } catch (error) {
      console.error('Error deleting update:', error);
      toast.error('Failed to delete update');
    }
  };

  return (
    <>
      <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
            Updates
          </h3>
          <Button.Root
            variant='neutral'
            mode='stroke'
            onClick={() => {
              setSelectedUpdates(null);
              setIsEditModalOpen(true);
            }}
            size='xsmall'
          >
            <RiAddLine className='size-4' />
          </Button.Root>
        </div>
        {loading ? (
          <div className='text-paragraph-sm text-text-sub-600'>
            Loading updates...
          </div>
        ) : error ? (
          <div className='text-paragraph-sm text-red-600'>
            Error loading updates: {error}
          </div>
        ) : updates.length > 0 ? (
          <div className='space-y-4'>
            {updates.map((update) => (
              <div
                key={update.id}
                className='bg-bg-soft-100 relative rounded-lg'
              >
                <div className='flex gap-4'>
                  {update.image ? (
                    <div className='flex-shrink-0'>
                      <img
                        src={update.image}
                        alt={update.title}
                        className='h-20 w-20 rounded-lg object-cover'
                      />
                    </div>
                  ) : (
                    <div className='size-20 flex-shrink-0 rounded-lg border border-stroke-soft-200 text-center text-label-xs'>
                      no image
                    </div>
                  )}

                  <div className='flex flex-1 flex-col gap-3'>
                    <h4 className='text-label-sm font-medium text-text-strong-950'>
                      {update.title}
                    </h4>

                    <div className='text-paragraph-sm text-text-strong-950'>
                      {update.description}
                    </div>

                    <div className='flex items-center justify-between text-paragraph-xs text-text-sub-600'>
                      <span>{new Date(update.date).toLocaleDateString()}</span>
                      <a
                        href={update.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-primary-600 max-w-[340px] truncate text-primary-base'
                        title={update.link}
                      >
                        {update.link}
                      </a>
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Button.Root
                      variant='neutral'
                      mode='stroke'
                      onClick={() => {
                        setSelectedUpdates(update);
                        setIsEditModalOpen(true);
                      }}
                      size='xsmall'
                    >
                      <RiEditLine className='size-4' />
                    </Button.Root>
                    <Button.Root
                      variant='error'
                      mode='stroke'
                      onClick={() => handleDelete(update.id)}
                      size='xsmall'
                    >
                      <RiDeleteBinLine className='size-4' />
                    </Button.Root>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-4 py-8'>
            <div className='flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiCoinLine className='size-8 text-text-sub-600' />
            </div>
            <div className='text-center'>
              <p className='text-paragraph-sm text-text-sub-600'>
                No updates found for this token.
              </p>
            </div>
          </div>
        )}
      </div>
      <UpdatesForm
        update={selectedUpdates || undefined}
        tokenAddress={address}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUpdates(null);
        }}
        onSuccess={handleSuccess}
      />
    </>
  );
}
