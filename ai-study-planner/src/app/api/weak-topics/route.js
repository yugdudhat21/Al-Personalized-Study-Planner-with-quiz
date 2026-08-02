import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentAccountId = searchParams.get('student_account_id');
    const classId = searchParams.get('class_id');

    let query = supabase.from('weak_topics').select('*, student_accounts(full_name, student_id)');

    if (studentAccountId) {
      query = query.eq('student_account_id', studentAccountId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, weak_topics: data || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
