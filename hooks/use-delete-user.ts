'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface DeleteUserParams {
  userId: string;
}

interface DeleteUserResult {
  error?: string;
}

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const deleteUser = async ({
    userId,
  }: DeleteUserParams): Promise<DeleteUserResult> => {
    try {
      setLoading(true);

      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to delete user' };
      }

      // Invalidate the users cache to force a fresh fetch
      await queryClient.invalidateQueries({ queryKey: ['users'] });

      return {};
    } catch (err) {
      console.error('Error deleting user:', err);
      return { error: 'Failed to delete user' };
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading };
}
