'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCheck, Key, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function StudentLoginPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { studentSignIn } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await studentSignIn(studentId, password);
      toast.success('Welcome back, Student!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Invalid Student ID or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 glass-card rounded-3xl shadow-2xl border border-white/10 my-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-xl glow-primary mb-3">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Student Login</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Enter your assigned Student ID and Password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Student ID (e.g. STU-1001)
          </label>
          <div className="relative">
            <UserCheck className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="STU-1001"
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Key className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg glow-primary flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6"
        >
          {loading ? 'Logging in...' : 'Sign In with Student ID'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Are you a Teacher or Admin?{' '}
          <Link href="/login" className="font-bold text-purple-500 hover:underline">
            Teacher Login
          </Link>
        </p>
      </div>
    </div>
  );
}
