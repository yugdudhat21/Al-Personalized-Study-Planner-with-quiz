import { create } from 'zustand';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

export const useAnalyticsStore = create((set) => ({
  dailyStudyData: [],
  weeklyCompletionData: [],
  subjectDistributionData: [],
  scoreTrendData: [],
  productivityHeatmapData: [],

  computeAnalytics: (sessions = [], subjects = [], testScores = []) => {
    // 1. Daily Study Hours (Last 7 Days)
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const dailyMap = {};
    last7Days.forEach((d) => {
      dailyMap[format(d, 'MMM dd')] = 0;
    });

    sessions.forEach((s) => {
      if (!s.start_time && !s.created_at) return;
      const dateObj = s.start_time ? parseISO(s.start_time) : parseISO(s.created_at);
      const dateKey = format(dateObj, 'MMM dd');

      if (dailyMap[dateKey] !== undefined) {
        dailyMap[dateKey] += (s.actual_minutes || 0) / 60;
      }
    });

    const dailyStudyData = Object.keys(dailyMap).map((date) => ({
      date,
      hours: Number(dailyMap[date].toFixed(1)),
    }));

    // 2. Weekly Completion Rate (Planned vs Actual Completed Count)
    const weeklyStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weeklyEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const thisWeekDays = eachDayOfInterval({ start: weeklyStart, end: weeklyEnd });

    const weeklyMap = {};
    thisWeekDays.forEach((d) => {
      const dayName = format(d, 'EEE');
      weeklyMap[dayName] = { day: dayName, planned: 0, completed: 0 };
    });

    sessions.forEach((s) => {
      if (!s.start_time && !s.created_at) return;
      const dateObj = s.start_time ? parseISO(s.start_time) : parseISO(s.created_at);
      const dayName = format(dateObj, 'EEE');

      if (weeklyMap[dayName]) {
        weeklyMap[dayName].planned += 1;
        if (s.completed) {
          weeklyMap[dayName].completed += 1;
        }
      }
    });

    const weeklyCompletionData = Object.values(weeklyMap);

    // 3. Subject Distribution (Total Actual Minutes per Subject)
    const subjectMap = {};
    subjects.forEach((sub) => {
      subjectMap[sub.id] = { name: sub.name, color: sub.color || '#3B82F6', value: 0 };
    });

    sessions.forEach((s) => {
      if (s.subject_id && subjectMap[s.subject_id]) {
        subjectMap[s.subject_id].value += s.actual_minutes || s.planned_minutes || 0;
      }
    });

    const subjectDistributionData = Object.values(subjectMap).filter((item) => item.value > 0);

    // 4. Score Trend Progress
    const sortedScores = [...testScores].sort((a, b) => new Date(a.taken_at) - new Date(b.taken_at));
    const scoreTrendData = sortedScores.map((score) => ({
      date: format(parseISO(score.taken_at), 'MMM dd'),
      subject: score.subjects?.name || 'Subject',
      score: Number(((score.score / score.max_score) * 100).toFixed(1)),
    }));

    // 5. Productivity Heatmap (Last 30 Days)
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    const heatmapMap = {};
    last30Days.forEach((d) => {
      heatmapMap[format(d, 'yyyy-MM-dd')] = 0;
    });

    sessions.forEach((s) => {
      if (!s.start_time && !s.created_at) return;
      const dateObj = s.start_time ? parseISO(s.start_time) : parseISO(s.created_at);
      const key = format(dateObj, 'yyyy-MM-dd');
      if (heatmapMap[key] !== undefined) {
        heatmapMap[key] += s.actual_minutes || 0;
      }
    });

    const productivityHeatmapData = Object.keys(heatmapMap).map((date) => {
      const mins = heatmapMap[date];
      let level = 0;
      if (mins >= 120) level = 4;
      else if (mins >= 90) level = 3;
      else if (mins >= 60) level = 2;
      else if (mins >= 30) level = 1;

      return {
        date,
        minutes: mins,
        level,
      };
    });

    set({
      dailyStudyData,
      weeklyCompletionData,
      subjectDistributionData,
      scoreTrendData,
      productivityHeatmapData,
    });
  },
}));
