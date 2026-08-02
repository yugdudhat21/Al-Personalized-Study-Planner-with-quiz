'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Timer, Play, Pause, RotateCcw, Coffee, BookOpen, Save } from 'lucide-react';
import { useTimerStore } from '@/store/timerStore';
import { useSubjectStore } from '@/store/subjectStore';
import { usePlannerStore } from '@/store/plannerStore';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function TimerPage() {
  const searchParams = useSearchParams();
  const initialSubjectId = searchParams.get('subjectId') || '';
  const initialTopic = searchParams.get('topic') || '';

  const { subjects } = useSubjectStore();
  const { toggleSessionComplete, saveGeneratedPlan } = usePlannerStore();
  const {
    mode,
    isBreak,
    workMinutes,
    breakMinutes,
    timeLeft,
    isRunning,
    selectedSubjectId,
    selectedTopic,
    elapsedSeconds,
    setMode,
    setSelectedSubject,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimerStore();

  const [customWork, setCustomWork] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);

  useEffect(() => {
    if (initialSubjectId || initialTopic) {
      setSelectedSubject(initialSubjectId, initialTopic);
    }
  }, [initialSubjectId, initialTopic]);

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const totalSeconds = (isBreak ? breakMinutes : workMinutes) * 60;
  const progressPct = Math.min(100, Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  const handleModeChange = (newMode) => {
    if (newMode === 'custom') {
      setMode('custom', customWork, customBreak);
    } else {
      setMode(newMode);
    }
  };

  const handleSaveStudyTime = async () => {
    const actualMinutes = Math.round(elapsedSeconds / 60);
    if (actualMinutes < 1) {
      toast.error('Session too short (< 1 min) to save.');
      return;
    }

    try {
      const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
      const topicName = selectedTopic || (activeSubject ? `Study: ${activeSubject.name}` : 'Pomodoro Session');

      await saveGeneratedPlan([{
        subject_id: selectedSubjectId || null,
        subject: activeSubject ? activeSubject.name : 'Focus Session',
        topic: topicName,
        planned_minutes: workMinutes,
        actual_minutes: actualMinutes,
        completed: true,
        date: new Date().toISOString(),
      }]);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(`Logged ${actualMinutes} minutes of actual study time!`);
      resetTimer();
    } catch (err) {
      toast.error(err.message || 'Failed to log study time');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-3">
          <Timer className="w-8 h-8 text-indigo-500" /> Focus Pomodoro Timer
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Boost focus, prevent burnout, and auto-log actual study time to maintain your streak!
        </p>
      </div>

      {/* Preset Mode Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 glass-card rounded-2xl border border-gray-200/20 dark:border-gray-800 max-w-md mx-auto">
        <button
          onClick={() => handleModeChange('25/5')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
            mode === '25/5'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          25 / 5 Mode
        </button>
        <button
          onClick={() => handleModeChange('50/10')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
            mode === '50/10'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          50 / 10 Mode
        </button>
        <button
          onClick={() => handleModeChange('custom')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
            mode === 'custom'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Custom
        </button>
      </div>

      {/* Custom Inputs */}
      {mode === 'custom' && (
        <div className="flex items-center justify-center gap-4 p-4 glass-card rounded-2xl max-w-md mx-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Work (min)</label>
            <input
              type="number"
              min="1"
              max="120"
              value={customWork}
              onChange={(e) => {
                const v = Number(e.target.value);
                setCustomWork(v);
                setMode('custom', v, customBreak);
              }}
              className="w-24 px-3 py-2 rounded-xl glass-card text-center font-bold text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Break (min)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={customBreak}
              onChange={(e) => {
                const v = Number(e.target.value);
                setCustomBreak(v);
                setMode('custom', customWork, v);
              }}
              className="w-24 px-3 py-2 rounded-xl glass-card text-center font-bold text-sm"
            />
          </div>
        </div>
      )}

      {/* Subject & Topic Selectors */}
      <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-500" /> Subject Focus
          </label>
          <select
            value={selectedSubjectId || ''}
            onChange={(e) => setSelectedSubject(e.target.value, selectedTopic)}
            className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">-- General Study Session --</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Topic Description
          </label>
          <input
            type="text"
            value={selectedTopic || ''}
            onChange={(e) => setSelectedSubject(selectedSubjectId, e.target.value)}
            placeholder="e.g. Chapter 4 Exercises & Theorems"
            className="w-full px-4 py-3 rounded-xl glass-card bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Main Timer Display Dial */}
      <div className="p-8 md:p-12 glass-card rounded-3xl border border-indigo-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-xs uppercase tracking-wider">
          {isBreak ? (
            <>
              <Coffee className="w-4 h-4" /> Break Time ({breakMinutes}m)
            </>
          ) : (
            <>
              <Timer className="w-4 h-4" /> Deep Focus Work ({workMinutes}m)
            </>
          )}
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center my-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-gray-200 dark:stroke-gray-800"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className={`transition-all duration-1000 ${
                isBreak ? 'stroke-amber-500' : 'stroke-blue-600 dark:stroke-indigo-500'
              }`}
              strokeWidth="10"
              strokeDasharray="283%"
              strokeDashoffset={`${283 - (283 * progressPct) / 100}%`}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs text-gray-400 font-medium mt-2">
              Elapsed: {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-4 mt-4">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl glow-primary flex items-center gap-3 transition transform hover:scale-105"
            >
              <Play className="w-6 h-6 fill-white" /> Start Focus
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base shadow-xl flex items-center gap-3 transition transform hover:scale-105"
            >
              <Pause className="w-6 h-6 fill-slate-950" /> Pause
            </button>
          )}

          <button
            onClick={resetTimer}
            className="p-4 rounded-2xl glass-card text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Save Actual Minutes Button */}
        {elapsedSeconds > 30 && (
          <button
            onClick={handleSaveStudyTime}
            className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" /> Save {Math.round(elapsedSeconds / 60)} mins to Dashboard & Streak
          </button>
        )}
      </div>
    </div>
  );
}
