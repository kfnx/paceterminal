import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { address, title, text } = await request.json();

    if (!address || !title) {
      return NextResponse.json(
        { error: 'Address and title are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('alpha')
      .insert({
        address,
        title,
        text: text || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating alpha:', error);
      return NextResponse.json(
        { error: 'Failed to create alpha' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Alpha create API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}