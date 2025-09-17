import { createClient } from '@/lib/supabase-server';

import BurnScreenerContent from './burn-screener-content';

async function getBurnedChartData() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('token_burned_chart')
    .select('*')
    .order('percentage', { ascending: false });

  if (error) {
    console.error('Error fetching burned chart data:', error);
    return [];
  }

  return data || [];
}

export default async function ChartPage() {
  const data = await getBurnedChartData();

  return <BurnScreenerContent data={data} />;
}
