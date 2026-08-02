'use client';

import { useState, useEffect } from 'react';
import TeacherLayout from '@/components/layout/TeacherLayout';
import {
  FileQuestion,
  Plus,
  Sparkles,
  Edit3,
  Trash2,
  Send,
  RefreshCw,
  FileText,
  Save,
  Upload,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useTeacherStore } from '@/store/teacherStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function TeacherQuizzesPage() {
  const { user } = useAuthStore();
  const { classes, quizzes, fetchClasses, fetchQuizzes, togglePublishQuiz } = useTeacherStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  // Create Quiz Form State
  const [classId, setClassId] = useState('');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Algebra');
  const [documentContent, setDocumentContent] = useState('');
  const [generateWithAi, setGenerateWithAi] = useState(true);
  const [questionCount, setQuestionCount] = useState(5);
  const [fileName, setFileName] = useState('');
  const [parsingPdf, setParsingPdf] = useState(false);

  // Quiz Editor Modal State
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editingQuestions, setEditingQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [savingQuiz, setSavingQuiz] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchClasses(user.id);
      fetchQuizzes(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (classes.length > 0 && !classId) {
      setClassId(classes[0].id);
    }
  }, [classes]);

  // Robust File Upload Handler (.txt, .md, .pdf text extraction via backend parser)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setParsingPdf(true);
      const toastId = toast.loading(`Extracting clean text from PDF "${file.name}"...`);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to extract text from PDF');

        setDocumentContent(data.text || '');
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
        setDocumentContent(text);
        toast.success(`Loaded text from "${file.name}"!`);
      };
      reader.readAsText(file);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!classId) {
      toast.error('Please create a class in Class & Roster first!');
      return;
    }

    setLoadingAi(true);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: user?.id,
          class_id: classId,
          title,
          topic,
          documentContent,
          generateWithAi,
          questionCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create quiz');

      toast.success(`Quiz "${title}" created successfully!`);
      setIsCreateModalOpen(false);
      setTitle('');
      setDocumentContent('');
      setFileName('');
      fetchQuizzes(user?.id);
    } catch (err) {
      toast.error(err.message || 'Error creating quiz');
    } finally {
      setLoadingAi(false);
    }
  };

  // Open Quiz Editor
  const handleOpenEditor = async (quiz) => {
    setEditingQuiz(quiz);
    setLoadingQuestions(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quiz.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setEditingQuestions(data || []);
    } catch (err) {
      toast.error('Failed to load quiz questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Edit Question Handlers
  const handleQuestionTextChange = (index, val) => {
    const updated = [...editingQuestions];
    updated[index].question_text = val;
    setEditingQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, val) => {
    const updated = [...editingQuestions];
    const opts = [...(updated[qIndex].options || [])];
    opts[optIndex] = val;
    updated[qIndex].options = opts;
    setEditingQuestions(updated);
  };

  const handleCorrectOptionChange = (qIndex, optIndex) => {
    const updated = [...editingQuestions];
    updated[qIndex].correct_option = optIndex;
    setEditingQuestions(updated);
  };

  const handleAddQuestion = () => {
    setEditingQuestions([
      ...editingQuestions,
      {
        id: `new_${Date.now()}`,
        quiz_id: editingQuiz.id,
        question_text: 'New Practice Question?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_option: 0,
        topic: editingQuiz.title || 'General',
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...editingQuestions];
    updated.splice(index, 1);
    setEditingQuestions(updated);
  };

  const handleSaveQuizChanges = async () => {
    if (!editingQuiz) return;
    setSavingQuiz(true);
    try {
      await supabase.from('questions').delete().eq('quiz_id', editingQuiz.id);

      const payload = editingQuestions.map((q) => ({
        quiz_id: editingQuiz.id,
        question_text: q.question_text,
        options: q.options || ['A', 'B', 'C', 'D'],
        correct_option: Number(q.correct_option || 0),
        topic: q.topic || 'General',
      }));

      const { error } = await supabase.from('questions').insert(payload);
      if (error) throw error;

      toast.success('Quiz questions updated successfully!');
      setEditingQuiz(null);
      fetchQuizzes(user?.id);
    } catch (err) {
      toast.error(err.message || 'Failed to save quiz changes');
    } finally {
      setSavingQuiz(false);
    }
  };

  const handleTogglePublish = async (quizId, currentPublished) => {
    try {
      await togglePublishQuiz(quizId, !currentPublished);
      toast.success(currentPublished ? 'Quiz Unpublished' : 'Quiz Published to Class!');
    } catch (err) {
      toast.error(err.message || 'Failed to update publish state');
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <FileQuestion className="w-7 h-7 text-purple-500" /> AI Quiz Generator & Question Editor
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Generate quizzes from topics or uploaded PDF/document notes using local AI (`qwen2.5:7b`), edit questions, and publish to classes.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg glow-accent flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Create Quiz / Upload Doc
          </button>
        </div>

        {/* Quizzes List */}
        {quizzes.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <FileQuestion className="w-10 h-10 text-purple-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Quizzes Created Yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Auto-generate multiple choice quizzes per topic or upload PDF document notes for your classes.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md glow-accent hover:bg-purple-500 transition inline-block"
            >
              Create First Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((q) => (
              <div key={q.id} className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-extrabold text-xs">
                      {q.classes?.name || 'Class Quiz'}
                    </span>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${q.published ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'}`}>
                      {q.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1">{q.title}</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2">{q.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditor(q)}
                    className="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-purple-500/10 hover:text-purple-500 transition flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Quiz
                  </button>

                  <button
                    onClick={() => handleTogglePublish(q.id, q.published)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                      q.published
                        ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                        : 'bg-emerald-600 text-white shadow-md hover:bg-emerald-500'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" /> {q.published ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Quiz Modal with PDF / Document Notes Upload */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Quiz or Upload Document Notes"
        >
          <form onSubmit={handleCreateQuiz} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Class
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {classes.length === 0 ? (
                  <option value="" className="bg-slate-900 text-white">No Classes Found (Create Class First)</option>
                ) : (
                  classes.map((cls) => (
                    <option key={cls.id} value={cls.id} className="bg-slate-900 text-white">
                      {cls.name} ({cls.subject})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Quiz Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midterm Chapter 4 Assessment"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Topic Name
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Linear Algebra & Matrices"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Document Notes Upload Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Upload Document Notes / PDF Text (Optional)
              </label>
              <div className="flex items-center gap-3 mb-2">
                <label className="px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold text-xs hover:bg-purple-500/20 cursor-pointer flex items-center gap-2 transition">
                  {parsingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {parsingPdf ? 'Extracting Text...' : 'Upload File (.txt, .md, .pdf)'}
                  <input type="file" accept=".txt,.md,.pdf" onChange={handleFileUpload} className="hidden" disabled={parsingPdf} />
                </label>
                {fileName && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {fileName}
                  </span>
                )}
              </div>

              <textarea
                rows="4"
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                placeholder="Clean extracted PDF notes text will appear here. Or paste syllabus notes directly for AI quiz generation..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Number of Questions: {questionCount}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loadingAi || parsingPdf}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm shadow-md hover:bg-purple-500 transition flex items-center gap-2 disabled:opacity-50"
              >
                {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loadingAi ? 'Generating Quiz...' : 'Generate & Publish Quiz'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Full Interactive Quiz Editor Modal */}
        <Modal
          isOpen={Boolean(editingQuiz)}
          onClose={() => setEditingQuiz(null)}
          title={`Edit Quiz: ${editingQuiz?.title || ''}`}
          maxWidth="max-w-3xl"
        >
          {loadingQuestions ? (
            <p className="text-center text-xs text-slate-400 py-8">Loading questions for editor...</p>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Total Questions: {editingQuestions.length}</span>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-500 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </div>

              {editingQuestions.map((q, qIndex) => (
                <div key={q.id || qIndex} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-purple-400">Question #{qIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(qIndex)}
                      className="p-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question Text */}
                  <input
                    type="text"
                    value={q.question_text}
                    onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                    placeholder="Question string..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {(q.options || ['A', 'B', 'C', 'D']).map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${qIndex}`}
                          checked={Number(q.correct_option) === optIdx}
                          onChange={() => handleCorrectOptionChange(qIndex, optIdx)}
                          className="w-4 h-4 text-purple-600 accent-purple-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, optIdx, e.target.value)}
                          className={`w-full px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                            Number(q.correct_option) === optIdx
                              ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                              : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingQuiz(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuizChanges}
                  disabled={savingQuiz}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-500 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {savingQuiz ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {savingQuiz ? 'Saving...' : 'Save & Update Quiz'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </TeacherLayout>
  );
}
