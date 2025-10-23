'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/translation-context';

import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import useBreakpoint from '@/hooks/use-breakpoint';
import { UpdateCard } from '@/components/updates/update-card';

type UpdateWithToken = Database['public']['Tables']['updates']['Row'] & {
  tokens: {
    name: string;
    image: string | null;
    tier: number | null;
  } | null;
};

export default function UpdatesPage() {
  const { lg } = useBreakpoint();
  const { locale } = useTranslation();
  const [updates, setUpdates] = useState<UpdateWithToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('updates')
          .select(
            `
            *,
            tokens (
              name,
              image,
              tier
            )
          `,
          )
          .order('date', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setUpdates(data || []);
        }
      } catch (err) {
        setError('Failed to fetch updates');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Get latest 7 updates for the featured section
  const latestUpdates = updates.slice(0, 7);
  const remainingUpdates = updates.slice(7);

  if (loading) {
    return (
      <div className='flex-1 p-4'>
        <div className='mx-auto w-full max-w-6xl'>
          {/* Featured Updates Skeleton */}
          <div className='mb-8'>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
              {/* Left column skeleton */}
              <div className='hidden lg:order-1 lg:block lg:space-y-4'>
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className='animate-pulse rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4'
                  >
                    <div className='mb-3 h-10 w-10 rounded-full bg-bg-weak-50'></div>
                    <div className='mb-2 h-4 w-3/4 rounded bg-bg-weak-50'></div>
                    <div className='h-3 w-1/2 rounded bg-bg-weak-50'></div>
                  </div>
                ))}
              </div>

              {/* Center large card skeleton */}
              <div className='lg:order-2 lg:col-span-2'>
                <div className='animate-pulse rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
                  <div className='mb-4 h-48 w-full rounded bg-bg-weak-50 lg:h-64'></div>
                  <div className='mb-3 h-6 w-3/4 rounded bg-bg-weak-50'></div>
                  <div className='mb-2 h-4 w-full rounded bg-bg-weak-50'></div>
                  <div className='mb-4 h-4 w-5/6 rounded bg-bg-weak-50'></div>
                  <div className='flex items-center gap-2'>
                    <div className='h-6 w-6 rounded-full bg-bg-weak-50'></div>
                    <div className='h-3 w-20 rounded bg-bg-weak-50'></div>
                  </div>
                </div>
              </div>

              {/* Right column skeleton */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-3 lg:grid-cols-1'>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className='animate-pulse rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4'
                  >
                    <div className='mb-3 h-10 w-10 rounded-full bg-bg-weak-50'></div>
                    <div className='mb-2 h-4 w-3/4 rounded bg-bg-weak-50'></div>
                    <div className='h-3 w-1/2 rounded bg-bg-weak-50'></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Masonry grid skeleton */}
          <div className='columns-1 gap-4 space-y-4 md:columns-2 lg:columns-4'>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className='animate-pulse break-inside-avoid rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4'
              >
                <div className='mb-3 h-10 w-10 rounded-full bg-bg-weak-50'></div>
                <div className='mb-3 h-4 w-5/6 rounded bg-bg-weak-50'></div>
                <div className='mb-2 h-3 w-full rounded bg-bg-weak-50'></div>
                <div className='h-3 w-3/4 rounded bg-bg-weak-50'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 px-4 py-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='rounded-lg border border-error-base bg-red-alpha-10 p-6 text-center'>
            <p className='text-error-base'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 p-4'>
      <div className='mx-auto w-full max-w-6xl overflow-hidden'>
        {updates.length === 0 ? (
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-8 text-center'>
            <p className='text-text-sub-600'>
              {locale === 'id' ? 'Belum ada pembaruan' : 'No updates available'}
            </p>
          </div>
        ) : (
          <>
            {/* Latest Updates Section */}
            {latestUpdates.length > 0 && (
              <div className='mb-8'>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
                  {/* Center - Large featured card (first update) - Shows first on mobile */}
                  <div className='lg:order-2 lg:col-span-2'>
                    <UpdateCard
                      update={latestUpdates[0]}
                      variant='large'
                      locale={locale}
                    />
                  </div>

                  {/* Left column - 2nd and 3rd updates */}
                  {lg ? (
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-1 lg:grid-cols-1'>
                      {latestUpdates[1] && (
                        <UpdateCard
                          update={latestUpdates[1]}
                          variant='medium'
                          locale={locale}
                        />
                      )}
                      {latestUpdates[2] && (
                        <UpdateCard
                          update={latestUpdates[2]}
                          variant='medium'
                          locale={locale}
                        />
                      )}
                    </div>
                  ) : (
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-1 lg:grid-cols-1'>
                      {latestUpdates[1] && (
                        <UpdateCard
                          update={latestUpdates[1]}
                          variant='small'
                          locale={locale}
                        />
                      )}
                      {latestUpdates[2] && (
                        <UpdateCard
                          update={latestUpdates[2]}
                          variant='small'
                          locale={locale}
                        />
                      )}
                    </div>
                  )}

                  {/* Right column - 4th through 7th updates */}
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-3 lg:grid-cols-1'>
                    {latestUpdates[3] && (
                      <UpdateCard
                        update={latestUpdates[3]}
                        variant='small'
                        locale={locale}
                      />
                    )}
                    {latestUpdates[4] && (
                      <UpdateCard
                        update={latestUpdates[4]}
                        variant='small'
                        locale={locale}
                      />
                    )}
                    {latestUpdates[5] && (
                      <UpdateCard
                        update={latestUpdates[5]}
                        variant='small'
                        locale={locale}
                      />
                    )}
                    {latestUpdates[6] && (
                      <UpdateCard
                        update={latestUpdates[6]}
                        variant='small'
                        locale={locale}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* All Updates Masonry Grid */}
            {remainingUpdates.length > 0 && (
              <div className='columns-1 gap-4 space-y-4 md:columns-2 lg:columns-4'>
                {remainingUpdates.map((update) => (
                  <>
                    {lg ? (
                      <UpdateCard
                        key={update.id}
                        update={update}
                        variant='masonry'
                        locale={locale}
                      />
                    ) : (
                      <UpdateCard
                        key={update.id}
                        update={update}
                        variant='small'
                        locale={locale}
                      />
                    )}
                  </>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
