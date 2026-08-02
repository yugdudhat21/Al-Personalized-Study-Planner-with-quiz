import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

// Helper to ensure profile row exists for current auth user
async function ensureUserProfile(user) {
  if (!user) return;
  try {
    await supabase.from('profiles').upsert(
      { id: user.id, full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student' },
      { onConflict: 'id' }
    );
  } catch (e) {
    console.warn('Profile sync warning:', e);
  }
}

export const useSubjectStore = create((set, get) => ({
  subjects: [],
  exams: [],
  testScores: [],
  loading: false,

  fetchSubjects: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ subjects: data || [] });
    } catch (err) {
      console.error('Fetch subjects error:', err);
    } finally {
      set({ loading: false });
    }
  },

  addSubject: async (subjectData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Ensure user profile row exists in DB
    await ensureUserProfile(user);

    const { data, error } = await supabase
      .from('subjects')
      .insert([{ ...subjectData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    set((state) => ({ subjects: [data, ...state.subjects] }));
    return data;
  },

  updateSubject: async (id, subjectData) => {
    const { data, error } = await supabase
      .from('subjects')
      .update(subjectData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    set((state) => ({
      subjects: state.subjects.map((s) => (s.id === id ? data : s)),
    }));
    return data;
  },

  deleteSubject: async (id) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
    }));
  },

  fetchExams: async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*, subjects(name, color)')
        .order('exam_date', { ascending: true });

      if (error) throw error;
      set({ exams: data || [] });
    } catch (err) {
      console.error('Fetch exams error:', err);
    }
  },

  addExam: async (examData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    await ensureUserProfile(user);

    const { data, error } = await supabase
      .from('exams')
      .insert([{ ...examData, user_id: user.id }])
      .select('*, subjects(name, color)')
      .single();

    if (error) throw error;
    set((state) => ({ exams: [...state.exams, data] }));
    return data;
  },

  deleteExam: async (id) => {
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({ exams: state.exams.filter((e) => e.id !== id) }));
  },

  fetchTestScores: async () => {
    try {
      const { data, error } = await supabase
        .from('test_scores')
        .select('*, subjects(name, color)')
        .order('taken_at', { ascending: true });

      if (error) throw error;
      set({ testScores: data || [] });
    } catch (err) {
      console.error('Fetch test scores error:', err);
    }
  },

  addTestScore: async (scoreData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    await ensureUserProfile(user);

    const { data, error } = await supabase
      .from('test_scores')
      .insert([{ ...scoreData, user_id: user.id }])
      .select('*, subjects(name, color)')
      .single();

    if (error) throw error;
    set((state) => ({ testScores: [...state.testScores, data] }));
    return data;
  },
}));
