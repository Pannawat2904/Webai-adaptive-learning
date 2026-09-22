-- =====================================================
-- Migration: Add IRT 3PL and CAT Schema
-- Description: เพิ่มตารางและคอลัมน์สำหรับรองรับระบบ Item Response Theory (IRT)
-- และ Computerized Adaptive Testing (CAT) ตามเอกสาร DATABASE_SCHEMA.md
-- =====================================================

-- 1. สร้างตาราง Question Domains (D1-D5)
CREATE TABLE IF NOT EXISTS public.question_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- e.g., 'D1', 'D2'
  name TEXT NOT NULL, -- e.g., 'HTML', 'CSS'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. เพิ่มคอลัมน์ IRT ให้กับตาราง questions เดิม
ALTER TABLE public.questions 
  ADD COLUMN IF NOT EXISTS domain_id UUID REFERENCES public.question_domains(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'EXPERT_REVIEW', 'PILOT', 'CALIBRATION', 'CALIBRATED', 'ACTIVE')),
  ADD COLUMN IF NOT EXISTS a_parameter NUMERIC(10,5) DEFAULT 1.00000, -- Discrimination
  ADD COLUMN IF NOT EXISTS b_parameter NUMERIC(10,5) DEFAULT 0.00000, -- Difficulty (Theta scale)
  ADD COLUMN IF NOT EXISTS c_parameter NUMERIC(10,5) DEFAULT 0.25000, -- Guessing
  ADD COLUMN IF NOT EXISTS scale_constant NUMERIC(5,2) DEFAULT 1.70,  -- D = 1.7
  ADD COLUMN IF NOT EXISTS calibration_status TEXT DEFAULT 'DRAFT',
  ADD COLUMN IF NOT EXISTS exposure_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS exposure_rate NUMERIC(5,4) DEFAULT 0.0000;

-- 3. ตาราง IRT Calibrations
CREATE TABLE IF NOT EXISTS public.irt_calibrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  calibration_status TEXT NOT NULL,
  sample_size INT DEFAULT 0,
  parameter_se_a NUMERIC(10,5),
  parameter_se_b NUMERIC(10,5),
  parameter_se_c NUMERIC(10,5),
  calibrated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ตาราง CAT Sessions (แทนที่ test_sessions เดิมสำหรับระบบ CAT โดยเฉพาะ)
CREATE TABLE IF NOT EXISTS public.cat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_id TEXT, -- identifier for the specific assessment
  initial_theta NUMERIC(10,5) DEFAULT 0.00000,
  current_theta NUMERIC(10,5) DEFAULT 0.00000,
  standard_error NUMERIC(10,5) DEFAULT 1.00000,
  estimation_method TEXT DEFAULT 'MLE' CHECK (estimation_method IN ('MLE', 'MAP', 'EAP')),
  items_answered INT DEFAULT 0,
  min_items INT DEFAULT 10,
  max_items INT DEFAULT 30,
  target_standard_error NUMERIC(10,5) DEFAULT 0.30000,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'ABANDONED')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. ตาราง CAT Responses (เก็บประวัติการตอบและค่าสถิติทีละข้อ)
CREATE TABLE IF NOT EXISTS public.cat_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.cat_sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sequence INT NOT NULL,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  theta_before NUMERIC(10,5) NOT NULL,
  theta_after NUMERIC(10,5) NOT NULL,
  item_information NUMERIC(10,5) NOT NULL,
  standard_error_after NUMERIC(10,5) NOT NULL,
  response_time INT DEFAULT 0, -- วินาที
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ตาราง Student Skill Profiles (รูปแบบ IRT)
CREATE TABLE IF NOT EXISTS public.student_skill_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES public.question_domains(id) ON DELETE CASCADE,
  theta NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
  standard_error NUMERIC(10,5) NOT NULL DEFAULT 1.00000,
  information NUMERIC(10,5) DEFAULT 0.00000,
  mastery_level TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN theta >= 1.5 THEN 'Advanced'
      WHEN theta >= 0.5 THEN 'Proficient'
      WHEN theta >= -0.5 THEN 'Developing'
      ELSE 'Needs Improvement'
    END
  ) STORED,
  strength_status BOOLEAN DEFAULT false,
  weakness_status BOOLEAN DEFAULT false,
  assessment_count INT DEFAULT 0,
  last_assessment_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, domain_id)
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR NEW TABLES
-- =====================================================
ALTER TABLE public.question_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irt_calibrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cat_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skill_profiles ENABLE ROW LEVEL SECURITY;

-- Question Domains: Everyone can read, Admin/Teacher manage
CREATE POLICY "Anyone can view domains" ON public.question_domains FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers manage domains" ON public.question_domains FOR ALL TO authenticated USING (public.is_teacher_or_admin());

-- IRT Calibrations: Teachers and Admins only
CREATE POLICY "Teachers manage calibrations" ON public.irt_calibrations FOR ALL TO authenticated USING (public.is_teacher_or_admin());

-- CAT Sessions & Responses: Students manage their own, Teachers view all
CREATE POLICY "Students manage own cat sessions" ON public.cat_sessions FOR ALL TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_admin());
CREATE POLICY "Students manage own cat responses" ON public.cat_responses FOR ALL TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_admin());

-- Student Skill Profiles: Students view own, Teachers view all
CREATE POLICY "Students view own skill profiles" ON public.student_skill_profiles FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_admin());
CREATE POLICY "System update skill profiles" ON public.student_skill_profiles FOR ALL TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_admin());

-- =====================================================
-- SEED DOMAIN DATA (D1-D5)
-- =====================================================
INSERT INTO public.question_domains (code, name, description) VALUES
('D1', 'HTML', 'HTML Structure, Elements, Semantics'),
('D2', 'CSS', 'CSS Selectors, Box Model, Flexbox, Grid'),
('D3', 'JavaScript', 'JS Basics, DOM, Events'),
('D4', 'Web Design', 'UI/UX, Layout, Accessibility'),
('D5', 'Web Project', 'Project Planning, Deployment')
ON CONFLICT (code) DO NOTHING;
