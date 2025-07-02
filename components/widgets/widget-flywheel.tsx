'use client';

import { useParams } from 'next/navigation';
import { RiFlashlightLine, RiOrganizationChart } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import { getFlywheelImageUrl } from '@/utils/image-url';
import { useFlywheel } from '@/hooks/use-flywheel';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetFlywheel({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const { flywheel, loading } = useFlywheel(address);

  return (
    <WidgetBox.Root {...rest} id='flywheels'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiOrganizationChart} />
        Flywheel
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />

        {!loading && flywheel?.image ? (
          <div className='w-full pb-1'>
            <img
              src={getFlywheelImageUrl(flywheel.image)}
              alt={flywheel.image}
              className='h-full w-full object-cover'
            />
          </div>
        ) : (
          <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
            <IllustrationEmptySavedActions className='size-[108px]' />
            <div className='text-center text-paragraph-sm text-text-soft-400'>
              {loading ? 'Loading flywheel...' : 'Flywheel empty.'}
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
