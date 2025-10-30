'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// TODO: This type will be automatically generated after running the database migration
import type { Tables } from '@/lib/database.types';

// and executing `pnpm db:gen:types`. For now, we define it manually.
// Once generated, replace with: import type { Tables } from '@/lib/database.types';
// export type XPost = Tables<'x_posts'>;

export type XPost = Tables<'x_posts'>;

interface XPostsResponse {
  xPosts: XPost[];
}

interface ActiveXPostResponse {
  xPost: XPost | null;
}

interface XPostResponse {
  xPost: XPost;
}

const fetchXPosts = async (): Promise<XPost[]> => {
  const response = await fetch('/api/x-posts');
  if (!response.ok) {
    throw new Error('Failed to fetch X posts');
  }
  const data: XPostsResponse = await response.json();
  return data.xPosts;
};

const fetchActiveXPost = async (): Promise<XPost | null> => {
  const response = await fetch('/api/x-posts?active=true');
  if (!response.ok) {
    throw new Error('Failed to fetch active X post');
  }
  const data: ActiveXPostResponse = await response.json();
  return data.xPost;
};

const createOrUpdateXPost = async (params: {
  id?: number;
  tweet_id: string;
  username: string;
  url?: string;
  is_active?: boolean;
}): Promise<XPost> => {
  const response = await fetch('/api/x-posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to save X post');
  }

  const data: XPostResponse = await response.json();
  return data.xPost;
};

const deleteXPost = async (id: number): Promise<void> => {
  const response = await fetch(`/api/x-posts?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete X post');
  }
};

/**
 * Hook to fetch all X posts (for admin management)
 */
export function useXPosts() {
  const {
    data: xPosts = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['x-posts'],
    queryFn: fetchXPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    xPosts,
    loading,
    error: error?.message || null,
    refetch,
  };
}

/**
 * Hook to fetch the single active X post (for widget display)
 */
export function useActiveXPost() {
  const {
    data: xPost = null,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['x-posts', 'active'],
    queryFn: fetchActiveXPost,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    xPost,
    loading,
    error: error?.message || null,
    refetch,
  };
}

/**
 * Hook to create or update an X post
 */
export function useCreateOrUpdateXPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrUpdateXPost,
    onSuccess: async () => {
      // Refetch all X posts and active post immediately
      await queryClient.refetchQueries({ queryKey: ['x-posts'] });
    },
  });
}

/**
 * Hook to delete an X post
 */
export function useDeleteXPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteXPost,
    onSuccess: async () => {
      // Refetch all X posts and active post immediately
      await queryClient.refetchQueries({ queryKey: ['x-posts'] });
    },
  });
}
