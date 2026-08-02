import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { class_id, teacher_id, title, description, due_date, file_url } = body;

    if (!class_id || !title) {
      return NextResponse.json({ error: 'Class ID and Title are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('assignments')
      .insert([{
        class_id,
        teacher_id: teacher_id || null,
        title,
        description: description || '',
        due_date: due_date || new Date().toISOString().split('T')[0],
        file_url: file_url || null,
      }])
      .select('*, classes(name)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, assignment: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
