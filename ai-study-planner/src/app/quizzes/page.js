'use client';

import { useState, useEffect } from 'react';
import { FileQuestion, CheckCircle2, XCircle, AlertTriangle, Award, RefreshCw, Eye, Check } from 'lucide-react';
import { useQuizStore } from '@/store/quizStore';
import { useAuthStore } from '@/store/authStore';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function StudentQuizzesPage() {
  const { studentAccount } = useAuthStore();
  const {
    assignedQuizzes,
    activeQuiz,
    activeQuestions,
    loading,
    submitting,
    fetchStudentQuizzes,
    loadQuizDetails,
    submitStudentQuiz,
    fetchStudentQuizResults,
    quizResults,
  } = useQuizStore();

  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmittedResult, setQuizSubmittedResult] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    if (studentAccount?.class_id) {
      fetchStudentQuizzes(studentAccount.class_id);
    } else {
      fetchStudentQuizzes();
    }
    if (studentAccount?.id) {
      fetchStudentQuizResults(studentAccount.id);
    }
  }, [studentAccount]);

  const handleStartQuiz = async (quizId) => {
    // Check if already taken
    const existingResult = quizResults.find((r) => r.quiz_id === quizId);
    if (existingResult) {
      // Open review mode directly
      handleReviewQuiz(quizId);
      return;
    }

    setSelectedQuizId(quizId);
    setUserAnswers({});
    setQuizSubmittedResult(null);
    setIsReviewMode(false);
    await loadQuizDetails(quizId);
  };

  const handleReviewQuiz = async (quizId) => {
    setSelectedQuizId(quizId);
    setIsReviewMode(true);
    await loadQuizDetails(quizId);
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    if (isReviewMode || quizSubmittedResult) return; // Prevent changing in review mode
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuizId) {
      toast.error('Quiz session missing');
      return;
    }

    try {
      const res = await submitStudentQuiz({
        quiz_id: selectedQuizId,
        student_account_id: studentAccount?.id || null,
        answers: userAnswers,
      });

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(`Quiz Completed! Score: ${res.score}/${res.total_questions} (${res.percentage}%)`);
      setQuizSubmittedResult(res);
      setIsReviewMode(true); // Automatically switch to Review mode after submit!
      if (studentAccount?.id) {
        fetchStudentQuizResults(studentAccount.id);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit quiz');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <FileQuestion className="w-7 h-7 text-purple-500" /> Class Quizzes & Assessments
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Take teacher-assigned quizzes (1 attempt per quiz). Review your answers and correct options after submission!
        </p>
      </div>

      {/* Quizzes List */}
      {loading && !activeQuiz ? (
        <p className="text-sm text-slate-400">Loading assigned quizzes...</p>
      ) : assignedQuizzes.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <FileQuestion className="w-10 h-10 text-purple-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Active Quizzes</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Your teacher has not published any quizzes for your class yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedQuizzes.map((q) => {
            const pastResult = quizResults.find((r) => r.quiz_id === q.id);

            return (
              <div key={q.id} className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 font-extrabold text-xs">
                      {q.classes?.name || 'Assigned Quiz'}
                    </span>
                    {pastResult ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500 font-mono font-bold text-xs">
                        Completed: {pastResult.percentage}%
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-500 font-bold text-xs">
                        1 Attempt Only
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1">{q.title}</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{q.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  {pastResult ? (
                    <button
                      onClick={() => handleReviewQuiz(q.id)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 text-purple-300 font-bold text-xs hover:bg-slate-700 transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Review Question Answers
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartQuiz(q.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md glow-accent flex items-center justify-center gap-2 transition"
                    >
                      Start Quiz Assessment &rarr;
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quiz Modal Player & Reviewer */}
      <Modal
        isOpen={Boolean(selectedQuizId)}
        onClose={() => setSelectedQuizId(null)}
        title={isReviewMode ? `Answer Review: ${activeQuiz?.title || ''}` : activeQuiz?.title || 'Quiz Assessment'}
        maxWidth="max-w-3xl"
      >
        {loading ? (
          <p className="text-center text-xs text-slate-400 py-8">Loading question paper...</p>
        ) : (
          <div className="space-y-6 py-2">
            {/* Top Score Banner when in Review Mode */}
            {isReviewMode && (
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Quiz Attempt Completed</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Below is the detailed breakdown of correct vs wrong answers.</p>
                </div>
                {quizSubmittedResult && (
                  <span className="text-xl font-black text-emerald-400 font-mono">{quizSubmittedResult.percentage}% Score</span>
                )}
              </div>
            )}

            {/* Questions List */}
            {activeQuestions.map((q, qIndex) => {
              const studentAnswerIdx = userAnswers[q.id];
              const isCorrectAnswer = Number(studentAnswerIdx) === q.correct_option;

              return (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-white">
                      Q{qIndex + 1}. {q.question_text}
                    </h4>

                    {isReviewMode && (
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        isCorrectAnswer ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isCorrectAnswer ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isCorrectAnswer ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {(q.options || []).map((opt, optIdx) => {
                      const isStudentChoice = Number(studentAnswerIdx) === optIdx;
                      const isCorrectChoice = Number(q.correct_option) === optIdx;

                      let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-purple-900/20';

                      if (isReviewMode) {
                        if (isCorrectChoice) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'; // Highlight Correct Option in Green
                        } else if (isStudentChoice && !isCorrectChoice) {
                          btnStyle = 'bg-red-950/60 border-red-500 text-red-200 font-bold'; // Highlight Wrong Choice in Red
                        }
                      } else if (isStudentChoice) {
                        btnStyle = 'bg-purple-600 text-white border-purple-500 font-bold shadow-md';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isReviewMode}
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={`w-full p-3 rounded-xl text-left text-xs font-semibold border transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </span>

                          {isReviewMode && isCorrectChoice && (
                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                              <Check className="w-4 h-4 text-emerald-400" /> Right Answer
                            </span>
                          )}
                          {isReviewMode && isStudentChoice && !isCorrectChoice && (
                            <span className="text-xs text-red-400 font-bold">Your Choice (Wrong)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedQuizId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Close
              </button>

              {!isReviewMode && (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-500 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {submitting ? 'Submitting Answers...' : 'Submit Answers (Final)'}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
