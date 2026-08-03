import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateAiContent } from '@/lib/ai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { teacher_id, class_id, title, description, questions = [], generateWithAi = false, topic = 'General', questionCount = 5 } = body;

    if (!class_id || !title) {
      return NextResponse.json({ error: 'Class ID and Quiz Title are required' }, { status: 400 });
    }

    let quizQuestions = [...questions];

    // AI Auto-Generation Flow if requested
    if (generateWithAi && quizQuestions.length === 0) {
      const prompt = `Generate a ${questionCount}-question multiple-choice quiz on the topic "${topic}".
Return ONLY valid JSON format:
{
  "questions": [
    {
      "question_text": "Sample question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
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
              quizQuestions = parsed.questions;
            }
          }
        }
      } catch (err) {
        console.warn('AI quiz generation fallback:', err.message);
      }

      // Fallback quiz generator if AI call failed
      if (quizQuestions.length === 0) {
        for (let i = 1; i <= questionCount; i++) {
          quizQuestions.push({
            question_text: `${topic} Sample Assessment Question #${i}`,
            options: [`Core Option A for ${topic}`, `Alternative Option B`, `Choice C`, `Choice D`],
            correct_option: 0,
            topic: topic,
          });
        }
      }
    }

    // 1. Create quiz entry
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert([{
        teacher_id,
        class_id,
        title,
        description: description || `Quiz assessment covering ${topic}`,
        published: true,
      }])
      .select()
      .single();

    if (quizError) {
      return NextResponse.json({ error: quizError.message }, { status: 500 });
    }

    // 2. Prepare and insert questions
    const questionPayloads = quizQuestions.map((q) => ({
      quiz_id: quizData.id,
      question_text: q.question_text || 'Question Text',
      options: q.options || ['A', 'B', 'C', 'D'],
      correct_option: Number(q.correct_option ?? 0),
      topic: q.topic || topic,
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
