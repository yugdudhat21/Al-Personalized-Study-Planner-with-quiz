'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Bot, 
  FileText, 
  LineChart, 
  BookOpen, 
  UserCheck, 
  FileCheck2, 
  TrendingUp, 
  Star, 
  Check, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Target
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does the AI study planner work?',
      a: 'The AI analyzes your target exam dates, subject difficulties, previous quiz scores, and available study hours to generate an optimal daily revision schedule with automated break intervals.'
    },
    {
      q: 'Can I generate quizzes from my own notes?',
      a: 'Yes! Simply upload your PDF study notes or paste syllabus text. Google Gemini AI will instantly parse the document and extract 20 multiple-choice questions with answer keys.'
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. All uploaded documents and student accounts are secured with Supabase enterprise-grade encryption and access control rules.'
    },
    {
      q: 'Can I use Quizama on mobile?',
      a: 'Yes, Quizama is fully responsive and optimized for smartphones, tablets, laptops, and desktop computers.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden">
      {/* Background Glow Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
      </div>

      {/* 1. Header / Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-[#070913]/90 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl glow-primary group-hover:scale-105 transition-all">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                Quizama
              </span>
              <span className="block text-[10px] font-extrabold tracking-widest uppercase text-purple-400">
                ExamPilot AI Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#impact" className="hover:text-purple-400 transition-colors">Platform</a>
            <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
            <a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden sm:inline"
            >
              Teacher Login
            </Link>
            <Link 
              href="/student-login" 
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl glow-accent transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative z-10 pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Study Smarter <br />
              with <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Generate personalized study plans, quizzes, and track your progress automatically with Google Gemini AI.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/student-login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-base shadow-2xl glow-accent transition-all hover:scale-105 text-center"
              >
                Get Started
              </Link>

              <a
                href="#impact"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-200 hover:text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Explore Platform</span>
              </a>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 font-semibold">
              <div className="flex -space-x-2">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Student" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Student" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Student" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="Student" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
              </div>
              <span>Loved by 10,000+ students</span>
            </div>
          </div>

          {/* Hero Right Visuals Composition */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            {/* Main Student 3D Image */}
            <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 glow-card">
              <Image 
                src="/student_3d_illustration.png" 
                alt="3D Student Studying with AI" 
                fill 
                className="object-cover rounded-3xl"
                priority
              />
            </div>

            {/* Floating Card 1: Study Plan (Top Left) */}
            <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-[#0E1325]/90 border border-slate-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-2.5 w-44 hidden sm:block">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Study Plan</span>
              <div className="space-y-1.5 text-xs font-semibold text-slate-200">
                <div className="flex justify-between"><span>Math</span><span className="text-purple-400 font-bold">2h</span></div>
                <div className="flex justify-between"><span>Physics</span><span className="text-purple-400 font-bold">1.5h</span></div>
                <div className="flex justify-between"><span>Chemistry</span><span className="text-purple-400 font-bold">1h</span></div>
                <div className="flex justify-between"><span>Break</span><span className="text-emerald-400 font-bold">30m</span></div>
              </div>
            </div>

            {/* Floating Card 2: Quiz Score (Top Right) */}
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-[#0E1325]/90 border border-slate-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-center space-y-2 w-40 hidden sm:block">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Quiz Score</span>
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-600/30 to-emerald-500/30 border-2 border-emerald-400">
                <span className="text-lg font-black text-emerald-400">85%</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-300 block">Great Progress!</span>
            </div>

            {/* Floating Card 3: Daily Goal (Bottom Right) */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-[#0E1325]/90 border border-slate-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-2 w-44 hidden sm:block">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Daily Goal</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-purple-500 flex items-center justify-center text-xs font-black text-purple-300">
                  4/5
                </div>
                <span className="text-xs font-bold text-slate-200">Topics Completed</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Powerful Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Powerful Features</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-medium">
            Everything you need to master your studies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-[#0C1021]/80 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 space-y-4 group hover:-translate-y-1">
            <div className="p-4 rounded-2xl bg-purple-600/15 text-purple-400 w-fit group-hover:scale-110 transition-transform">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Study Planner</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Get a personalized study plan based on your subjects, strengths and goals.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-[#0C1021]/80 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 space-y-4 group hover:-translate-y-1">
            <div className="p-4 rounded-2xl bg-purple-600/15 text-purple-400 w-fit group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Quiz Generator</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              AI generates quizzes from your notes and tracks your performance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-[#0C1021]/80 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 space-y-4 group hover:-translate-y-1">
            <div className="p-4 rounded-2xl bg-purple-600/15 text-purple-400 w-fit group-hover:scale-110 transition-transform">
              <LineChart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Progress Tracking</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Visualize your progress with detailed analytics and insights.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-3xl bg-[#0C1021]/80 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 space-y-4 group hover:-translate-y-1">
            <div className="p-4 rounded-2xl bg-purple-600/15 text-purple-400 w-fit group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Smart Revision</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              AI recommends what to revise and when to revise for better retention.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="about" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">How it Works</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-medium">
            Simple steps to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-[#0C1021]/80 border border-slate-800 text-center space-y-4 relative">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center shadow-lg border border-purple-500/30">
              <UserCheck className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">1. Tell Us About You</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Add your subjects, goals and exam dates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-[#0C1021]/80 border border-slate-800 text-center space-y-4 relative">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center shadow-lg border border-purple-500/30">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">2. Get Your Plan</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI creates a personalized study plan for you.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-[#0C1021]/80 border border-slate-800 text-center space-y-4 relative">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center shadow-lg border border-purple-500/30">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">3. Learn & Improve</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Practice quizzes, track progress and improve consistently.
            </p>
          </div>
        </div>
      </section>

      {/* 5. What Students Say (Testimonials) Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">What Students Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="p-8 rounded-3xl bg-[#0C1021]/80 border border-slate-800 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
              "Quizama changed the way I study. My productivity increased by 3x!"
            </p>
            <span className="text-xs font-bold text-slate-400 block">— Ananya, Engineering</span>
          </div>

          {/* Review 2 */}
          <div className="p-8 rounded-3xl bg-[#0C1021]/80 border border-slate-800 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
              "The AI quizzes are awesome. It feels like having a personal tutor!"
            </p>
            <span className="text-xs font-bold text-slate-400 block">— Rohan, NEET Aspirant</span>
          </div>

          {/* Review 3 */}
          <div className="p-8 rounded-3xl bg-[#0C1021]/80 border border-slate-800 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
              "Finally a tool that keeps me consistent and organized."
            </p>
            <span className="text-xs font-bold text-slate-400 block">— Priya, UPSC Aspirant</span>
          </div>
        </div>
      </section>

      {/* 6. Real-Time Learning Intelligence Breakdown (Replaces Pricing) */}
      <section id="impact" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-16">
          <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 border border-purple-500/30 text-xs font-extrabold uppercase tracking-wider">
            AI Engine Ecosystem
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Next-Gen Learning Intelligence
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-medium">
            Designed for teachers to conduct exams and students to achieve top grades with Google Gemini AI.
          </p>
        </div>

        {/* 3 Core Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#0E1328] border border-purple-500/30 space-y-5 relative overflow-hidden group hover:border-purple-500/60 transition-all shadow-xl">
            <div className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-400 w-fit">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Instant PDF to Quiz</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Upload any PDF notes or assignment. Google Gemini AI instantly parses up to 8,000 characters and creates 20 structured MCQs with answer keys.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-purple-400">
              <ShieldCheck className="w-4 h-4" /> 1-Click Parsing
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0E1328] border border-indigo-500/30 space-y-5 relative overflow-hidden group hover:border-indigo-500/60 transition-all shadow-xl">
            <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400 w-fit">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Exam Weightage Planner</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Calculates exam countdowns and weightages (100%, 50%) to generate a daily study plan with 50-minute study and 10-minute break cycles.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-indigo-400">
              <ShieldCheck className="w-4 h-4" /> Exam Countdown Aware
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0E1328] border border-cyan-500/30 space-y-5 relative overflow-hidden group hover:border-cyan-500/60 transition-all shadow-xl">
            <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 w-fit">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Weak Topic Remediation</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Tracks individual student accuracy, flags weak areas below 60%, generates custom remedial practice quizzes, and exports vector PDF reports.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-cyan-400">
              <ShieldCheck className="w-4 h-4" /> Vector PDF Reports
            </div>
          </div>
        </div>

        {/* Live CTA Banner */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-2xl font-black text-white">Ready to boost your exam performance?</h4>
            <p className="text-sm text-slate-300 mt-1 font-medium">Join thousands of students studying smarter with ExamPilot AI.</p>
          </div>
          <Link
            href="/student-login"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl glow-accent shrink-0 transition-all hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* 7. Frequently Asked Questions (FAQ) Section */}
      <section id="faq" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="p-6 rounded-2xl bg-[#0C1021]/80 border border-slate-800 transition-all cursor-pointer"
              onClick={() => toggleFaq(index)}
            >
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-base font-bold text-white">{faq.q}</h4>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-purple-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </div>
              {openFaq === index && (
                <p className="mt-3 text-sm text-slate-400 leading-relaxed pt-3 border-t border-slate-800/60 font-medium">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600 text-white">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white block">Quizama</span>
              <span className="text-[11px] text-slate-500">Study Smarter. Achieve More.</span>
            </div>
          </div>

          <span className="text-slate-500 font-medium">© 2026 Quizama. All rights reserved.</span>

          <div className="flex items-center gap-6 font-semibold text-slate-400">
            <Link href="/login" className="hover:text-purple-400 transition-colors">Teacher Login</Link>
            <Link href="/student-login" className="hover:text-cyan-400 transition-colors">Student Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
