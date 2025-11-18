'use client';

import * as React from 'react';
import {
  RiExternalLinkLine,
  RiMoneyDollarCircleLine,
  RiRefreshLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { useAdsClicks } from '@/hooks/use-ads-clicks';
import * as Alert from '@/components/ui/alert';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';

export default function AdClicksPage() {
  const { adsClicks, stats, loading, error, refetch } = useAdsClicks();

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Ad clicks data refreshed');
    } catch (err) {
      toast.error('Failed to refresh data');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Loading ad clicks data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Alert.Root status='error' variant='light'>
          <Alert.Icon />
          <div>Failed to load ad clicks: {error}</div>
        </Alert.Root>
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col p-6'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-title-h2 text-text-strong-950'>
            Ad Click Analytics
          </h1>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Track and analyze advertisement click performance
          </p>
        </div>
        <Button.Root onClick={handleRefresh} variant='outlined'>
          <Button.Icon as={RiRefreshLine} />
          Refresh
        </Button.Root>
      </div>

      {/* Stats Cards */}
      <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-paragraph-sm text-text-sub-600'>
                Total Clicks
              </p>
              <p className='mt-2 text-title-h3 font-semibold text-text-strong-950'>
                {stats.totalClicks.toLocaleString()}
              </p>
            </div>
            <div className='rounded-lg bg-primary-surface p-3'>
              <RiMoneyDollarCircleLine className='size-6 text-primary-base' />
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-paragraph-sm text-text-sub-600'>Left Ad</p>
              <p className='mt-2 text-title-h3 font-semibold text-text-strong-950'>
                {stats.leftClicks.toLocaleString()}
              </p>
            </div>
            <Badge.Root variant='filled' color='blue'>
              {stats.totalClicks > 0
                ? Math.round((stats.leftClicks / stats.totalClicks) * 100)
                : 0}
              %
            </Badge.Root>
          </div>
        </div>

        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-paragraph-sm text-text-sub-600'>Right Ad</p>
              <p className='mt-2 text-title-h3 font-semibold text-text-strong-950'>
                {stats.rightClicks.toLocaleString()}
              </p>
            </div>
            <Badge.Root variant='filled' color='green'>
              {stats.totalClicks > 0
                ? Math.round((stats.rightClicks / stats.totalClicks) * 100)
                : 0}
              %
            </Badge.Root>
          </div>
        </div>

        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-paragraph-sm text-text-sub-600'>Unique Ads</p>
              <p className='mt-2 text-title-h3 font-semibold text-text-strong-950'>
                {stats.uniqueAds}
              </p>
            </div>
            <Badge.Root variant='filled' color='purple'>
              {adsClicks.length}
            </Badge.Root>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {adsClicks.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-lg border border-stroke-soft-200 py-12'>
          <RiMoneyDollarCircleLine className='text-text-sub-400 mb-4 size-12' />
          <h3 className='mb-2 text-title-h5 text-text-strong-950'>
            No ad clicks yet
          </h3>
          <p className='text-paragraph-sm text-text-sub-600'>
            Ad clicks will appear here once users interact with your ads
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-lg border border-stroke-soft-200'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-bg-weak-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-subheading-xs uppercase text-text-sub-600'>
                    Position
                  </th>
                  <th className='px-6 py-3 text-left text-subheading-xs uppercase text-text-sub-600'>
                    Target URL
                  </th>
                  <th className='px-6 py-3 text-right text-subheading-xs uppercase text-text-sub-600'>
                    Click Count
                  </th>
                  <th className='px-6 py-3 text-right text-subheading-xs uppercase text-text-sub-600'>
                    % of Total
                  </th>
                  <th className='px-6 py-3 text-right text-subheading-xs uppercase text-text-sub-600'>
                    Last Updated
                  </th>
                  <th className='px-6 py-3 text-right text-subheading-xs uppercase text-text-sub-600'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-stroke-soft-200 bg-bg-white-0'>
                {adsClicks.map((record) => {
                  const percentage =
                    stats.totalClicks > 0
                      ? ((record.click_count / stats.totalClicks) * 100).toFixed(
                          1,
                        )
                      : '0';

                  return (
                    <tr
                      key={record.id}
                      className='hover:bg-bg-weak-50 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <Badge.Root
                          variant='filled'
                          color={record.position === 'left' ? 'blue' : 'green'}
                        >
                          {record.position.toUpperCase()}
                        </Badge.Root>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <span className='max-w-md truncate text-paragraph-sm text-text-strong-950'>
                            {record.target_url}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <span className='text-paragraph-md font-semibold text-text-strong-950'>
                          {record.click_count.toLocaleString()}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <span className='text-paragraph-sm text-text-sub-600'>
                          {percentage}%
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <span className='text-paragraph-sm text-text-sub-600'>
                          {record.updated_at
                            ? new Date(record.updated_at).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )
                            : new Date(record.created_at).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <a
                          href={record.target_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-1 text-paragraph-sm text-primary-base hover:text-primary-hover transition-colors'
                        >
                          Visit
                          <RiExternalLinkLine className='size-4' />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Info */}
      {adsClicks.length > 0 && (
        <div className='mt-4 text-paragraph-sm text-text-sub-600'>
          Showing {adsClicks.length} ad{adsClicks.length !== 1 ? 's' : ''} with
          a total of {stats.totalClicks.toLocaleString()} click
          {stats.totalClicks !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
