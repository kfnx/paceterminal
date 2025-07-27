import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      address,
      title,
      title_en,
      description,
      description_en,
      link,
      image,
      date,
    } = await request.json();

    if (!address || !title || !description || !link) {
      return NextResponse.json(
        { error: 'Address, title, description, and link are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('updates')
      .insert({
        address,
        title,
        title_en,
        description,
        description_en,
        link,
        image: image || null,
        date: date || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating update:', error);
      return NextResponse.json(
        { error: 'Failed to create update' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
