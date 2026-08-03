import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { generateFallbackPlan } from '@/utils/fallbackPlanner';
import { useAuthStore } from './authStore';

// Helper to get a valid profiles.id (satisfies foreign key constraints for study_plans & study_sessions)
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

export const usePlannerStore = create((set, get) => ({
  sessions: [],
  studyPlans: [],
  loading: false,
  generating: false,
  generationSource: 'gemini',

  fetchSessions: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*, subjects(name, color)')
        .order('start_time', { ascending: true, nullsFirst: false });

      if (error) throw error;
      set({ sessions: data || [] });
    } catch (err) {
      console.error('Fetch study sessions error:', err);
    } finally {
      set({ loading: false });
    }
  },

  generatePlan: async ({ startDate, daysCount, availableHoursPerDay, subjects, exams, testScores }) => {
    set({ generating: true });

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate,
          daysCount,
          availableHoursPerDay,
          subjects,
          exams,
          testScores,
        }),
      });

      const result = await response.json();

      if (response.ok && result.sessions && result.sessions.length > 0) {
        set({ generationSource: result.generated_by || 'gemini' });
        return result.sessions;
      } else {
        console.warn('AI API unavailable or failed. Using Fallback Planner algorithm.');
        const fallback = generateFallbackPlan({
          subjects,
          exams,
          testScores,
          startDate,
          daysCount,
          availableHoursPerDay,
        });
        set({ generationSource: 'fallback' });
        return fallback.sessions;
      }
    } catch (error) {
      console.error('Generation error, using fallback:', error);
      const fallback = generateFallbackPlan({
        subjects,
        exams,
        testScores,
        startDate,
        daysCount,
        availableHoursPerDay,
      });
      set({ generationSource: 'fallback' });
      return fallback.sessions;
    } finally {
      set({ generating: false });
    }
  },

  saveGeneratedPlan: async (generatedSessions, planDate = new Date().toISOString()) => {
    const userId = await getActiveProfileUserId();

    // 1. Create study plan record
    const { data: planData, error: planError } = await supabase
      .from('study_plans')
      .insert([{
        user_id: userId,
        plan_date: planDate,
        generated_by: get().generationSource,
      }])
      .select()
      .single();

    if (planError) throw planError;

    // 2. Prepare sessions payload
    const sessionPayloads = generatedSessions.map((s) => ({
      user_id: userId,
      subject_id: s.subject_id || null,
      plan_id: planData.id,
      topic: s.topic || s.subject || 'Study Session',
      planned_minutes: s.planned_minutes || 45,
      actual_minutes: s.actual_minutes || 0,
      priority: s.priority || 3,
      completed: s.completed || false,
      start_time: s.date ? new Date(s.date).toISOString() : new Date().toISOString(),
    }));

    // 3. Batch insert sessions
    const { data: insertedSessions, error: sessionError } = await supabase
      .from('study_sessions')
      .insert(sessionPayloads)
      .select('*, subjects(name, color)');

    if (sessionError) throw sessionError;

    set((state) => ({
      sessions: [...(insertedSessions || []), ...state.sessions],
    }));

    return insertedSessions;
  },

  toggleSessionComplete: async (sessionId, completed, actualMinutes = 0) => {
    const session = get().sessions.find((s) => s.id === sessionId);
    const minutesToSave = actualMinutes || (completed ? (session?.planned_minutes || 45) : 0);

    const { data, error } = await supabase
      .from('study_sessions')
      .update({
        completed,
        actual_minutes: minutesToSave,
        end_time: completed ? new Date().toISOString() : null,
      })
      .eq('id', sessionId)
      .select('*, subjects(name, color)')
      .single();

    if (error) throw error;

    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === sessionId ? data : s)),
    }));

    return data;
  },

  deleteSession: async (sessionId) => {
    const { error } = await supabase.from('study_sessions').delete().eq('id', sessionId);
    if (error) throw error;

    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
    }));
  },
}));
