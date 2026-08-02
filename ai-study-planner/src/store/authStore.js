import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  profile: null,
  studentAccount: null,
  role: 'teacher', // Default to teacher for email/pass auth
  loading: true,

  initialize: async () => {
    try {
      set({ loading: true });

      // Check if student session exists in localStorage
      if (typeof window !== 'undefined') {
        const storedStudent = localStorage.getItem('student_session');
        if (storedStudent) {
          const parsed = JSON.parse(storedStudent);
          set({
            studentAccount: parsed,
            role: 'student',
            loading: false,
          });
          return;
        }
      }

      // Supabase Auth Check (Teachers / Admins)
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ session, user: session.user });
        await get().fetchProfile(session.user.id);
      } else {
        set({ user: null, session: null, profile: null });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ loading: false });
    }

    // Listen to Auth State Changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        set({ session, user: session.user });
        await get().fetchProfile(session.user.id);
      } else if (!get().studentAccount) {
        set({ user: null, session: null, profile: null, role: 'teacher' });
      }
      set({ loading: false });
    });
  },

  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        set({ profile: data, role: data.role || 'teacher' });
        return data;
      } else {
        // Fallback: create/upsert teacher profile if missing
        const defaultProfile = { id: userId, role: 'teacher' };
        await supabase.from('profiles').upsert(defaultProfile);
        set({ profile: defaultProfile, role: 'teacher' });
        return defaultProfile;
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    }
  },

  signIn: async (email, password) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('student_session');
    }
    set({ studentAccount: null });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data?.user) {
      const prof = await get().fetchProfile(data.user.id);
      set({ role: prof?.role || 'teacher' });
    }
    return data;
  },

  studentSignIn: async (studentId, password) => {
    const res = await fetch('/api/student-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Student login failed');
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('student_session', JSON.stringify(data.student));
    }

    set({
      studentAccount: data.student,
      role: 'student',
      user: { id: data.student.id, email: `${data.student.student_id}@student.local` },
      profile: { full_name: data.student.full_name, role: 'student' },
    });

    return data.student;
  },

  signUp: async (email, password, fullName, role = 'teacher') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });
    if (error) throw error;

    if (data?.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        role: role,
      });
      set({ role });
    }

    return data;
  },

  signOut: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('student_session');
    }

    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }

    set({ user: null, session: null, profile: null, studentAccount: null, role: 'teacher' });

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
}));
