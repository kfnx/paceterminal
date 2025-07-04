import { NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('alpha')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) {
      console.error('Error deleting alpha:', error);
      return NextResponse.json(
        { error: 'Failed to delete alpha' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alpha delete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
