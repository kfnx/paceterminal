'use client';

import { useQuery } from '@tanstack/react-query';
import type { XUserResponse } from '@/app/api/x-user/route';

/**
 * Hook to fetch X (Twitter) user details
 * @param username - X username (without @ symbol)
 * @returns Query result with user data including pinned_tweet_id
 *
 * @example
 * const { data, isLoading, error } = useXUser('pacecrypto');
 */
export function useXUser(username: string) {
  return useQuery({
    queryKey: ['x-user', username],
    queryFn: async (): Promise<XUserResponse> => {
      const response = await fetch(`/api/x-user?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'Failed to fetch X user details',
        }));
        throw new Error(error.message || 'Failed to fetch X user details');
      }

      return response.json();
    },
    enabled: !!username, // Only run if username is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - user profiles don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}
