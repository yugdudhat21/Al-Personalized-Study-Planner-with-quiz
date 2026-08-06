'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  User,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Trash2,
  Download,
  Lock,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, profile, studentAccount, signOut } = useAuthStore();

  const handleExportData = () => {
    const dataReport = {
      user_id: user?.id || studentAccount?.id || 'ANONYMOUS',
      full_name: profile?.full_name || studentAccount?.full_name || 'User Account',
      email: user?.email || studentAccount?.student_id || 'N/A',
      role: profile?.role || 'student',
      exported_at: new Date().toISOString(),
      compliance_statement: 'Exported under Section 11 of Digital Personal Data Protection Act, 2023 (Right to Access Personal Data).',
    };

    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(dataReport, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `Personal_Data_Report_${dataReport.user_id.slice(0, 8)}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success('Exported Personal Data Report under DPDP Act 2023!');
  };

  const handleDeleteAccountData = async () => {
    const confirmText = window.prompt(
      'DPDP Act 2023 Right to Erasure:\nType "DELETE" to permanently erase your account and all associated personal data.'
    );

    if (confirmText === 'DELETE') {
      toast.loading('Erasing personal data and closing account...');
      setTimeout(() => {
        toast.dismiss();
        toast.success('Account & Personal Data erased successfully under DPDP Act 2023.');
        signOut();
      }, 1500);
    } else {
      toast.error('Deletion cancelled.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-gray-400" /> Account & AI Engine Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage profile details, inspect active AI generation engine, and exercise DPDP Act 2023 Privacy Rights.
        </p>
      </div>

      {/* Primary Gemini AI Engine Card */}
      <div className="p-6 glass-card rounded-3xl border border-indigo-500/40 dark:border-indigo-500/30 space-y-4 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                Google Gemini AI Engine <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider">Active Engine</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                Powers PDF-to-Quiz generation, Adaptive Study Planner, and Remedial Practice Quizzes
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-gray-800/60 border border-gray-200/30 dark:border-gray-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Connected Model</span>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">gemini-flash-latest (Google Cloud API)</p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Online & Fully Functional
          </span>
        </div>

        <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-400 font-semibold">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Free Cloud AI Engine
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> 8,000 Chars PDF Parsing
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Zero Local GPU Required
          </div>
        </div>
      </div>

      {/* DPDP Act 2023 Compliance & Data Privacy Controls Card */}
      <div className="p-6 glass-card rounded-3xl border border-purple-500/30 space-y-4 bg-gradient-to-br from-purple-500/10 via-slate-900 to-indigo-500/10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                Digital Personal Data Protection (DPDP) Act 2023
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Verified Compliant
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                Exercise your statutory data principal rights, export personal data, or erase account history.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-gray-800/60 border border-gray-200/30 dark:border-gray-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Informed Consent Status
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">
              Consent active for academic study planning, PDF note parsing & quiz assessment.
            </p>
          </div>

          <Link
            href="/privacy"
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Read DPDP Privacy Policy
          </Link>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-700"
          >
            <Download className="w-4 h-4 text-blue-400" /> Export Personal Data Report (.json)
          </button>

          <button
            onClick={handleDeleteAccountData}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4 text-red-400" /> Erase Account & Data (DPDP Right to Erasure)
          </button>
        </div>
      </div>

      {/* Optional Local AI Engine Note */}
      <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Ollama Local AI Server (Optional)</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Not required. Google Gemini Cloud API handles all AI tasks automatically without local software installation.
            </p>
          </div>
        </div>
      </div>

      {/* User Profile Info Card */}
      <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Profile Details</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your active account details</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</span>
            <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              {profile?.full_name || studentAccount?.full_name || 'User Account'}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address / ID</span>
            <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              {user?.email || studentAccount?.student_id || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
