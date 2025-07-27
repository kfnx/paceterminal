import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { address, title, text, title_en, text_en } = await request.json();

    if (!address || !title) {
      return NextResponse.json(
        { error: 'Address and title are required' },
        { status: 400 },
      );
    }

    const insertData: any = {
      address,
      title,
      text: text || null,
    };

    // Add English fields if they exist
    if (title_en) {
      insertData.title_en = title_en;
    }
    if (text_en) {
      insertData.text_en = text_en;
    }

    const { data, error } = await supabase
      .from('alpha')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating alpha:', error);
      return NextResponse.json(
        { error: 'Failed to create alpha' },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Alpha create API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
