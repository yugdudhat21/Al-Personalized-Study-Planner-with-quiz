import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateAiContent } from '@/lib/ai';

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

    let prompt = '';
    if (documentContent && documentContent.trim().length > 0) {
      prompt = `You are an exam quiz generator. Read the study material and create exactly ${questionCount} multiple-choice questions.

Rules:
- Return ONLY valid JSON.
- No markdown, no explanation.
- Each question must have 4 options.
- Use simple student-friendly language.
- Cover important concepts from the material.
- Keep each question under 20 words if possible.

JSON format:
[
  {
    "question": "What is React?",
    "options": [
      "Library",
      "Database",
      "Server",
      "Compiler"
    ],
    "answer": "Library"
  }
]

Study material:
${documentContent.trim().slice(0, 8000)}`;
    } else {
      prompt = `You are an exam quiz generator. Create exactly ${questionCount} multiple-choice questions for Subject "${subject}", Chapter "${chapter}", Difficulty Level ${difficulty}/5.

Rules:
- Return ONLY valid JSON.
- No markdown, no explanation.
- Each question must have 4 options.
- Use simple student-friendly language.
- Cover important concepts.
- Keep each question under 20 words if possible.

JSON format:
[
  {
    "question": "Sample question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A"
  }
]`;
    }

    try {
      const rawResponse = await generateAiContent(prompt, true);
      if (rawResponse) {
        let cleanJson = rawResponse.trim();
        const jsonMatch = cleanJson.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          let parsedQuestions = [];
          if (Array.isArray(parsed)) {
            parsedQuestions = parsed;
          } else if (parsed.questions && Array.isArray(parsed.questions)) {
            parsedQuestions = parsed.questions;
          }

          quizQuestions = parsedQuestions.map((q) => {
            const qText = q.question || q.question_text || 'Assessment Question';
            const opts = Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'];
            
            let correctIdx = 0;
            if (q.correct_option !== undefined && !isNaN(Number(q.correct_option))) {
              correctIdx = Number(q.correct_option);
            } else if (q.answer !== undefined) {
              if (typeof q.answer === 'number') {
                correctIdx = q.answer;
              } else if (typeof q.answer === 'string') {
                const idx = opts.findIndex(o => String(o).trim().toLowerCase() === q.answer.trim().toLowerCase());
                if (idx !== -1) {
                  correctIdx = idx;
                }
              }
            }

            return {
              question_text: qText,
              options: opts,
              correct_option: correctIdx,
              topic: q.topic || chapter || 'PDF Notes',
            };
          });
        }
      }
    } catch (err) {
      console.warn('AI quiz generator warning:', err.message);
    }

    // Fallback if AI response was empty
    if (quizQuestions.length === 0) {
      for (let i = 1; i <= questionCount; i++) {
        quizQuestions.push({
          question_text: `${subject} (${chapter}) Assessment Question #${i}`,
          options: [`Correct Concept Option A`, `Distractor Option B`, `Alternative Choice C`, `Choice D`],
          correct_option: 0,
          topic: chapter || 'PDF Notes',
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
        description: documentContent ? `AI Quiz generated from uploaded document notes (${chapter || 'PDF Notes'})` : `Quiz on ${subject} - ${chapter}`,
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
      topic: q.topic || chapter || 'PDF Notes',
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
