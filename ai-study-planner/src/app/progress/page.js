'use client';

import { useEffect } from 'react';
import { TrendingUp, Flame, Award, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { usePlannerStore } from '@/store/plannerStore';
import { useQuizStore } from '@/store/quizStore';
import { useAuthStore } from '@/store/authStore';
import { calculateStreak } from '@/utils/streak';

export default function StudentProgressReportPage() {
  const { studentAccount } = useAuthStore();
  const { sessions } = usePlannerStore();
  const { quizResults, studentWeakTopics, fetchStudentQuizResults, fetchStudentWeakTopics } = useQuizStore();

  useEffect(() => {
    if (studentAccount?.id) {
      fetchStudentQuizResults(studentAccount.id);
      fetchStudentWeakTopics(studentAccount.id);
    }
  }, [studentAccount]);

  const completedSessions = sessions.filter((s) => s.completed);
  const completionPct = sessions.length > 0 ? Math.round((completedSessions.length / sessions.length) * 100) : 0;
  const totalActualMins = sessions.reduce((acc, s) => acc + (s.actual_minutes || 0), 0);

  const streak = calculateStreak(sessions);

  const avgQuizPct = quizResults.length > 0
    ? Math.round(quizResults.reduce((acc, r) => acc + Number(r.percentage || 0), 0) / quizResults.length)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-teal-500" /> Comprehensive Progress Report
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Consolidated performance metrics tracking study time, quiz averages, consistency streak, and weak topics.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Total Study Time</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {(totalActualMins / 60).toFixed(1)} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Session Completion</span>
            <div className="text-2xl font-extrabold text-emerald-500 dark:text-emerald-400 mt-1">{completionPct}%</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Quiz Score Avg</span>
            <div className="text-2xl font-extrabold text-purple-500 dark:text-purple-400 mt-1">{avgQuizPct}%</div>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-500">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Study Streak</span>
            <div className="text-2xl font-extrabold text-orange-500 dark:text-orange-400 mt-1">{streak} days</div>
          </div>
          <div className="p-3 rounded-2xl bg-orange-500/15 text-orange-500">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quiz Submission Results History */}
      <div className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Recent Quiz Assessment Submissions</h3>
        {quizResults.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No quiz submissions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Quiz Title</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Date Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold">
                {quizResults.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{r.quizzes?.title || 'Quiz'}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{r.score} / {r.total_questions}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                        r.percentage >= 80
                          ? 'bg-emerald-500/15 text-emerald-500'
                          : r.percentage >= 60
                          ? 'bg-blue-500/15 text-blue-500'
                          : 'bg-red-500/15 text-red-500'
                      }`}>
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(r.taken_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
