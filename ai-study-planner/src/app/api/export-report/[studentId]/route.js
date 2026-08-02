import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req, { params }) {
  try {
    const studentId = params.studentId;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Fetch student account directly without join dependencies
    const { data: student, error: sErr } = await supabase
      .from('student_accounts')
      .select('*')
      .eq('id', studentId)
      .single();

    if (sErr || !student) {
      return NextResponse.json({ error: 'Student account not found' }, { status: 404 });
    }

    // Fetch class details if class_id is present
    let classObj = null;
    if (student.class_id) {
      const { data: cData } = await supabase
        .from('classes')
        .select('name, subject')
        .eq('id', student.class_id)
        .maybeSingle();
      classObj = cData;
    }

    const studentWithClass = {
      ...student,
      classes: classObj || { name: 'General Class', subject: 'General' },
    };

    const { data: quizResults } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('student_account_id', studentId);

    const { data: weakTopics } = await supabase
      .from('weak_topics')
      .select('*')
      .eq('student_account_id', studentId);

    const avgScore = quizResults && quizResults.length > 0
      ? (quizResults.reduce((acc, curr) => acc + Number(curr.percentage || 0), 0) / quizResults.length).toFixed(1)
      : '0';

    return NextResponse.json({
      success: true,
      report: {
        student: studentWithClass,
        quizResults: quizResults || [],
        weakTopics: weakTopics || [],
        analyticsSummary: {
          averageQuizPercentage: avgScore,
          totalQuizzesTaken: quizResults?.length || 0,
          flaggedWeakTopicsCount: weakTopics?.length || 0,
          predictionSummary: Number(avgScore) >= 75
            ? 'High Mastery - Ready for advanced assessments'
            : Number(avgScore) >= 60
            ? 'Moderate Mastery - Focused practice on weak topics recommended'
            : 'Remediation Needed - Targeted intervention required',
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
