import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req, { params }) {
  try {
    const quizId = params.quizId;

    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 });
    }

    // 1. Fetch raw quiz results
    const { data: results, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('quiz_id', quizId)
      .order('score', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Fetch student account details for each submission reliably
    const enrichedResults = await Promise.all(
      (results || []).map(async (res, index) => {
        let studentAccount = null;
        if (res.student_account_id) {
          const { data: stu } = await supabase
            .from('student_accounts')
            .select('full_name, student_id')
            .eq('id', res.student_account_id)
            .maybeSingle();
          studentAccount = stu;
        }

        return {
          ...res,
          student_accounts: studentAccount || { full_name: 'Student', student_id: '-' },
          rank: index + 1,
        };
      })
    );

    return NextResponse.json({ success: true, results: enrichedResults });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
