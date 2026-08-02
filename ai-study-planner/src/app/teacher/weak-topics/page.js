'use client';

import { useEffect } from 'react';
import TeacherLayout from '@/components/layout/TeacherLayout';
import { AlertTriangle, Sparkles, GraduationCap, RefreshCw } from 'lucide-react';
import { useTeacherStore } from '@/store/teacherStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function TeacherWeakTopicsPage() {
  const { user } = useAuthStore();
  const { weakTopics, fetchClassWeakTopics } = useTeacherStore();

  useEffect(() => {
    fetchClassWeakTopics();
  }, []);

  const handleGenerateRemedialQuiz = async (topicName) => {
    toast.success(`Generating targeted remedial quiz for topic "${topicName}"...`);
  };

  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-amber-500" /> Class Weak Topics Analytics & Remediation
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Topics flagged with accuracy &lt; 60% across student quiz submissions for targeted intervention.
          </p>
        </div>

        {weakTopics.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <AlertTriangle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Weak Topics Flagged</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              All students are performing above the 60% accuracy threshold across active quizzes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weakTopics.map((wt) => (
              <div key={wt.id} className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-amber-500/30 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 font-extrabold text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Below 60% Threshold
                    </span>
                    <span className="text-xs font-mono font-bold text-red-500">
                      {wt.accuracy}% Accuracy
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1">{wt.topic}</h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    Student: {wt.student_accounts?.full_name || 'Student'} ({wt.student_accounts?.student_id})
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-1">
                    Class: {wt.student_accounts?.classes?.name || 'Class'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleGenerateRemedialQuiz(wt.topic)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md glow-accent flex items-center justify-center gap-2 transition"
                  >
                    <Sparkles className="w-4 h-4" /> Create Remedial AI Practice Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
