'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  PieChart,
  Flame,
  AlertTriangle,
  Calendar,
  Sparkles,
  Timer,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { useSubjectStore } from '@/store/subjectStore';
import { usePlannerStore } from '@/store/plannerStore';
import { detectWeakSubjects } from '@/utils/weakSubjects';
import { calculateStreak } from '@/utils/streak';
import { supabase } from '@/lib/supabase';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import AnnouncementsWidget from '@/components/dashboard/AnnouncementsWidget';
import { format, parseISO, differenceInCalendarDays, isToday } from 'date-fns';

export default function DashboardPage() {
  const { subjects, exams, testScores } = useSubjectStore();
  const { sessions, toggleSessionComplete, fetchSessions, loading } = usePlannerStore();

  // Supabase Realtime Listener for Instant Dashboard Updates
  useEffect(() => {
    const channel = supabase
      .channel('realtime_dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'study_sessions' },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSessions]);

  // Metric Calculations
  const todaySessions = sessions.filter((s) => {
    if (!s.start_time && !s.created_at) return false;
    const d = s.start_time ? parseISO(s.start_time) : parseISO(s.created_at);
    return isToday(d);
  });

  const plannedMinutesToday = todaySessions.reduce((acc, curr) => acc + (curr.planned_minutes || 0), 0);
  const actualMinutesToday = todaySessions.reduce((acc, curr) => acc + (curr.actual_minutes || 0), 0);
  const plannedHoursToday = (plannedMinutesToday / 60).toFixed(1);
  const actualHoursToday = (actualMinutesToday / 60).toFixed(1);
  const completionPercentage = plannedMinutesToday > 0 ? Math.min(100, Math.round((actualMinutesToday / plannedMinutesToday) * 100)) : 0;

  const streak = calculateStreak(sessions);
  const weakSubjects = detectWeakSubjects(subjects, sessions, testScores);

  // Upcoming Exams (sorted by closest)
  const sortedExams = [...exams]
    .map((e) => {
      const daysLeft = differenceInCalendarDays(parseISO(e.exam_date), new Date());
      return { ...e, daysLeft };
    })
    .filter((e) => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-8">
      {/* Teacher Live Announcements Widget */}
      <AnnouncementsWidget />

      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/80 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs mb-2.5 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" /> AI Engine Active
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Study Command Center
            </h1>
            <p className="text-sm text-slate-300 dark:text-slate-300 mt-1 max-w-xl font-medium">
              Track progress, launch Pomodoro timers, and generate AI schedules tailored to your exams.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/planner"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg glow-primary flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" /> Generate AI Plan
            </Link>
            <Link
              href="/timer"
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition"
            >
              <Timer className="w-4 h-4 text-indigo-400" /> Start Timer
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Planned */}
        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              Planned Today
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {plannedHoursToday} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Completed Hours */}
        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              Completed Hours
            </span>
            <div className="text-2xl font-extrabold text-emerald-500 dark:text-emerald-400 mt-1">
              {actualHoursToday} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Completion Rate */}
        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="text-2xl font-extrabold text-indigo-500 dark:text-indigo-400 mt-1">
              {completionPercentage}%
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-500">
            <PieChart className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Current Streak */}
        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              Current Streak
            </span>
            <div className="text-2xl font-extrabold text-orange-500 dark:text-orange-400 mt-1">
              {streak} <span className="text-sm font-semibold text-slate-400">days</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-orange-500/15 text-orange-500">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Weak Subjects Alert Banner */}
      {weakSubjects.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-900 dark:text-amber-100 flex items-start gap-4 shadow-md">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-base text-amber-900 dark:text-amber-200">Weak Subjects Attention Needed ({weakSubjects.length})</h4>
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mt-0.5">
              AI detected lower performance or session completion rates in these subjects:
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {weakSubjects.map((ws) => (
                <span
                  key={ws.id}
                  className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-900 dark:text-amber-200 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ws.color }} />
                  {ws.name} ({ws.reasons[0]})
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/planner"
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shrink-0"
          >
            Rebalance Schedule
          </Link>
        </div>
      )}

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Today's Scheduled Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" /> Today&apos;s Sessions
            </h3>
            <Link href="/planner" className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} height="h-20" />
          ) : todaySessions.length === 0 ? (
            <EmptyState
              title="No Sessions Scheduled Today"
              description="You have no study sessions planned for today. Generate an AI study schedule to get started!"
              actionButton={
                <Link
                  href="/planner"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md glow-primary hover:bg-blue-500 transition"
                >
                  Generate Study Plan
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 bg-white dark:bg-[#111827] rounded-2xl flex items-center justify-between border transition-all ${
                    session.completed
                      ? 'border-emerald-500/40 bg-emerald-500/5 opacity-85'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSessionComplete(session.id, !session.completed)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                        session.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-400 hover:border-blue-500'
                      }`}
                    >
                      {session.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: session.subjects?.color || '#3B82F6' }}
                        />
                        <h4 className={`font-bold text-sm ${session.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {session.subjects?.name || session.topic || 'Study Block'}
                        </h4>
                      </div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mt-0.5">
                        {session.topic} • {session.planned_minutes} mins planned
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/timer?subjectId=${session.subject_id}&topic=${encodeURIComponent(session.topic || '')}`}
                      className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition"
                      title="Launch Pomodoro Timer"
                    >
                      <Timer className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Upcoming Exams & Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Exams List */}
          <div className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" /> Upcoming Exams
              </h3>
              <Link href="/exams" className="text-xs font-bold text-indigo-500 hover:underline">
                Manage
              </Link>
            </div>

            {sortedExams.length === 0 ? (
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center py-4">No upcoming exams added yet.</p>
            ) : (
              <div className="space-y-3">
                {sortedExams.slice(0, 4).map((exam) => (
                  <div
                    key={exam.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: exam.subjects?.color || '#6366F1' }}
                        />
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                          {exam.subjects?.name || 'Exam'}
                        </h5>
                      </div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mt-0.5">
                        {format(parseISO(exam.exam_date), 'MMM dd, yyyy')}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        exam.daysLeft <= 3
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                          : exam.daysLeft <= 7
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {exam.daysLeft === 0 ? 'Today!' : `${exam.daysLeft}d left`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Shortcuts */}
          <div className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/subjects"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-500/10 dark:hover:bg-slate-700/80 transition flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <PlusCircle className="w-4 h-4 text-blue-500" /> Add Subject
              </Link>
              <Link
                href="/timer"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-500/10 dark:hover:bg-slate-700/80 transition flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <Timer className="w-4 h-4 text-indigo-500" /> Pomodoro
              </Link>
              <Link
                href="/planner"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-500/10 dark:hover:bg-slate-700/80 transition flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <Sparkles className="w-4 h-4 text-purple-500" /> AI Planner
              </Link>
              <Link
                href="/analytics"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-500/10 dark:hover:bg-slate-700/80 transition flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <PieChart className="w-4 h-4 text-emerald-500" /> Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
