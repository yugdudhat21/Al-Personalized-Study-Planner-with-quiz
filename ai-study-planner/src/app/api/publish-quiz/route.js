import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { quiz_id, published } = body;

    if (!quiz_id) {
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('quizzes')
      .update({ published: Boolean(published) })
      .eq('id', quiz_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, quiz: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
