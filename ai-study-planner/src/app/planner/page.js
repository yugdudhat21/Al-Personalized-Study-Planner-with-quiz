'use client';

import { useState } from 'react';
import { Sparkles, Calendar, Clock, RefreshCw, Save, CheckCircle2, Trash2, Cpu, Zap, ArrowUp, ArrowDown } from 'lucide-react';
import { useSubjectStore } from '@/store/subjectStore';
import { usePlannerStore } from '@/store/plannerStore';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function PlannerPage() {
  const { subjects, exams, testScores } = useSubjectStore();
  const {
    sessions,
    generating,
    generationSource,
    generatePlan,
    saveGeneratedPlan,
    toggleSessionComplete,
    deleteSession,
  } = usePlannerStore();

  // Generator Controls State
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [daysCount, setDaysCount] = useState(7);
  const [availableHoursPerDay, setAvailableHoursPerDay] = useState(4);
  const [draftPlan, setDraftPlan] = useState(null);

  const handleGenerate = async () => {
    if (subjects.length === 0) {
      toast.error('Please add at least one subject before generating a plan.');
      return;
    }

    try {
      const generatedSessions = await generatePlan({
        startDate,
        daysCount,
        availableHoursPerDay,
        subjects,
        exams,
        testScores,
      });

      setDraftPlan(generatedSessions);
      toast.success('Study plan generated successfully!');
    } catch (err) {
      toast.error(err.message || 'Plan generation failed');
    }
  };

  const handleSavePlan = async () => {
    if (!draftPlan || draftPlan.length === 0) return;

    try {
      await saveGeneratedPlan(draftPlan, startDate);
      toast.success('Generated plan saved to database!');
      setDraftPlan(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save plan');
    }
  };

  const moveSession = (index, direction) => {
    if (!draftPlan) return;
    const newDraft = [...draftPlan];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newDraft.length) return;

    const temp = newDraft[index];
    newDraft[index] = newDraft[targetIndex];
    newDraft[targetIndex] = temp;
    setDraftPlan(newDraft);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-purple-500" /> AI Study Schedule Generator
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Uses Ollama local AI model (`qwen2.5:7b`) with automatic fallback to prioritize exams, weak subjects, and 50m study/10m break cycles.
          </p>
        </div>
      </div>

      {/* Control Panel Card */}
      <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Plan Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-500" /> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" /> Schedule Duration (Days): {daysCount}
            </label>
            <select
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value={3}>3 Days (Crash Course)</option>
              <option value={7}>7 Days (Standard Week)</option>
              <option value={14}>14 Days (Two Weeks)</option>
              <option value={30}>30 Days (Full Month)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-500" /> Available Hours / Day: {availableHoursPerDay} hrs
            </label>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={availableHoursPerDay}
              onChange={(e) => setAvailableHoursPerDay(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 mt-3"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl glow-primary flex items-center gap-2.5 transition disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" /> Generating AI Schedule...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate AI Plan
              </>
            )}
          </button>

          {draftPlan && draftPlan.length > 0 && (
            <button
              onClick={handleSavePlan}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition"
            >
              <Save className="w-5 h-5" /> Save Plan to Schedule
            </button>
          )}
        </div>
      </div>

      {/* Draft Generated Schedule Preview */}
      {draftPlan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Generated AI Draft Schedule</h3>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-semibold text-xs flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Engine: {generationSource === 'ollama' ? 'Ollama Local AI (qwen2.5)' : 'Fallback Algorithm'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {draftPlan.map((session, index) => (
              <div
                key={index}
                className={`p-4 glass-card rounded-2xl flex items-center justify-between border ${
                  session.is_break
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-gray-200/20 dark:border-gray-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-400 w-16">{session.date}</span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{session.topic || session.subject}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {session.subject} • {session.planned_minutes} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSession(index, -1)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-white rounded disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSession(index, 1)}
                    disabled={index === draftPlan.length - 1}
                    className="p-1 text-gray-400 hover:text-white rounded disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Active Study Sessions */}
      <div className="space-y-4 pt-4 border-t border-gray-200/20 dark:border-gray-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Saved Schedule</h3>

        {sessions.length === 0 ? (
          <EmptyState
            title="No Saved Study Sessions"
            description="Use the generator above to create and save your personalized study schedule."
          />
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`p-4 glass-card rounded-2xl flex items-center justify-between border transition ${
                  s.completed ? 'border-emerald-500/30 bg-emerald-500/5 opacity-80' : 'border-gray-200/20 dark:border-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSessionComplete(s.id, !s.completed)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                      s.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-400 hover:border-blue-500'
                    }`}
                  >
                    {s.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: s.subjects?.color || '#3B82F6' }}
                      />
                      <h4 className={`font-semibold text-sm ${s.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {s.topic || s.subjects?.name || 'Study Block'}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {s.subjects?.name || 'Subject'} • {s.planned_minutes} mins planned
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteSession(s.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
