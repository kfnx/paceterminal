import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { id, label, label_en, ordering, unit, unit_en } =
      await request.json();

    if (!id || !label) {
      return NextResponse.json(
        { error: 'ID and label are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('metrics_dynamic')
      .update({
        label,
        label_en: label_en || null,
        ordering: ordering || null,
        unit: unit || null,
        unit_en: unit_en || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating dynamic metric:', error);
      return NextResponse.json(
        { error: 'Failed to update dynamic metric' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating dynamic metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
