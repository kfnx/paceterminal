'use client';

import { useQuery } from '@tanstack/react-query';

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

async function fetchMembershipStatus(address: string): Promise<MembershipData> {
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
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function useMemberStatus() {
  const { publicKey } = useWalletAddress();
  const address = publicKey?.toBase58();

  const {
    data: membershipData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['membership', address],
    queryFn: () => fetchMembershipStatus(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // const isMember = membershipData?.isMember ?? false;
  // const isActive = membershipData?.isActive ?? false;
  // const expiredAt =
  //   membershipData?.isActive && membershipData.data?.expired_at
  //     ? new Date(membershipData.data.expired_at)
  //     : null;

  // for now we give free access to everyone
  const isMember = true;
  const isActive = true;
  const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 month from now

  return {
    isMember,
    isActive,
    expiredAt,
    loading: isLoading,
    error,
    refetch,
  };
}
