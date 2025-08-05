import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { metric_id, value, time } = await request.json();

    if (!metric_id || value === undefined || !time) {
      return NextResponse.json(
        { error: 'metric_id, value, and time are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('metrics_dynamic_values')
      .insert({
        metric_id,
        value,
        time,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding dynamic metric value:', error);
      return NextResponse.json(
        { error: 'Failed to add dynamic metric value' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error adding dynamic metric value:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
