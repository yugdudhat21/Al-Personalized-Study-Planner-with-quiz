'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Successfully signed in!');
      
      const currentRole = useAuthStore.getState().role;
      if (currentRole === 'teacher' || currentRole === 'admin') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 glass-card rounded-3xl shadow-2xl border border-white/10 my-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl glow-primary mb-3">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Teacher & Admin Portal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to manage classes, quizzes, and study planners</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="dpdpConsent"
            required
            defaultChecked
            className="mt-0.5 rounded accent-purple-600 cursor-pointer"
          />
          <label htmlFor="dpdpConsent" className="text-[11px] text-gray-500 dark:text-gray-400">
            I consent to data processing under{' '}
            <Link href="/privacy" className="text-purple-400 font-bold hover:underline" target="_blank">
              DPDP Act 2023 & Privacy Policy
            </Link>.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg glow-accent flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6"
        >
          {loading ? 'Signing in...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Are you a Student?{' '}
          <Link href="/student-login" className="font-bold text-cyan-500 hover:underline inline-flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> Student ID Login
          </Link>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Don&apos;t have a teacher account?{' '}
          <Link href="/register" className="font-semibold text-purple-400 hover:underline">
            Register Teacher Account
          </Link>
        </p>
      </div>
    </div>
  );
}
