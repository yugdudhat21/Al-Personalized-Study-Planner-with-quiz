import { NextResponse } from 'next/server';
import { generateAiContent } from '@/lib/ai';

export async function POST(req) {
  try {
    const { topic, notes, count = 6 } = await req.json();

    if (!topic && !notes) {
      return NextResponse.json(
        { error: 'Topic or notes content is required' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert AI tutor. Generate ${count} concise, highly effective revision flashcards for the topic/notes provided.
Input: ${notes ? `Study Notes: "${notes.slice(0, 1500)}"` : `Topic: "${topic}"`}

Return ONLY a valid JSON array of objects with the exact format:
[
  {
    "id": "fc-1",
    "front": "Clear question or concept prompt",
    "back": "Concise answer or explanation",
    "category": "Key Concept / Formula / Definition",
    "difficulty": "Easy" | "Medium" | "Hard"
  }
]`;

    let cards = null;
    const aiResponse = await generateAiContent(prompt, true);

    if (aiResponse) {
      try {
        let cleaned = aiResponse.trim();
        if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
        else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
        
        cards = JSON.parse(cleaned);
      } catch (err) {
        console.warn('Failed to parse AI flashcard JSON:', err);
      }
    }

    // Fallback if AI call returns null or unparseable JSON
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      const subjectTopic = topic || 'General Study Subject';
      cards = [
        {
          id: 'fc-fallback-1',
          front: `What is the core definition of ${subjectTopic}?`,
          back: `${subjectTopic} refers to the foundational principles, key methodologies, and core application areas within this field of study.`,
          category: 'Core Definition',
          difficulty: 'Easy',
        },
        {
          id: 'fc-fallback-2',
          front: `What are the top 3 key principles of ${subjectTopic}?`,
          back: `1. Systemic structure & organization\n2. Analytical reasoning & problem solving\n3. Practical execution and iteration.`,
          category: 'Key Principles',
          difficulty: 'Medium',
        },
        {
          id: 'fc-fallback-3',
          front: `How do you apply concepts of ${subjectTopic} in real-world scenarios?`,
          back: `By breaking down complex problems into modular steps, applying verified formulas/methods, and evaluating outcome accuracy.`,
          category: 'Application',
          difficulty: 'Hard',
        },
        {
          id: 'fc-fallback-4',
          front: `What are common misconceptions about ${subjectTopic}?`,
          back: `Assuming surface-level memorization is enough. True mastery requires deep understanding of underlying mechanisms.`,
          category: 'Concept Review',
          difficulty: 'Medium',
        },
      ];
    }

    return NextResponse.json({ success: true, cards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
