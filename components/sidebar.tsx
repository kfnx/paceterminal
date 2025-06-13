'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiArrowRightSLine,
  RiHeadphoneLine,
  RiSkipLeftLine,
  RiSkipRightLine,
} from '@remixicon/react';
import { useQueryState } from 'nuqs';
import { useHotkeys } from 'react-hotkeys-hook';

import { TOKENS } from '@/lib/tokens';
import { cn, cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';

import { LoadingSpinner } from './ui/loading-spinner';
import IconCmd from '~/icons/icon-cmd.svg';

type CuratedTokens = {
  address: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  disabled?: boolean;
};

export const curatedTokens: CuratedTokens[] = TOKENS.map((token) => ({
  address: token.address,
  icon: (
    <Avatar.Root size='24' color='blue'>
      <Avatar.Image
        src={`/images/placeholder/${token.icon}.svg`}
        alt={token.name}
      />
    </Avatar.Root>
  ),
  label: token.name,
  href: `?token=${token.address}`,
}));

export const favoriteLinks = [
  {
    href: '#',
    color: 'purple',
    projectName: 'Loom Mobile App',
    shortcut: (
      <>
        <IconCmd className='size-2.5' />1
      </>
    ),
  },
  {
    href: '#',
    color: 'red',
    projectName: 'Monday Redesign',
    shortcut: (
      <>
        <IconCmd className='size-2.5' />2
      </>
    ),
  },
  {
    href: '#',
    color: 'pink',
    projectName: 'Udemy Courses',
    shortcut: (
      <>
        <IconCmd className='size-2.5' />3
      </>
    ),
  },
];

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
        <h1 className='text-2xl font-bold text-text-strong-950'>
          {collapsed ? 'PACE' : 'PACETERMINAL'}
        </h1>
        {!collapsed && (
          <p className='text-paragraph-sm text-text-sub-600'>
            Hong Pingpah Alaium
          </p>
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
  const [token] = useQueryState('token');

  return (
    <div className='space-y-1'>
      {curatedTokens.map(
        ({ icon: Icon, label, href, disabled, address }, i) => {
          const selected = token === address;
          return (
            <Link
              key={i}
              href={href}
              aria-current={selected}
              aria-disabled={disabled}
              className={cn(
                'group relative flex items-center gap-2 whitespace-nowrap rounded-lg py-2 text-text-sub-600 hover:bg-bg-weak-50',
                'transition-default',
                'aria-[current=page]:bg-bg-weak-50',
                'aria-disabled:pointer-events-none aria-disabled:opacity-50',
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
              {Icon}
              {/* <Icon
              className={cn(
              'transition-default size-5 shrink-0 text-text-sub-600',
              'group-aria-[current=page]:text-primary-base',
            )}
          /> */}

              <div
                className='flex w-[180px] shrink-0 items-center gap-2'
                data-hide-collapsed
              >
                <div className='flex-1 text-label-sm'>{label}</div>
                {selected && (
                  <RiArrowRightSLine className='size-5 text-text-sub-600' />
                )}
              </div>
            </Link>
          );
        },
      )}
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
      <React.Suspense fallback={<LoadingSpinner />}>
        <CuratedTokenList collapsed={collapsed} />
      </React.Suspense>
    </div>
  );
}

function TrendingTokens({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  const links = [
    {
      href: '/settings/profile-settings',
      icon: (
        <Avatar.Root size='24' color='blue'>
          <Avatar.Image src='/images/placeholder/solaris.svg' alt='buddy' />
        </Avatar.Root>
      ),
      label: 'DTR',
    },
    {
      href: '#',
      icon: (
        <Avatar.Root size='24' color='blue'>
          <Avatar.Image src='/images/placeholder/apex.svg' alt='buddy' />
        </Avatar.Root>
      ),
      label: 'AIBXC',
      disabled: true,
    },
  ];

  return (
    <div className='space-y-2'>
      <div
        className={cn('p-1 text-subheading-xs uppercase text-text-soft-400', {
          '-mx-2.5 w-14 px-0 text-center': collapsed,
        })}
      >
        Trending Tokens
      </div>
      <div className='space-y-1'>
        {links.map(({ icon: Icon, label, href, disabled }, i) => {
          const isActivePage = pathname.startsWith(href);

          return (
            <Link
              key={i}
              href={href}
              aria-current={isActivePage ? 'page' : undefined}
              aria-disabled={disabled}
              className={cn(
                'group relative flex items-center gap-2 whitespace-nowrap rounded-lg py-2 text-text-sub-600 hover:bg-bg-weak-50',
                'transition-default',
                'aria-[current=page]:bg-bg-weak-50',
                'aria-disabled:pointer-events-none aria-disabled:opacity-50',
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
                    'scale-100': isActivePage,
                    'scale-0': !isActivePage,
                  },
                )}
              />
              {Icon}
              {/* <Icon
                className={cn(
                  'transition-default size-5 shrink-0 text-text-sub-600',
                  'group-aria-[current=page]:text-primary-base',
                )}
              /> */}

              <div
                className='flex w-[180px] shrink-0 items-center gap-2'
                data-hide-collapsed
              >
                <div className='flex-1 text-label-sm'>{label}</div>
                {isActivePage && (
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

function LatestBlogs({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  const links = [
    {
      href: '#',
      icon: RiHeadphoneLine,
      label: 'Support',
      disabled: true,
    },
  ];

  return (
    <div className='space-y-2'>
      <div
        className={cn('p-1 text-subheading-xs uppercase text-text-soft-400', {
          '-mx-2.5 w-14 px-0 text-center': collapsed,
        })}
      >
        Latest Blogs
      </div>
      <div className='space-y-1'>
        {links.map(({ icon: Icon, label, href, disabled }, i) => {
          const isActivePage = pathname.startsWith(href);

          return (
            <Link
              key={i}
              href={href}
              aria-current={isActivePage ? 'page' : undefined}
              aria-disabled={disabled}
              className={cn(
                'group relative flex items-center gap-2 whitespace-nowrap rounded-lg py-2 text-text-sub-600 hover:bg-bg-weak-50',
                'transition-default',
                'aria-[current=page]:bg-bg-weak-50',
                'aria-disabled:pointer-events-none aria-disabled:opacity-50',
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
                    'scale-100': isActivePage,
                    'scale-0': !isActivePage,
                  },
                )}
              />
              <Icon
                className={cn(
                  'transition-default size-5 shrink-0 text-text-sub-600',
                  'group-aria-[current=page]:text-primary-base',
                )}
              />

              <div
                className='flex w-[180px] shrink-0 items-center gap-2'
                data-hide-collapsed
              >
                <div className='flex-1 text-label-sm'>{label}</div>
                {isActivePage && (
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
            'w-[224px]': !collapsed,
            '[&_[data-hide-collapsed]]:hidden': !collapsed
              ? false
              : defaultCollapsed,
          },
        )}
      >
        <div
          ref={sidebarRef}
          className='flex h-full w-[224px] min-w-[224px] flex-col overflow-auto'
        >
          <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />

          <SidebarDivider collapsed={collapsed} />

          <div
            className={cn('flex flex-1 flex-col gap-5 pb-4 pt-5', {
              'px-[22px]': collapsed,
              'px-5': !collapsed,
            })}
          >
            <CuratedTokens collapsed={collapsed} />
            <TrendingTokens collapsed={collapsed} />
            <LatestBlogs collapsed={collapsed} />
          </div>
        </div>
      </div>

      {/* a necessary placeholder because of sidebar is fixed */}
      <div
        className={cn('shrink-0', {
          'w-[224px]': !collapsed,
          'w-20': collapsed,
        })}
      />
    </>
  );
}
