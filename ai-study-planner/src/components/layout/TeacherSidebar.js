'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileQuestion,
  Award,
  AlertTriangle,
  BookCheck,
  BarChart2,
  FileSpreadsheet,
  LogOut,
  FileText,
  Megaphone,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const teacherNavItems = [
  { label: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
  { label: 'Question Paper', href: '/teacher/question-paper', icon: FileText, color: 'text-purple-400' },
  { label: 'Notice Board', href: '/teacher/announcements', icon: Megaphone, color: 'text-red-400' },
  { label: 'Classes', href: '/teacher/classes', icon: Users, color: 'text-cyan-500' },
  { label: 'Students', href: '/teacher/students', icon: GraduationCap, color: 'text-teal-500' },
  { label: 'Quizzes', href: '/teacher/quizzes', icon: FileQuestion, color: 'text-purple-500' },
  { label: 'Results', href: '/teacher/results', icon: Award, color: 'text-amber-500' },
  { label: 'Analytics', href: '/teacher/analytics', icon: AlertTriangle, color: 'text-red-500' },
  { label: 'Assignments', href: '/teacher/assignments', icon: BookCheck, color: 'text-indigo-500' },
  { label: 'Comparison', href: '/teacher/comparison', icon: BarChart2, color: 'text-emerald-500' },
  { label: 'Reports', href: '/teacher/reports', icon: FileSpreadsheet, color: 'text-pink-500' },
];

export default function TeacherSidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const pathname = usePathname();
  const { signOut } = useAuthStore();

  return (
    <aside
      className={`print:hidden fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out flex flex-col justify-between p-4 shadow-xl overflow-y-auto ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white shadow-lg glow-accent">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              ExamPilot AI
            </h1>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Teacher Control Panel</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {teacherNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 glow-accent'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-purple-600 dark:hover:text-white'
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
      <div className="pt-3 mt-4 border-t border-slate-200 dark:border-slate-800">
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
