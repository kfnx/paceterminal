import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // First delete all values associated with this metric
    const { error: valuesError } = await supabase
      .from('metrics_dynamic_values')
      .delete()
      .eq('metric_id', id);

    if (valuesError) {
      console.error('Error deleting dynamic metric values:', valuesError);
      return NextResponse.json(
        { error: 'Failed to delete dynamic metric values' },
        { status: 500 },
      );
    }

    // Then delete the metric itself
    const { error } = await supabase
      .from('metrics_dynamic')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting dynamic metric:', error);
      return NextResponse.json(
        { error: 'Failed to delete dynamic metric' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dynamic metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
