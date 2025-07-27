import * as React from 'react';
import { useTranslation } from '@/contexts/translation-context';
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
      return 'S';
    case 2:
      return 'A';
    case 3:
      return 'B';
    case 4:
      return 'C';
    default:
      return 'Unknown';
  }
};

export function TokenInfoCard({ address }: TokenInfoCardProps) {
  const { data: token, isLoading, error, refetch } = useToken(address);
  const { locale } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleSuccess = () => {
    setIsEditModalOpen(false);
    refetch();
  };

  // Get the appropriate description based on locale
  const getDescription = () => {
    if (locale === 'en' && token?.description_en) {
      return token.description_en;
    }
    return token?.description;
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

  const description = getDescription();

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
        <div className='space-y-1'>
          <div>
            <label className='text-paragraph-sm text-text-sub-600'>
              Address
            </label>
            <p className='break-all font-mono text-paragraph-sm text-text-strong-950'>
              {token.address}
            </p>
          </div>
          {token.description && (
            <div>
              <label className='text-paragraph-sm text-text-sub-600'>
                Description (ID)
              </label>
              <p className='text-paragraph-sm text-text-strong-950'>
                {token.description}
              </p>
            </div>
          )}
          {token.description_en && (
            <div>
              <label className='text-paragraph-sm text-text-sub-600'>
                Description (EN)
              </label>
              <p className='text-paragraph-sm text-text-strong-950'>
                {token.description_en}
              </p>
            </div>
          )}
          <div>
            <label className='text-paragraph-sm text-text-sub-600'>
              Tier:{' '}
              <span className='text-text-strong-950'>
                {getTierLabel(token.tier || 0)}
              </span>
            </label>
          </div>
          {token.ordering !== null && (
            <div>
              <label className='text-paragraph-sm text-text-sub-600'>
                Ordering:{' '}
                <span className='text-text-strong-950'>{token.ordering}</span>
              </label>
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
