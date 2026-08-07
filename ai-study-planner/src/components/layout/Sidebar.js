'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Sparkles,
  Timer,
  FileQuestion,
  BookCheck,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
  BrainCircuit,
  LogOut,
  GraduationCap,
  ArrowRight,
  FileText,
  Layers,
  Megaphone,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const studentNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
  { label: 'Class Notices', href: '/announcements', icon: Megaphone, color: 'text-red-400' },
  { label: 'Subjects', href: '/subjects', icon: BookOpen, color: 'text-cyan-500' },
  { label: 'Exams', href: '/exams', icon: CalendarCheck, color: 'text-indigo-500' },
  { label: 'AI Planner', href: '/planner', icon: Sparkles, color: 'text-purple-500' },
  { label: 'AI Flashcards', href: '/flashcards', icon: Layers, color: 'text-indigo-400' },
  { label: 'Notes Summarizer', href: '/summarizer', icon: FileText, color: 'text-violet-500' },
  { label: 'Pomodoro Timer', href: '/timer', icon: Timer, color: 'text-amber-500' },
  { label: 'Class Quizzes', href: '/quizzes', icon: FileQuestion, color: 'text-emerald-500' },
  { label: 'Assignments', href: '/assignments', icon: BookCheck, color: 'text-pink-500' },
  { label: 'Weak Topics', href: '/weak-topics', icon: AlertTriangle, color: 'text-orange-500' },
  { label: 'Progress Report', href: '/progress', icon: TrendingUp, color: 'text-teal-500' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, color: 'text-blue-400' },
  { label: 'Settings', href: '/settings', icon: Settings, color: 'text-slate-400' },
];

export default function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const pathname = usePathname();
  const { signOut, role } = useAuthStore();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out flex flex-col justify-between p-4 shadow-xl overflow-y-auto ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg glow-primary">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              AI Study Plan
            </h1>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {role === 'teacher' || role === 'admin' ? 'Teacher Account' : 'Student Portal'}
            </span>
          </div>
        </div>

        {/* Teacher Switch Button if Teacher */}
        {(role === 'teacher' || role === 'admin') && (
          <div className="mb-4">
            <Link
              href="/teacher/dashboard"
              className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md glow-accent hover:from-purple-500 hover:to-indigo-500 transition"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>Go to Teacher Portal</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {studentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 glow-primary'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sign Out */}
      <div className="pt-3 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <Link
          href="/privacy"
          className="flex items-center gap-2 px-4 text-[11px] font-bold text-slate-400 hover:text-purple-400 transition"
        >
          <span>🛡️ DPDP 2023 Privacy Policy</span>
        </Link>

        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl font-bold text-sm text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
