import { NextResponse } from 'next/server';
import { generateAiContent } from '@/lib/ai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { notesText, subject = 'General Subject', summaryFormat = 'bullet_points' } = body;

    if (!notesText || notesText.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide notes text or upload a PDF document.' }, { status: 400 });
    }

    let formatInstruction = '';
    switch (summaryFormat) {
      case 'key_takeaways':
        formatInstruction = `Provide a concise "Key Takeaways" summary with:
- 📌 5 to 7 Main Takeaways (in bullet points)
- 💡 Core Concepts & Definitions
- 🎯 Actionable Study Tips`;
        break;
      case 'exam_revision':
        formatInstruction = `Provide a high-yield "Exam Revision Cheat Sheet" with:
- ⚡ 10 Quick High-Yield Exam Points (bullet points)
- ⚠️ Common Pitfalls & Mistakes to Avoid
- 🧠 Important Formulas / Key Rules`;
        break;
      case 'flashcards':
        formatInstruction = `Provide a "Flashcard Q&A Revision List" with:
- ❓ 8 to 10 Important Questions and Concise Answers
- Format each as Q: [Question] -> A: [Answer]`;
        break;
      default:
        formatInstruction = `Provide a comprehensive "Bullet-Point Notes Summary" with:
- 📑 Chapter / Subject Overview
- 🔹 Detailed Bullet Points grouped by main subtopics
- 🔑 Essential Terminology & Key Vocabulary
- 📌 Summary Wrap-up`;
    }

    const prompt = `You are an expert academic tutor and study assistant. Summarize the following study notes / material for the subject "${subject}".

${formatInstruction}

Guidelines:
- Use clean, structured Markdown formatting with clear headers (##, ###), bullet points (- or •), and bold text (**key terms**).
- Keep language student-friendly, clear, and easy to memorize.
- Focus strictly on facts and details from the provided notes.

Study Material / Notes:
${notesText.trim().slice(0, 9000)}`;

    try {
      const summaryResult = await generateAiContent(prompt, false);

      if (summaryResult && summaryResult.trim().length > 0) {
        return NextResponse.json({
          success: true,
          summary: summaryResult.trim(),
        });
      }
    } catch (aiErr) {
      console.warn('AI Summarizer Warning:', aiErr.message);
    }

    // Fallback simple bullet point generator if AI returns empty
    const lines = notesText
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25);

    const fallbackBullets = lines
      .slice(0, 8)
      .map((line) => `• ${line}`)
      .join('\n\n');

    const fallbackSummary = `## 📌 Summary Notes for ${subject}\n\n### 🔹 Key Bullet Points\n${fallbackBullets}\n\n---\n*Generated using Smart Text Extraction Engine.*`;

    return NextResponse.json({
      success: true,
      summary: fallbackSummary,
    });
  } catch (error) {
    console.error('Notes Summarizer Route Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to summarize notes' }, { status: 500 });
  }
}
