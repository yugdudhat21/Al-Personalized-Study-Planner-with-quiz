'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import TeacherLayout from '@/components/layout/TeacherLayout';
import { Users, FileQuestion, BookCheck, AlertTriangle, Plus, Sparkles, GraduationCap } from 'lucide-react';
import { useTeacherStore } from '@/store/teacherStore';
import { useAuthStore } from '@/store/authStore';

export default function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const { classes, quizzes, assignments, weakTopics, fetchClasses, fetchQuizzes, fetchAssignments, fetchClassWeakTopics } = useTeacherStore();

  useEffect(() => {
    if (user?.id) {
      fetchClasses(user.id);
      fetchQuizzes(user.id);
      fetchAssignments();
      fetchClassWeakTopics();
    }
  }, [user]);

  const totalStudents = classes.reduce((acc, curr) => acc + (curr.student_accounts?.[0]?.count || 0), 0);

  return (
    <TeacherLayout>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/80 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs mb-2.5 border border-purple-500/30">
                <GraduationCap className="w-3.5 h-3.5" /> Teacher Control Panel
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Classroom Command Center
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl font-medium">
                Manage your class rosters, auto-generate Student IDs, assign AI quizzes, and inspect weak topics.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/teacher/classes"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg glow-accent flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" /> Create Class
              </Link>
              <Link
                href="/teacher/quizzes"
                className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-purple-400" /> AI Quiz Builder
              </Link>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Active Classes</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{classes.length}</div>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-500">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Total Students</span>
              <div className="text-2xl font-extrabold text-cyan-500 dark:text-cyan-400 mt-1">{totalStudents}</div>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-500">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Published Quizzes</span>
              <div className="text-2xl font-extrabold text-purple-500 dark:text-purple-400 mt-1">{quizzes.length}</div>
            </div>
            <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-500">
              <FileQuestion className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Weak Topics Flagged</span>
              <div className="text-2xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">{weakTopics.length}</div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Classes Overview Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Your Classes</h3>
            <Link href="/teacher/classes" className="text-xs font-bold text-purple-500 hover:underline">
              Manage All
            </Link>
          </div>

          {classes.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <Users className="w-10 h-10 text-purple-500 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Classes Created Yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Create a class to start generating Student IDs and publishing AI quizzes.
              </p>
              <Link
                href="/teacher/classes"
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md glow-accent hover:bg-purple-500 transition inline-block"
              >
                Create Your First Class
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <div key={cls.id} className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 font-extrabold text-xs font-mono">
                      {cls.class_code}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {cls.student_accounts?.[0]?.count || 0} Students
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">{cls.name}</h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Subject: {cls.subject}</p>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={`/teacher/classes?classId=${cls.id}`}
                      className="text-xs font-bold text-purple-500 hover:underline"
                    >
                      View Roster & Add Students &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
