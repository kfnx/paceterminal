'use client';

import { useState } from 'react';

interface ResendInvitationParams {
  email: string;
}

interface ResendInvitationResult {
  error?: string;
}

export function useResendInvitation() {
  const [loading, setLoading] = useState(false);

  const resendInvitation = async ({
    email,
  }: ResendInvitationParams): Promise<ResendInvitationResult> => {
    try {
      setLoading(true);

      const response = await fetch('/api/admin/resend-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to resend invitation' };
      }

      return {};
    } catch (err) {
      console.error('Error resending invitation:', err);
      return { error: 'Failed to resend invitation' };
    } finally {
      setLoading(false);
    }
  };

  return { resendInvitation, loading };
}
