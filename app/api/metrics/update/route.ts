import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { id, label, value, description, source } = await request.json();

    if (!id || !label || !value) {
      return NextResponse.json(
        { error: 'ID, label, and value are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('metrics_static')
      .update({
        label,
        value,
        description: description || null,
        source: source || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating metric:', error);
      return NextResponse.json(
        { error: 'Failed to update metric' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
