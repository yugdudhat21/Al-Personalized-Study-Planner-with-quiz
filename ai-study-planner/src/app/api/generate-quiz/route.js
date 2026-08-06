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
      prompt = `You are a strict exam question author. Read the provided Study Material below and create exactly ${questionCount} multiple-choice questions based ONLY on facts, definitions, and concepts directly stated in the Study Material.

CRITICAL INSTRUCTIONS:
- EVERY question, correct answer, and option MUST come strictly from the provided Study Material.
- DO NOT use outside topics, general knowledge, or example questions (such as React, coding, math, etc.) unless they are explicitly in the Study Material.
- Return ONLY valid JSON format.
- No markdown formatting, no extra explanation text.
- Provide 4 distinct options per question.

JSON Schema required:
[
  {
    "question": "Question derived directly from the text?",
    "options": [
      "Correct answer choice from text",
      "Distractor choice 1 from text",
      "Distractor choice 2 from text",
      "Distractor choice 3 from text"
    ],
    "answer": "Correct answer choice from text"
  }
]

Study Material Text:
${documentContent.trim().slice(0, 8000)}`;
    } else {
      prompt = `You are an exam quiz generator. Create exactly ${questionCount} multiple-choice questions for Subject "${subject}", Chapter "${chapter}", Difficulty Level ${difficulty}/5.

Rules:
- Return ONLY valid JSON.
- No markdown, no explanation.
- Each question must have 4 options.
- Use simple student-friendly language.
- Cover important concepts from topic "${chapter}".
- Keep each question concise.

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
              topic: q.topic || chapter || 'PDF Content',
            };
          });
        }
      }
    } catch (err) {
      console.warn('AI quiz generator warning:', err.message);
    }

    // Smart Fallback if AI response was empty or failed
    if (quizQuestions.length === 0) {
      if (documentContent && documentContent.trim().length > 0) {
        // Extract clean sentences from uploaded document
        const sentences = documentContent
          .split(/(?<=[.?!])\s+/)
          .map(s => s.trim())
          .filter(s => s.length > 20 && s.length < 180);

        for (let i = 0; i < Math.min(questionCount, sentences.length || questionCount); i++) {
          const sentence = sentences[i] || `Key concept from ${title}`;
          const words = sentence.split(' ').filter(w => w.length > 4);
          const keyTerm = words[0] || 'concept';
          
          quizQuestions.push({
            question_text: `According to the uploaded document material: "${sentence.slice(0, 100)}..." what is discussed?`,
            options: [
              `Correct concept regarding ${keyTerm}`,
              `Incorrect interpretation of ${keyTerm}`,
              `Unrelated concept not mentioned in document`,
              `Alternative distractor choice`
            ],
            correct_option: 0,
            topic: chapter || 'PDF Document Notes',
          });
        }
      } else {
        for (let i = 1; i <= questionCount; i++) {
          quizQuestions.push({
            question_text: `${subject} (${chapter}) Assessment Question #${i}`,
            options: [`Core Concept Option A`, `Distractor Option B`, `Alternative Choice C`, `Choice D`],
            correct_option: 0,
            topic: chapter || 'PDF Notes',
          });
        }
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
