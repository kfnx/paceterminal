'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiCoinLine,
  RiDeleteBinLine,
  RiEditLine,
  RiTwitterLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { useFlywheel, type Flywheel } from '@/hooks/use-flywheel';
import { useMetrics, type Metric } from '@/hooks/use-metrics';
import { useTeams, type Team } from '@/hooks/use-teams';
import {
  useTechnicalAnalysis,
  type TechnicalAnalysis,
} from '@/hooks/use-technical-analysis';
import { useToken } from '@/hooks/use-token';
import type { Token } from '@/hooks/use-tokens';
import { useUpdates, type Update } from '@/hooks/use-updates';
import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';

import { FlywheelForm } from './flywheel-form';
import { MetricsForm } from './metrics-form';
import { TeamForm } from './team-form';
import { TechnicalAnalysisForm } from './technical-analysis-form';
import { TokenForm } from './token-form';
import { UpdatesForm } from './updates-form';

interface TokenDetailPageProps {
  address: string;
}

export function TokenDetailPage({ address }: TokenDetailPageProps) {
  const { data: token, isLoading, error, refetch } = useToken(address);
  const {
    teams,
    loading: teamsLoading,
    error: teamsError,
    refetch: refetchTeams,
  } = useTeams(address);
  const {
    flywheel,
    loading: flywheelLoading,
    error: flywheelError,
    refetch: refetchFlywheel,
  } = useFlywheel(address);
  const {
    technicalAnalysis,
    loading: technicalAnalysisLoading,
    error: technicalAnalysisError,
    refetch: refetchTechnicalAnalysis,
  } = useTechnicalAnalysis(address);
  const {
    metrics,
    loading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useMetrics(address);
  const {
    updates,
    loading: updatesLoading,
    error: updatesError,
    refetch: refetchUpdates,
  } = useUpdates(address);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isEditFlywheelModalOpen, setIsEditFlywheelModalOpen] =
    React.useState(false);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = React.useState(false);
  const [
    isEditTechnicalAnalysisModalOpen,
    setIsEditTechnicalAnalysisModalOpen,
  ] = React.useState(false);
  const [selectedTechnicalAnalysis, setSelectedTechnicalAnalysis] =
    React.useState<TechnicalAnalysis | null>(null);
  const [isEditMetricsModalOpen, setIsEditMetricsModalOpen] =
    React.useState(false);
  const [selectedMetric, setSelectedMetric] = React.useState<Metric | null>(
    null,
  );
  const [isEditUpdatesModalOpen, setIsEditUpdatesModalOpen] =
    React.useState(false);
  const [selectedUpdate, setSelectedUpdate] = React.useState<Update | null>(
    null,
  );

  const handleSuccess = () => {
    refetch();
    toast.success('Token updated successfully!');
  };

  const handleFlywheelSuccess = () => {
    refetchFlywheel();
    toast.success('Flywheel updated successfully!');
  };

  const handleTeamSuccess = () => {
    refetchTeams();
    toast.success('Team updated successfully!');
  };

  const handleTechnicalAnalysisSuccess = () => {
    refetchTechnicalAnalysis();
    toast.success('Technical analysis updated successfully!');
  };

  const handleDeleteTechnicalAnalysis = async (id: number) => {
    if (!confirm('Are you sure you want to delete this technical analysis?')) {
      return;
    }

    try {
      const response = await fetch(`/api/technical-analysis/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete technical analysis');
      }

      refetchTechnicalAnalysis();
      toast.success('Technical analysis deleted successfully!');
    } catch (error) {
      console.error('Error deleting technical analysis:', error);
      toast.error('Failed to delete technical analysis');
    }
  };

  const handleMetricsSuccess = () => {
    refetchMetrics();
    toast.success('Metric updated successfully!');
  };

  const handleDeleteMetric = async (id: number) => {
    if (!confirm('Are you sure you want to delete this metric?')) {
      return;
    }

    try {
      const response = await fetch(`/api/metrics/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete metric');
      }

      refetchMetrics();
      toast.success('Metric deleted successfully!');
    } catch (error) {
      console.error('Error deleting metric:', error);
      toast.error('Failed to delete metric');
    }
  };

  const handleUpdatesSuccess = () => {
    refetchUpdates();
    toast.success('Update updated successfully!');
  };

  const handleDeleteUpdate = async (id: number) => {
    if (!confirm('Are you sure you want to delete this update?')) {
      return;
    }

    try {
      const response = await fetch(`/api/updates/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete update');
      }

      refetchUpdates();
      toast.success('Update deleted successfully!');
    } catch (error) {
      console.error('Error deleting update:', error);
      toast.error('Failed to delete update');
    }
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
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          {token.image ? (
            <Avatar.Root size='64'>
              <Avatar.Image src={token.image} />
            </Avatar.Root>
          ) : (
            <div className='flex size-16 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiCoinLine className='size-8 text-text-sub-600' />
            </div>
          )}
          <div>
            <h1 className='text-heading-lg font-semibold text-text-strong-950'>
              {token.name}
            </h1>
            {token.label && (
              <p className='mt-1 text-paragraph-sm text-text-sub-600'>
                {token.label}
              </p>
            )}
            <div className='mt-2 flex items-center gap-2'>
              <Badge.Root variant='filled' color={tierInfo.color}>
                {tierInfo.label}
              </Badge.Root>
              {token.ordering !== null && (
                <Badge.Root variant='stroke' color='gray'>
                  Order: {token.ordering}
                </Badge.Root>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
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
                {tierInfo.label}
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

        <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Metrics
            </h3>
            <Button.Root
              variant='neutral'
              mode='stroke'
              onClick={() => {
                setSelectedMetric(null);
                setIsEditMetricsModalOpen(true);
              }}
              size='xsmall'
            >
              <RiAddLine className='size-4' />
            </Button.Root>
          </div>
          {metricsLoading ? (
            <div className='text-paragraph-sm text-text-sub-600'>
              Loading metrics...
            </div>
          ) : metricsError ? (
            <div className='text-paragraph-sm text-red-600'>
              Error loading metrics: {metricsError}
            </div>
          ) : metrics.length > 0 ? (
            <div className='grid gap-4 md:grid-cols-2'>
              {metrics.map((metric: Metric) => (
                <div
                  key={metric.id}
                  className='bg-bg-soft-100 relative rounded-lg p-4'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center justify-between'>
                        <h4 className='text-label-sm font-medium text-text-strong-950'>
                          {metric.label}
                        </h4>
                      </div>
                      <div className='mb-2 text-paragraph-lg font-semibold text-text-strong-950'>
                        {metric.value}
                      </div>
                      {metric.description && (
                        <div className='mb-2 text-paragraph-xs text-text-sub-600'>
                          {metric.description}
                        </div>
                      )}
                      <div className='flex items-center justify-between text-paragraph-xs text-text-sub-600'>
                        <span>
                          {new Date(metric.created_at).toLocaleDateString()}
                        </span>
                        {metric.source && <span>Source: {metric.source}</span>}
                      </div>
                    </div>
                    <div className='ml-3 flex flex-col gap-2'>
                      <Button.Root
                        variant='neutral'
                        mode='stroke'
                        onClick={() => {
                          setSelectedMetric(metric);
                          setIsEditMetricsModalOpen(true);
                        }}
                        size='xsmall'
                      >
                        <RiEditLine className='size-4' />
                      </Button.Root>
                      <Button.Root
                        variant='error'
                        mode='stroke'
                        onClick={() => handleDeleteMetric(metric.id)}
                        size='xsmall'
                      >
                        <RiDeleteBinLine className='size-4' />
                      </Button.Root>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-4 py-8'>
              <div className='flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                <RiCoinLine className='size-8 text-text-sub-600' />
              </div>
              <div className='text-center'>
                <p className='text-paragraph-sm text-text-sub-600'>
                  No metrics found for this token.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Team
            </h3>
            <Button.Root
              variant='neutral'
              mode='stroke'
              onClick={() => setIsEditTeamModalOpen(true)}
              size='xsmall'
            >
              <RiEditLine className='size-4' />
            </Button.Root>
          </div>
          {teamsLoading ? (
            <div className='text-paragraph-sm text-text-sub-600'>
              Loading team...
            </div>
          ) : teamsError ? (
            <div className='text-paragraph-sm text-red-600'>
              Error loading team: {teamsError}
            </div>
          ) : teams.length > 0 ? (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {teams.map((team: Team) => (
                <div
                  key={team.id}
                  className='flex flex-col items-center gap-3 text-center'
                >
                  <div className='flex items-center gap-1'>
                    {team.image ? (
                      <Avatar.Root size='64'>
                        <Avatar.Image
                          src={team.image}
                          alt={team.name || 'Team member'}
                        />
                      </Avatar.Root>
                    ) : (
                      <Avatar.Root size='64' placeholderType='user' />
                    )}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <div className='text-label-sm text-text-strong-950'>
                      {team.name}
                    </div>
                    {team.role && (
                      <div className='text-paragraph-xs text-text-sub-600'>
                        {team.role}
                      </div>
                    )}
                  </div>
                  {team.x_account && (
                    <div className='flex flex-row items-center gap-1 text-paragraph-xs text-text-sub-600'>
                      <RiTwitterLine />
                      <a
                        href={`https://x.com/${team.x_account}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-text-strong-950'
                      >
                        @{team.x_account}
                      </a>
                    </div>
                  )}
                  {team.description && (
                    <div className='text-paragraph-xs text-text-sub-600'>
                      {team.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-4 py-8'>
              <div className='flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                <RiCoinLine className='size-8 text-text-sub-600' />
              </div>
              <div className='text-center'>
                <p className='text-paragraph-sm text-text-sub-600'>
                  No team members found for this token.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Flywheel
            </h3>
            <Button.Root
              variant='neutral'
              mode='stroke'
              onClick={() => setIsEditFlywheelModalOpen(true)}
              size='xsmall'
            >
              <RiEditLine className='size-4' />
            </Button.Root>
          </div>
          {flywheelLoading ? (
            <div className='text-paragraph-sm text-text-sub-600'>
              Loading flywheel...
            </div>
          ) : flywheelError ? (
            <div className='text-paragraph-sm text-red-600'>
              Error loading flywheel: {flywheelError}
            </div>
          ) : flywheel && flywheel.image ? (
            <div className='w-full'>
              <img
                src={flywheel.image}
                alt='Flywheel'
                className='h-full w-full rounded-lg object-cover'
              />
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-4 py-8'>
              <div className='flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                <RiCoinLine className='size-8 text-text-sub-600' />
              </div>
              <div className='text-center'>
                <p className='text-paragraph-sm text-text-sub-600'>
                  No flywheel found for this token.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Technical Analysis
            </h3>
            <Button.Root
              variant='neutral'
              mode='stroke'
              onClick={() => {
                setSelectedTechnicalAnalysis(null);
                setIsEditTechnicalAnalysisModalOpen(true);
              }}
              size='xsmall'
            >
              <RiAddLine className='size-4' />
            </Button.Root>
          </div>
          {technicalAnalysisLoading ? (
            <div className='text-paragraph-sm text-text-sub-600'>
              Loading technical analysis...
            </div>
          ) : technicalAnalysisError ? (
            <div className='text-paragraph-sm text-red-600'>
              Error loading technical analysis: {technicalAnalysisError}
            </div>
          ) : technicalAnalysis.length > 0 ? (
            <div className='space-y-6'>
              {technicalAnalysis.map((analysis: TechnicalAnalysis) => (
                <div key={analysis.id} className='space-y-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 space-y-3'>
                      <div className='w-full'>
                        <img
                          src={analysis.image}
                          alt='Technical Analysis Chart'
                          className='h-full w-full rounded-lg object-cover'
                        />
                      </div>
                      <div className='bg-bg-soft-100 rounded-lg'>
                        <p className='whitespace-pre-wrap break-words text-paragraph-sm text-text-strong-950'>
                          {analysis.description}
                        </p>
                      </div>
                      <div className='text-paragraph-xs text-text-sub-600'>
                        Created:{' '}
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className='ml-3 flex flex-col gap-2'>
                      <Button.Root
                        variant='neutral'
                        mode='stroke'
                        onClick={() => {
                          setSelectedTechnicalAnalysis(analysis);
                          setIsEditTechnicalAnalysisModalOpen(true);
                        }}
                        size='xsmall'
                      >
                        <RiEditLine className='size-4' />
                      </Button.Root>
                      <Button.Root
                        variant='error'
                        mode='stroke'
                        onClick={() =>
                          handleDeleteTechnicalAnalysis(analysis.id)
                        }
                        size='xsmall'
                      >
                        <RiDeleteBinLine className='size-4' />
                      </Button.Root>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-4 py-8'>
              <div className='flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                <RiCoinLine className='size-8 text-text-sub-600' />
              </div>
              <div className='text-center'>
                <p className='text-paragraph-sm text-text-sub-600'>
                  No technical analysis found for this token.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
          <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
            Alpha
          </h3>
        </div>

        <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Updates
            </h3>
            <Button.Root
              variant='neutral'
              mode='stroke'
              onClick={() => {
                setSelectedUpdate(null);
                setIsEditUpdatesModalOpen(true);
              }}
              size='xsmall'
            >
              <RiAddLine className='size-4' />
            </Button.Root>
          </div>
          {updatesLoading ? (
            <div className='text-paragraph-sm text-text-sub-600'>
              Loading updates...
            </div>
          ) : updatesError ? (
            <div className='text-paragraph-sm text-red-600'>
              Error loading updates: {updatesError}
            </div>
          ) : updates.length > 0 ? (
            <div className='space-y-4'>
              {updates.map((update: Update) => (
                <div
                  key={update.id}
                  className='bg-bg-soft-100 relative rounded-lg'
                >
                  <div className='flex gap-4'>
                    {update.image ? (
                      <div className='flex-shrink-0'>
                        <img
                          src={update.image}
                          alt={update.title}
                          className='h-20 w-20 rounded-lg object-cover'
                        />
                      </div>
                    ) : (
                      <div className='size-20 flex-shrink-0 rounded-lg border border-stroke-soft-200 text-center text-label-xs'>
                        no image
                      </div>
                    )}

                    <div className='flex flex-1 flex-col gap-3'>
                      <h4 className='text-label-sm font-medium text-text-strong-950'>
                        {update.title}
                      </h4>

                      <div className='text-paragraph-sm text-text-strong-950'>
                        {update.description}
                      </div>

                      <div className='flex items-center justify-between text-paragraph-xs text-text-sub-600'>
                        <span>
                          {new Date(update.created_at).toLocaleDateString()}
                        </span>
                        <a
                          href={update.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='hover:text-primary-600 max-w-[400px] truncate text-primary-base'
                          title={update.link}
                        >
                          {update.link}
                        </a>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                      <Button.Root
                        variant='neutral'
                        mode='stroke'
                        onClick={() => {
                          setSelectedUpdate(update);
                          setIsEditUpdatesModalOpen(true);
                        }}
                        size='xsmall'
                      >
                        <RiEditLine className='size-4' />
                      </Button.Root>
                      <Button.Root
                        variant='error'
                        mode='stroke'
                        onClick={() => handleDeleteUpdate(update.id)}
                        size='xsmall'
                      >
                        <RiDeleteBinLine className='size-4' />
                      </Button.Root>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-4 py-8'>
              <div className='flex size-16 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                <RiCoinLine className='size-8 text-text-sub-600' />
              </div>
              <div className='text-center'>
                <p className='text-paragraph-sm text-text-sub-600'>
                  No updates found for this token.
                </p>
              </div>
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

      <FlywheelForm
        flywheel={flywheel}
        tokenAddress={address}
        isOpen={isEditFlywheelModalOpen}
        onClose={() => setIsEditFlywheelModalOpen(false)}
        onSuccess={handleFlywheelSuccess}
      />

      <TeamForm
        teams={teams}
        tokenAddress={address}
        isOpen={isEditTeamModalOpen}
        onClose={() => setIsEditTeamModalOpen(false)}
        onSuccess={handleTeamSuccess}
      />

      <TechnicalAnalysisForm
        technicalAnalysis={selectedTechnicalAnalysis || undefined}
        tokenAddress={address}
        isOpen={isEditTechnicalAnalysisModalOpen}
        onClose={() => {
          setIsEditTechnicalAnalysisModalOpen(false);
          setSelectedTechnicalAnalysis(null);
        }}
        onSuccess={handleTechnicalAnalysisSuccess}
      />

      <MetricsForm
        metric={selectedMetric || undefined}
        tokenAddress={address}
        isOpen={isEditMetricsModalOpen}
        onClose={() => {
          setIsEditMetricsModalOpen(false);
          setSelectedMetric(null);
        }}
        onSuccess={handleMetricsSuccess}
      />

      <UpdatesForm
        update={selectedUpdate || undefined}
        tokenAddress={address}
        isOpen={isEditUpdatesModalOpen}
        onClose={() => {
          setIsEditUpdatesModalOpen(false);
          setSelectedUpdate(null);
        }}
        onSuccess={handleUpdatesSuccess}
      />
    </div>
  );
}
