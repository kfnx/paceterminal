'use client';

import { useCallback, useEffect, useState } from 'react';

import { useWalletAddress } from './use-wallet-address';

interface MembershipData {
  isMember: boolean;
  isActive: boolean;
  message: string;
  data: {
    solana_address: string;
    expired_at: string | null;
    created_at: string;
    expires_in_days: number;
  } | null;
}

export function useMemberStatus() {
  const { publicKey } = useWalletAddress();
  const address = publicKey?.toBase58();
  const [isMember, setIsMember] = useState(false);
  const [expiredAt, setExpiredAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const checkMembership = useCallback(async () => {
    if (!address) {
      setLoading(false);
      setIsMember(false);
      setExpiredAt(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/member?address=${encodeURIComponent(address)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        console.error('API error:', response.status, response.statusText);
        setIsMember(false);
        setExpiredAt(null);
        return;
      }

      const data: MembershipData = await response.json();

      setIsMember(data.isMember);

      if (data.isActive && data.data?.expired_at) {
        setExpiredAt(new Date(data.data.expired_at));
      } else {
        setExpiredAt(null);
      }
    } catch (error) {
      console.error('Error checking membership:', error);
      setIsMember(false);
      setExpiredAt(null);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    checkMembership();
  }, [checkMembership]);

  return { isMember, expiredAt, loading, refetch: checkMembership };
}
