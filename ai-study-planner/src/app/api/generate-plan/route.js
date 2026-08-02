import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { startDate, daysCount = 7, availableHoursPerDay = 4, subjects = [], exams = [], testScores = [] } = body;

    const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434';

    // Construct the prompt string using the exact template requirements
    const prompt = `You are an expert study planner.
Student data:
- Subjects with difficulty: ${JSON.stringify(subjects.map(s => ({ name: s.name, difficulty: s.difficulty, target_hours: s.target_hours })))}
- Exam dates: ${JSON.stringify(exams.map(e => ({ subject_id: e.subject_id, exam_date: e.exam_date, weightage: e.weightage })))}
- Previous scores: ${JSON.stringify(testScores.map(t => ({ subject_id: t.subject_id, score: t.score, max_score: t.max_score })))}
- Available study hours per day: ${availableHoursPerDay}
- Start Date: ${startDate || new Date().toISOString().split('T')[0]}
- Number of Days: ${daysCount}

Rules:
1. Prioritize closer exams.
2. Give more time to weak subjects.
3. Give more time to difficult subjects.
4. Include 10-minute breaks after every 50 minutes.
5. Include 20-minute daily revision.
6. Include one mock test per week.
7. Do not exceed available hours.
8. Return ONLY valid JSON.

Return format:
{
  "sessions": [
    {
      "date": "2026-08-01",
      "subject": "Mathematics",
      "topic": "Calculus revision",
      "planned_minutes": 60,
      "priority": 5
    }
  ]
}`;

    // Call Ollama local instance
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout

    const res = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        prompt: prompt,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json({ error: 'Ollama service error', generated_by: 'fallback' }, { status: 502 });
    }

    const data = await res.json();
    const responseText = data.response || '';

    // Extract JSON block using regex if model wraps output in markdown code blocks
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Invalid JSON response from Ollama', generated_by: 'fallback' }, { status: 422 });
    }

    const parsedJson = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      sessions: parsedJson.sessions || [],
      generated_by: 'ollama',
    });
  } catch (error) {
    console.error('Ollama API Route Error:', error.message);
    return NextResponse.json({
      error: 'Ollama connection failed or timed out. Falling back to heuristic planner.',
      generated_by: 'fallback',
    }, { status: 500 });
  }
}
