'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { RiFlashlightLine, RiTeamLine, RiTwitterLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import { useTeams } from '@/hooks/use-teams';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import * as WidgetBox from '@/components/widget-box';

type TeamMemberProps = {
  name: string;
  description?: string;
  image: string;
  role: string;
  x?: string;
};

function TeamMembers({ name, description, image, role, x }: TeamMemberProps) {
  return (
    <div className='flex flex-col items-center gap-2 space-x-2 text-center'>
      <div className='flex items-center'>
        <img
          src={image}
          alt={name}
          className='max-h-28 max-w-28 rounded-full object-cover'
        />
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-label-sm text-text-strong-950'>{name}</div>
        <div className='text-paragraph-xs text-text-sub-600'>{role}</div>
      </div>
      {x && (
        <div className='flex flex-row items-center gap-1 text-paragraph-xs text-text-sub-600'>
          <RiTwitterLine className='size-5' />
          <Link href={`https://x.com/${x}`} target='_blank'>
            @{x}
          </Link>
        </div>
      )}
      <div className='text-paragraph-xs text-text-sub-600'>{description}</div>
    </div>
  );
}

export default function WidgetTeam({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const { teams, loading } = useTeams(address);

  return (
    <WidgetBox.Root {...rest} id='team'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTeamLine} />
        Team
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />

        <div className='grid grid-cols-1 justify-items-center gap-6 py-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          {!loading && teams && teams.length > 0 ? (
            teams.map((team, index) => (
              <TeamMembers
                key={team.id}
                name={team.name || ''}
                description={team.description || ''}
                image={team.image || ''}
                role={team.role || ''}
                x={team.x_account || ''}
              />
            ))
          ) : (
            <div className='col-span-full flex flex-1 flex-col items-center justify-center gap-5 p-5'>
              <IllustrationEmptySavedActions className='size-[108px]' />
              <div className='text-center text-paragraph-sm text-text-soft-400'>
                {loading ? 'Loading team...' : 'Team member unknown.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetTeamEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
      id='team'
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFlashlightLine} />
        Team
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptySavedActions className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            Team member unknown.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
