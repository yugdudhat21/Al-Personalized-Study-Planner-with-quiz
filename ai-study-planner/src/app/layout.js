import './globals.css';
import DashboardLayout from '@/components/layout/DashboardLayout';

export const metadata = {
  title: 'AI Personalized Study Planner',
  description: 'Production-ready AI study schedule assistant powered by Supabase & Ollama',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-[#0b0f19]">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
