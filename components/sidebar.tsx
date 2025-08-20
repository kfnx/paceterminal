'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import {
  RiArrowRightSLine,
  RiNewspaperLine,
  RiSkipLeftLine,
  RiSkipRightLine,
} from '@remixicon/react';
import { useHotkeys } from 'react-hotkeys-hook';

import { cn, cnExt } from '@/utils/cn';
import { getTokenImageUrl } from '@/utils/image-url';
import { getTierLabel } from '@/utils/tier-alphabet-label';
import { useAllTokens } from '@/hooks/use-all-tokens';
import { useMemberStatus } from '@/hooks/use-member-status';
import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';

import { SidebarProfile } from './sidebar-profile';
import { LoadingSpinner } from './ui/loading-spinner';

type CuratedTokens = {
  address: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  disabled?: boolean;
};

function useCollapsedState({
  defaultCollapsed = false,
}: {
  defaultCollapsed?: boolean;
}): {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarRef: React.RefObject<HTMLDivElement>;
} {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  useHotkeys(
    ['ctrl+b', 'meta+b'],
    () => setCollapsed((prev) => !prev),
    { preventDefault: true },
    [collapsed],
  );

  React.useEffect(() => {
    if (!sidebarRef.current) return;

    const elementsToHide = sidebarRef.current.querySelectorAll(
      '[data-hide-collapsed]',
    );

    const listeners: { el: Element; listener: EventListener }[] = [];

    elementsToHide.forEach((el) => {
      const hideListener = () => {
        el.classList.add('hidden');
        el.classList.remove('transition', 'duration-300');
      };

      const showListener = () => {
        el.classList.remove('transition', 'duration-300');
      };

      if (collapsed) {
        el.classList.add('opacity-0', 'transition', 'duration-300');
        el.addEventListener('transitionend', hideListener, { once: true });
        listeners.push({ el, listener: hideListener });
      } else {
        el.classList.add('transition', 'duration-300');
        el.classList.remove('hidden');
        setTimeout(() => {
          el.classList.remove('opacity-0');
        }, 1);
        el.addEventListener('transitionend', showListener, { once: true });
        listeners.push({ el, listener: showListener });
      }
    });

    return () => {
      listeners.forEach(({ el, listener }) => {
        el.removeEventListener('transitionend', listener);
      });
    };
  }, [collapsed]);

  return { collapsed, setCollapsed, sidebarRef };
}

export function SidebarHeader({
  collapsed,
  setCollapsed,
}: {
  collapsed?: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={cnExt('flex p-5', {
        'flex-col': collapsed,
        'flex-row justify-between': !collapsed,
      })}
    >
      <div className='flex flex-col items-start'>
        <Link href='/'>
          <h1 className='text-2xl font-bold text-text-strong-950'>
            {collapsed ? 'PACE' : 'PACETERMINAL'}
          </h1>
        </Link>
        {!collapsed && (
          <p className='text-paragraph-sm text-text-sub-600'>Hong Wilaheng</p>
        )}
      </div>
      <Button.Root className='mt-5'>
        <Button.Icon
          as={collapsed ? RiSkipRightLine : RiSkipLeftLine}
          onClick={() => setCollapsed((prev) => !prev)}
        />
      </Button.Root>
    </div>
  );
}

function CuratedTokenList({ collapsed }: { collapsed: boolean }) {
  const params = useParams();
  const currentTokenAddress = params.address as string;
  const { data: tokens, isLoading, error } = useAllTokens();
  const { isMember } = useMemberStatus();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='text-center text-paragraph-sm text-text-soft-400'>
        Failed to load tokens
      </div>
    );
  }

  if (!tokens || tokens.length === 0) {
    return (
      <div className='text-center text-paragraph-sm text-text-soft-400'>
        No tokens found
      </div>
    );
  }

  return (
    <div className='space-y-1'>
      {tokens.map((token) => {
        const selected = currentTokenAddress === token.address;
        const href = `/solana/${token.address}`;
        const tierInfo = getTierLabel(token.tier || 0);

        return (
          <Link
            key={token.address}
            href={href}
            aria-current={selected}
            className={cn(
              'group relative flex items-center gap-2 whitespace-nowrap rounded-lg py-2 text-text-sub-600 hover:bg-bg-weak-50',
              'transition-default',
              'aria-[current=page]:bg-bg-weak-50',
              {
                'w-9 px-2': collapsed,
                'w-full px-3': !collapsed,
              },
            )}
          >
            <div
              className={cn(
                'transition-default absolute top-1/2 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary-base',
                {
                  '-left-[22px]': collapsed,
                  '-left-5': !collapsed,
                  'scale-100': selected,
                  'scale-0': !selected,
                },
              )}
            />
            <Avatar.Root size='24' color='blue'>
              <Avatar.Image
                src={getTokenImageUrl(token.image)}
                alt={token.name}
              />
            </Avatar.Root>

            <div
              className='flex w-[180px] shrink-0 items-center gap-2'
              data-hide-collapsed
            >
              <div className='flex-1 text-label-sm'>{token.name}</div>
              {isMember && (
                <Badge.Root variant='filled' color={tierInfo.color}>
                  {tierInfo.label}
                </Badge.Root>
              )}
              {selected && (
                <RiArrowRightSLine className='size-5 text-text-sub-600' />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function GeneralNavigation({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/updates',
      label: 'Updates',
      icon: RiNewspaperLine,
    },
  ];

  return (
    <div className='space-y-2'>
      <div
        className={cn('p-1 text-subheading-xs uppercase text-text-soft-400', {
          '-mx-2.5 w-14 px-0 text-center': collapsed,
        })}
      >
        {collapsed ? 'NAV' : 'Navigation'}
      </div>
      <div className='space-y-1'>
        {navItems.map((item) => {
          const selected = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={selected ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-2 whitespace-nowrap rounded-lg py-2 text-text-sub-600 hover:bg-bg-weak-50',
                'transition-default',
                'aria-[current=page]:bg-bg-weak-50',
                {
                  'w-9 px-2': collapsed,
                  'w-full px-3': !collapsed,
                },
              )}
            >
              <div
                className={cn(
                  'transition-default absolute top-1/2 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary-base',
                  {
                    '-left-[22px]': collapsed,
                    '-left-5': !collapsed,
                    'scale-100': selected,
                    'scale-0': !selected,
                  },
                )}
              />
              <item.icon className='h-6 w-6' />

              <div
                className='flex w-[180px] shrink-0 items-center gap-2'
                data-hide-collapsed
              >
                <div className='flex-1 text-label-sm'>{item.label}</div>
                {selected && (
                  <RiArrowRightSLine className='size-5 text-text-sub-600' />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CuratedTokens({ collapsed }: { collapsed: boolean }) {
  return (
    <div className='space-y-2'>
      <div
        className={cn('p-1 text-subheading-xs uppercase text-text-soft-400', {
          '-mx-2.5 w-14 px-0 text-center': collapsed,
        })}
      >
        Curated Tokens
      </div>
      <CuratedTokenList collapsed={collapsed} />
    </div>
  );
}

function SidebarDivider({ collapsed }: { collapsed: boolean }) {
  return (
    <div className='px-5'>
      <Divider.Root
        className={cn('transition-all-default', {
          'w-10': collapsed,
        })}
      />
    </div>
  );
}

function UserProfile({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn('p-3', {
        'px-2': collapsed,
      })}
    >
      <SidebarProfile
        collapsed={collapsed}
        className={cn('transition-all-default', {
          'w-auto': collapsed,
        })}
      />
    </div>
  );
}

export default function Sidebar({
  defaultCollapsed = false,
}: {
  defaultCollapsed?: boolean;
}) {
  const { collapsed, setCollapsed, sidebarRef } = useCollapsedState({
    defaultCollapsed,
  });

  return (
    <>
      <div
        className={cn(
          'transition-all-default fixed left-0 top-0 z-40 hidden h-full overflow-hidden border-r border-stroke-soft-200 bg-bg-white-0 duration-300 lg:block',
          {
            'w-20': collapsed,
            'w-[272px]': !collapsed,
            '[&_[data-hide-collapsed]]:hidden': !collapsed
              ? false
              : defaultCollapsed,
          },
        )}
      >
        <div
          ref={sidebarRef}
          className='flex h-full w-[272px] min-w-[272px] flex-col overflow-auto'
        >
          <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          <SidebarDivider collapsed={collapsed} />

          <div
            className={cn('flex flex-1 flex-col gap-5 pb-4 pt-5', {
              'px-[22px]': collapsed,
              'px-5': !collapsed,
            })}
          >
            <GeneralNavigation collapsed={collapsed} />
            <CuratedTokens collapsed={collapsed} />
          </div>

          <SidebarDivider collapsed={collapsed} />

          <UserProfile collapsed={collapsed} />
        </div>
      </div>

      {/* a necessary placeholder because of sidebar is fixed */}
      <div
        className={cn('shrink-0', {
          'w-[272px]': !collapsed,
          'w-20': collapsed,
        })}
      />
    </>
  );
}
