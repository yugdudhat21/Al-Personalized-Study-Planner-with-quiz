'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { useQuizStore } from '@/store/quizStore';
import { useAuthStore } from '@/store/authStore';
import { usePlannerStore } from '@/store/plannerStore';
import toast from 'react-hot-toast';

export default function StudentWeakTopicsPage() {
  const { studentAccount } = useAuthStore();
  const { studentWeakTopics, fetchStudentWeakTopics } = useQuizStore();
  const { saveGeneratedPlan } = usePlannerStore();

  useEffect(() => {
    if (studentAccount?.id) {
      fetchStudentWeakTopics(studentAccount.id);
    }
  }, [studentAccount]);

  const handleAddRemedialBlock = async (topicName) => {
    try {
      await saveGeneratedPlan([{
        subject: 'Remedial Study',
        topic: `Remedial AI Practice: ${topicName}`,
        planned_minutes: 45,
        priority: 5,
        completed: false,
        date: new Date().toISOString(),
      }]);

      toast.success(`Remedial study session for "${topicName}" added to AI Study Planner!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add remedial block');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-orange-500" /> Weak Topics & Remediation
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Topics flagged with accuracy &lt; 60% in your quiz attempts. One-click adds targeted remedial study blocks to your AI planner!
        </p>
      </div>

      {studentWeakTopics.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Weak Topics Flagged</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Great job! You are maintaining above 60% accuracy across all taken quizzes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentWeakTopics.map((wt) => (
            <div key={wt.id} className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-orange-500/30 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-300 font-extrabold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Remediation Needed
                  </span>
                  <span className="text-xs font-mono font-bold text-red-500">
                    {wt.accuracy}% Accuracy
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1">{wt.topic}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Identified on: {new Date(wt.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => handleAddRemedialBlock(wt.topic)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md glow-primary flex items-center justify-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" /> Add 45-Min Remedial Session to AI Planner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
