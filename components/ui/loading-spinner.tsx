import React from 'react';

import { cn } from '@/utils/cn';

type LoadingSpinnerProps = {
  className?: string;
};

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        className,
      )}
      aria-label='Loading'
    >
      <div
        className='border-primary h-12 w-12 animate-spin rounded-full border-4 border-solid border-t-transparent'
        role='status'
      >
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
}
