import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      teacher_id,
      class_id,
      title,
      subject = 'General',
      chapter = 'Unit 1',
      difficulty = 3,
      questionCount = 5,
      documentContent = '',
    } = body;

    if (!class_id || !title) {
      return NextResponse.json({ error: 'Class ID and Quiz Title are required' }, { status: 400 });
    }

    let quizQuestions = [];
    const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434';

    let prompt = '';
    if (documentContent && documentContent.trim().length > 0) {
      prompt = `You are an expert exam creator. Read the following uploaded study document notes text and generate a ${questionCount}-question multiple choice quiz directly based on its content.
Source Text:
"""
${documentContent.trim().slice(0, 3500)}
"""

Return ONLY valid JSON:
{
  "questions": [
    {
      "question_text": "Question extracted from source text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_option": 0,
      "topic": "${chapter}"
    }
  ]
}`;
    } else {
      prompt = `You are an expert exam creator. Generate a ${questionCount}-question multiple choice quiz for Subject "${subject}", Chapter "${chapter}", Difficulty Level ${difficulty}/5.
Return ONLY valid JSON:
{
  "questions": [
    {
      "question_text": "Sample question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_option": 0,
      "topic": "${chapter}"
    }
  ]
}`;
    }

    try {
      const aiRes = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:7b',
          prompt,
          stream: false,
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const jsonMatch = (aiData.response || '').match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.questions) {
            quizQuestions = parsed.questions;
          }
        }
      }
    } catch (err) {
      console.warn('Ollama quiz generator fallback:', err.message);
    }

    // Fallback if Ollama response was empty
    if (quizQuestions.length === 0) {
      for (let i = 1; i <= questionCount; i++) {
        quizQuestions.push({
          question_text: `${subject} (${chapter}) Assessment Question #${i}`,
          options: [`Correct Concept Option A`, `Distractor Option B`, `Alternative Choice C`, `Choice D`],
          correct_option: 0,
          topic: chapter,
        });
      }
    }

    // Insert quiz into database
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert([{
        teacher_id,
        class_id,
        title,
        description: documentContent ? `AI Quiz generated from uploaded document notes (${chapter})` : `Quiz on ${subject} - ${chapter}`,
        published: true,
      }])
      .select()
      .single();

    if (quizError) {
      return NextResponse.json({ error: quizError.message }, { status: 500 });
    }

    const questionPayloads = quizQuestions.map((q) => ({
      quiz_id: quizData.id,
      question_text: q.question_text,
      options: q.options || ['A', 'B', 'C', 'D'],
      correct_option: Number(q.correct_option ?? 0),
      topic: q.topic || chapter,
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
