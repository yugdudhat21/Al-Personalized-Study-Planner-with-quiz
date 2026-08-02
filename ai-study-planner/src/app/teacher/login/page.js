'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function DedicatedTeacherLoginPage() {
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
      toast.success('Teacher login successful!');
      router.push('/teacher/dashboard');
    } catch (error) {
      toast.error(error.message || 'Teacher login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100">
      <div className="w-full max-w-md p-8 glass-card rounded-3xl shadow-2xl border border-white/10 my-auto">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl glow-accent mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Teacher System Portal</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in with Teacher credentials (`role = teacher`)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Teacher Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-card bg-slate-900/80 border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-card bg-slate-900/80 border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg glow-accent flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6"
          >
            {loading ? 'Authenticating...' : 'Sign In as Teacher'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <Link href="/student-login" className="text-xs font-bold text-cyan-400 hover:underline">
            Student Login with Student ID &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
