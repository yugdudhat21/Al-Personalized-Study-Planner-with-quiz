import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateAiContent } from '@/lib/ai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { teacher_id, class_id, topic, questionCount = 3 } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Weak topic name is required' }, { status: 400 });
    }

    let remedialQuestions = [];
    const prompt = `You are a patient tutor. Generate a ${questionCount}-question easier remedial practice quiz for weak topic "${topic}".
Return ONLY valid JSON:
{
  "questions": [
    {
      "question_text": "Easier foundational question about ${topic}?",
      "options": ["Correct Option A", "Option B", "Option C", "Option D"],
      "correct_option": 0,
      "topic": "${topic}"
    }
  ]
}`;

    try {
      const rawResponse = await generateAiContent(prompt, true);
      if (rawResponse) {
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.questions && Array.isArray(parsed.questions)) {
            remedialQuestions = parsed.questions;
          }
        }
      }
    } catch (err) {
      console.warn('AI remedial generator fallback:', err.message);
    }

    if (remedialQuestions.length === 0) {
      for (let i = 1; i <= questionCount; i++) {
        remedialQuestions.push({
          question_text: `Foundational Practice for ${topic} #${i}`,
          options: [`Simplified Concept A`, `Option B`, `Option C`, `Option D`],
          correct_option: 0,
          topic: topic,
        });
      }
    }

    // Insert remedial quiz into database
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert([{
        teacher_id: teacher_id || null,
        class_id: class_id || null,
        title: `Remedial Quiz: ${topic}`,
        description: `Targeted practice quiz for weak topic: ${topic}`,
        published: true,
      }])
      .select()
      .single();

    if (quizError) {
      return NextResponse.json({ error: quizError.message }, { status: 500 });
    }

    const questionPayloads = remedialQuestions.map((q) => ({
      quiz_id: quizData.id,
      question_text: q.question_text,
      options: q.options || ['A', 'B', 'C', 'D'],
      correct_option: Number(q.correct_option ?? 0),
      topic: topic,
    }));

    const { data: insertedQuestions, error: questionError } = await supabase
      .from('questions')
      .insert(questionPayloads)
      .select();

    if (questionError) {
      return NextResponse.json({ error: questionError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      quiz: quizData,
      questions: insertedQuestions,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
