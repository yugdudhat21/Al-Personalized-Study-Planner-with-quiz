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
  Target,
  Calendar,
  Sliders,
  RefreshCw,
  MessageSquare,
  Clock,
  GraduationCap,
  CheckSquare,
  ClipboardList,
  BarChart3,
  Activity,
  ExternalLink,
  Flame,
  X,
  Send,
  RotateCcw
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [demoTasks, setDemoTasks] = useState([
    { id: 1, subject: 'Mathematics', topic: 'Integration by parts', duration: '2h', icon: '∑', bg: 'bg-indigo-600/20 text-indigo-400', completed: true },
    { id: 2, subject: 'Physics', topic: 'Rotational motion', duration: '1.5h', icon: '⚛', bg: 'bg-purple-600/20 text-purple-400', completed: true },
    { id: 3, subject: 'Chemistry', topic: 'Chemical bonding', duration: '1h', icon: '⚗', bg: 'bg-cyan-600/20 text-cyan-400', completed: false },
    { id: 4, subject: 'Revision', topic: 'Weak topics quiz', duration: '30m', icon: '📖', bg: 'bg-pink-600/20 text-pink-400', completed: false }
  ]);

  const toggleDemoTask = (id) => {
    setDemoTasks(demoTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const doneCount = demoTasks.filter(t => t.completed).length;

  // Interactive Modals State
  const [activeModal, setActiveModal] = useState(null); // 'doubt' | 'summarizer' | null
  
  // Doubt Solver State
  const [doubtInput, setDoubtInput] = useState('');
  const [doubtResult, setDoubtResult] = useState(null);
  const [isSolvingDoubt, setIsSolvingDoubt] = useState(false);

  // Summarizer State
  const [notesInput, setNotesInput] = useState('');
  const [summaryResult, setSummaryResult] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);

  const handleSolveDoubt = (queryToSolve) => {
    const q = queryToSolve || doubtInput;
    if (!q.trim()) return;
    setDoubtInput(q);
    setIsSolvingDoubt(true);
    setDoubtResult(null);

    setTimeout(() => {
      setIsSolvingDoubt(false);
      setDoubtResult({
        query: q,
        concept: 'Core Subject Concepts & Step-by-Step AI Solution',
        explanation: `To solve "${q}", StudyPilot AI breaks down the problem using first-principles reasoning and step-by-step logic.`,
        steps: [
          'Step 1: Identify the given parameters, equations, and target variables.',
          'Step 2: Apply the fundamental theorem or mathematical formula.',
          'Step 3: Perform step-by-step simplification and verification.',
          'Step 4: Review final result and note common exam shortcuts.'
        ],
        tip: 'Pro Tip: Re-test yourself on similar questions in Quizzes to lock this into long-term memory!'
      });
    }, 600);
  };

  const handleSummarizeNotes = (textToSummarize) => {
    const text = textToSummarize || notesInput;
    if (!text.trim()) return;
    setNotesInput(text);
    setIsSummarizing(true);
    setSummaryResult(null);

    setTimeout(() => {
      setIsSummarizing(false);
      setSummaryResult({
        title: 'Crisp Chapter Bullet Summary & AI Flashcards',
        bullets: [
          '⚡ High-Yield Concept 1: Core definition and fundamental axioms.',
          '⚡ High-Yield Concept 2: Essential formulas, shortcuts, and key identities.',
          '⚡ High-Yield Concept 3: Frequently asked exam questions and common pitfalls.'
        ],
        flashcards: [
          { q: 'What is the core principle of this topic?', a: 'Mastering foundational concepts and applying active recall techniques.' },
          { q: 'What is the recommended revision strategy?', a: 'Use spaced repetition at 1-day, 3-day, and 7-day intervals for 95%+ retention.' },
          { q: 'How does StudyPilot track progress?', a: 'Automatically calculates accuracy, study streak, and flags weak topics.' }
        ]
      });
    }, 600);
  };

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
      a: 'Yes! Simply upload your PDF study notes or paste syllabus text. Google Gemini AI will instantly parse the document and extract targeted practice quizzes with answer keys.'
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. All uploaded documents and student accounts are secured with enterprise-grade encryption and access control rules.'
    },
    {
      q: 'Can I use StudyPilot on mobile?',
      a: 'Yes, StudyPilot is fully responsive and optimized for smartphones, tablets, laptops, and desktop computers.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-2/3 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      {/* 1. Header / Navbar */}
      <header className="relative z-50 border-b border-slate-800/80 bg-[#060814]/90 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/logo.png" 
              alt="StudyPilot Logo" 
              width={40} 
              height={40} 
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-all"
            />
            <span className="text-2xl font-black tracking-tight text-white">
              StudyPilot
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#workspace" className="hover:text-purple-400 transition-colors">The app</a>
            <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How it works</a>
            <a href="#teacher-portal" className="hover:text-purple-400 transition-colors">Teachers</a>
            <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              href="/student-login" 
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Login
            </Link>
            <Link 
              href="/student-login" 
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Text & Actions */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            {/* Top AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1226] border border-purple-500/30 text-slate-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Personalized study, powered by AI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Study smarter <br />
              with <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">StudyPilot AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Generate personalized study plans, auto-create quizzes from your notes, and track your progress — all in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/student-login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:opacity-90 text-white font-bold text-base shadow-xl shadow-purple-600/30 transition-all hover:scale-105 text-center"
              >
                Get Started Free
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-slate-800 bg-[#0A0D1B]/80 hover:bg-slate-800/60 text-slate-200 hover:text-white font-semibold text-base flex items-center justify-center gap-2.5 transition-all"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Watch Demo</span>
              </a>
            </div>

            {/* Social Proof */}
            <div className="pt-2 flex items-center justify-center lg:justify-start text-sm text-slate-400 font-medium">
              <span><strong className="text-white">10,000+</strong> students plan their week with StudyPilot</span>
            </div>
          </div>

          {/* Hero Right Visuals Composition */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 bg-[#0B0F24]">
              <Image 
                src="/hero_student_3d.png" 
                alt="StudyPilot AI Student Dashboard Mockup" 
                width={600}
                height={500}
                className="w-full h-auto object-cover rounded-3xl"
                priority
              />
            </div>
          </div>

        </div>

        {/* Bottom Hero Stats Bar */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-[#0A0D1D]/90 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
            {/* Stat 1 */}
            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-0">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">10,000+</div>
                <div className="text-xs font-medium text-slate-400">Active students</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">1.2M</div>
                <div className="text-xs font-medium text-slate-400">Quiz questions generated</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">94%</div>
                <div className="text-xs font-medium text-slate-400">Stick to their plan</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-pink-600/15 border border-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">4.8/5</div>
                <div className="text-xs font-medium text-slate-400">Average rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Powerful Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/40">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Powerful <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">features</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-medium">
            Everything you need to master your studies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Study Planner</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              A day-by-day plan built around your subjects, strengths and exam dates.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Quiz Generator</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Turn any notes or PDF into practice quizzes in seconds.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Progress Tracking</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              See accuracy, streaks and weak topics in one clean dashboard.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Smart Revision</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Spaced repetition tells you exactly what to revise, and when.
            </p>
          </div>

          {/* Card 5 - Interactive AI Doubt Solver */}
          <div 
            onClick={() => setActiveModal('doubt')}
            className="p-8 rounded-3xl bg-[#090C1B] border border-purple-500/40 hover:border-purple-500/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all duration-300 space-y-4 group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-600/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                Try Live Demo ✨
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">AI Doubt Solver</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Stuck on a question? Ask StudyPilot and get a step-by-step explanation instantly.
            </p>
          </div>

          {/* Card 6 - Interactive Notes Summarizer */}
          <div 
            onClick={() => setActiveModal('summarizer')}
            className="p-8 rounded-3xl bg-[#090C1B] border border-purple-500/40 hover:border-purple-500/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all duration-300 space-y-4 group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-600/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                Try Live Demo ✨
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Notes Summarizer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload a chapter and get crisp bullet summaries and flashcards.
            </p>
          </div>

          {/* Card 7 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Focus Timer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pomodoro sessions that log your real study hours automatically.
            </p>
          </div>

          {/* Card 8 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Teacher Portal</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Assign quizzes to a class and track every student's progress.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Everything in One Workspace Section */}
      <section id="workspace" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/40">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Everything in <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">one workspace</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-medium">
            Twelve modules that cover the full study cycle — plan, practise, review, repeat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Module 1 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Planner</h4>
              <p className="text-xs text-slate-400 mt-1">Auto-balanced weekly schedule</p>
            </div>
          </div>

          {/* Module 2 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Quizzes</h4>
              <p className="text-xs text-slate-400 mt-1">AI generated practice sets</p>
            </div>
          </div>

          {/* Module 3 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Subjects</h4>
              <p className="text-xs text-slate-400 mt-1">Syllabus & chapter tracking</p>
            </div>
          </div>

          {/* Module 4 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Assignments</h4>
              <p className="text-xs text-slate-400 mt-1">Deadlines in one list</p>
            </div>
          </div>

          {/* Module 5 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Exams</h4>
              <p className="text-xs text-slate-400 mt-1">Countdowns & revision load</p>
            </div>
          </div>

          {/* Module 6 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Progress</h4>
              <p className="text-xs text-slate-400 mt-1">Daily completion streaks</p>
            </div>
          </div>

          {/* Module 7 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Analytics</h4>
              <p className="text-xs text-slate-400 mt-1">Accuracy & time insights</p>
            </div>
          </div>

          {/* Module 8 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Weak Topics</h4>
              <p className="text-xs text-slate-400 mt-1">What to fix first</p>
            </div>
          </div>

          {/* Module 9 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Focus Timer</h4>
              <p className="text-xs text-slate-400 mt-1">Pomodoro study sessions</p>
            </div>
          </div>

          {/* Module 10 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Teacher Portal</h4>
              <p className="text-xs text-slate-400 mt-1">Track a whole class</p>
            </div>
          </div>

          {/* Module 11 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Settings</h4>
              <p className="text-xs text-slate-400 mt-1">Goals, hours & reminders</p>
            </div>
          </div>

          {/* Module 12 */}
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Secure Login</h4>
              <p className="text-xs text-slate-400 mt-1">Student & teacher accounts</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Your day, already planned Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Your day, <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">already planned</span>
            </h2>

            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Every morning StudyPilot rebuilds your schedule from what you actually finished yesterday — no more guilt-driven timetables you abandon by Wednesday.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-slate-300 text-sm font-medium">
                <Flame className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Missed a session? The plan reshuffles itself automatically.</span>
              </div>
              <div className="flex items-start gap-3 text-slate-300 text-sm font-medium">
                <Flame className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Weak topics get more slots as exams get closer.</span>
              </div>
              <div className="flex items-start gap-3 text-slate-300 text-sm font-medium">
                <Flame className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Focus timer logs real study hours, not intentions.</span>
              </div>
            </div>

            {/* Left 3D Illustration Graphic */}
            <div className="pt-6 relative max-w-md">
              <div className="rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl">
                <Image 
                  src="/student_night_study.png"
                  alt="Student Night Study Session Illustration"
                  width={500}
                  height={350}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Dashboard Card Mockup */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090C1B] border border-slate-800/90 shadow-2xl space-y-6">
              {/* Header of Mock Card */}
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    Today's plan
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Monday · 5h scheduled</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 text-xs font-bold border border-purple-500/30 transition-all">
                  {doneCount} of {demoTasks.length} done
                </span>
              </div>

              {/* Task Items List */}
              <div className="space-y-3">
                {demoTasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => toggleDemoTask(task.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between group ${
                      task.completed 
                        ? 'bg-[#0E1328] border-slate-800/90 shadow-sm' 
                        : 'bg-[#0E1328]/50 border-slate-800/50 hover:bg-[#0E1328]/80 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        task.completed 
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/40 scale-105' 
                          : 'border border-slate-700 text-transparent group-hover:border-purple-400'
                      }`}>
                        <Check className={`w-4 h-4 ${task.completed ? 'text-white' : 'text-transparent'}`} />
                      </div>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${task.bg}`}>
                        {task.icon}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold transition-colors ${task.completed ? 'text-white' : 'text-slate-200'}`}>
                          {task.subject}
                        </h4>
                        <p className="text-xs text-slate-400">{task.topic}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{task.duration}</span>
                  </div>
                ))}
              </div>

              {/* Bottom 3 Mini Stats */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#0E1328] border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-lg font-black text-white mt-1">14</div>
                  <div className="text-[10px] text-slate-400">day streak</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0E1328] border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-lg font-black text-white mt-1">3.2h</div>
                  <div className="text-[10px] text-slate-400">focused today</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0E1328] border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-lg font-black text-white mt-1">85%</div>
                  <div className="text-[10px] text-slate-400">quiz score</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/40">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How it <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">works</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-medium">
            Six simple steps to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/15 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/20">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Tell us about you</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Add subjects, goals and exam dates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/15 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/20">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Get your plan</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              AI drafts a realistic weekly schedule.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/15 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/20">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Add your notes</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Upload PDFs or paste text to build your material.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/15 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">4. Practise with quizzes</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              AI turns your notes into targeted question sets.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/15 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/20">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">5. Track progress</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              See accuracy, streaks and weak topics live.
            </p>
          </div>

          {/* Step 6 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/15 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/20">
              <Star className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">6. Learn & improve</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Quiz, track and adapt every week.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Teacher Portal Section */}
      <section id="teacher-portal" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Run a whole classroom <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">from one screen</span>
            </h2>

            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Assign quizzes, watch class-wide accuracy, and spot the students who quietly fall behind — before the exam does it for you.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/login"
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
              >
                <span>Open teacher portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://github.com/yugdudhat21/Al-Personalized-Study-Planner-with-quiz"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl border border-slate-800 bg-[#0A0D1B] hover:bg-slate-800/50 text-slate-300 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View source</span>
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 pt-8 border-t border-slate-800/60">
              <div>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-white">2.4K+</div>
                <div className="text-xs text-slate-400">Teachers</div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-white">98K+</div>
                <div className="text-xs text-slate-400">Quizzes</div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                  <Star className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-white">4.9/5</div>
                <div className="text-xs text-slate-400">Rating</div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-white">99.9%</div>
                <div className="text-xs text-slate-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Teacher Dashboard Visual */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl bg-[#090C1B]">
              <Image 
                src="/teacher_portal_3d.png"
                alt="Teacher Portal Dashboard Analytics Visual"
                width={600}
                height={420}
                className="w-full h-auto object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>

        {/* 6 Teacher Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Class analytics</h4>
            <p className="text-xs text-slate-400">Average score, attempts, and time spent insights.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Assignment builder</h4>
            <p className="text-xs text-slate-400">Push quizzes to a batch in one click.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Weak topic heatmap</h4>
            <p className="text-xs text-slate-400">See which chapter the class is struggling in.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Student roster</h4>
            <p className="text-xs text-slate-400">Individual progress at a glance.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Auto grading</h4>
            <p className="text-xs text-slate-400">Quizzes scored the moment they're submitted.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 hover:border-purple-500/40 transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Parent reports</h4>
            <p className="text-xs text-slate-400">Share a monthly progress summary in one tap.</p>
          </div>
        </div>
      </section>

      {/* 8. What Students Say Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/40">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            What <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">students say</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-medium">
            Trusted by 10,000+ learners across India
          </p>
        </div>

        {/* Top Stats Banner */}
        <div className="p-6 rounded-2xl bg-[#090C1B] border border-slate-800 max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
            <div className="pt-2 md:pt-0">
              <div className="text-lg font-black text-white flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
                <span>4.9/5</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">average rating</div>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="text-lg font-black text-white flex items-center justify-center gap-1">
                <Users className="w-4 h-4 text-purple-400" />
                <span>10K+</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">students</div>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="text-lg font-black text-white flex items-center justify-center gap-1">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>1.2M+</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">quizzes taken</div>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="text-lg font-black text-white flex items-center justify-center gap-1">
                <Target className="w-4 h-4 text-purple-400" />
                <span>94%</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">stick rate</div>
            </div>
          </div>
        </div>

        {/* 3 Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Review 1 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex gap-1 text-blue-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-blue-500" />)}
              </div>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                "StudyPilot changed the way I study. My productivity increased by 3x."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                A
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Ananya</h4>
                <p className="text-xs text-slate-400">Engineering</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex gap-1 text-blue-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-blue-500" />)}
              </div>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                "The AI quizzes are awesome. It feels like having a personal tutor."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                R
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Rohan</h4>
                <p className="text-xs text-slate-400">NEET Aspirant</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex gap-1 text-blue-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-blue-500" />)}
              </div>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                "Finally a tool that keeps me consistent and organized."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                P
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Priya</h4>
                <p className="text-xs text-slate-400">UPSC Aspirant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Institutes Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-[#090C1B] border border-slate-800/80 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-medium">
          <span className="text-slate-500 font-semibold">Students from</span>
          <span className="flex items-center gap-1 text-slate-300 font-bold"><GraduationCap className="w-4 h-4 text-purple-400" /> IITs</span>
          <span className="flex items-center gap-1 text-slate-300 font-bold"><GraduationCap className="w-4 h-4 text-purple-400" /> NITs</span>
          <span className="flex items-center gap-1 text-slate-300 font-bold"><GraduationCap className="w-4 h-4 text-purple-400" /> AIIMS</span>
          <span className="flex items-center gap-1 text-slate-300 font-bold"><GraduationCap className="w-4 h-4 text-purple-400" /> GATE</span>
          <span className="flex items-center gap-1 text-slate-300 font-bold"><GraduationCap className="w-4 h-4 text-purple-400" /> UPSC</span>
        </div>
      </section>

      {/* 9. Pricing Plans & FAQ Section */}
      <section id="pricing" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/40">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Pricing plans</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-medium">
            Choose the plan that works for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left: 2 Pricing Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl bg-[#090C1B] border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Free Plan</h3>
                <div className="text-3xl font-black text-white">
                  ₹0 <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>

                <div className="space-y-2.5 pt-2 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>AI study plan (limited)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>10 quizzes / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Basic analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Community support</span>
                  </div>
                </div>
              </div>

              <Link
                href="/student-login"
                className="w-full py-3 rounded-xl border border-slate-800 bg-[#0A0D1B] hover:bg-slate-800 text-white font-bold text-xs text-center transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-3xl bg-[#090C1B] border-2 border-purple-500/60 shadow-xl shadow-purple-600/10 space-y-6 flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Popular
              </span>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Pro Plan</h3>
                <div className="text-3xl font-black text-white">
                  ₹299 <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>

                <div className="space-y-2.5 pt-2 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Unlimited AI study plans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Unlimited quizzes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Smart revision alerts</span>
                  </div>
                </div>
              </div>

              <Link
                href="/student-login"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:opacity-90 text-white font-bold text-xs text-center shadow-lg shadow-purple-600/30 transition-all"
              >
                Start Free Trial
              </Link>
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-[#090C1B] border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Frequently asked questions</h3>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl bg-[#060814]/80 border border-slate-800/80 transition-all cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-xs font-bold text-white">{faq.q}</h4>
                    {openFaq === index ? (
                      <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>
                  {openFaq === index && (
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/60">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900/40 border border-purple-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Start your first AI study plan today
            </h3>
            <p className="text-sm text-slate-300 font-medium">
              Free to begin, no card needed. Two minutes of setup, one semester of clarity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/student-login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:opacity-90 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
            >
              Create free account
            </Link>

            <a
              href="https://github.com/yugdudhat21/Al-Personalized-Study-Planner-with-quiz"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-slate-800 bg-[#0A0D1B] hover:bg-slate-800 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub repo</span>
            </a>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 bg-[#040610]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Image 
                src="/logo.png" 
                alt="StudyPilot Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-extrabold text-base text-white">StudyPilot</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              An AI personalized study planner with quizzes, progress tracking and a teacher portal.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#workspace" className="hover:text-purple-400 transition-colors">The app</a></li>
              <li><a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a></li>
              <li><a href="#pricing" className="hover:text-purple-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">For schools</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Teacher portal</Link></li>
              <li><a href="#teacher-portal" className="hover:text-purple-400 transition-colors">Class analytics</a></li>
              <li><a href="#how-it-works" className="hover:text-purple-400 transition-colors">How it works</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Project</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="https://github.com/yugdudhat21/Al-Personalized-Study-Planner-with-quiz" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">GitHub repository</a></li>
              <li><a href="https://github.com/yugdudhat21/Al-Personalized-Study-Planner-with-quiz/issues" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">Report an issue</a></li>
              <li><span className="text-slate-500">Built by yugdudhat21</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/60 text-center text-xs text-slate-500 font-medium">
          © 2026 StudyPilot. <span className="text-purple-400">Study smarter. Achieve more.</span>
        </div>
      </footer>

      {/* 11. Interactive Feature Modals */}
      {activeModal === 'doubt' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0A0E22] border border-purple-500/40 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  AI Doubt Solver <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">Google Gemini Powered</span>
                </h3>
                <p className="text-xs text-slate-400">Ask any study doubt or question and get an instant step-by-step answer.</p>
              </div>
            </div>

            {/* Quick Prompt Badges */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Try a sample question:</span>
              <div className="flex flex-wrap gap-2">
                {['What is Integration by Parts?', "Explain Newton's Second Law", 'Structure of DNA'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleSolveDoubt(sample)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#121832] hover:bg-purple-600/20 border border-slate-800 hover:border-purple-500/50 text-slate-300 transition-all text-left"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={doubtInput}
                onChange={(e) => setDoubtInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSolveDoubt()}
                placeholder="Type your study doubt here..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#060919] border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
              />
              <button
                onClick={() => handleSolveDoubt()}
                disabled={isSolvingDoubt}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shrink-0 disabled:opacity-50"
              >
                {isSolvingDoubt ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isSolvingDoubt ? 'Solving...' : 'Ask AI'}</span>
              </button>
            </div>

            {/* Solution Result Box */}
            {doubtResult && (
              <div className="p-6 rounded-2xl bg-[#060919] border border-purple-500/30 space-y-4 max-h-72 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{doubtResult.concept}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Verified AI Answer</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{doubtResult.explanation}</p>
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-slate-300">Step-by-step breakdown:</span>
                  <div className="space-y-1.5 pl-2">
                    {doubtResult.steps.map((step, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 text-xs text-amber-300/90 font-medium bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  {doubtResult.tip}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeModal === 'summarizer' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0A0E22] border border-purple-500/40 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Notes Summarizer & Flashcards <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">PDF & Text Support</span>
                </h3>
                <p className="text-xs text-slate-400">Paste your study notes to get instant bullet summaries and interactive revision flashcards.</p>
              </div>
            </div>

            {/* Textarea Input */}
            <div className="space-y-3">
              <textarea
                rows={4}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Paste chapter notes or textbook paragraphs here..."
                className="w-full p-4 rounded-xl bg-[#060919] border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleSummarizeNotes("Quantum Mechanics deals with atomic and subatomic scales. Wave-particle duality shows light acts as both particle and wave. Heisenberg's Uncertainty Principle states position and momentum cannot be simultaneously measured with arbitrary precision.")}
                  className="text-xs text-purple-400 hover:underline font-medium"
                >
                  Paste Sample Chapter Notes
                </button>
                <button
                  onClick={() => handleSummarizeNotes()}
                  disabled={isSummarizing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shrink-0 disabled:opacity-50"
                >
                  {isSummarizing ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isSummarizing ? 'Summarizing...' : 'Summarize Notes'}</span>
                </button>
              </div>
            </div>

            {/* Summarizer Result Box */}
            {summaryResult && (
              <div className="p-6 rounded-2xl bg-[#060919] border border-purple-500/30 space-y-5 max-h-72 overflow-y-auto">
                <div className="border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-white">{summaryResult.title}</h4>
                </div>
                <div className="space-y-2">
                  {summaryResult.bullets.map((b, idx) => (
                    <p key={idx} className="text-xs text-slate-300 leading-relaxed">{b}</p>
                  ))}
                </div>

                {/* AI Flashcards Section */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">Interactive Revision Flashcards (Click to flip):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {summaryResult.flashcards.map((card, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFlippedCard(flippedCard === idx ? null : idx)}
                        className="p-4 rounded-xl bg-[#0A0E22] border border-slate-800 hover:border-purple-500/50 cursor-pointer min-h-[90px] flex items-center justify-center text-center transition-all select-none"
                      >
                        {flippedCard === idx ? (
                          <span className="text-xs font-semibold text-emerald-300">{card.a}</span>
                        ) : (
                          <span className="text-xs font-bold text-slate-200">Q: {card.q}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
