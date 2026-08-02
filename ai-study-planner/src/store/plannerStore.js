import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { generateFallbackPlan } from '@/utils/fallbackPlanner';

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

export const usePlannerStore = create((set, get) => ({
  sessions: [],
  studyPlans: [],
  loading: false,
  generating: false,
  generationSource: 'ollama', // 'ollama' or 'fallback'

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
      // 1. Try calling local Ollama API route
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
        set({ generationSource: result.generated_by || 'ollama' });
        return result.sessions;
      } else {
        // Fallback to internal heuristic planner algorithm if API returned fallback / error
        console.warn('Ollama API unavailable or failed. Using Fallback Planner algorithm.');
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    await ensureUserProfile(user);

    // 1. Create study plan record
    const { data: planData, error: planError } = await supabase
      .from('study_plans')
      .insert([{
        user_id: user.id,
        plan_date: planDate,
        generated_by: get().generationSource,
      }])
      .select()
      .single();

    if (planError) throw planError;

    // 2. Prepare sessions payload
    const sessionPayloads = generatedSessions.map((s) => ({
      user_id: user.id,
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
