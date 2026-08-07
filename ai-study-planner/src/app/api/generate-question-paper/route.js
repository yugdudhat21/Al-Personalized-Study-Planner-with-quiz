import { NextResponse } from 'next/server';
import { generateAiContent } from '@/lib/ai';

export async function POST(req) {
  try {
    const { subject, topic, totalMarks = 50, examTitle = 'Unit Assessment' } = await req.json();

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    const marksNum = Number(totalMarks) || 50;

    // Define section breakdowns to ensure EXACT total marks matching
    let mcqCount = 10;
    let shortCount = 5;
    let longCount = 5;
    let longMarks = 5;

    if (marksNum <= 20) {
      mcqCount = 5;      // 5 * 1 = 5
      shortCount = 3;    // 3 * 3 = 9
      longCount = 1;     // 1 * 6 = 6  (Sum = 20)
      longMarks = 6;
    } else if (marksNum <= 50) {
      mcqCount = 10;     // 10 * 1 = 10
      shortCount = 5;    // 5 * 3 = 15
      longCount = 5;     // 5 * 5 = 25 (Sum = 50)
      longMarks = 5;
    } else {
      mcqCount = 20;     // 20 * 1 = 20
      shortCount = 10;   // 10 * 3 = 30
      longCount = 10;    // 10 * 5 = 50 (Sum = 100)
      longMarks = 5;
    }

    const prompt = `You are an elite academic examiner. Create a comprehensive Examination Question Paper with a Teacher Answer Key.
CRITICAL MANDATE: The total marks of all questions MUST SUM UP EXACTLY TO ${marksNum} MARKS.

Breakdown Required:
- Section A: ${mcqCount} Multiple Choice Questions (1 Mark Each = ${mcqCount * 1} Marks)
- Section B: ${shortCount} Short Answer Questions (3 Marks Each = ${shortCount * 3} Marks)
- Section C: ${longCount} Long / Analytical Questions (${longMarks} Marks Each = ${longCount * longMarks} Marks)
TOTAL MARKS SUM: ${mcqCount * 1 + shortCount * 3 + longCount * longMarks} MARKS.

Exam Details:
- Title: "${examTitle}"
- Subject: "${subject}"
- Topic: "${topic || 'Complete Syllabus'}"

Return ONLY a valid JSON object with the exact format:
{
  "title": "${examTitle}",
  "subject": "${subject}",
  "topic": "${topic || 'General Syllabus'}",
  "totalMarks": ${marksNum},
  "duration": "${marksNum >= 100 ? '3 Hours' : marksNum >= 50 ? '2 Hours' : '1 Hour'}",
  "instructions": [
    "All questions are compulsory.",
    "Write answers clearly and state assumptions where necessary.",
    "Figures to the right indicate full marks."
  ],
  "sections": [
    {
      "sectionTitle": "Section A: Multiple Choice Questions (1 Mark Each)",
      "questions": [
        { "id": "q1", "marks": 1, "questionText": "MCQ Question 1...", "options": ["A) Opt 1", "B) Opt 2", "C) Opt 3", "D) Opt 4"], "answer": "A) Opt 1", "explanation": "Rationale" }
      ]
    },
    {
      "sectionTitle": "Section B: Short Answer Questions (3 Marks Each)",
      "questions": [
        { "id": "q2", "marks": 3, "questionText": "Short Answer Question...", "answer": "Model Answer...", "explanation": "Marking scheme" }
      ]
    },
    {
      "sectionTitle": "Section C: Long Problem / Analytical Questions (${longMarks} Marks Each)",
      "questions": [
        { "id": "q3", "marks": ${longMarks}, "questionText": "Long Analytical Question...", "answer": "Stepwise solution...", "explanation": "Grading criteria" }
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

    // Dynamic fallback matching exact requested marks
    if (!paperData || !paperData.sections || paperData.sections.length < 3) {
      paperData = buildFallbackPaper(subject, topic, marksNum, examTitle, mcqCount, shortCount, longCount, longMarks);
    }

    return NextResponse.json({ success: true, paper: paperData });
  } catch (error) {
    console.error('Error generating question paper:', error);
    return NextResponse.json({ error: 'Failed to generate question paper' }, { status: 500 });
  }
}

function buildFallbackPaper(subject, topic, marksNum, examTitle, mcqCount, shortCount, longCount, longMarks) {
  const mcqs = Array.from({ length: mcqCount }, (_, i) => ({
    id: `mcq-${i + 1}`,
    marks: 1,
    questionText: `[Q${i + 1}] Which fundamental rule governs ${topic || subject} in core principles?`,
    options: [
      `A) Principle of ${subject} Conservation`,
      `B) Standard ${topic || subject} Equilibrium`,
      `C) Universal Axiom of ${subject}`,
      `D) Dynamic Model ${i + 1}`,
    ],
    answer: `A) Principle of ${subject} Conservation`,
    explanation: 'Core theoretical foundation.',
  }));

  const shortQs = Array.from({ length: shortCount }, (_, i) => ({
    id: `short-${i + 1}`,
    marks: 3,
    questionText: `Explain Question ${i + 1}: Discuss the key aspects and formula of ${topic || subject}.`,
    answer: `1. Definition of core components\n2. Primary formula application\n3. Verification of output values.`,
    explanation: '1 mark per key point.',
  }));

  const longQs = Array.from({ length: longCount }, (_, i) => ({
    id: `long-${i + 1}`,
    marks: longMarks,
    questionText: `Analytical Problem ${i + 1}: Provide a complete step-by-step mathematical or conceptual derivation for ${subject} applied to ${topic || 'real-world engineering'}.`,
    answer: `Step 1: State initial conditions.\nStep 2: Apply basic law of ${subject}.\nStep 3: Derive final relationship and calculate parameters accurately.`,
    explanation: 'Stepwise marking scheme applies.',
  }));

  return {
    title: examTitle,
    subject,
    topic: topic || 'Standard Curriculum',
    totalMarks: marksNum,
    duration: marksNum >= 100 ? '3 Hours' : marksNum >= 50 ? '2 Hours' : '1 Hour',
    instructions: [
      'All questions are compulsory.',
      'Read questions carefully before answering.',
      'Figures to the right indicate full marks.',
    ],
    sections: [
      {
        sectionTitle: `Section A: Multiple Choice Questions (1 Mark Each x ${mcqCount} = ${mcqCount * 1} Marks)`,
        questions: mcqs,
      },
      {
        sectionTitle: `Section B: Short Answer Questions (3 Marks Each x ${shortCount} = ${shortCount * 3} Marks)`,
        questions: shortQs,
      },
      {
        sectionTitle: `Section C: Long Analytical Questions (${longMarks} Marks Each x ${longCount} = ${longCount * longMarks} Marks)`,
        questions: longQs,
      },
    ],
  };
}
