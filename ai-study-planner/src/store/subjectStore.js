import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

// Helper to get a valid profiles.id (satisfies foreign key constraints for subjects, exams, test_scores, study_plans)
async function getActiveProfileUserId() {
  const authState = useAuthStore.getState();

  // 1. Check if teacher / auth user session exists
  if (authState.session?.user?.id) {
    return authState.session.user.id;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id) return user.id;

  // 2. If student is logged in, use teacher_id from student's class
  if (authState.studentAccount) {
    if (authState.studentAccount.user_id) {
      return authState.studentAccount.user_id;
    }
    if (authState.studentAccount.class_id) {
      const { data: cls } = await supabase
        .from('classes')
        .select('teacher_id')
        .eq('id', authState.studentAccount.class_id)
        .maybeSingle();
      if (cls?.teacher_id) return cls.teacher_id;
    }
  }

  // 3. Fallback: get first available profile ID in DB
  const { data: firstProfile } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (firstProfile?.id) {
    return firstProfile.id;
  }

  throw new Error('User not authenticated');
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
    const userId = await getActiveProfileUserId();

    const { data, error } = await supabase
      .from('subjects')
      .insert([{ ...subjectData, user_id: userId }])
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
    const userId = await getActiveProfileUserId();

    const { data, error } = await supabase
      .from('exams')
      .insert([{ ...examData, user_id: userId }])
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
    const userId = await getActiveProfileUserId();

    const { data, error } = await supabase
      .from('test_scores')
      .insert([{ ...scoreData, user_id: userId }])
      .select('*, subjects(name, color)')
      .single();

    if (error) throw error;
    set((state) => ({ testScores: [...state.testScores, data] }));
    return data;
  },
}));
