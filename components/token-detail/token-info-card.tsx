import * as React from 'react';
import { RiEditLine } from '@remixicon/react';

import { useToken } from '@/hooks/use-token';
import * as Button from '@/components/ui/button';

import { TokenForm } from '../token-form';

interface TokenInfoCardProps {
  address: string;
}

const getTierLabel = (tier: number) => {
  switch (tier) {
    case 1:
      return 'S Tier';
    case 2:
      return 'A Tier';
    case 3:
      return 'B Tier';
    case 4:
      return 'C Tier';
    default:
      return 'Unknown';
  }
};

export function TokenInfoCard({ address }: TokenInfoCardProps) {
  const { data: token, isLoading, error, refetch } = useToken(address);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleSuccess = () => {
    setIsEditModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Loading token information...
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
        <div className='text-paragraph-sm text-red-600'>
          Error loading token information
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
            Token Information
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
        <div className='space-y-4'>
          <div>
            <label className='text-paragraph-sm font-medium text-text-sub-600'>
              Address
            </label>
            <p className='mt-1 break-all font-mono text-paragraph-sm text-text-strong-950'>
              {token.address}
            </p>
          </div>
          {token.description && (
            <div>
              <label className='text-paragraph-sm font-medium text-text-sub-600'>
                Description
              </label>
              <p className='mt-1 text-paragraph-sm text-text-strong-950'>
                {token.description}
              </p>
            </div>
          )}
          <div>
            <label className='text-paragraph-sm font-medium text-text-sub-600'>
              Tier
            </label>
            <p className='mt-1 text-paragraph-sm text-text-strong-950'>
              {getTierLabel(token.tier || 0)}
            </p>
          </div>
          {token.ordering !== null && (
            <div>
              <label className='text-paragraph-sm font-medium text-text-sub-600'>
                Ordering
              </label>
              <p className='mt-1 text-paragraph-sm text-text-strong-950'>
                {token.ordering}
              </p>
            </div>
          )}
          {token.image && (
            <div>
              <label className='text-paragraph-sm font-medium text-text-sub-600'>
                Image URL
              </label>
              <p className='mt-1 break-all text-paragraph-sm text-text-strong-950'>
                {token.image}
              </p>
            </div>
          )}
        </div>
      </div>

      <TokenForm
        token={token}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
