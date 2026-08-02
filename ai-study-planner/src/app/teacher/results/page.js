'use client';

import { useState, useEffect } from 'react';
import TeacherLayout from '@/components/layout/TeacherLayout';
import { Award, Clock, FileQuestion, Users, RefreshCw } from 'lucide-react';
import { useTeacherStore } from '@/store/teacherStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function TeacherResultsPage() {
  const { user } = useAuthStore();
  const { quizzes, fetchQuizzes } = useTeacherStore();
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchQuizzes(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (quizzes.length > 0 && !selectedQuizId) {
      setSelectedQuizId(quizzes[0].id);
    }
  }, [quizzes]);

  useEffect(() => {
    if (selectedQuizId) {
      fetchQuizResults(selectedQuizId);
    }
  }, [selectedQuizId]);

  const fetchQuizResults = async (quizId) => {
    setLoadingResults(true);
    try {
      const res = await fetch(`/api/results/${quizId}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data.results || []);
      }
    } catch (err) {
      console.error('Fetch quiz results error:', err);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleRefresh = () => {
    if (selectedQuizId) {
      fetchQuizResults(selectedQuizId);
      toast.success('Quiz results refreshed!');
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <Award className="w-7 h-7 text-amber-500" /> Quiz Results & Class Ranks
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Inspect student quiz submissions, percentages, submission timestamps, and automated class ranks.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 font-bold text-xs hover:bg-purple-500/20 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loadingResults ? 'animate-spin' : ''}`} /> Refresh Submissions
          </button>
        </div>

        {/* Quiz Filter Select */}
        <div className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Select Quiz:</label>
            <select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white"
            >
              {quizzes.length === 0 ? (
                <option value="" className="bg-slate-900 text-white">No Quizzes Created Yet</option>
              ) : (
                quizzes.map((q) => (
                  <option key={q.id} value={q.id} className="bg-slate-900 text-white">
                    {q.title} ({q.classes?.name || 'Class'})
                  </option>
                ))
              )}
            </select>
          </div>

          {loadingResults ? (
            <p className="text-center text-xs text-slate-400 py-8">Loading quiz submission results...</p>
          ) : results.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <FileQuestion className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No student submissions recorded for this quiz yet.</p>
              <p className="text-xs text-slate-500">Submissions will automatically appear here as students complete the quiz in their portal.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4">Class Rank</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Submitted Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-extrabold text-amber-500">#{r.rank}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{r.student_accounts?.full_name || 'Student'}</td>
                      <td className="py-3.5 px-4 font-mono text-purple-500 font-bold">{r.student_accounts?.student_id || '-'}</td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200">{r.score} / {r.total_questions}</td>
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
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-400">
                        {new Date(r.taken_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
