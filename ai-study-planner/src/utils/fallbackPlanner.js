import { addDays, format, differenceInCalendarDays, parseISO } from 'date-fns';

export function generateFallbackPlan({
  subjects = [],
  exams = [],
  testScores = [],
  startDate = new Date(),
  daysCount = 7,
  availableHoursPerDay = 4,
}) {
  if (!subjects || !subjects.length) {
    return { sessions: [] };
  }

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const sessions = [];

  // Calculate scores per subject
  const subjectScores = {};
  subjects.forEach((sub) => {
    const scores = testScores.filter((s) => s.subject_id === sub.id);
    if (scores.length > 0) {
      const avg = scores.reduce((acc, curr) => acc + (curr.score / (curr.max_score || 100)), 0) / scores.length;
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
        subject: subjects[0]?.name || 'General Revision',
        subject_id: subjects[0]?.id || null,
        topic: `Daily Revision & Key Terms (${subjects[0]?.name || 'Core'})`,
        planned_minutes: 20,
        priority: 4,
        completed: false,
        is_break: false,
      });
      dailyMinutesLeft -= 20;
    }

    // 2. Calculate dynamic priorities for all subjects on this day
    const ratedSubjects = subjects.map((sub) => {
      const subExams = exams.filter((e) => e.subject_id === sub.id || e.subjects?.name === sub.name);
      let daysLeft = 30;
      let weightage = 50;

      if (subExams.length > 0) {
        const closest = subExams.map((e) => ({ ...e, parsedDate: parseISO(e.exam_date) })).sort((a, b) => a.parsedDate - b.parsedDate)[0];
        const diff = differenceInCalendarDays(closest.parsedDate, currentDate);
        daysLeft = Math.max(1, diff);
        weightage = closest.weightage || 50;
      }
      const examUrgency = Math.max(1, Math.min(30, 30 - daysLeft));
      const normScore = subjectScores[sub.id] ?? 2.5;
      const weakness = Math.max(0, 5 - normScore);

      // Formula: priority = difficulty * 0.30 + examUrgency * 0.40 + (weightage / 20) * 0.20 + weakness * 0.10
      const calculatedPriority = (sub.difficulty * 0.30) + (examUrgency * 0.40) + ((weightage / 20) * 0.20) + (weakness * 0.10);

      return {
        ...sub,
        calculatedPriority,
        normScore,
        daysLeft,
        weightage,
        hasExam: subExams.length > 0,
      };
    });

    // Sort subjects by calculated priority descending
    ratedSubjects.sort((a, b) => b.calculatedPriority - a.calculatedPriority);
    const totalPriority = ratedSubjects.reduce((sum, s) => sum + s.calculatedPriority, 0) || 1;

    let subIdx = 0;
    let accumulatedStudyMinutes = 0;

    while (dailyMinutesLeft >= 30 && ratedSubjects.length > 0) {
      const subjectObj = ratedSubjects[subIdx % ratedSubjects.length];
      const share = subjectObj.calculatedPriority / totalPriority;
      let blockMinutes = Math.min(50, Math.max(30, Math.round(share * availableHoursPerDay * 60)));

      if (blockMinutes > dailyMinutesLeft) {
        blockMinutes = dailyMinutesLeft;
      }

      if (blockMinutes >= 15) {
        const examText = subjectObj.hasExam ? ` (Exam in ${subjectObj.daysLeft}d - ${subjectObj.weightage}% Weightage)` : '';
        sessions.push({
          date: dateStr,
          subject: subjectObj.name,
          subject_id: subjectObj.id,
          topic: `${subjectObj.name}: Intensive Exam Prep & Practice Questions${examText}`,
          planned_minutes: blockMinutes,
          priority: Math.min(5, Math.max(1, Math.round(subjectObj.calculatedPriority / 2))),
          completed: false,
          is_break: false,
        });

        dailyMinutesLeft -= blockMinutes;
        accumulatedStudyMinutes += blockMinutes;

        // Rule 4: Add 10-minute break after 50 minutes of continuous study
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
      if (subIdx > 20) break;
    }
  }

  return { sessions };
}
