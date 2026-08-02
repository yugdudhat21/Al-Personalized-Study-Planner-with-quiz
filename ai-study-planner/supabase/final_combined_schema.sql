-- ====================================================================
-- EXAMPILOT AI - MASTER COMBINED DATABASE SCHEMA
-- Contains Student Study Planner + Teacher Management System (No Attendance)
-- Project Ref: snuuvpsxjzjrugdcqnzm
-- ====================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (With Role Column)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'teacher' CHECK (role IN ('teacher', 'student', 'admin')),
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

-- 7. CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STUDENT ACCOUNTS TABLE (Student ID + Password Authentication)
CREATE TABLE IF NOT EXISTS public.student_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL, -- e.g. STU-1001
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  published BOOLEAN DEFAULT FALSE,
  time_limit INT DEFAULT 15,
  total_marks INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INT NOT NULL CHECK (correct_option BETWEEN 0 AND 3),
  topic TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. QUIZ RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_account_id UUID REFERENCES public.student_accounts(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  percentage NUMERIC NOT NULL DEFAULT 0,
  weak_topics JSONB DEFAULT '[]'::jsonb,
  taken_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. WEAK TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.weak_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_account_id UUID REFERENCES public.student_accounts(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  accuracy NUMERIC NOT NULL DEFAULT 0,
  needs_remediation BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- PL/PGSQL RPC FUNCTIONS & TRIGGERS
-- ====================================================================

-- RPC Function: create_student_account
CREATE OR REPLACE FUNCTION public.create_student_account(
  p_class_id UUID,
  p_student_id TEXT,
  p_password TEXT,
  p_full_name TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_new_id UUID;
BEGIN
  INSERT INTO public.student_accounts (class_id, student_id, password, full_name)
  VALUES (p_class_id, UPPER(TRIM(p_student_id)), p_password, p_full_name)
  RETURNING id INTO v_new_id;

  SELECT jsonb_build_object(
    'id', v_new_id,
    'student_id', UPPER(TRIM(p_student_id)),
    'password', p_password,
    'full_name', p_full_name,
    'class_id', p_class_id
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Function: Auto-create Profile on Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email), COALESCE(new.raw_user_meta_data->>'role', 'teacher'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weak_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow subjects" ON public.subjects;
DROP POLICY IF EXISTS "Allow exams" ON public.exams;
DROP POLICY IF EXISTS "Allow study_plans" ON public.study_plans;
DROP POLICY IF EXISTS "Allow study_sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Allow test_scores" ON public.test_scores;
DROP POLICY IF EXISTS "Allow classes" ON public.classes;
DROP POLICY IF EXISTS "Allow student_accounts" ON public.student_accounts;
DROP POLICY IF EXISTS "Allow quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Allow questions" ON public.questions;
DROP POLICY IF EXISTS "Allow quiz_results" ON public.quiz_results;
DROP POLICY IF EXISTS "Allow weak_topics" ON public.weak_topics;
DROP POLICY IF EXISTS "Allow assignments" ON public.assignments;

CREATE POLICY "Allow profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow subjects" ON public.subjects FOR ALL USING (true);
CREATE POLICY "Allow exams" ON public.exams FOR ALL USING (true);
CREATE POLICY "Allow study_plans" ON public.study_plans FOR ALL USING (true);
CREATE POLICY "Allow study_sessions" ON public.study_sessions FOR ALL USING (true);
CREATE POLICY "Allow test_scores" ON public.test_scores FOR ALL USING (true);
CREATE POLICY "Allow classes" ON public.classes FOR ALL USING (true);
CREATE POLICY "Allow student_accounts" ON public.student_accounts FOR ALL USING (true);
CREATE POLICY "Allow quizzes" ON public.quizzes FOR ALL USING (true);
CREATE POLICY "Allow questions" ON public.questions FOR ALL USING (true);
CREATE POLICY "Allow quiz_results" ON public.quiz_results FOR ALL USING (true);
CREATE POLICY "Allow weak_topics" ON public.weak_topics FOR ALL USING (true);
CREATE POLICY "Allow assignments" ON public.assignments FOR ALL USING (true);

-- Enable Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_results;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quizzes;
