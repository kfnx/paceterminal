'use client';

import { RiGlobalLine, RiRefreshLine } from '@remixicon/react';
import * as Button from '@/components/ui/button';
import { useNetworkInfo } from '@/hooks/use-network-info';

export function ConnectionWidget() {
  const networkInfo = useNetworkInfo();

  return (
    <div className={`rounded-lg border p-4 ${networkInfo.bgColor}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm text-gray-900 font-semibold">
          Network Connection
        </h3>
        <Button.Root
          variant="neutral"
          mode="ghost"
          size="xsmall"
          onClick={() => window.location.reload()}
        >
          <Button.Icon as={RiRefreshLine} />
        </Button.Root>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <RiGlobalLine className={networkInfo.color} />
          <span className={`text-sm font-medium ${networkInfo.color}`}>
            {networkInfo.name}
          </span>
        </div>

        <div className="text-xs text-gray-600 break-all font-mono">
          {networkInfo.endpoint}
        </div>

        <div className="text-xs text-gray-500">
          {networkInfo.description}
        </div>
      </div>
    </div>
  );
}