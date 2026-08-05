import './globals.css';
import DashboardLayout from '@/components/layout/DashboardLayout';

export const metadata = {
  title: 'StudyPilot AI - Personalized Study Planner',
  description: 'AI Personalized Study Planner with auto-generated quizzes, progress tracking, and teacher portal.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-[#060814]">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
