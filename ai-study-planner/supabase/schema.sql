-- =====================================
-- AI PERSONALIZED STUDY PLANNER SQL SCHEMA
-- =====================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  difficulty INT CHECK (difficulty BETWEEN 1 AND 5) DEFAULT 3,
  target_hours NUMERIC DEFAULT 0,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_date DATE NOT NULL,
  weightage INT DEFAULT 50 CHECK (weightage BETWEEN 1 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDY PLANS TABLE
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_date DATE DEFAULT CURRENT_DATE,
  generated_by TEXT DEFAULT 'ollama',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDY SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.study_plans(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  planned_minutes INT DEFAULT 45,
  actual_minutes INT DEFAULT 0,
  topic TEXT,
  priority INT DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TEST SCORES TABLE
CREATE TABLE IF NOT EXISTS public.test_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL DEFAULT 100,
  taken_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_scores ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Subjects Policies
CREATE POLICY "Users can manage own subjects" ON public.subjects
  FOR ALL USING (auth.uid() = user_id);

-- Exams Policies
CREATE POLICY "Users can manage own exams" ON public.exams
  FOR ALL USING (auth.uid() = user_id);

-- Study Plans Policies
CREATE POLICY "Users can manage own study plans" ON public.study_plans
  FOR ALL USING (auth.uid() = user_id);

-- Study Sessions Policies
CREATE POLICY "Users can manage own study sessions" ON public.study_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Test Scores Policies
CREATE POLICY "Users can manage own test scores" ON public.test_scores
  FOR ALL USING (auth.uid() = user_id);

-- =====================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- =====================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Realtime for study_sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_sessions;
