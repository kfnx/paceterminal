import { NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const { id, description } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    if (description === undefined) {
      return NextResponse.json(
        { error: 'No description provided' },
        { status: 400 },
      );
    }

    // Create server-side Supabase client with service role key
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('technical_analysis')
      .update({
        description: description || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating technical analysis:', error);
      return NextResponse.json(
        { error: 'Failed to update technical analysis' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      technicalAnalysis: data,
    });
  } catch (error) {
    console.error('Technical analysis update API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Update failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
