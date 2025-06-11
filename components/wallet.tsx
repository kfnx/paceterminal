'use client';

import { RiArrowDownSLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';

export function WalletButton({ className }: { className?: string }) {
  return (
    <Button.Root className={className}>
      0xc801...4cB7
      <Button.Icon as={RiArrowDownSLine} />
    </Button.Root>
  );
}
