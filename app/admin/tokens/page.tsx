'use client';

import * as React from 'react';
import { RiAddLine } from '@remixicon/react';

import { useTokens } from '@/hooks/use-tokens';
import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
import { TokenForm } from '@/components/token-form';
import { TokensTable, TokenTablePagination } from '@/components/token-table';

export default function AdminTokensPage() {
  const { tokens, loading, error, refetch } = useTokens();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    refetch();
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
          <h1 className='text-title-h2 text-text-strong-950'>
            Token Management
          </h1>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Manage and organize your token collection
          </p>
        </div>
        <Button.Root onClick={() => setIsAddModalOpen(true)}>
          <Button.Icon as={RiAddLine} />
          Add Token
        </Button.Root>
      </div>

      <div className='flex-1'>
        <TokensTable data={tokens} onRefetch={refetch} />
      </div>

      <TokenTablePagination />

      <TokenForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
