'use client';

import { useState, useEffect, useRef } from 'react';
import TeacherLayout from '@/components/layout/TeacherLayout';
import { FileSpreadsheet, Download, RefreshCw, GraduationCap, AlertTriangle, Sparkles } from 'lucide-react';
import { useTeacherStore } from '@/store/teacherStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function TeacherReportsPage() {
  const { user } = useAuthStore();
  const { classes, students, fetchClasses, fetchStudentsByClass } = useTeacherStore();

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const reportRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      fetchClasses(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes]);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudentsByClass(selectedClassId).then((stus) => {
        if (stus && stus.length > 0) {
          setSelectedStudentId(stus[0].id);
          loadReport(stus[0].id);
        } else {
          setSelectedStudentId('');
          setReportData(null);
        }
      });
    }
  }, [selectedClassId]);

  const handleStudentSelect = (e) => {
    const sId = e.target.value;
    setSelectedStudentId(sId);
    if (sId) {
      loadReport(sId);
    } else {
      setReportData(null);
    }
  };

  const loadReport = async (studentId) => {
    if (!studentId) return;
    setLoadingReport(true);
    try {
      const res = await fetch(`/api/export-report/${studentId}`);
      const data = await res.json();
      if (res.ok && data.report) {
        setReportData(data.report);
      } else {
        setReportData(null);
      }
    } catch (err) {
      console.error('Fetch report error:', err);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportData) return;

    setDownloadingPdf(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const studentName = reportData.student?.full_name || 'Student';
      const studentId = reportData.student?.student_id || '-';
      const className = reportData.student?.classes?.name || 'Class';
      const dateStr = new Date().toLocaleDateString();

      // Header Background
      pdf.setFillColor(15, 23, 42); // Dark Slate
      pdf.rect(0, 0, 210, 42, 'F');

      // Header Title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ExamPilot AI - Student Performance Report', 15, 22);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Report Generated: ${dateStr}`, 15, 32);

      // Student Info Box
      pdf.setFillColor(241, 245, 249);
      pdf.rect(15, 50, 180, 25, 'F');

      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Student: ${studentName}`, 20, 60);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Student ID: ${studentId}   |   Class: ${className}`, 20, 68);

      // Summary Metrics Cards
      const avgPct = `${reportData.analyticsSummary?.averageQuizPercentage || 0}%`;
      const taken = `${reportData.analyticsSummary?.totalQuizzesTaken || 0}`;
      const weakCount = `${reportData.analyticsSummary?.flaggedWeakTopicsCount || 0}`;

      // Card 1: Quiz Average
      pdf.setFillColor(238, 242, 255);
      pdf.rect(15, 85, 55, 30, 'F');
      pdf.setTextColor(79, 70, 229);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('QUIZ AVERAGE', 20, 94);
      pdf.setFontSize(18);
      pdf.text(avgPct, 20, 107);

      // Card 2: Quizzes Taken
      pdf.setFillColor(239, 246, 255);
      pdf.rect(77, 85, 55, 30, 'F');
      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('QUIZZES TAKEN', 82, 94);
      pdf.setFontSize(18);
      pdf.text(taken, 82, 107);

      // Card 3: Weak Topics
      pdf.setFillColor(254, 243, 199);
      pdf.rect(140, 85, 55, 30, 'F');
      pdf.setTextColor(217, 119, 6);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('WEAK TOPICS', 145, 94);
      pdf.setFontSize(18);
      pdf.text(weakCount, 145, 107);

      // AI Prediction Section
      pdf.setFillColor(243, 232, 255);
      pdf.rect(15, 125, 180, 25, 'F');
      pdf.setTextColor(126, 34, 206);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AI PERFORMANCE PREDICTION:', 20, 134);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(reportData.analyticsSummary?.predictionSummary || 'No prediction data available', 20, 143);

      // Weak Topics Section
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Identified Weak Topics:', 15, 163);

      let yPos = 173;
      if (!reportData.weakTopics || reportData.weakTopics.length === 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 116, 139);
        pdf.text('No weak topics flagged. Great performance!', 15, yPos);
      } else {
        reportData.weakTopics.forEach((wt) => {
          pdf.setFillColor(254, 243, 199);
          pdf.rect(15, yPos - 5, 180, 10, 'F');
          pdf.setTextColor(180, 83, 9);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`• ${wt.topic || 'Topic'} (Accuracy: ${wt.accuracy || 0}%)`, 20, yPos);
          yPos += 14;
        });
      }

      // Save PDF
      pdf.save(`Report_${studentId}_${studentName.replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF Performance Report downloaded!');
    } catch (err) {
      console.error('PDF error:', err);
      toast.error('Failed to generate PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <FileSpreadsheet className="w-7 h-7 text-pink-500" /> Export PDF Student Performance Reports
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Generate downloadable PDF reports containing quiz scores, weak topics, study progress, and AI predictions.
            </p>
          </div>

          {reportData && (
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg glow-accent flex items-center gap-2 transition disabled:opacity-50"
            >
              {downloadingPdf ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {downloadingPdf ? 'Generating PDF...' : 'Download PDF Report'}
            </button>
          )}
        </div>

        {/* Student Selector */}
        <div className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Class:</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white"
              >
                {classes.length === 0 ? (
                  <option value="" className="bg-slate-900 text-white">No Classes Found</option>
                ) : (
                  classes.map((cls) => (
                    <option key={cls.id} value={cls.id} className="bg-slate-900 text-white">
                      {cls.name} ({cls.subject})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Student:</label>
              <select
                value={selectedStudentId}
                onChange={handleStudentSelect}
                className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white"
              >
                {students.length === 0 ? (
                  <option value="" className="bg-slate-900 text-white">No Enrolled Students</option>
                ) : (
                  students.map((stu) => (
                    <option key={stu.id} value={stu.id} className="bg-slate-900 text-white">
                      {stu.full_name} ({stu.student_id})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {loadingReport ? (
            <p className="text-center text-xs text-slate-400 py-8">Compiling report data...</p>
          ) : !reportData ? (
            <div className="text-center py-10 space-y-2">
              <GraduationCap className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Select an enrolled student to view and download their performance report.</p>
            </div>
          ) : (
            /* Printable Report Preview Area */
            <div ref={reportRef} className="p-8 bg-slate-950 text-white rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{reportData.student?.full_name}</h2>
                  <p className="text-xs font-mono text-purple-400 mt-0.5">
                    Student ID: {reportData.student?.student_id} • Class: {reportData.student?.classes?.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 block">ExamPilot AI Report</span>
                  <span className="text-xs text-slate-500">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-bold">Quiz Average</span>
                  <p className="text-2xl font-black text-purple-400 mt-1">{reportData.analyticsSummary?.averageQuizPercentage}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-bold">Quizzes Taken</span>
                  <p className="text-2xl font-black text-blue-400 mt-1">{reportData.analyticsSummary?.totalQuizzesTaken}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-bold">Weak Topics</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">{reportData.analyticsSummary?.flaggedWeakTopicsCount}</p>
                </div>
              </div>

              {/* AI Prediction Summary */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-400" /> AI Performance Prediction:
                </h4>
                <p className="text-sm font-semibold text-purple-200">{reportData.analyticsSummary?.predictionSummary}</p>
              </div>

              {/* Weak Topics List */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Identified Weak Topics:
                </h4>
                {reportData.weakTopics?.length === 0 ? (
                  <p className="text-xs text-slate-400">No weak topics flagged.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {reportData.weakTopics.map((wt, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                        {wt.topic} ({wt.accuracy}%)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
