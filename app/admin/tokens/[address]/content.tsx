'use client';

import * as React from 'react';
import { RiAddLine, RiCoinLine } from '@remixicon/react';

import { useToken } from '@/hooks/use-token';
import * as Button from '@/components/ui/button';
import { AlphaCard } from '@/components/token-detail/alpha-card';
import { FlywheelCard } from '@/components/token-detail/flywheel-card';
import { MetricsCard } from '@/components/token-detail/metrics-card';
// import { MetricsDynamicCard } from '@/components/token-detail/metrics-dynamic-card';
import { TeamCard } from '@/components/token-detail/team-card';
import { TechnicalAnalysisCard } from '@/components/token-detail/technical-analysis-card';
import { TokenHeader } from '@/components/token-detail/token-header';
import { TokenInfoCard } from '@/components/token-detail/token-info-card';
import { UpdatesCard } from '@/components/token-detail/updates-card';
import { TokenForm } from '@/components/token-form';

interface ManageTokenProps {
  address: string;
}

export function ManageToken({ address }: ManageTokenProps) {
  const { data: token, isLoading, error } = useToken(address, true);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // Token data will be refetched automatically by TokenHeader component
  };

  if (isLoading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-paragraph-md text-text-sub-600'>
          Loading token...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-paragraph-md text-red-600'>
          Error loading token: {error.message}
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className='space-y-6'>
        <div className='flex min-h-[400px] flex-col items-center justify-center space-y-4'>
          <div className='flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiCoinLine className='size-8 text-text-sub-600' />
          </div>
          <div className='text-center'>
            <h2 className='text-heading-md font-semibold text-text-strong-950'>
              Token Not Found
            </h2>
            <p className='mt-2 text-paragraph-sm text-text-sub-600'>
              The token with address{' '}
              <code className='bg-bg-soft-100 rounded px-1 py-0.5 text-paragraph-xs'>
                {address}
              </code>{' '}
              does not exist in the database.
            </p>
          </div>
          <Button.Root
            onClick={() => setIsCreateModalOpen(true)}
            className='mt-4'
          >
            <RiAddLine className='size-4' />
            Create Token
          </Button.Root>
        </div>

        <TokenForm
          token={null}
          initialAddress={address}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <TokenHeader token={token} />

      <div className='flex flex-col gap-6'>
        <TokenInfoCard address={address} />
        <MetricsCard address={address} />
        {/* <MetricsDynamicCard address={address} /> */}
        <TeamCard address={address} />
        <FlywheelCard address={address} />
        <TechnicalAnalysisCard address={address} />
        <AlphaCard address={address} />
        <UpdatesCard address={address} />
      </div>
    </div>
  );
}
