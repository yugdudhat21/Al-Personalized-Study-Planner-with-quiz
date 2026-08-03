import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req, context) {
  try {
    const resolvedParams = await context.params;
    const studentId = resolvedParams?.studentId;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const { data: weakTopics, error } = await supabase
      .from('weak_topics')
      .select('*, student_accounts(full_name, student_id)')
      .eq('student_account_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, weak_topics: weakTopics || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
