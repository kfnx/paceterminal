import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      address,
      label,
      value,
      description,
      source,
      ordering,
      label_en,
      value_en,
      description_en,
    } = await request.json();

    if (!address || !label || !value) {
      return NextResponse.json(
        { error: 'Address, label, and value are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('metrics_static')
      .insert({
        address,
        label,
        value,
        description: description || null,
        source: source || null,
        ordering: ordering || null,
        label_en: label_en || null,
        value_en: value_en || null,
        description_en: description_en || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating metric:', error);
      return NextResponse.json(
        { error: 'Failed to create metric' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
