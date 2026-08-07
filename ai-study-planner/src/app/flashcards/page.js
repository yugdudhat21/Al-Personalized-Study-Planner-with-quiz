'use client';

import { useState } from 'react';
import {
  Layers,
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  HelpCircle,
  Brain,
  Shuffle,
  BookOpen,
  PlusCircle,
  Loader2,
  BookmarkCheck,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

const PRESET_DECKS = [
  {
    title: 'Physics Mechanics & Newton Laws',
    topic: 'Newton Laws of Motion & Kinematics',
  },
  {
    title: 'Organic Chemistry Key Reactions',
    topic: 'Organic Chemistry Reactions & Reagents',
  },
  {
    title: 'Data Structures & Algorithms',
    topic: 'Big O Notation, Trees, Graphs, Sorting',
  },
  {
    title: 'World History & Major Revolutions',
    topic: 'Industrial & French Revolutions History',
  },
];

export default function FlashcardsPage() {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([
    {
      id: 'demo-1',
      front: 'What is Newton’s Second Law of Motion?',
      back: 'The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. (F = m × a)',
      category: 'Physics',
      difficulty: 'Easy',
    },
    {
      id: 'demo-2',
      front: 'What is the difference between Synchronous and Asynchronous execution?',
      back: 'Synchronous execution blocks code until the current task finishes. Asynchronous execution allows other tasks to run concurrently while waiting for operations (like network fetch) to resolve.',
      category: 'Computer Science',
      difficulty: 'Medium',
    },
    {
      id: 'demo-3',
      front: 'Define Photosynthesis and write its core formula.',
      back: 'Photosynthesis is the process by which green plants convert light energy into chemical energy: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂.',
      category: 'Biology',
      difficulty: 'Medium',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState(new Set());

  const currentCard = cards[currentIndex] || null;

  const handleGenerate = async (e, customTopic = null) => {
    if (e) e.preventDefault();
    const queryTopic = customTopic || topic;

    if (!queryTopic.trim() && !notes.trim()) {
      toast.error('Please enter a topic or paste study notes.');
      return;
    }

    setLoading(true);
    setIsFlipped(false);

    try {
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: queryTopic,
          notes,
          count: 6,
        }),
      });

      const data = await res.json();

      if (data.success && data.cards && data.cards.length > 0) {
        setCards(data.cards);
        setCurrentIndex(0);
        setMasteredIds(new Set());
        toast.success(`Generated ${data.cards.length} AI flashcards!`);
      } else {
        toast.error(data.error || 'Failed to generate flashcards.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error generating flashcards. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    toast.success('Deck shuffled!');
  };

  const toggleMastered = (id) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const progressPercent = cards.length
    ? Math.round((masteredIds.size / cards.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg glow-primary text-white">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                AI Flashcard Generator
              </h1>
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                <Sparkles className="w-3 h-3" /> Smart Revision
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Master complex topics with AI-generated interactive 3D revision cards.
            </p>
          </div>
        </div>

        {/* Progress pill */}
        {cards.length > 0 && (
          <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Mastery Progress</p>
              <p className="text-sm font-bold text-white">
                {masteredIds.size} / {cards.length} cards ({progressPercent}%)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Left Controls, Right Flashcard Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Create Flashcard Deck
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Subject or Topic Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic Chemistry Reactions, Quantum Mechanics"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a2333] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Or Paste Study Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste paragraph or notes text to convert into cards..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a2333] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating Cards...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate AI Flashcards
                  </>
                )}
              </button>
            </form>

            {/* Presets */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                Quick Sample Decks
              </p>
              <div className="space-y-2">
                {PRESET_DECKS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTopic(preset.topic);
                      handleGenerate(null, preset.topic);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 font-medium text-xs flex items-center justify-between transition group"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      {preset.title}
                    </span>
                    <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Flashcard Presentation Deck (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentCard ? (
            <div className="space-y-6">
              {/* Card Container with Perspective Flip */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer group relative min-h-[320px] md:min-h-[360px] w-full [perspective:1000px]"
              >
                <div
                  className={`relative w-full h-full min-h-[320px] md:min-h-[360px] rounded-3xl p-8 border transition-all duration-500 [transform-style:preserve-3d] shadow-2xl flex flex-col justify-between ${
                    isFlipped
                      ? '[transform:rotateY(180deg)] bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/90 border-indigo-500/40 text-white'
                      : 'bg-gradient-to-br from-slate-900/90 via-[#111827] to-slate-950/90 border-blue-500/30 text-white hover:border-blue-500/60'
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div
                    className={`absolute inset-0 p-8 flex flex-col justify-between [backface-visibility:hidden] ${
                      isFlipped ? 'hidden' : 'block'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {currentCard.category || 'Concept'}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5 animate-pulse text-blue-400" /> Click to Flip Card
                      </span>
                    </div>

                    <div className="my-auto py-6">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                        Question / Concept:
                      </p>
                      <h3 className="text-xl md:text-2xl font-black text-white leading-relaxed">
                        {currentCard.front}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                      <span>Card {currentIndex + 1} of {cards.length}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {currentCard.difficulty || 'Medium'}
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div
                    className={`absolute inset-0 p-8 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                      isFlipped ? 'block' : 'hidden'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Explanation & Answer
                      </span>
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5 text-emerald-400" /> Click to Flip Back
                      </span>
                    </div>

                    <div className="my-auto py-6">
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                        Answer & Detail:
                      </p>
                      <p className="text-base md:text-lg font-medium text-slate-100 whitespace-pre-line leading-relaxed">
                        {currentCard.back}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-indigo-900/60 pt-4 text-xs text-slate-400">
                      <span>Card {currentIndex + 1} of {cards.length}</span>
                      <span className="text-indigo-300 font-semibold">Tap to flip back</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xl">
                {/* Mastery Button */}
                <button
                  onClick={() => toggleMastered(currentCard.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                    masteredIds.has(currentCard.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {masteredIds.has(currentCard.id) ? 'Mastered!' : 'Mark as Mastered'}
                </button>

                {/* Deck Navigation Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition"
                    title="Previous Card"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">
                    {currentIndex + 1} / {cards.length}
                  </span>

                  <button
                    onClick={handleNext}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition"
                    title="Next Card"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Shuffle */}
                <button
                  onClick={handleShuffle}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-600 hover:text-white text-xs font-bold transition"
                  title="Shuffle Deck"
                >
                  <Shuffle className="w-4 h-4" />
                  Shuffle
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center space-y-4">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Flashcards Loaded</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Enter a subject topic on the left or select a sample preset to generate your interactive deck.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
