import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/supabase';

const createEntrySchema = z.object({
  name: z.string().min(1).max(20),
  percentage: z.number().min(0).max(100),
});

const updateEntrySchema = z.object({
  percentage: z.number().min(0).max(100),
});

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('token_burned_chart')
      .select('*')
      .order('percentage', { ascending: false });

    if (error) {
      console.error('Error fetching burn chart data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch burn chart data' },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error in burn-screener GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createEntrySchema.parse(body);

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('token_burned_chart')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating burn chart entry:', error);
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Token name already exists' },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: 'Failed to create burn chart entry' },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error in burn-screener POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, ...updateData } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Token name is required' },
        { status: 400 },
      );
    }

    const validatedData = updateEntrySchema.parse(updateData);

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('token_burned_chart')
      .update(validatedData)
      .eq('name', name)
      .select()
      .single();

    if (error) {
      console.error('Error updating burn chart entry:', error);
      return NextResponse.json(
        { error: 'Failed to update burn chart entry' },
        { status: 500 },
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error in burn-screener PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: 'Token name is required' },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('token_burned_chart')
      .delete()
      .eq('name', name);

    if (error) {
      console.error('Error deleting burn chart entry:', error);
      return NextResponse.json(
        { error: 'Failed to delete burn chart entry' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in burn-screener DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
