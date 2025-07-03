import { NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, link, image } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    if (!title || !description || !link) {
      return NextResponse.json(
        { error: 'Title, description, and link are required' },
        { status: 400 },
      );
    }

    // Create server-side Supabase client with service role key
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('updates')
      .update({
        title,
        description,
        link,
        image: image || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating update:', error);
      return NextResponse.json(
        { error: 'Failed to update update' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      update: data,
    });
  } catch (error) {
    console.error('Update API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Update failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
