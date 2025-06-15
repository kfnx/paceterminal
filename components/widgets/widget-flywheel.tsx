'use client';

import {
  RiFlashlightLine,
  RiTeamLine,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import * as WidgetBox from '@/components/widget-box';
import { useParams } from 'next/navigation';
import { CURATED_TOKENS } from '@/lib/tokens';

export default function WidgetFlywheel({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const token = CURATED_TOKENS.find((token) => token.address === address);

  return (
    <WidgetBox.Root {...rest} id='team'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTeamLine} />
        Flywheel
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />

        {token?.flywheels ? (
          <div className='w-full pb-1'>
            <img src={`/images/flywheels/${token.flywheels}`} alt={token.flywheels} className='h-full w-full object-cover' />
          </div>
        ) : (
          <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
            <IllustrationEmptySavedActions className='size-[108px]' />
            <div className='text-center text-paragraph-sm text-text-soft-400'>
              Flywheel empty.
            </div>
          </div>
        )}
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetFlywheelEmpty({
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
        Flywheel
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptySavedActions className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            Flywheel empty.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
