'use client';

import { useEffect } from 'react';
import { BookCheck, Calendar, ExternalLink } from 'lucide-react';
import { useTeacherStore } from '@/store/teacherStore';
import { useAuthStore } from '@/store/authStore';

export default function StudentAssignmentsPage() {
  const { studentAccount } = useAuthStore();
  const { assignments, fetchAssignments } = useTeacherStore();

  useEffect(() => {
    if (studentAccount?.class_id) {
      fetchAssignments(studentAccount.class_id);
    } else {
      fetchAssignments();
    }
  }, [studentAccount]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <BookCheck className="w-7 h-7 text-pink-500" /> Class Assignments & Homework
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          View assigned homework tasks, due dates, and learning resource links from your teacher.
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <BookCheck className="w-10 h-10 text-pink-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Assignments Due</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            You currently have no pending homework assignments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((asg) => (
            <div key={asg.id} className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 font-extrabold text-xs">
                    {asg.classes?.name || 'Class Homework'}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due: {new Date(asg.due_date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1">{asg.title}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{asg.description}</p>
              </div>

              {asg.file_url && (
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={asg.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-pink-500 hover:underline flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Resource Link
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
