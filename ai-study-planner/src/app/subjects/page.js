'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Clock, Award, Check } from 'lucide-react';
import { useSubjectStore } from '@/store/subjectStore';
import Modal from '@/components/ui/Modal';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';

const PRESET_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#10B981', '#F59E0B', '#14B8A6'];

export default function SubjectsPage() {
  const { subjects, loading, addSubject, updateSubject, deleteSubject, addTestScore } = useSubjectStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Subject Form State
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [targetHours, setTargetHours] = useState(20);
  const [color, setColor] = useState('#3B82F6');

  // Test Score Form State
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [score, setScore] = useState(80);
  const [maxScore, setMaxScore] = useState(100);

  const openAddModal = () => {
    setEditingSubject(null);
    setName('');
    setDifficulty(3);
    setTargetHours(20);
    setColor('#3B82F6');
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setName(subject.name);
    setDifficulty(subject.difficulty || 3);
    setTargetHours(subject.target_hours || 20);
    setColor(subject.color || '#3B82F6');
    setIsModalOpen(true);
  };

  const openScoreModal = (subjectId = '') => {
    setSelectedSubjectId(subjectId || (subjects[0]?.id || ''));
    setScore(80);
    setMaxScore(100);
    setIsScoreModalOpen(true);
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, { name, difficulty, target_hours: targetHours, color });
        toast.success('Subject updated!');
      } else {
        await addSubject({ name, difficulty, target_hours: targetHours, color });
        toast.success('Subject created!');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error saving subject');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        await deleteSubject(id);
        toast.success('Subject deleted!');
      } catch (err) {
        toast.error(err.message || 'Failed to delete');
      }
    }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubjectId) return;

    try {
      await addTestScore({
        subject_id: selectedSubjectId,
        score: Number(score),
        max_score: Number(maxScore),
      });
      toast.success('Test score recorded!');
      setIsScoreModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to record score');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-500" /> Subject Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Define target study hours, difficulty ratings, and record mock assessment scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openScoreModal()}
            className="px-4 py-2.5 rounded-xl glass-card text-gray-800 dark:text-white font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition"
          >
            <Award className="w-4 h-4 text-amber-500" /> Log Test Score
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg glow-primary flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      {loading ? (
        <LoadingSkeleton count={3} height="h-40" />
      ) : subjects.length === 0 ? (
        <EmptyState
          title="No Subjects Added"
          description="Create your subjects to calculate personalized AI study schedules and exam countdowns."
          actionButton={
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-500 transition"
            >
              Add First Subject
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="p-6 glass-card glass-card-hover rounded-3xl border border-gray-200/20 dark:border-gray-800 relative flex flex-col justify-between"
            >
              <div>
                {/* Header with color pill and action buttons */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: sub.color || '#3B82F6' }} />
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">{sub.name}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(sub)}
                      className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/40">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Target Hours
                    </span>
                    <span className="text-base font-bold text-gray-900 dark:text-white mt-0.5 block">
                      {sub.target_hours || 0} hrs
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/40">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Difficulty Level
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full ${
                            i < sub.difficulty
                              ? 'bg-blue-500 shadow-sm'
                              : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold ml-1 text-gray-600 dark:text-gray-300">
                        {sub.difficulty}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Button */}
              <button
                onClick={() => openScoreModal(sub.id)}
                className="w-full py-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-amber-500/10 text-gray-700 dark:text-gray-300 hover:text-amber-500 border border-gray-200/20 dark:border-gray-800 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <Award className="w-4 h-4 text-amber-500" /> Log Score
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
      >
        <form onSubmit={handleSubjectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Advanced Calculus"
              className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Difficulty Rating (1 = Easy, 5 = Very Hard): {difficulty}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Target Hours
            </label>
            <input
              type="number"
              min="1"
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Theme Color
            </label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition transform hover:scale-110 shadow"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-500 transition"
            >
              Save Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Test Score Modal */}
      <Modal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        title="Log Test / Quiz Score"
      >
        <form onSubmit={handleScoreSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Select Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Your Score
              </label>
              <input
                type="number"
                required
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Max Score
              </label>
              <input
                type="number"
                required
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-200/20 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsScoreModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-md hover:bg-amber-400 transition"
            >
              Record Score
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
