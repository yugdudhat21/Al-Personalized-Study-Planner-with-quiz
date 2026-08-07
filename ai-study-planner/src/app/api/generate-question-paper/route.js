import { NextResponse } from 'next/server';
import { generateAiContent } from '@/lib/ai';

export async function POST(req) {
  try {
    const { subject, topic, totalMarks = 50, examTitle = 'Unit Assessment' } = await req.json();

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    const prompt = `You are an elite academic examiner. Create a comprehensive, well-structured Examination Question Paper with a separate Teacher Answer Key.
Details:
- Exam Title: "${examTitle}"
- Subject: "${subject}"
- Topic/Syllabus: "${topic || 'Complete Syllabus'}"
- Total Marks: ${totalMarks}

Requirements:
Return ONLY a valid JSON object with the exact format:
{
  "title": "${examTitle}",
  "subject": "${subject}",
  "topic": "${topic || 'General Syllabus'}",
  "totalMarks": ${totalMarks},
  "duration": "1.5 Hours",
  "instructions": [
    "All questions are compulsory.",
    "Write answers clearly and state assumptions where necessary.",
    "Figures to the right indicate full marks."
  ],
  "sections": [
    {
      "sectionTitle": "Section A: Multiple Choice Questions (1 Mark Each)",
      "questions": [
        { "id": "q1", "marks": 1, "questionText": "Question 1 text...", "options": ["A) Opt 1", "B) Opt 2", "C) Opt 3", "D) Opt 4"], "answer": "A) Opt 1", "explanation": "Brief explanation" }
      ]
    },
    {
      "sectionTitle": "Section B: Short Answer Questions (3 Marks Each)",
      "questions": [
        { "id": "q2", "marks": 3, "questionText": "Short answer question prompt...", "answer": "Model answer points...", "explanation": "Grading criteria" }
      ]
    },
    {
      "sectionTitle": "Section C: Long Problem / Analytical Questions (5 Marks Each)",
      "questions": [
        { "id": "q3", "marks": 5, "questionText": "Detailed long analytical question prompt...", "answer": "Detailed solution steps...", "explanation": "Stepwise marking scheme" }
      ]
    }
  ]
}`;

    let paperData = null;
    const aiResponse = await generateAiContent(prompt, true);

    if (aiResponse) {
      try {
        let cleaned = aiResponse.trim();
        if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
        else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
        paperData = JSON.parse(cleaned);
      } catch (err) {
        console.warn('Failed to parse question paper JSON from AI:', err);
      }
    }

    // Fallback if AI call returns null
    if (!paperData || !paperData.sections) {
      paperData = {
        title: examTitle,
        subject: subject,
        topic: topic || 'Standard Curriculum',
        totalMarks: totalMarks,
        duration: '1.5 Hours',
        instructions: [
          'All questions are compulsory.',
          'Read questions carefully before answering.',
          'Figures to the right indicate full marks.'
        ],
        sections: [
          {
            sectionTitle: 'Section A: Multiple Choice Questions (1 Mark Each)',
            questions: [
              {
                id: 'fb-q1',
                marks: 1,
                questionText: `What is the fundamental concept governing ${subject}?`,
                options: ['A) Principle of Energy Conservation', 'B) System Dynamic Equilibrium', 'C) Standard Modular Logic', 'D) Universal Constant Theorem'],
                answer: 'A) Principle of Energy Conservation',
                explanation: 'Foundational axiom in fundamental science and engineering.'
              },
              {
                id: 'fb-q2',
                marks: 1,
                questionText: `Which methodology is primary when evaluating ${topic || subject}?`,
                options: ['A) Empirical Observation', 'B) Random Guessing', 'C) Reverse Hypothesis', 'D) Static Assumption'],
                answer: 'A) Empirical Observation',
                explanation: 'Empirical verification is the core methodology.'
              }
            ]
          },
          {
            sectionTitle: 'Section B: Short Answer Questions (3 Marks Each)',
            questions: [
              {
                id: 'fb-q3',
                marks: 3,
                questionText: `Explain the top 3 core mechanisms involved in ${topic || subject}.`,
                answer: '1. Initial Input Phase\n2. Core Processing / Transformation\n3. Output Verification & Feedback loop.',
                explanation: '1 mark for each correctly stated mechanism.'
              }
            ]
          },
          {
            sectionTitle: 'Section C: Comprehensive Analytical Questions (5 Marks Each)',
            questions: [
              {
                id: 'fb-q4',
                marks: 5,
                questionText: `Derive or describe in detail how ${subject} is applied to solve real-world industry problems. Give two concrete examples.`,
                answer: 'Detailed explanation covering domain mapping, analytical formulation, example 1 (automation), example 2 (optimization), and accuracy measurement.',
                explanation: '2 marks for theoretical explanation, 3 marks for well-reasoned real-world examples.'
              }
            ]
          }
        ]
      };
    }

    return NextResponse.json({ success: true, paper: paperData });
  } catch (error) {
    console.error('Error generating question paper:', error);
    return NextResponse.json({ error: 'Failed to generate question paper' }, { status: 500 });
  }
}
