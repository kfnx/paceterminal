import { RiAddLine, RiCoinLine, RiDeleteBinLine, RiEditLine } from '@remixicon/react';

import type { Update } from '@/hooks/use-updates';
import * as Button from '@/components/ui/button';

interface UpdatesCardProps {
  updates: Update[];
  loading: boolean;
  error: string | null;
  onAdd: () => void;
  onEdit: (update: Update) => void;
  onDelete: (id: number) => void;
}

export function UpdatesCard({
  updates,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
}: UpdatesCardProps) {
  return (
    <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
          Updates
        </h3>
        <Button.Root
          variant='neutral'
          mode='stroke'
          onClick={onAdd}
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
                    <span>
                      {new Date(update.date).toLocaleDateString()}
                    </span>
                    <a
                      href={update.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:text-primary-600 max-w-[280px] truncate text-primary-base'
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
                    onClick={() => onEdit(update)}
                    size='xsmall'
                  >
                    <RiEditLine className='size-4' />
                  </Button.Root>
                  <Button.Root
                    variant='error'
                    mode='stroke'
                    onClick={() => onDelete(update.id)}
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
  );
}