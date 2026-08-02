import { format, subDays, parseISO, isSameDay } from 'date-fns';

/**
 * Calculates current streak (consecutive days with >= 30 mins actual study time).
 */
export function calculateStreak(sessions = []) {
  if (!sessions.length) return 0;

  // Group total actual study minutes by date string (yyyy-MM-dd)
  const dailyMinutes = {};

  sessions.forEach((s) => {
    if (!s.start_time && !s.created_at) return;
    const dateObj = s.start_time ? parseISO(s.start_time) : parseISO(s.created_at);
    const dateStr = format(dateObj, 'yyyy-MM-dd');
    
    dailyMinutes[dateStr] = (dailyMinutes[dateStr] || 0) + (s.actual_minutes || 0);
  });

  let streak = 0;
  let checkDate = new Date();

  // Check today first. If today has < 30 mins, start checking from yesterday
  const todayStr = format(checkDate, 'yyyy-MM-dd');
  const todayMinutes = dailyMinutes[todayStr] || 0;

  if (todayMinutes >= 30) {
    streak++;
    checkDate = subDays(checkDate, 1);
  } else {
    // If today hasn't hit 30 mins yet, check if yesterday was part of a streak
    checkDate = subDays(checkDate, 1);
  }

  // Count backwards day by day
  while (true) {
    const dayStr = format(checkDate, 'yyyy-MM-dd');
    const minutes = dailyMinutes[dayStr] || 0;

    if (minutes >= 30) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return streak;
}
