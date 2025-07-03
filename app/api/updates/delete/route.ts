import { NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    // Create server-side Supabase client with service role key
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from('updates').delete().eq('id', id);

    if (error) {
      console.error('Error deleting update:', error);
      return NextResponse.json(
        { error: 'Failed to delete update' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete update API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Delete failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}