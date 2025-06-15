'use client';

import { useTheme } from 'next-themes';
import { RiMoonLine, RiSunLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';

export function ThemeToggler({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button.Root
      variant='neutral'
      mode='ghost'
      className={className}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Button.Icon as={RiSunLine} />
      ) : (
        <Button.Icon as={RiMoonLine} />
      )}
    </Button.Root>
  );
} 