import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { class_id, full_name, custom_password } = body;

    if (!class_id || !full_name) {
      return NextResponse.json({ error: 'Class ID and Student Full Name are required' }, { status: 400 });
    }

    // Generate unique Student ID (e.g. STU-8492)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const student_id = `STU-${randomNum}`;
    const password = custom_password || `pass${Math.floor(100 + Math.random() * 900)}`;

    // Insert student account into student_accounts table
    const { data: newStudent, error } = await supabase
      .from('student_accounts')
      .insert([{
        class_id,
        student_id,
        password,
        full_name,
      }])
      .select('*, classes(name)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      student: newStudent,
      credentials: {
        student_id,
        password,
        full_name,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
