import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function DELETE(request: NextRequest) {
  try {
    const { metric_id, time } = await request.json();

    if (!metric_id || !time) {
      return NextResponse.json(
        { error: 'metric_id and time are required' },
        { status: 400 },
      );
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('metrics_dynamic_values')
      .delete()
      .eq('metric_id', metric_id)
      .eq('time', time);

    if (error) {
      console.error('Error deleting dynamic metric value:', error);
      return NextResponse.json(
        { error: 'Failed to delete dynamic metric value' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dynamic metric value:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
} 