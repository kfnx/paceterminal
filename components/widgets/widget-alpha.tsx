'use client';

import { useParams } from 'next/navigation';
import { RiVipDiamondLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import { useAlpha } from '@/hooks/use-alpha';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptySavedActions from '@/components/empty-state-illustrations/saved-actions';
import * as WidgetBox from '@/components/widget-box';

type AlphaItemProps = {
  title: string;
  text: string;
  createdAt: string;
};

function AlphaItem({ title, text, createdAt }: AlphaItemProps) {
  return (
    <div className='bg-bg-soft-100 rounded-lg p-4'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-start justify-between'>
          <h4 className='text-label-sm font-medium text-text-strong-950'>
            {title}
          </h4>
        </div>

        {text && (
          <div className='text-paragraph-sm text-text-strong-950'>{text}</div>
        )}
      </div>
    </div>
  );
}

export default function WidgetAlpha({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const params = useParams();
  const address = params.address as string;
  const { alpha, loading } = useAlpha(address);

  return (
    <WidgetBox.Root {...rest} id='alpha'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiVipDiamondLine} />
        Alpha
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />

        <div className='w-full pb-1'>
          {!loading && alpha && alpha.length > 0 ? (
            <div className='space-y-4'>
              {alpha.map((alphaItem) => (
                <AlphaItem
                  key={alphaItem.id}
                  title={alphaItem.title || 'Untitled'}
                  text={alphaItem.text || ''}
                  createdAt={alphaItem.created_at}
                />
              ))}
            </div>
          ) : (
            <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
              <IllustrationEmptySavedActions className='size-[108px]' />
              <div className='text-center text-paragraph-sm text-text-soft-400'>
                {loading ? 'Loading alpha...' : 'Alpha empty.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetAlphaEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
      id='alpha'
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiVipDiamondLine} />
        Alpha
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptySavedActions className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            Alpha empty.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
