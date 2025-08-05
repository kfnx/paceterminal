import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { address, label, label_en, ordering, unit, unit_en } =
      await request.json();

    if (!address || !label) {
      return NextResponse.json(
        { error: 'Address and label are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('metrics_dynamic')
      .insert({
        address,
        label,
        label_en: label_en || null,
        ordering: ordering || null,
        unit: unit || null,
        unit_en: unit_en || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating dynamic metric:', error);
      return NextResponse.json(
        { error: 'Failed to create dynamic metric' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating dynamic metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
