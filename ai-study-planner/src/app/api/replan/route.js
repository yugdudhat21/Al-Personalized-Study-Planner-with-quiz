import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { incompleteSessions = [], remainingDays = 5, availableHoursPerDay = 4 } = body;

    // Logic to recalculate and redistribute incomplete session topics across remaining days
    const redistributedSessions = incompleteSessions.map((session, idx) => {
      const dayOffset = idx % remainingDays;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + dayOffset);

      return {
        ...session,
        date: targetDate.toISOString().split('T')[0],
        planned_minutes: Math.min(60, session.planned_minutes || 45),
        priority: Math.min(5, (session.priority || 3) + 1), // Bump priority
      };
    });

    return NextResponse.json({
      sessions: redistributedSessions,
      message: 'Schedule successfully adjusted and redistributed.',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
