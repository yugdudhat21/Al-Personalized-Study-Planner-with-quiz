import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export const useTeacherStore = create((set, get) => ({
  classes: [],
  students: [],
  quizzes: [],
  assignments: [],
  weakTopics: [],
  loading: false,

  fetchClasses: async (teacherId) => {
    set({ loading: true });
    try {
      let query = supabase.from('classes').select('*, student_accounts(count)');
      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      set({ classes: data || [] });
    } catch (err) {
      console.error('Fetch classes error:', err);
    } finally {
      set({ loading: false });
    }
  },

  createClass: async ({ name, subject, teacherId }) => {
    const classCode = `${subject.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const { data, error } = await supabase
      .from('classes')
      .insert([{
        name,
        subject,
        teacher_id: teacherId || null,
        class_code: classCode,
      }])
      .select()
      .single();

    if (error) throw error;
    set((state) => ({ classes: [data, ...state.classes] }));
    return data;
  },

  updateClass: async ({ id, name, subject }) => {
    const { data, error } = await supabase
      .from('classes')
      .update({ name, subject })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    set((state) => ({
      classes: state.classes.map((c) => (c.id === id ? { ...c, name: data.name, subject: data.subject } : c)),
    }));
    return data;
  },

  deleteClass: async (classId) => {
    const { error } = await supabase.from('classes').delete().eq('id', classId);
    if (error) throw error;
    set((state) => ({ classes: state.classes.filter((c) => c.id !== classId) }));
  },

  fetchStudentsByClass: async (classId) => {
    try {
      const { data, error } = await supabase
        .from('student_accounts')
        .select('*, classes(name)')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ students: data || [] });
      return data || [];
    } catch (err) {
      console.error('Fetch students error:', err);
      return [];
    }
  },

  createStudentInClass: async ({ class_id, full_name }) => {
    const res = await fetch('/api/create-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id, full_name }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create student');

    set((state) => ({ students: [data.student, ...state.students] }));
    return data;
  },

  fetchQuizzes: async (teacherId) => {
    try {
      let query = supabase.from('quizzes').select('*, classes(name), questions(count), quiz_results(count)');
      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      set({ quizzes: data || [] });
    } catch (err) {
      console.error('Fetch quizzes error:', err);
    }
  },

  togglePublishQuiz: async (quizId, published) => {
    const res = await fetch('/api/publish-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quiz_id: quizId, published }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update publish state');

    set((state) => ({
      quizzes: state.quizzes.map((q) => (q.id === quizId ? { ...q, published: data.quiz.published } : q)),
    }));
  },

  deleteQuiz: async (quizId) => {
    try {
      // Delete questions & quiz results associated with this quiz
      await supabase.from('questions').delete().eq('quiz_id', quizId);
      await supabase.from('quiz_results').delete().eq('quiz_id', quizId);

      const { error } = await supabase.from('quizzes').delete().eq('id', quizId);
      if (error) throw error;

      set((state) => ({
        quizzes: state.quizzes.filter((q) => q.id !== quizId),
      }));
    } catch (err) {
      console.error('Delete quiz error:', err);
      throw err;
    }
  },

  fetchAssignments: async (classId) => {
    try {
      let query = supabase.from('assignments').select('*, classes(name)');
      if (classId) {
        query = query.eq('class_id', classId);
      }
      const { data, error } = await query.order('due_date', { ascending: true });

      if (error) throw error;
      set({ assignments: data || [] });
    } catch (err) {
      console.error('Fetch assignments error:', err);
    }
  },

  createAssignment: async ({ class_id, teacher_id, title, description, due_date, file_url }) => {
    const { data, error } = await supabase
      .from('assignments')
      .insert([{
        class_id,
        teacher_id,
        title,
        description,
        due_date,
        file_url,
      }])
      .select('*, classes(name)')
      .single();

    if (error) throw error;
    set((state) => ({ assignments: [...state.assignments, data] }));
    return data;
  },

  fetchClassWeakTopics: async () => {
    try {
      const { data, error } = await supabase
        .from('weak_topics')
        .select('*, student_accounts(full_name, student_id, classes(name))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ weakTopics: data || [] });
    } catch (err) {
      console.error('Fetch class weak topics error:', err);
    }
  },
}));
