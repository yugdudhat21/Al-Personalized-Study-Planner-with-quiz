'use client';

import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuthStore } from '@/store/authStore';

export default function Topbar({ onMenuClick }) {
  const { profile, user } = useAuthStore();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student';

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
      {/* Mobile Drawer Trigger & User Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Welcome back,</h2>
          <p className="text-base font-extrabold text-slate-900 dark:text-white capitalize">{displayName}</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md glow-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
