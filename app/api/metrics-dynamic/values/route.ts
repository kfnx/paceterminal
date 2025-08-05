import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metricId = searchParams.get('metric_id');

    if (!metricId) {
      return NextResponse.json(
        { error: 'metric_id is required' },
        { status: 400 },
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('metrics_dynamic_values')
      .select('value, time')
      .eq('metric_id', metricId)
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching dynamic metric values:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dynamic metric values' },
        { status: 500 },
      );
    }

    return NextResponse.json({ values: data || [] });
  } catch (error) {
    console.error('Error fetching dynamic metric values:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
