'use client';

import { useParams } from 'next/navigation';

import { useToken } from './use-token';

/**
 * Hook to get the current token based on the route parameter.
 * This can be used as a fallback when token context is not available.
 */
export function useCurrentToken() {
  const params = useParams();
  const address = params.address as string;

  return useToken(address);
}
