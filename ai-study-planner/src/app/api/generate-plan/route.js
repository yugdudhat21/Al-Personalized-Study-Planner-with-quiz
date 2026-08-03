import { NextResponse } from 'next/server';
import { generateAiContent } from '@/lib/ai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { startDate, daysCount = 7, availableHoursPerDay = 4, subjects = [], exams = [], testScores = [] } = body;

    if (!subjects || subjects.length === 0) {
      return NextResponse.json({ error: 'No subjects provided' }, { status: 400 });
    }

    // Build subject ID -> name map to enrich exams and scores with human-readable subject names
    const subjectMap = {};
    subjects.forEach((s) => {
      if (s.id && s.name) {
        subjectMap[s.id] = s.name;
      }
    });

    const enrichedExams = exams.map((e) => ({
      subject: subjectMap[e.subject_id] || e.subjects?.name || 'Subject Exam',
      exam_date: e.exam_date,
      weightage: `${e.weightage || 50}%`,
    }));

    const enrichedScores = testScores.map((t) => ({
      subject: subjectMap[t.subject_id] || t.subjects?.name || 'Subject',
      score: `${t.score}/${t.max_score || 100}`,
    }));

    const subjectNamesList = subjects.map((s) => s.name);
    const subjectNamesStr = subjectNamesList.join(', ');

    const prompt = `You are an expert AI study schedule generator. Generate a personalized daily study plan for a student.

CRITICAL MANDATE:
You MUST ONLY assign study sessions to the student's ACTUAL subjects: [${subjectNamesStr}].
Do NOT use generic subjects like "Calculus" or "Kinematics" unless they are explicitly in [${subjectNamesStr}]!

Student Input Data:
- Student Subjects: ${JSON.stringify(subjects.map(s => ({ name: s.name, difficulty: `${s.difficulty}/5`, target_hours: s.target_hours })))}
- Upcoming Exams & Weightages: ${JSON.stringify(enrichedExams)}
- Past Test Scores: ${JSON.stringify(enrichedScores)}
- Available Hours Per Day: ${availableHoursPerDay} hrs (${availableHoursPerDay * 60} mins)
- Start Date: ${startDate || new Date().toISOString().split('T')[0]}
- Plan Duration: ${daysCount} Days

Optimization Rules:
1. Heavily prioritize subjects with upcoming exams and higher weightages (e.g., 100% weightage exams happening soon get highest priority).
2. Allocate more study time to high difficulty rating subjects and weak subjects.
3. Every session's "subject" property MUST BE EXACTLY one of: [${subjectNamesStr}] or "Break Time".
4. Provide customized, specific topic descriptions referencing exam countdowns, weightages, or core revision.
5. Include 10-minute breaks ("Break Time") after 50 minutes of continuous study.
6. Return ONLY valid JSON format.

JSON Output Schema:
{
  "sessions": [
    {
      "date": "YYYY-MM-DD",
      "subject": "maths",
      "topic": "Maths Intensive Problem Solving & Formulas (100% Weightage Exam Prep)",
      "planned_minutes": 50,
      "priority": 5,
      "is_break": false
    }
  ]
}`;

    let responseText = await generateAiContent(prompt, true);
    let parsedSessions = [];

    if (responseText) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedJson = JSON.parse(jsonMatch[0]);
        if (parsedJson.sessions && Array.isArray(parsedJson.sessions)) {
          parsedSessions = parsedJson.sessions;
        }
      }
    }

    if (parsedSessions.length > 0) {
      return NextResponse.json({
        sessions: parsedSessions,
        generated_by: 'gemini',
      });
    }

    return NextResponse.json({
      error: 'AI planner fallback active.',
      generated_by: 'fallback',
    }, { status: 500 });
  } catch (error) {
    console.error('AI Study Planner Route Error:', error.message);
    return NextResponse.json({
      error: 'AI study planner failed. Falling back to heuristic planner.',
      generated_by: 'fallback',
    }, { status: 500 });
  }
}
