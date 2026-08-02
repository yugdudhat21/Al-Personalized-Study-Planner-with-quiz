'use client';

import { useState, useEffect } from 'react';
import TeacherLayout from '@/components/layout/TeacherLayout';
import { GraduationCap, Plus, Key, Copy, Check, Trash2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useTeacherStore } from '@/store/teacherStore';
import { useAuthStore } from '@/store/authStore';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function TeacherStudentsPage() {
  const { user } = useAuthStore();
  const { classes, students, fetchClasses, fetchStudentsByClass, createStudentInClass } = useTeacherStore();

  const [selectedClassId, setSelectedClassId] = useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [lastCredentials, setLastCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchClasses(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes]);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudentsByClass(selectedClassId);
    }
  }, [selectedClassId]);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!selectedClassId) {
      toast.error('Please select a class first');
      return;
    }

    try {
      const res = await createStudentInClass({
        class_id: selectedClassId,
        full_name: studentName,
      });
      toast.success(`Student Account Created for ${studentName}!`);
      setLastCredentials(res.credentials);
      setStudentName('');
      setIsStudentModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add student');
    }
  };

  const handleCopyCredentials = () => {
    if (!lastCredentials) return;
    const text = `Student ID: ${lastCredentials.student_id}\nPassword: ${lastCredentials.password}\nName: ${lastCredentials.full_name}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Credentials copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <GraduationCap className="w-7 h-7 text-teal-500" /> Student Account Management
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Add student accounts, generate unique Student IDs & Passwords, and manage roster security.
            </p>
          </div>

          <button
            onClick={() => setIsStudentModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>

        {/* Credentials Copy Card */}
        {lastCredentials && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-900 dark:text-emerald-100 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <div>
                <h4 className="font-extrabold text-base text-emerald-900 dark:text-emerald-200">
                  New Credentials Generated: {lastCredentials.full_name}
                </h4>
                <p className="text-xs font-mono mt-0.5 text-emerald-800 dark:text-emerald-300">
                  ID: <strong>{lastCredentials.student_id}</strong> • Password: <strong>{lastCredentials.password}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyCredentials}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Credentials'}
            </button>
          </div>
        )}

        {/* Class Filter & Table */}
        <div className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Filter by Class:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.subject})
                </option>
              ))}
            </select>
          </div>

          {students.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">No students enrolled in this class yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Student ID (Login)</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4">Assigned Class</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold">
                  {students.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{stu.full_name}</td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-teal-600 dark:text-teal-400">{stu.student_id}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">{stu.password}</td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-500">{stu.classes?.name || 'Class'}</td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toast.success(`Password reset link issued for ${stu.student_id}`)}
                          className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs font-bold transition"
                        >
                          Reset Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Student Modal */}
        <Modal
          isOpen={isStudentModalOpen}
          onClose={() => setIsStudentModalOpen(false)}
          title="Create Student Account"
        >
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Target Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.subject})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Student Full Name
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. John Smith"
                className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-200/20 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm shadow-md hover:bg-teal-500 transition"
              >
                Generate Student Credentials
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </TeacherLayout>
  );
}
