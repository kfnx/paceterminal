'use client';

import * as React from 'react';
import { RiAddLine, RiCoinLine, RiEditLine, RiTwitterLine } from '@remixicon/react';
import { toast } from 'sonner';

import { useToken } from '@/hooks/use-token';
import { useTeams, type Team } from '@/hooks/use-teams';
import type { Token } from '@/hooks/use-tokens';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge';

import { TokenForm } from './token-form';

interface TokenDetailPageProps {
  address: string;
}

export function TokenDetailPage({ address }: TokenDetailPageProps) {
  const { data: token, isLoading, error, refetch } = useToken(address);
  const { teams, loading: teamsLoading, error: teamsError } = useTeams(address);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleSuccess = () => {
    refetch();
    toast.success('Token updated successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-paragraph-md text-text-sub-600">Loading token...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-paragraph-md text-red-600">
          Error loading token: {error.message}
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
            <RiCoinLine className="size-8 text-text-sub-600" />
          </div>
          <div className="text-center">
            <h2 className="text-heading-md font-semibold text-text-strong-950">
              Token Not Found
            </h2>
            <p className="mt-2 text-paragraph-sm text-text-sub-600">
              The token with address <code className="bg-bg-soft-100 rounded px-1 py-0.5 text-paragraph-xs">{address}</code> does not exist in the database.
            </p>
          </div>
          <Button.Root
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4"
          >
            <RiAddLine className="size-4" />
            Create Token
          </Button.Root>
        </div>

        <TokenForm
          token={null}
          initialAddress={address}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 1:
        return { label: 'S Tier', color: 'purple' as const };
      case 2:
        return { label: 'A Tier', color: 'blue' as const };
      case 3:
        return { label: 'B Tier', color: 'green' as const };
      case 4:
        return { label: 'C Tier', color: 'yellow' as const };
      default:
        return { label: 'Unknown', color: 'gray' as const };
    }
  };

  const tierInfo = getTierLabel(token.tier || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {token.image ? (
            <Avatar.Root size="64">
              <Avatar.Image src={token.image} />
            </Avatar.Root>
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
              <RiCoinLine className="size-8 text-text-sub-600" />
            </div>
          )}
          <div>
            <h1 className="text-heading-lg font-semibold text-text-strong-950">
              {token.name}
            </h1>
            {token.label && (
              <p className="mt-1 text-paragraph-sm text-text-sub-600">
                {token.label}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <Badge.Root variant="filled" color={tierInfo.color}>
                {tierInfo.label}
              </Badge.Root>
              {token.ordering !== null && (
                <Badge.Root variant="stroke" color="gray">
                  Order: {token.ordering}
                </Badge.Root>
              )}
            </div>
          </div>
        </div>
        <Button.Root
          variant="neutral"
          mode="stroke"
          onClick={() => setIsEditModalOpen(true)}
        >
          <RiEditLine className="size-4" />
          Edit Token
        </Button.Root>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <h3 className="text-heading-sm mb-4 font-semibold text-text-strong-950">
            Token Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-paragraph-sm font-medium text-text-sub-600">
                Address
              </label>
              <p className="mt-1 break-all font-mono text-paragraph-sm text-text-strong-950">
                {token.address}
              </p>
            </div>
            {token.description && (
              <div>
                <label className="text-paragraph-sm font-medium text-text-sub-600">
                  Description
                </label>
                <p className="mt-1 text-paragraph-sm text-text-strong-950">
                  {token.description}
                </p>
              </div>
            )}
            <div>
              <label className="text-paragraph-sm font-medium text-text-sub-600">
                Tier
              </label>
              <p className="mt-1 text-paragraph-sm text-text-strong-950">
                {tierInfo.label}
              </p>
            </div>
            {token.ordering !== null && (
              <div>
                <label className="text-paragraph-sm font-medium text-text-sub-600">
                  Ordering
                </label>
                <p className="mt-1 text-paragraph-sm text-text-strong-950">
                  {token.ordering}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <h3 className="text-heading-sm mb-4 font-semibold text-text-strong-950">
            Metadata
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-paragraph-sm font-medium text-text-sub-600">
                Created At
              </label>
              <p className="mt-1 text-paragraph-sm text-text-strong-950">
                {token.created_at ? new Date(token.created_at).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-paragraph-sm font-medium text-text-sub-600">
                Updated At
              </label>
              <p className="mt-1 text-paragraph-sm text-text-strong-950">
                {token.updated_at ? new Date(token.updated_at).toLocaleString() : 'N/A'}
              </p>
            </div>
            {token.image && (
              <div>
                <label className="text-paragraph-sm font-medium text-text-sub-600">
                  Image URL
                </label>
                <p className="mt-1 break-all text-paragraph-sm text-text-strong-950">
                  {token.image}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <h3 className="text-heading-sm mb-4 font-semibold text-text-strong-950">
            Metrics
          </h3>
        </div>

        <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-heading-sm mb-4 font-semibold text-text-strong-950">
              Team
            </h3>
            <Button.Root
              variant="neutral"
              mode="stroke"
              onClick={() => setIsEditModalOpen(true)}
            >
              <RiEditLine className="size-4" />
              Edit Team Members
            </Button.Root>
          </div>
          {teamsLoading ? (
            <div className="text-paragraph-sm text-text-sub-600">Loading team...</div>
          ) : teamsError ? (
            <div className="text-paragraph-sm text-red-600">
              Error loading team: {teamsError}
            </div>
          ) : teams.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team: Team) => (
                <div key={team.id} className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center gap-1">
                    {team.image ? (
                      <Avatar.Root size="64">
                        <Avatar.Image src={team.image} alt={team.name || 'Team member'} />
                      </Avatar.Root>
                    ) : (
                      <Avatar.Root size="64" placeholderType="user" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-label-sm text-text-strong-950">{team.name}</div>
                    {team.role && (
                      <div className="text-paragraph-xs text-text-sub-600">{team.role}</div>
                    )}
                  </div>
                  {team.x_account && (
                    <div className="flex flex-row items-center gap-1 text-paragraph-xs text-text-sub-600">
                      <RiTwitterLine />
                      <a
                        href={`https://x.com/${team.x_account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-text-strong-950"
                      >
                        @{team.x_account}
                      </a>
                    </div>
                  )}
                  {team.description && (
                    <div className="text-paragraph-xs text-text-sub-600">{team.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                <RiCoinLine className="size-8 text-text-sub-600" />
              </div>
              <div className="text-center">
                <p className="text-paragraph-sm text-text-sub-600">
                  No team members found for this token.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <h3 className="text-heading-sm mb-4 font-semibold text-text-strong-950">
            Flywheel
          </h3>
        </div>

        <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <h3 className="text-heading-sm mb-4 font-semibold text-text-strong-950">
            Technical Analysis
          </h3>
        </div>

        <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <h3 className="text-heading-sm mb-4 font-semibold text-text-strong-950">
            Alpha
          </h3>
        </div>

        <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <h3 className="text-heading-sm mb-4 font-semibold text-text-strong-950">
            Updates
          </h3>
        </div>
      </div>

      <TokenForm
        token={token}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 