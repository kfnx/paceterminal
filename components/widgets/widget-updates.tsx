'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { RiExternalLinkLine, RiNewsLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import { useUpdates } from '@/hooks/use-updates';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import * as WidgetBox from '@/components/widget-box';

type UpdateItemProps = {
  title: string;
  description: string;
  link: string;
  image?: string;
  createdAt: string;
};

function UpdateItem({
  title,
  description,
  link,
  image,
  createdAt,
}: UpdateItemProps) {
  return (
    <div className='bg-bg-soft-100 rounded-lg p-4'>
      <div className='flex gap-4'>
        {image && (
          <div className='flex-shrink-0'>
            <img
              src={image}
              alt={title}
              className='h-20 w-20 rounded-lg object-cover'
            />
          </div>
        )}

        <div className='flex flex-1 flex-col gap-3'>
          <div className='flex items-start justify-between'>
            <h4 className='text-label-sm font-medium text-text-strong-950'>
              {title}
            </h4>
            <Link
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-primary-600 flex items-center gap-1 text-paragraph-xs text-primary-base'
            >
              <RiExternalLinkLine className='size-3' />
            </Link>
          </div>

          <div className='text-paragraph-sm text-text-strong-950'>
            {description}
          </div>

          <div className='flex items-center justify-between text-paragraph-xs text-text-sub-600'>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
            <Link
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-primary-600 text-primary-base'
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WidgetUpdates({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const { updates, loading } = useUpdates(address);

  return (
    <WidgetBox.Root {...rest} id='updates'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiNewsLine} />
        Updates
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />

        <div className='w-full pb-1'>
          {!loading && updates && updates.length > 0 ? (
            <div className='space-y-4'>
              {updates.map((update) => (
                <UpdateItem
                  key={update.id}
                  title={update.title}
                  description={update.description}
                  link={update.link}
                  image={update.image || undefined}
                  createdAt={update.created_at}
                />
              ))}
            </div>
          ) : (
            <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
              <IllustrationEmptySavedActions className='size-[108px]' />
              <div className='text-center text-paragraph-sm text-text-soft-400'>
                {loading ? 'Loading updates...' : 'No updates available.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetUpdatesEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
      id='updates'
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiNewsLine} />
        Updates
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptySavedActions className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No updates available.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
