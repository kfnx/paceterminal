import { NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    let query = supabase
      .from('x_posts')
      .select('*')
      .order('is_active', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true).limit(1);
    }

    const { data: xPosts, error } = await query;

    if (error) {
      console.error('Error fetching X posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch X posts' },
        { status: 500 },
      );
    }

    // Return single post if active only, otherwise array
    if (activeOnly) {
      return NextResponse.json({ xPost: xPosts?.[0] || null });
    }

    return NextResponse.json({ xPosts });
  } catch (error) {
    console.error('Error in X posts GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { id, tweet_id, username, url, is_active } = await request.json();

    // Validate required fields
    if (!tweet_id || !username) {
      return NextResponse.json(
        { error: 'tweet_id and username are required' },
        { status: 400 },
      );
    }

    // If setting this post as active, deactivate all other posts first
    if (is_active) {
      await supabase
        .from('x_posts')
        .update({ is_active: false })
        .neq('id', id || 0);
    }

    if (id) {
      // Update existing X post
      const { data: updatedXPost, error: updateError } = await supabase
        .from('x_posts')
        .update({
          tweet_id,
          username,
          url: url || null,
          is_active: is_active || false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating X post:', updateError);
        return NextResponse.json(
          { error: 'Failed to update X post' },
          { status: 500 },
        );
      }

      return NextResponse.json({ xPost: updatedXPost });
    } else {
      // Create new X post
      const { data: newXPost, error: insertError } = await supabase
        .from('x_posts')
        .insert({
          tweet_id,
          username,
          url: url || null,
          is_active: is_active || false,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating X post:', insertError);
        return NextResponse.json(
          { error: 'Failed to create X post' },
          { status: 500 },
        );
      }

      return NextResponse.json({ xPost: newXPost });
    }
  } catch (error) {
    console.error('Error in X posts POST API:', error);
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('x_posts')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) {
      console.error('Error deleting X post:', error);
      return NextResponse.json(
        { error: 'Failed to delete X post' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in X posts DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
