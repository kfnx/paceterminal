'use client';

import { useState } from 'react';

interface InviteUserParams {
  email: string;
}

interface InviteUserResult {
  error?: string;
}

export function useInviteUser() {
  const [loading, setLoading] = useState(false);

  const inviteUser = async ({
    email,
  }: InviteUserParams): Promise<InviteUserResult> => {
    try {
      setLoading(true);

      const response = await fetch('/api/admin/invite-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to invite user' };
      }

      return {};
    } catch (err) {
      console.error('Error inviting user:', err);
      return { error: 'Failed to invite user' };
    } finally {
      setLoading(false);
    }
  };

  return { inviteUser, loading };
}
