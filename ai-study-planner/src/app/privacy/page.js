'use client';

import Link from 'next/link';
import { ShieldCheck, Lock, UserCheck, Trash2, ArrowLeft, Mail, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Back Navigation */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-purple-400 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 shadow-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-white">Privacy Policy & DPDP Act 2023 Compliance</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                    Verified Compliant
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Digital Personal Data Protection Act, 2023 Notice & Data Fiduciary Disclosures
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DPDP Act 2023 Key Rights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="p-2 w-max rounded-xl bg-purple-500/10 text-purple-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-white">1. Informed Consent</h3>
            <p className="text-xs text-slate-400">
              Your personal data (name, email, quiz scores) is processed strictly based on free, explicit, and informed consent.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="p-2 w-max rounded-xl bg-blue-500/10 text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-white">2. Data Minimization</h3>
            <p className="text-xs text-slate-400">
              We collect ONLY essential information required for study planning, quizzes, and class roster performance tracking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="p-2 w-max rounded-xl bg-emerald-500/10 text-emerald-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-white">3. Right to Erasure</h3>
            <p className="text-xs text-slate-400">
              Under DPDP Act 2023, you can erase your profile, scores, and uploaded PDF notes at any time from your Account Settings.
            </p>
          </div>
        </div>

        {/* Comprehensive Terms & Notice Sections */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> 1. Data Collected & Processing Purpose
            </h2>
            <p>
              AI Study Planner operates as a Data Fiduciary under the Digital Personal Data Protection Act, 2023. We process the following categories of personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Account Credentials:</strong> Full Name, Email Address, and Student/Teacher Identifier.</li>
              <li><strong className="text-slate-200">Academic Records:</strong> Quiz attempts, topic scores, weak topic analysis, and adaptive study schedule entries.</li>
              <li><strong className="text-slate-200">Uploaded Study Material:</strong> Document notes or PDF text uploaded for AI Quiz and Bullet Summarizer generation. PDF files are processed in-memory and NOT sold or shared with third parties.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-800">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> 2. AI Processing & Third-Party Services
            </h2>
            <p>
              AI generation features (PDF parsing, Study Planner, Quiz Generation) utilize Google Gemini Cloud API and local Ollama servers. Prompts sent to AI engines are stripped of personal identity markers and strictly used for generating educational content.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-800">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> 3. Children&apos;s Data Protection Policy
            </h2>
            <p>
              For users under 18 years of age, processing of personal data is governed by verifiable parental or institutional teacher consent. We strictly prohibit behavioral monitoring, targeted advertising, or tracking of minors.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-800">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> 4. Data Protection Officer (DPO) & Grievance Redressal
            </h2>
            <p>
              In accordance with DPDP Act 2023, you have the right to request data correction, inspect stored records, or lodge privacy inquiries. Contact our designated Grievance Officer:
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-purple-300 flex items-center justify-between">
              <div>
                <p className="font-bold">Data Protection Officer (DPO)</p>
                <p className="text-[11px] text-slate-400">Email: privacy@aistudyplanner.com</p>
              </div>
              <a
                href="mailto:privacy@aistudyplanner.com"
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> Contact DPO
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
