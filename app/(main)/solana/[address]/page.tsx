import { notFound } from 'next/navigation';

import { supabase } from '@/lib/supabase';

import { Content } from './content';

export async function generateStaticParams() {
  try {
    const { data: tokens } = await supabase
      .from('tokens')
      .select('address')
      .order('ordering', { ascending: true });

    return (
      tokens?.map((token) => ({
        address: token.address,
      })) || []
    );
  } catch (error) {
    console.error('Error fetching tokens for static params:', error);
    return [];
  }
}

export default async function SolanaTokenPage({
  params,
}: {
  params: { address: string };
}) {
  const { data: token, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('address', params.address)
    .single();

  if (error || !token) {
    notFound();
  }

  return <Content />;
}
