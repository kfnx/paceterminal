'use client';

import * as React from 'react';
import { RiAddLine } from '@remixicon/react';
import { useAtomValue } from 'jotai';

import { useTokens } from '@/hooks/use-tokens';
import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
import { TokenForm } from '@/components/token-form';
import { TokensTable, TokenTablePagination } from '@/components/token-table';

import {
  Filters,
  tokenSearchAtom,
  tokenSortFieldAtom,
  tokenSortOrderAtom,
  tokenTierFilterAtom,
} from './filters';

export default function AdminTokensPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Get filter values to reset pagination when they change
  const search = useAtomValue(tokenSearchAtom);
  const tierFilter = useAtomValue(tokenTierFilterAtom);
  const sortField = useAtomValue(tokenSortFieldAtom);
  const sortOrder = useAtomValue(tokenSortOrderAtom);

  const { tokens, total, page, totalPages, loading, error, refetch } =
    useTokens(currentPage, pageSize);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, tierFilter, sortField, sortOrder]);

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (loading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-paragraph-lg text-text-sub-600'>
          Loading tokens...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6'>
        <Alert.Root status='error' variant='light'>
          <Alert.Icon />
          <div>Failed to load tokens: {error}</div>
        </Alert.Root>
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-text-strong-950'>Token Management</h1>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Manage and organize your token collection
          </p>
        </div>
        <Button.Root onClick={() => setIsAddModalOpen(true)}>
          <Button.Icon as={RiAddLine} />
          Add Token
        </Button.Root>
      </div>

      <div className='flex-1 space-y-4'>
        <Filters />
        <TokensTable data={tokens} onRefetch={refetch} />
        <TokenTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <TokenForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
