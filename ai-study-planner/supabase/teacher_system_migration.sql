-- ========================================================
-- TEACHER MANAGEMENT SYSTEM & STUDENT ID PORTAL MIGRATION
-- ========================================================

-- 1. Add role column to profiles if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student' CHECK (role IN ('teacher', 'student', 'admin'));
  END IF;
END $$;

-- 2. CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STUDENT ACCOUNTS TABLE (For Student ID + Password Login)
CREATE TABLE IF NOT EXISTS public.student_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL, -- e.g. STU-1001
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  published BOOLEAN DEFAULT FALSE,
  time_limit INT DEFAULT 15, -- in minutes
  total_marks INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- ["Option A", "Option B", "Option C", "Option D"]
  correct_option INT NOT NULL CHECK (correct_option BETWEEN 0 AND 3),
  topic TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. QUIZ RESULTS TABLE
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

-- 7. WEAK TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.weak_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_account_id UUID REFERENCES public.student_accounts(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  accuracy NUMERIC NOT NULL DEFAULT 0,
  needs_remediation BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ASSIGNMENTS TABLE
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

-- RPC FUNCTION FOR STUDENT CREATION
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

-- RLS POLICIES & PERMISSIONS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weak_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all classes" ON public.classes FOR ALL USING (true);
CREATE POLICY "Allow all student_accounts" ON public.student_accounts FOR ALL USING (true);
CREATE POLICY "Allow all quizzes" ON public.quizzes FOR ALL USING (true);
CREATE POLICY "Allow all questions" ON public.questions FOR ALL USING (true);
CREATE POLICY "Allow all quiz_results" ON public.quiz_results FOR ALL USING (true);
CREATE POLICY "Allow all weak_topics" ON public.weak_topics FOR ALL USING (true);
CREATE POLICY "Allow all assignments" ON public.assignments FOR ALL USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_results;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quizzes;
