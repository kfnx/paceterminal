import * as React from 'react';
import { RiCoinLine, RiEditLine, RiTwitterLine } from '@remixicon/react';
import { toast } from 'sonner';

import { useTeams } from '@/hooks/use-teams';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';

import { TeamForm } from '../team-form';

interface TeamCardProps {
  address: string;
}

export function TeamCard({ address }: TeamCardProps) {
  const { teams, loading, error, refetch } = useTeams(address);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleSuccess = () => {
    setIsEditModalOpen(false);
    refetch();
    toast.success('Team updated successfully!');
  };

  return (
    <>
      <div className='rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
            Team
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
        {loading ? (
          <div className='text-paragraph-sm text-text-sub-600'>
            Loading team...
          </div>
        ) : error ? (
          <div className='text-paragraph-sm text-red-600'>
            Error loading team: {error}
          </div>
        ) : teams.length > 0 ? (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {teams.map((team) => (
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

      <TeamForm
        teams={teams}
        tokenAddress={address}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
