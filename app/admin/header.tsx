'use client';

import { useRouter } from 'next/navigation';
import { RiLogoutBoxLine, RiUserFill } from '@remixicon/react';

import { supabase } from '@/lib/supabase';
import { cnExt } from '@/utils/cn';
import { useAuth } from '@/hooks/use-auth';
import * as FancyButton from '@/components/ui/fancy-button';

export default function Header({
  children,
  className,
  icon,
  title,
  description,
  contentClassName,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  contentClassName?: string;
}) {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <div className='flex items-center justify-between gap-4 px-8 py-4 lg:gap-3.5'>
      {/* <Avatar.Root size='48' color='blue'>
        <Avatar.Image
          src={`/images/tokens/${token?.icon}`}
          alt='buddy'
        />
      </Avatar.Root> */}
      <div className='flex items-center gap-4'>
        <p className='text-paragraph-sm text-text-sub-600'>
          Welcome back, {user.email}
        </p>
      </div>

      <FancyButton.Root variant='neutral' size='medium' onClick={handleSignOut}>
        <RiLogoutBoxLine className='size-4' />
        Sign Out
      </FancyButton.Root>
    </div>
  );
}
