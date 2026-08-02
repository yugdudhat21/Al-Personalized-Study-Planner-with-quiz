'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(email, password, fullName);
      toast.success('Account created! Logging you in...');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 glass-card rounded-3xl shadow-2xl border border-white/10 my-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl glow-primary mb-3">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create Account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join AI Study Planner today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

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
              placeholder="student@example.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg glow-primary flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
