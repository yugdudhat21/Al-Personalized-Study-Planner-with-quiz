'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TeacherSidebar from './TeacherSidebar';
import Topbar from './Topbar';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from 'react-hot-toast';

export default function TeacherLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const router = useRouter();
  const { user, role, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  // 1.5s safety fallback so spinner never hangs infinitely
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading && !timedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#090d16] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-300">Loading Teacher Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <TeacherSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Topbar onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
