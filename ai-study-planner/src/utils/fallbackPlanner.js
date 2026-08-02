/**
 * Heuristic Study Planner Fallback Algorithm
 * Used when Ollama AI service is offline or unavailable.
 */

import { addDays, format, differenceInCalendarDays, parseISO } from 'date-fns';

export function generateFallbackPlan({
  subjects = [],
  exams = [],
  testScores = [],
  startDate = new Date(),
  daysCount = 7,
  availableHoursPerDay = 4,
}) {
  if (!subjects.length) {
    return { sessions: [] };
  }

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const sessions = [];

  // Calculate scores per subject
  const subjectScores = {};
  subjects.forEach((sub) => {
    const scores = testScores.filter((s) => s.subject_id === sub.id);
    if (scores.length > 0) {
      const avg = scores.reduce((acc, curr) => acc + (curr.score / curr.max_score), 0) / scores.length;
      subjectScores[sub.id] = avg * 5; // 0 to 5 normalized
    } else {
      subjectScores[sub.id] = 2.5; // Default middle value
    }
  });

  for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
    const currentDate = addDays(start, dayIndex);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    let dailyMinutesLeft = availableHoursPerDay * 60;

    // 1. Add Daily 20-minute Revision session
    if (dailyMinutesLeft >= 20) {
      sessions.push({
        date: dateStr,
        subject: 'General Revision',
        subject_id: null,
        topic: 'Daily 20-min Quick Concept Review',
        planned_minutes: 20,
        priority: 4,
        completed: false,
        is_break: false,
      });
      dailyMinutesLeft -= 20;
    }

    // 2. Add Weekly Mock Test on day 6 or last day
    if (dayIndex % 7 === 6 && dailyMinutesLeft >= 60) {
      const toughestSubject = [...subjects].sort((a, b) => b.difficulty - a.difficulty)[0];
      sessions.push({
        date: dateStr,
        subject: toughestSubject ? toughestSubject.name : 'All Subjects',
        subject_id: toughestSubject ? toughestSubject.id : null,
        topic: 'Weekly Full Mock Assessment & Analysis',
        planned_minutes: 60,
        priority: 5,
        completed: false,
        is_break: false,
      });
      dailyMinutesLeft -= 60;
    }

    // 3. Calculate dynamic priorities for all subjects on this day
    const ratedSubjects = subjects.map((sub) => {
      // Exam urgency
      const subExams = exams.filter((e) => e.subject_id === sub.id);
      let daysLeft = 30;
      if (subExams.length > 0) {
        const closestExamDate = subExams.map((e) => parseISO(e.exam_date)).sort((a, b) => a - b)[0];
        const diff = differenceInCalendarDays(closestExamDate, currentDate);
        daysLeft = Math.max(1, diff);
      }
      const examUrgency = Math.max(1, Math.min(30, 30 - daysLeft));

      // Weakness
      const normScore = subjectScores[sub.id] ?? 2.5;
      const weakness = Math.max(0, 5 - normScore);

      // Formula: priority = difficulty * 0.35 + examUrgency * 0.40 + weakness * 0.25
      const calculatedPriority = (sub.difficulty * 0.35) + (examUrgency * 0.40) + (weakness * 0.25);

      return {
        ...sub,
        calculatedPriority,
        normScore,
        daysLeft,
      };
    });

    // Sort subjects by calculated priority descending
    ratedSubjects.sort((a, b) => b.calculatedPriority - a.calculatedPriority);
    const totalPriority = ratedSubjects.reduce((sum, s) => sum + s.calculatedPriority, 0) || 1;

    // Distribute remaining daily minutes among top subjects
    let subIdx = 0;
    let accumulatedStudyMinutes = 0;

    while (dailyMinutesLeft >= 30 && ratedSubjects.length > 0) {
      const subjectObj = ratedSubjects[subIdx % ratedSubjects.length];

      // Proportional minute block (between 30 and 50 mins)
      const share = subjectObj.calculatedPriority / totalPriority;
      let blockMinutes = Math.min(50, Math.max(30, Math.round(share * availableHoursPerDay * 60)));

      if (blockMinutes > dailyMinutesLeft) {
        blockMinutes = dailyMinutesLeft;
      }

      if (blockMinutes >= 15) {
        sessions.push({
          date: dateStr,
          subject: subjectObj.name,
          subject_id: subjectObj.id,
          topic: `Core Study: ${subjectObj.name} (Priority ${Math.round(subjectObj.calculatedPriority)})`,
          planned_minutes: blockMinutes,
          priority: Math.min(5, Math.max(1, Math.round(subjectObj.calculatedPriority / 6))),
          completed: false,
          is_break: false,
        });

        dailyMinutesLeft -= blockMinutes;
        accumulatedStudyMinutes += blockMinutes;

        // Rule 4: Add 10-minute break after 50 minutes of cumulative study
        if (accumulatedStudyMinutes >= 50 && dailyMinutesLeft >= 10) {
          sessions.push({
            date: dateStr,
            subject: 'Break Time',
            subject_id: null,
            topic: '10-Minute Rest & Refresh Break',
            planned_minutes: 10,
            priority: 1,
            completed: false,
            is_break: true,
          });
          dailyMinutesLeft -= 10;
          accumulatedStudyMinutes = 0;
        }
      }

      subIdx++;
      if (subIdx > 20) break; // Safety exit
    }
  }

  return { sessions };
}
