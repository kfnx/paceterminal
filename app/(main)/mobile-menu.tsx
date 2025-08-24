'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as DialogPrimitives from '@radix-ui/react-dialog';
import {
  RiArrowRightSLine,
  RiCloseFill,
  RiMenu3Fill,
  RiNewspaperLine,
  RiSearch2Line,
  RiStarLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import { getTokenImageUrl } from '@/utils/image-url';
import { getTierLabel } from '@/utils/tier-alphabet-label';
import { useAllTokens } from '@/hooks/use-all-tokens';
import useBreakpoint from '@/hooks/use-breakpoint';
import { useMemberStatus } from '@/hooks/use-member-status';
import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import * as TopbarItemButton from '@/components/topbar-item-button';

export default function MobileMenu() {
  const { lg } = useBreakpoint();
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: tokens, isLoading, error } = useAllTokens();
  const { isMember } = useMemberStatus();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (lg) setOpen(false);
  }, [lg]);

  return (
    <DialogPrimitives.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitives.Trigger asChild>
        <TopbarItemButton.Root>
          <TopbarItemButton.Icon as={RiMenu3Fill} />
        </TopbarItemButton.Root>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay
          className={cn(
            'fixed inset-0 z-50 origin-top-right lg:hidden',
            // animation
            'data-[state=closed]:duration-200 data-[state=closed]:animate-out',
          )}
        >
          <DialogPrimitives.Content
            className={cn(
              'flex size-full origin-top-right flex-col overflow-auto bg-bg-white-0 focus:outline-none',
              // animation
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:ease-out data-[state=open]:ease-out',
              'data-[state=closed]:duration-200 data-[state=open]:duration-200',
              'data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-left-full',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            )}
          >
            <DialogPrimitives.Title className='sr-only'>
              Mobile Menu
            </DialogPrimitives.Title>
            <DialogPrimitives.Description className='sr-only'>
              This menu provides mobile navigation options, including access to
              main navigation links, favorite projects, search, and user
              settings.
            </DialogPrimitives.Description>

            <div className='flex h-[60px] w-full shrink-0 items-center border-b border-stroke-soft-200 px-4'>
              <div className='relative flex-1 pr-4'>
                <RiSearch2Line className='absolute left-0 top-1/2 size-6 -translate-y-1/2 text-text-soft-400' />
                <input
                  type='text'
                  placeholder='Search...'
                  className='h-6 w-full pl-9 text-paragraph-md outline-none placeholder:text-text-sub-600 focus:outline-none'
                />
              </div>
              <div className='flex gap-3'>
                {/* <div className='flex gap-1'>
                  <TopbarItemButton.Root>
                    <TopbarItemButton.Icon as={RiHeadphoneLine} />
                  </TopbarItemButton.Root>
                  <TopbarItemButton.Root>
                    <TopbarItemButton.Icon as={RiSettings2Line} />
                  </TopbarItemButton.Root>
                </div> */}
                <div className='flex w-1 shrink-0 items-center before:h-full before:w-px before:bg-stroke-soft-200' />
                <DialogPrimitives.Close asChild>
                  <TopbarItemButton.Root>
                    <TopbarItemButton.Icon as={RiCloseFill} />
                  </TopbarItemButton.Root>
                </DialogPrimitives.Close>
              </div>
            </div>
            {/* <CompanySwitchMobile /> */}

            <TabMenuHorizontal.Root
              defaultValue='nav'
              className='flex flex-1 flex-col'
            >
              <TabMenuHorizontal.List className='gap-8 px-7'>
                <TabMenuHorizontal.Trigger
                  value='nav'
                  className='flex-1 text-label-md'
                >
                  Navigation
                </TabMenuHorizontal.Trigger>
                <div className='flex h-6 w-1 shrink-0 items-center before:h-full before:w-px before:bg-stroke-soft-200' />
                <TabMenuHorizontal.Trigger
                  value='main'
                  className='flex-1 text-label-md'
                >
                  Tokens
                </TabMenuHorizontal.Trigger>
              </TabMenuHorizontal.List>

              <div className='flex-1 py-6'>
                <TabMenuHorizontal.Content
                  value='nav'
                  className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0'
                >
                  <div className='flex flex-col gap-5'>
                    <Link
                      href='/updates'
                      aria-current={
                        pathname === '/updates' ? 'page' : undefined
                      }
                      className={cn(
                        'group relative flex w-full items-center gap-2.5 whitespace-nowrap px-5 text-text-sub-600',
                      )}
                    >
                      <RiNewspaperLine className='h-6 w-6 text-text-sub-600' />
                      <div className='flex-1 text-label-md'>Updates</div>
                      <div
                        className={cn(
                          'transition-default absolute left-0 top-1/2 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary-base',
                          {
                            'scale-0': pathname !== '/updates',
                          },
                        )}
                      />
                      <RiArrowRightSLine className='size-6 text-text-sub-600' />
                    </Link>
                    <Link
                      href='/alpha'
                      aria-current={pathname === '/alpha' ? 'page' : undefined}
                      className={cn(
                        'group relative flex w-full items-center gap-2.5 whitespace-nowrap px-5 text-text-sub-600',
                      )}
                    >
                      <RiStarLine className='h-6 w-6 text-text-sub-600' />
                      <div className='flex-1 text-label-md'>Alpha</div>
                      <div
                        className={cn(
                          'transition-default absolute left-0 top-1/2 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary-base',
                          {
                            'scale-0': pathname !== '/alpha',
                          },
                        )}
                      />
                      <RiArrowRightSLine className='size-6 text-text-sub-600' />
                    </Link>
                  </div>
                </TabMenuHorizontal.Content>
                <TabMenuHorizontal.Content
                  value='main'
                  className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0'
                >
                  <div className='flex flex-col gap-5'>
                    {isLoading ? (
                      <div className='flex justify-center p-5'>
                        <LoadingSpinner />
                      </div>
                    ) : error ? (
                      <div className='p-5 text-center text-paragraph-sm text-text-soft-400'>
                        Failed to load tokens
                      </div>
                    ) : !tokens || tokens.length === 0 ? (
                      <div className='p-5 text-center text-paragraph-sm text-text-soft-400'>
                        No tokens found
                      </div>
                    ) : (
                      tokens.map((token) => {
                        const href = `/solana/${token.address}`;
                        const tierInfo = getTierLabel(token.tier || 0);
                        return (
                          <Link
                            key={token.address}
                            href={href}
                            aria-current={
                              pathname === href ? 'page' : undefined
                            }
                            className={cn(
                              'group relative flex w-full items-center gap-2.5 whitespace-nowrap px-5 text-text-sub-600',
                            )}
                          >
                            <Avatar.Root size='24' color='blue'>
                              <Avatar.Image
                                src={getTokenImageUrl(token.image)}
                                alt={token.name}
                              />
                            </Avatar.Root>
                            <div className='flex-1 text-label-md'>
                              {token.name}
                            </div>
                            {isMember && (
                              <Badge.Root
                                variant='filled'
                                color={tierInfo.color}
                              >
                                {tierInfo.label}
                              </Badge.Root>
                            )}
                            <div
                              className={cn(
                                'transition-default absolute left-0 top-1/2 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary-base',
                                {
                                  'scale-0': pathname !== href,
                                },
                              )}
                            />
                            <RiArrowRightSLine className='size-6 text-text-sub-600' />
                          </Link>
                        );
                      })
                    )}
                  </div>
                </TabMenuHorizontal.Content>
              </div>
            </TabMenuHorizontal.Root>

            {/* <div className='grid border-y border-stroke-soft-200 p-4'>
              <MoveMoneyButton />
            </div>

            <div className='p-2'>
              <UserButtonMobile />
            </div> */}
          </DialogPrimitives.Content>
        </DialogPrimitives.Overlay>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
