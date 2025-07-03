import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Metric ID is required' },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from('metrics_static')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Error deleting metric:', error);
      return NextResponse.json(
        { error: 'Failed to delete metric' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
