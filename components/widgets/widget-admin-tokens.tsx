'use client';

import * as React from 'react';
import { RiCoinLine, RiSearch2Line } from '@remixicon/react';
import { useAtomValue } from 'jotai';

import { cnExt } from '@/utils/cn';
import { useTokens } from '@/hooks/use-tokens';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import { TokensTable, TokenTablePagination } from '@/components/token-table';
import {
  tokenSearchAtom,
  tokenTierFilterAtom,
  tokenSortFieldAtom,
  tokenSortOrderAtom
} from '@/app/admin/tokens/filters';

import IconCmd from '~/icons/icon-cmd.svg';

export default function WidgetAdminTokens({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Get filter values to reset pagination when they change
  const search = useAtomValue(tokenSearchAtom);
  const tierFilter = useAtomValue(tokenTierFilterAtom);
  const sortField = useAtomValue(tokenSortFieldAtom);
  const sortOrder = useAtomValue(tokenSortOrderAtom);

  const { tokens, total, totalPages, loading, error, refetch } = useTokens(currentPage, pageSize);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, tierFilter, sortField, sortOrder]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div
      className={cnExt(
        'relative left-1/2 flex w-screen -translate-x-1/2 flex-col gap-6 px-4 lg:w-auto lg:px-0',
        className,
      )}
      {...rest}
    >
      <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
        <div className='flex flex-1 items-center gap-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiCoinLine className='size-5 text-text-sub-600' />
          </div>
          <div>
            <div className='text-label-sm text-text-strong-950'>
              Admin Tokens
            </div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              Manage and view all tokens in the system.
            </div>
          </div>
        </div>
        <div className='flex gap-3'>
          <Input.Root size='small' className='max-w-lg lg:w-[300px]'>
            <Input.Wrapper>
              <Input.Icon as={RiSearch2Line} />
              <Input.Input placeholder='Search tokens...' />
              <Kbd.Root>
                <IconCmd className='size-2.5' />1
              </Kbd.Root>
            </Input.Wrapper>
          </Input.Root>
          <Button.Root variant='neutral' mode='stroke' size='small'>
            Add Token
          </Button.Root>
        </div>
      </div>

      {loading && (
        <div className='flex items-center justify-center py-8'>
          <div className='text-paragraph-sm text-text-sub-600'>
            Loading tokens...
          </div>
        </div>
      )}

      {error && (
        <div className='flex items-center justify-center py-8'>
          <div className='text-paragraph-sm text-red-600'>Error: {error}</div>
        </div>
      )}

      {!loading && !error && tokens.length === 0 && (
        <div className='flex items-center justify-center py-8'>
          <div className='text-paragraph-sm text-text-sub-600'>
            No tokens found
          </div>
        </div>
      )}

      {!loading && !error && tokens.length > 0 && (
        <>
          <TokensTable
            data={tokens}
            onRefetch={refetch}
            pagination={{
              currentPage,
              totalPages,
              pageSize,
              total,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
          <TokenTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            total={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
}
