'use client';

import * as React from 'react';
import { RiCoinLine, RiEditLine, RiShareLine } from '@remixicon/react';
import { useAtom } from 'jotai';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import { tokenDetailModalOpenAtom } from '@/components/token-table';
import { formatDate } from '@/utils/date-formatter';

export function TokenDetailDrawer() {
  const [detailModalOpen, setDetailModalOpen] = useAtom(
    tokenDetailModalOpenAtom,
  );

  return (
    <Drawer.Root open={detailModalOpen} onOpenChange={setDetailModalOpen}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Token Details</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Divider.Root variant='solid-text'>Token Information</Divider.Root>

          <div className='flex items-center gap-4 p-5'>
            <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiCoinLine className='size-6 text-text-sub-600' />
            </div>
            <div>
              <div className='text-title-h4 text-text-strong-950'>Token Name</div>
              <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                Token Label
              </div>
            </div>
          </div>

          <Divider.Root variant='solid-text'>Details</Divider.Root>

          <div className='flex flex-col gap-3 p-5'>
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Token Address
              </div>
              <div className='mt-1 font-mono text-label-sm text-text-strong-950'>
                0x1234...5678
              </div>
            </div>

            <Divider.Root variant='line-spacing' />

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Tier
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                A
              </div>
            </div>

            <Divider.Root variant='line-spacing' />

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Description
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                This is a sample token description that provides information about the token&apos;s purpose and functionality.
              </div>
            </div>

            <Divider.Root variant='line-spacing' />

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Created At
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {formatDate(new Date().toISOString())}
              </div>
            </div>

            <Divider.Root variant='line-spacing' />

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Created By
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                admin@example.com
              </div>
            </div>
          </div>
        </Drawer.Body>

        <Drawer.Footer className='border-t'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            className='w-full'
          >
            <Button.Icon as={RiEditLine} />
            Edit Token
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            className='w-full'
          >
            <Button.Icon as={RiShareLine} />
            Share
          </Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
} 