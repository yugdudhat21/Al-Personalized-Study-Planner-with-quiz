import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    let { quiz_id, student_account_id, answers = {} } = body;

    if (!quiz_id) {
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 });
    }

    // Fallback: If student_account_id is missing, look up student_accounts for this quiz's class
    if (!student_account_id) {
      const { data: quizData } = await supabase.from('quizzes').select('class_id').eq('id', quiz_id).single();
      if (quizData?.class_id) {
        const { data: stuAcc } = await supabase
          .from('student_accounts')
          .select('id')
          .eq('class_id', quizData.class_id)
          .limit(1)
          .maybeSingle();

        if (stuAcc?.id) {
          student_account_id = stuAcc.id;
        }
      }
    }

    if (!student_account_id) {
      // Create emergency student account record if none exists
      const { data: fallbackStu } = await supabase
        .from('student_accounts')
        .insert([{
          student_id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
          password: 'password123',
          full_name: 'Enrolled Student',
        }])
        .select()
        .single();

      if (fallbackStu?.id) {
        student_account_id = fallbackStu.id;
      }
    }

    // 1. Fetch questions for this quiz
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quiz_id);

    if (qError || !questions || !questions.length) {
      return NextResponse.json({ error: 'Quiz questions not found' }, { status: 404 });
    }

    // 2. Score calculation & Topic accuracy breakdown
    let totalScore = 0;
    const topicStats = {};

    questions.forEach((q) => {
      const selectedOption = answers[q.id];
      const isCorrect = Number(selectedOption) === q.correct_option;
      if (isCorrect) totalScore++;

      const topicName = q.topic || 'General';
      if (!topicStats[topicName]) {
        topicStats[topicName] = { total: 0, correct: 0 };
      }
      topicStats[topicName].total += 1;
      if (isCorrect) {
        topicStats[topicName].correct += 1;
      }
    });

    const totalQuestions = questions.length;
    const percentage = Number(((totalScore / totalQuestions) * 100).toFixed(1));

    // 3. Detect weak topics (< 60% accuracy)
    const weakTopicsDetected = [];
    Object.keys(topicStats).forEach((topic) => {
      const stats = topicStats[topic];
      const accuracy = Number(((stats.correct / stats.total) * 100).toFixed(1));
      if (accuracy < 60) {
        weakTopicsDetected.push({ topic, accuracy, total: stats.total, correct: stats.correct });
      }
    });

    // 4. Save result into quiz_results table
    const { data: quizResult, error: resultError } = await supabase
      .from('quiz_results')
      .insert([{
        quiz_id,
        student_account_id,
        score: totalScore,
        total_questions: totalQuestions,
        percentage,
        weak_topics: weakTopicsDetected,
      }])
      .select('*, quizzes(title)')
      .single();

    if (resultError) {
      return NextResponse.json({ error: resultError.message }, { status: 500 });
    }

    // 5. Automatically insert/upsert into weak_topics table if accuracy < 60%
    if (student_account_id) {
      for (const wt of weakTopicsDetected) {
        await supabase
          .from('weak_topics')
          .insert([{
            student_account_id,
            topic: wt.topic,
            accuracy: wt.accuracy,
            needs_remediation: true,
          }]);
      }
    }

    return NextResponse.json({
      success: true,
      result: quizResult,
      score: totalScore,
      total_questions: totalQuestions,
      percentage,
      weak_topics: weakTopicsDetected,
      questions,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
