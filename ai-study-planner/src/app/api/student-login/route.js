import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { student_id, password } = body;

    if (!student_id || !password) {
      return NextResponse.json({ error: 'Student ID and Password are required' }, { status: 400 });
    }

    // Query student_accounts table
    const { data: studentAccount, error } = await supabase
      .from('student_accounts')
      .select('*, classes(name, subject)')
      .eq('student_id', student_id.trim().toUpperCase())
      .single();

    if (error || !studentAccount) {
      return NextResponse.json({ error: 'Invalid Student ID or credentials' }, { status: 401 });
    }

    if (studentAccount.password !== password) {
      return NextResponse.json({ error: 'Invalid Password' }, { status: 401 });
    }

    // Return student session object
    return NextResponse.json({
      success: true,
      student: {
        id: studentAccount.id,
        student_id: studentAccount.student_id,
        full_name: studentAccount.full_name,
        class_id: studentAccount.class_id,
        className: studentAccount.classes?.name || 'Assigned Class',
        subject: studentAccount.classes?.subject || 'General',
        role: 'student',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
