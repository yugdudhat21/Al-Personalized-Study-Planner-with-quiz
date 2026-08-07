'use client';

import { useState } from 'react';
import TeacherLayout from '@/components/layout/TeacherLayout';
import {
  FileText,
  Sparkles,
  Printer,
  BookOpen,
  Loader2,
  Key,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuestionPaperPage() {
  const [examTitle, setExamTitle] = useState('Mid-Term Examination 2026');
  const [subject, setSubject] = useState('Physics');
  const [topic, setTopic] = useState('Laws of Motion, Work Energy, & Thermodynamics');
  const [totalMarks, setTotalMarks] = useState(50);
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();

    if (!subject.trim()) {
      toast.error('Please enter a subject name.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/generate-question-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examTitle,
          subject,
          topic,
          totalMarks: Number(totalMarks),
        }),
      });

      const data = await res.json();

      if (data.success && data.paper) {
        setPaper(data.paper);
        toast.success('Generated AI Question Paper with Answer Key!');
      } else {
        toast.error(data.error || 'Failed to generate question paper.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <TeacherLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 print:p-0 print:m-0 print:max-w-none">
        {/* Top Bar - Hide on Print */}
        <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-lg glow-accent text-white">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  AI Question Paper Builder
                </h1>
                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                  <Sparkles className="w-3 h-3" /> Teacher Tool
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Generate formatted exam question papers with Answer Keys in seconds.
              </p>
            </div>
          </div>

          {paper && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
                  showAnswerKey
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Key className="w-4 h-4 text-amber-400" />
                {showAnswerKey ? 'Showing Answer Key' : 'Show Answer Key'}
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          )}
        </div>

        {/* Main Grid: Form on Left, Generated Paper on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form - Hide on Print */}
          <div className="print:hidden lg:col-span-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Exam Parameters
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Exam Header Title
                </label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a2333] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Chemistry, Computer Science"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a2333] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Topic / Chapter Syllabus
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chapters 1 to 4"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a2333] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Total Marks
                </label>
                <select
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a2333] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={20}>20 Marks (Unit Test)</option>
                  <option value={50}>50 Marks (Mid-Term)</option>
                  <option value={100}>100 Marks (Final Exam)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating Paper...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Create Question Paper
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Paper Display Area (8 cols) */}
          <div className="lg:col-span-8">
            {paper ? (
              <div className="bg-white text-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 font-serif">
                {/* Paper Header */}
                <div className="text-center border-b-2 border-slate-900 pb-6 mb-6 space-y-2">
                  <h2 className="text-2xl font-bold uppercase tracking-wide">{paper.title}</h2>
                  <div className="flex flex-wrap justify-between text-sm font-sans font-semibold border-t border-slate-300 pt-3">
                    <span>Subject: {paper.subject}</span>
                    <span>Time: {paper.duration}</span>
                    <span>Max Marks: {paper.totalMarks}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans italic">Syllabus: {paper.topic}</p>
                </div>

                {/* Instructions */}
                {paper.instructions && (
                  <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans text-xs space-y-1 print:bg-transparent print:p-0 print:border-none">
                    <p className="font-bold uppercase tracking-wider text-slate-800">General Instructions:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {paper.instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sections */}
                <div className="space-y-8 font-sans">
                  {paper.sections?.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                      <div className="bg-slate-100 p-2.5 rounded-lg border-l-4 border-slate-900 print:bg-transparent print:p-0 print:border-l-0 print:border-b">
                        <h3 className="font-bold text-sm uppercase tracking-wide">{section.sectionTitle}</h3>
                      </div>

                      <div className="space-y-6">
                        {section.questions?.map((q, qIdx) => (
                          <div key={q.id || qIdx} className="space-y-2 text-sm">
                            <div className="flex justify-between font-medium">
                              <p className="pr-4 font-semibold text-slate-900">
                                Q{qIdx + 1}. {q.questionText}
                              </p>
                              <span className="font-bold whitespace-nowrap">[{q.marks} Mark{q.marks > 1 ? 's' : ''}]</span>
                            </div>

                            {/* Options if MCQ */}
                            {q.options && (
                              <div className="grid grid-cols-2 gap-2 pl-4 text-xs font-normal text-slate-800">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx}>{opt}</div>
                                ))}
                              </div>
                            )}

                            {/* Answer Key Overlay if toggled */}
                            {showAnswerKey && (
                              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-mono space-y-1">
                                <p className="font-bold text-amber-900 flex items-center gap-1">
                                  <Key className="w-3.5 h-3.5 text-amber-600" /> Model Answer / Solution:
                                </p>
                                <p className="text-slate-800 whitespace-pre-line">{q.answer}</p>
                                {q.explanation && (
                                  <p className="text-slate-600 italic">Criteria: {q.explanation}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center space-y-4">
                <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Exam Paper Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Fill in the exam parameters on the left and click "Create Question Paper" to generate your printable exam paper.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
