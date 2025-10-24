'use client';

import { useState } from 'react';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCalendarLine,
} from '@remixicon/react';

import { Database } from '@/lib/database.types';
import { getTokenImageUrl } from '@/utils/image-url';
import useBreakpoint from '@/hooks/use-breakpoint';
import * as Avatar from '@/components/ui/avatar';

type UpdateWithToken = Database['public']['Tables']['updates']['Row'] & {
  tokens: {
    name: string;
    image: string | null;
    tier: number | null;
  } | null;
};

interface UpdateCardProps {
  update: UpdateWithToken;
  variant: 'large' | 'medium' | 'small' | 'masonry';
  locale: string;
}

export function UpdateCard({ update, variant, locale }: UpdateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { sm, lg } = useBreakpoint();

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderTokenName = () => {
    if (!update.tokens) return null;

    return (
      <div className='flex w-fit items-center gap-2 rounded bg-neutral-100 px-2 py-1 text-paragraph-xs font-medium text-text-strong-950  dark:text-primary-dark'>
        <Avatar.Root size='20'>
          <Avatar.Image
            src={getTokenImageUrl(update.tokens.image)}
            alt={update.tokens.name}
          />
        </Avatar.Root>
        {update.tokens.name}
      </div>
    );
  };

  const description =
    locale === 'id'
      ? update.description
      : update.description_en || update.description;

  const shouldShowExpand =
    (description.length > 200 && update.image) ||
    (description.length > 400 && !update.image) ||
    update.image;

  if (variant === 'large') {
    return (
      <div
        key={update.id}
        className='flex max-h-[600px] min-h-[500px] flex-col rounded-lg border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs transition-shadow hover:shadow-regular-md'
      >
        {update.image && (
          <div className='overflow-hidden rounded-t-lg'>
            <img
              src={update.image}
              alt='Update'
              className='h-80 w-full object-cover'
            />
          </div>
        )}
        <div className='flex flex-1 flex-col p-6'>
          <h3 className='mb-3 text-center text-label-lg font-semibold leading-tight text-text-strong-950 md:text-label-xl'>
            {locale === 'id' ? update.title : update.title_en || update.title}
          </h3>

          <div className='relative max-h-20 flex-1 overflow-hidden'>
            <p className='mb-3 text-center text-paragraph-xs leading-relaxed text-text-sub-600 md:text-paragraph-sm'>
              {description}
            </p>
          </div>

          <div className='mt-auto flex flex-col gap-3'>
            <div className='flex items-center justify-center gap-2 text-paragraph-xs text-text-soft-400'>
              <RiCalendarLine className='h-3.5 w-3.5' />
              <time dateTime={update.created_at}>
                {formatShortDate(update.date || update.created_at)}
              </time>
              {renderTokenName()}
            </div>

            <a
              href={update.link}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center justify-center gap-1 text-paragraph-xs font-medium text-primary-base transition-colors hover:text-primary-darker md:text-paragraph-sm'
            >
              {locale === 'id' ? 'Buka' : 'Read More'}
              <RiArrowDownSLine className='h-4 w-4' />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'medium') {
    return (
      <div
        key={update.id}
        className='flex h-full flex-col rounded-lg border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs transition-shadow hover:shadow-regular-md'
      >
        {update.image && (
          <div className='overflow-hidden rounded-t-lg'>
            <img
              src={update.image}
              alt='Update'
              className='h-32 w-full object-cover'
            />
          </div>
        )}
        <div className='flex flex-1 flex-col p-4'>
          <h3 className='mb-2 line-clamp-2 text-paragraph-sm font-semibold leading-snug text-text-strong-950 md:text-paragraph-md'>
            {locale === 'id' ? update.title : update.title_en || update.title}
          </h3>

          <div className='relative max-h-16 flex-1 overflow-hidden'>
            <p className='mb-3 text-paragraph-xs leading-relaxed text-text-sub-600'>
              {description}
            </p>
            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-bg-white-0 to-transparent'></div>
          </div>

          <div className='mt-auto flex flex-col gap-2'>
            <div className='flex items-center gap-2 text-paragraph-xs text-text-soft-400'>
              <RiCalendarLine className='h-3.5 w-3.5' />
              <time dateTime={update.created_at}>
                {formatShortDate(update.date || update.created_at)}
              </time>
              {renderTokenName()}
            </div>

            <a
              href={update.link}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-paragraph-xs font-medium text-primary-base transition-colors hover:text-primary-darker'
            >
              {locale === 'id' ? 'Buka' : 'Read More'}
              <RiArrowDownSLine className='h-3.5 w-3.5' />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'small') {
    return (
      <a
        key={update.id}
        href={update.link}
        target='_blank'
        rel='noopener noreferrer'
        className='group flex items-start gap-3 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 shadow-regular-xs transition-all hover:shadow-regular-md'
      >
        {update.image && (
          <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
            <img
              src={update.image}
              alt='Update'
              className='h-full w-full object-cover'
            />
          </div>
        )}
        <div className='flex min-w-0 flex-1 flex-col justify-between gap-2'>
          <h3 className='line-clamp-3 text-paragraph-md font-semibold text-text-strong-950'>
            {locale === 'id' ? update.title : update.title_en || update.title}
          </h3>
          {!lg && (
            <div className='relative max-h-16 flex-1 overflow-hidden'>
              <p className='mb-3 text-paragraph-xs leading-relaxed text-text-sub-600'>
                {description}
              </p>
              <div className='pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-bg-white-0 to-transparent'></div>
            </div>
          )}
          <div className='flex gap-1 lg:flex-col'>
            <div className='flex items-center gap-1.5 text-paragraph-xs text-text-soft-400'>
              <RiCalendarLine className='h-3 w-3' />
              <time dateTime={update.created_at}>
                {formatShortDate(update.date || update.created_at)}
              </time>
            </div>
            {renderTokenName()}
          </div>
          {/* <div className='inline-flex items-center gap-1 text-paragraph-xs font-medium text-primary-base transition-colors hover:text-primary-darker'>
            {locale === 'id' ? 'Buka' : 'Read More'}
            <RiArrowDownSLine className='h-3.5 w-3.5' />
          </div> */}
        </div>
        {/* <RiArrowDownSLine className='h-5 w-5 flex-shrink-0 text-text-sub-600 transition-transform group-hover:translate-x-1' /> */}
      </a>
    );
  }

  return (
    <article
      key={update.id}
      className='break-inside-avoid rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs transition-shadow hover:shadow-regular-md'
    >
      {update.image && (
        <div className='mb-4 overflow-hidden rounded-lg border border-stroke-soft-200'>
          <img
            src={update.image}
            alt='Update'
            className='h-auto w-full object-cover'
          />
        </div>
      )}

      <h3 className='mb-3 text-paragraph-md font-semibold leading-snug text-text-strong-950 md:text-paragraph-lg'>
        {locale === 'id' ? update.title : update.title_en || update.title}
      </h3>

      <div className='flex items-center gap-2 text-paragraph-xs text-text-soft-400'>
        <RiCalendarLine className='h-3.5 w-3.5' />
        <time dateTime={update.created_at}>
          {formatShortDate(update.date || update.created_at)}
        </time>
        {renderTokenName()}
      </div>

      <div
        className={`relative ${!isExpanded && shouldShowExpand ? 'max-h-32 overflow-hidden' : ''}`}
      >
        <p className='text-paragraph-xs leading-relaxed text-text-sub-600 md:text-paragraph-sm'>
          {description}
        </p>

        {!isExpanded && shouldShowExpand && (
          <div className='pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg-white-0 to-transparent'></div>
        )}
      </div>

      {shouldShowExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='mt-3 flex items-center gap-1 text-paragraph-xs font-medium text-primary-base transition-colors hover:text-primary-darker md:text-paragraph-sm'
        >
          {isExpanded ? (
            <>
              {locale === 'id' ? 'Tutup' : 'Show less'}
              <RiArrowUpSLine className='h-4 w-4' />
            </>
          ) : (
            <>
              {locale === 'id' ? 'Buka' : 'Read More'}
              <RiArrowDownSLine className='h-4 w-4' />
            </>
          )}
        </button>
      )}
    </article>
  );
}
