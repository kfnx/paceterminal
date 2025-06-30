'use client';

import { useQuery } from '@tanstack/react-query';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  last_sign_in_at: string | null;
  confirmed_at: string | null;
}

interface UsersResponse {
  users: User[];
}

interface ErrorResponse {
  error: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/admin/users');

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || 'Failed to fetch users');
  }

  const data: UsersResponse = await response.json();
  return data.users;
};

export function useUsers() {
  const {
    data: users = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 30 * 1000, // 30 seconds - reduced from 5 minutes for more responsive updates
  });

  return {
    users,
    loading,
    error: error?.message || null,
    refetch,
  };
}
