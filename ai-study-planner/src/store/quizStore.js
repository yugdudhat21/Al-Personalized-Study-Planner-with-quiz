import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export const useQuizStore = create((set, get) => ({
  assignedQuizzes: [],
  activeQuiz: null,
  activeQuestions: [],
  quizResults: [],
  studentWeakTopics: [],
  loading: false,
  submitting: false,

  fetchStudentQuizzes: async (classId) => {
    set({ loading: true });
    try {
      let query = supabase.from('quizzes').select('*, classes(name), questions(count)').eq('published', true);
      if (classId) {
        query = query.eq('class_id', classId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      set({ assignedQuizzes: data || [] });
    } catch (err) {
      console.error('Fetch student quizzes error:', err);
    } finally {
      set({ loading: false });
    }
  },

  loadQuizDetails: async (quizId) => {
    set({ loading: true });
    try {
      const { data: quiz, error: qErr } = await supabase.from('quizzes').select('*').eq('id', quizId).single();
      if (qErr) throw qErr;

      const { data: questions, error: qesErr } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId);

      if (qesErr) throw qesErr;

      set({ activeQuiz: quiz, activeQuestions: questions || [] });
    } catch (err) {
      console.error('Load quiz error:', err);
    } finally {
      set({ loading: false });
    }
  },

  submitStudentQuiz: async ({ quiz_id, student_account_id, answers }) => {
    set({ submitting: true });
    try {
      const res = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id, student_account_id, answers }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit quiz');

      set((state) => ({
        quizResults: [data.result, ...state.quizResults],
        activeQuiz: null,
        activeQuestions: [],
      }));

      return data;
    } finally {
      set({ submitting: false });
    }
  },

  fetchStudentQuizResults: async (studentAccountId) => {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*, quizzes(title, classes(name))')
        .eq('student_account_id', studentAccountId)
        .order('taken_at', { ascending: false });

      if (error) throw error;
      set({ quizResults: data || [] });
    } catch (err) {
      console.error('Fetch student quiz results error:', err);
    }
  },

  fetchStudentWeakTopics: async (studentAccountId) => {
    try {
      const { data, error } = await supabase
        .from('weak_topics')
        .select('*')
        .eq('student_account_id', studentAccountId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ studentWeakTopics: data || [] });
    } catch (err) {
      console.error('Fetch student weak topics error:', err);
    }
  },
}));
