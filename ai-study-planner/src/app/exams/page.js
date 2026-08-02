'use client';

import { useState } from 'react';
import { Plus, Trash2, CalendarCheck, Clock, AlertCircle } from 'lucide-react';
import { useSubjectStore } from '@/store/subjectStore';
import Modal from '@/components/ui/Modal';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import toast from 'react-hot-toast';

export default function ExamsPage() {
  const { exams, subjects, addExam, deleteExam } = useSubjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [subjectId, setSubjectId] = useState('');
  const [examDate, setExamDate] = useState('');
  const [weightage, setWeightage] = useState(50);

  const openAddModal = () => {
    if (subjects.length > 0) {
      setSubjectId(subjects[0].id);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    setExamDate(tomorrow.toISOString().split('T')[0]);
    setWeightage(50);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId) {
      toast.error('Please select or create a subject first!');
      return;
    }

    try {
      await addExam({
        subject_id: subjectId,
        exam_date: examDate,
        weightage: Number(weightage),
      });
      toast.success('Exam scheduled!');
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add exam');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this scheduled exam?')) {
      try {
        await deleteExam(id);
        toast.success('Exam deleted');
      } catch (err) {
        toast.error(err.message || 'Failed to delete');
      }
    }
  };

  // Enhance exams with countdown
  const processedExams = exams.map((e) => {
    const daysLeft = differenceInCalendarDays(parseISO(e.exam_date), new Date());
    return { ...e, daysLeft };
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <CalendarCheck className="w-7 h-7 text-indigo-500" /> Exam Schedule
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep track of upcoming midterms, finals, and weightage to prioritize study sessions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg glow-accent flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Add Exam
        </button>
      </div>

      {/* Grid of Exams */}
      {processedExams.length === 0 ? (
        <EmptyState
          title="No Exams Scheduled"
          description="Add your upcoming exams to enable AI urgent prioritization in your study plan."
          actionButton={
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md hover:bg-indigo-500 transition"
            >
              Add Exam
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedExams.map((exam) => (
            <div
              key={exam.id}
              className="p-6 glass-card glass-card-hover rounded-3xl border border-gray-200/20 dark:border-gray-800 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: exam.subjects?.color || '#6366F1' }}
                    />
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                      {exam.subjects?.name || 'Subject Exam'}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Countdown Badge */}
                <div className="my-4">
                  <div
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      exam.daysLeft < 0
                        ? 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                        : exam.daysLeft <= 3
                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                        : exam.daysLeft <= 7
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Countdown</span>
                    </div>

                    <span className="text-lg font-extrabold">
                      {exam.daysLeft < 0
                        ? 'Passed'
                        : exam.daysLeft === 0
                        ? 'Today!'
                        : `In ${exam.daysLeft} days`}
                    </span>
                  </div>
                </div>

                {/* Info row */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200/20 dark:border-gray-800">
                  <span>Exam Date: <strong className="text-gray-800 dark:text-gray-200">{format(parseISO(exam.exam_date), 'MMMM dd, yyyy')}</strong></span>
                  <span>Weightage: <strong className="text-indigo-500">{exam.weightage}%</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Exam Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Exam"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Select Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Exam Date
            </label>
            <input
              type="date"
              required
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Grade Weightage (%): {weightage}%
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={weightage}
              onChange={(e) => setWeightage(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-200/20 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-500 transition"
            >
              Schedule Exam
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
