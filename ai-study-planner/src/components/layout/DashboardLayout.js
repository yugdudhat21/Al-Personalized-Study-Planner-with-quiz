'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuthStore } from '@/store/authStore';
import { useSubjectStore } from '@/store/subjectStore';
import { usePlannerStore } from '@/store/plannerStore';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { user, role, loading, initialize } = useAuthStore();
  const { fetchSubjects, fetchExams, fetchTestScores } = useSubjectStore();
  const { fetchSessions } = usePlannerStore();

  useEffect(() => {
    initialize();
  }, []);

  // 1.5s safety fallback so spinner never hangs infinitely
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const isLandingPage = pathname === '/';
  const isPrivacyPage = pathname === '/privacy';
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/student-login' || pathname === '/teacher/login';
  const isTeacherRoute = pathname.startsWith('/teacher');

  useEffect(() => {
    if (!loading && !user && !isAuthPage && !isTeacherRoute && !isLandingPage && !isPrivacyPage) {
      router.push('/login');
    }

    // Auto-redirect Teachers away from student dashboard
    if (!loading && user && (role === 'teacher' || role === 'admin') && pathname === '/dashboard') {
      router.push('/teacher/dashboard');
    }
  }, [user, role, loading, pathname, router, isAuthPage, isTeacherRoute, isLandingPage, isPrivacyPage]);

  useEffect(() => {
    if (user && !isAuthPage && !isTeacherRoute && !isLandingPage && !isPrivacyPage) {
      fetchSubjects();
      fetchExams();
      fetchTestScores();
      fetchSessions();
    }
  }, [user, isAuthPage, isTeacherRoute, isLandingPage, isPrivacyPage]);

  // If Landing Page, render cleanly without dashboard frame
  if (isLandingPage) {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    );
  }

  // If Teacher route, let TeacherLayout handle layout exclusively
  if (isTeacherRoute) {
    return <>{children}</>;
  }

  // Always render Auth & Privacy pages cleanly without Sidebar/Topbar
  if (isAuthPage || isPrivacyPage) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100">
        <Toaster position="top-right" />
        {children}
      </main>
    );
  }

  if (loading && !timedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#090d16] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-300">Loading ExamPilot AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Topbar onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
