/**
 * Utility to identify weak subjects based on:
 * 1. Average test score < 60%
 * 2. Session completion rate < 50%
 */

export function detectWeakSubjects(subjects = [], sessions = [], testScores = []) {
  if (!subjects.length) return [];

  return subjects.map((subject) => {
    // 1. Average Test Score
    const subScores = testScores.filter((s) => s.subject_id === subject.id);
    let avgScorePct = null;
    if (subScores.length > 0) {
      const sumPct = subScores.reduce((acc, curr) => acc + ((curr.score / curr.max_score) * 100), 0);
      avgScorePct = sumPct / subScores.length;
    }

    // 2. Session Completion Rate
    const subSessions = sessions.filter((s) => s.subject_id === subject.id);
    let completionRatePct = null;
    if (subSessions.length > 0) {
      const completedCount = subSessions.filter((s) => s.completed).length;
      completionRatePct = (completedCount / subSessions.length) * 100;
    }

    // Check Weak Conditions
    const isLowScore = avgScorePct !== null && avgScorePct < 60;
    const isLowCompletion = completionRatePct !== null && completionRatePct < 50;
    const isWeak = isLowScore || isLowCompletion;

    const reasons = [];
    if (isLowScore) reasons.push(`Average score ${avgScorePct.toFixed(1)}% (< 60%)`);
    if (isLowCompletion) reasons.push(`Completion rate ${completionRatePct.toFixed(1)}% (< 50%)`);

    return {
      ...subject,
      avgScorePct,
      completionRatePct,
      isWeak,
      reasons,
    };
  }).filter((sub) => sub.isWeak);
}
