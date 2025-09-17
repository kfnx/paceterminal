import { NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: ads, error } = await supabase
      .from('ads')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching ads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch ads' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ads });
  } catch (error) {
    console.error('Error in ads API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { position, image_url, target_url } = await request.json();

    // Check if ad already exists for this position
    const { data: existingAd } = await supabase
      .from('ads')
      .select('*')
      .eq('position', position)
      .single();

    if (existingAd) {
      // Update existing ad
      const { data: updatedAd, error: updateError } = await supabase
        .from('ads')
        .update({ image_url, target_url, updated_at: new Date().toISOString() })
        .eq('position', position)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating ad:', updateError);
        return NextResponse.json(
          { error: 'Failed to update ad' },
          { status: 500 },
        );
      }

      return NextResponse.json({ ad: updatedAd });
    } else {
      // Create new ad
      const { data: newAd, error: insertError } = await supabase
        .from('ads')
        .insert({ position, image_url, target_url })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating ad:', insertError);
        return NextResponse.json(
          { error: 'Failed to create ad' },
          { status: 500 },
        );
      }

      return NextResponse.json({ ad: newAd });
    }
  } catch (error) {
    console.error('Error in ads POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');

    if (!position) {
      return NextResponse.json(
        { error: 'Position is required' },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('position', position);

    if (error) {
      console.error('Error deleting ad:', error);
      return NextResponse.json(
        { error: 'Failed to delete ad' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in ads DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
