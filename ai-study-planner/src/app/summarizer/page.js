'use client';

import { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  Copy,
  Download,
  BookOpen,
  Zap,
  Check,
  RotateCcw,
  ListOrdered,
  FileCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

export default function NotesSummarizerPage() {
  const [notesText, setNotesText] = useState('');
  const [subject, setSubject] = useState('');
  const [summaryFormat, setSummaryFormat] = useState('bullet_points');
  const [fileName, setFileName] = useState('');
  const [parsingPdf, setParsingPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summaryOutput, setSummaryOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // PDF & Document File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setParsingPdf(true);
      const toastId = toast.loading(`Extracting text from PDF "${file.name}"...`);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to extract text from PDF');

        setNotesText(data.text || '');
        toast.success(`Successfully extracted ${data.pages || 1} pages from "${file.name}"!`, { id: toastId });
      } catch (err) {
        toast.error(err.message || 'PDF text extraction failed', { id: toastId });
      } finally {
        setParsingPdf(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        setNotesText(text);
        toast.success(`Loaded text from "${file.name}"!`);
      };
      reader.readAsText(file);
    }
  };

  // Generate Summary Handler
  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    if (!notesText.trim()) {
      toast.error('Please enter notes text or upload a PDF document first.');
      return;
    }

    setLoading(true);
    setSummaryOutput('');
    const toastId = toast.loading('Generating AI bullet-point summary...');

    try {
      const res = await fetch('/api/summarize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notesText,
          subject: subject || 'General Study Notes',
          summaryFormat,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate summary');

      setSummaryOutput(data.summary || '');
      toast.success('Summary generated successfully!', { id: toastId });
    } catch (err) {
      toast.error(err.message || 'Error generating summary', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    if (!summaryOutput) return;
    navigator.clipboard.writeText(summaryOutput);
    setCopied(true);
    toast.success('Summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Summary as TXT
  const handleDownloadTxt = () => {
    if (!summaryOutput) return;
    const element = document.createElement('a');
    const file = new Blob([summaryOutput], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${subject || 'Study_Notes'}_Summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded summary TXT file!');
  };

  // Download Summary as PDF
  const handleDownloadPdf = () => {
    if (!summaryOutput) return;
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(`AI Study Notes Summary: ${subject || 'General'}`, 14, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 27);
      doc.line(14, 30, 196, 30);

      const splitText = doc.splitTextToSize(summaryOutput.replace(/[#*]/g, ''), 180);
      let y = 38;

      for (let i = 0; i < splitText.length; i++) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(splitText[i], 14, y);
        y += 6;
      }

      doc.save(`${subject || 'Study_Notes'}_Summary.pdf`);
      toast.success('Downloaded summary PDF!');
    } catch (err) {
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-violet-500" /> AI Notes & PDF Bullet Summarizer
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Upload your PDF lecture notes or paste syllabus text to generate instant, structured bullet-point revision summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Notes Input */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleGenerateSummary} className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-500" /> Source Material & Settings
              </h3>
            </div>

            {/* Subject Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Subject / Chapter Name (Optional)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Physics Chapter 3: Laws of Motion"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>

            {/* Summary Format Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Summary Output Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bullet_points', label: '📌 Bullet Points', desc: 'Structured chapter points' },
                  { id: 'key_takeaways', label: '💡 Key Takeaways', desc: 'Core takeaways & tips' },
                  { id: 'exam_revision', label: '⚡ Exam Cheat Sheet', desc: 'High-yield points' },
                  { id: 'flashcards', label: '🗂️ Q&A Flashcards', desc: 'Revision Q&A pairs' },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSummaryFormat(style.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      summaryFormat === style.id
                        ? 'bg-violet-500/10 border-violet-500 text-violet-600 dark:text-violet-400 font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{style.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload PDF / Document Notes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Notes Content / PDF Upload
                </label>

                <label className="px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 font-bold text-xs hover:bg-violet-500/20 cursor-pointer flex items-center gap-1.5 transition">
                  {parsingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {parsingPdf ? 'Extracting...' : 'Upload (.pdf, .txt, .md)'}
                  <input type="file" accept=".txt,.md,.pdf" onChange={handleFileUpload} className="hidden" disabled={parsingPdf} />
                </label>
              </div>

              {fileName && (
                <div className="mb-2 text-xs font-mono text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Loaded File: {fileName}
                </div>
              )}

              <textarea
                rows="8"
                required
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Extracted PDF text will appear here. Or paste your textbook notes, lecture transcript, or study material directly..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-y"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setNotesText('');
                  setFileName('');
                  setSummaryOutput('');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </button>

              <button
                type="submit"
                disabled={loading || parsingPdf || !notesText.trim()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg glow-accent flex items-center gap-2 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Summarizing Notes...' : 'Summarize Notes with AI'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: AI Generated Summary Output Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-full min-h-[480px]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Generated Bullet Summary</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Structured revision bullet points</p>
                </div>
              </div>

              {summaryOutput && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopySummary}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-violet-500/10 hover:text-violet-500 transition flex items-center gap-1"
                    title="Copy Summary"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={handleDownloadTxt}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-violet-500/10 hover:text-violet-500 transition"
                    title="Download TXT"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    className="px-2.5 py-1.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-500 transition flex items-center gap-1 shadow-sm"
                    title="Export PDF"
                  >
                    PDF
                  </button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto max-h-[520px] pr-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-3">
                  <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                  <p className="text-xs font-bold text-slate-400">AI is reading notes & generating bullet points...</p>
                </div>
              ) : summaryOutput ? (
                <div className="prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed space-y-3 whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200">
                  {summaryOutput}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <ListOrdered className="w-10 h-10 text-slate-400 mb-2" />
                  <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">No Summary Generated Yet</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                    Upload a PDF document or paste your notes on the left, then click "Summarize Notes with AI".
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
