-- =====================================================
-- การพัฒนานวัตกรรมการเรียนรู้แบบปรับเหมาะเฉพาะบุคคล
-- เรื่อง โครงสร้างภาษา HTML สำหรับนักเรียนระดับ ปวช.
-- Supabase PostgreSQL Schema & Row Level Security (RLS)
-- =====================================================

-- เปิดใช้งาน UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ตาราง profiles (ผู้ใช้งานระบบ)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  class_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ตาราง courses (หลักสูตร - เจาะจงโครงสร้างภาษา HTML)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE DEFAULT 'HTML-STRUCT-01',
  name TEXT NOT NULL DEFAULT 'โครงสร้างภาษา HTML',
  description TEXT DEFAULT 'การเรียนรู้โครงสร้างภาษา HTML สำหรับนักเรียนระดับ ปวช. ครอบคลุม 8 Sub-domain หลัก',
  status TEXT NOT NULL CHECK (status IN ('active', 'archived', 'draft')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ตาราง units (หน่วยการเรียนรู้ 8 Sub-domain: H1-H8)
CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  sub_domain_code TEXT NOT NULL CHECK (sub_domain_code IN ('H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8')),
  title TEXT NOT NULL,
  description TEXT,
  order_no INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, sub_domain_code)
);

-- 4. ตาราง lessons (บทเรียนย่อยในแต่ละหน่วย)
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_no INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ตาราง lesson_media (สื่อการสอน: สไลด์ วิดีโอ เอกสาร)
CREATE TABLE IF NOT EXISTS public.lesson_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('slide', 'video', 'document')),
  title TEXT NOT NULL,
  file_url TEXT,
  external_url TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  order_no INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ตาราง enrollments (การลงทะเบียนเรียน)
CREATE TABLE IF NOT EXISTS public.enrollments (
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  class_id UUID,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'dropped')) DEFAULT 'active',
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, course_id)
);

-- 7. ตาราง assignments (โจทย์ฝึกปฏิบัติใน Code Lab)
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  sub_domain_code TEXT NOT NULL CHECK (sub_domain_code IN ('H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  starter_code TEXT DEFAULT '<!DOCTYPE html>\n<html>\n<head>\n  <title>ฝึกเขียนโค้ด HTML</title>\n</head>\n<body>\n  <!-- เริ่มเขียนโค้ดที่นี่ -->\n</body>\n</html>',
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  order_no INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ตาราง questions (คลังข้อสอบ Adaptive Assessment H1-H8)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_domain_code TEXT NOT NULL CHECK (sub_domain_code IN ('H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  cognitive_level TEXT DEFAULT 'understanding',
  answer_type TEXT NOT NULL DEFAULT 'single_choice',
  question_text TEXT NOT NULL,
  code_snippet TEXT,
  choices JSONB NOT NULL,
  correct_option TEXT NOT NULL,
  explanation TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ตาราง test_sessions (รอบการทำแบบทดสอบ Adaptive)
CREATE TABLE IF NOT EXISTS public.test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL DEFAULT 'adaptive' CHECK (test_type IN ('adaptive', 'pre_test', 'post_test', 're_test')),
  target_sub_domain TEXT,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress',
  total_questions INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  score_percentage NUMERIC(5,2) DEFAULT 0,
  start_at TIMESTAMPTZ DEFAULT NOW(),
  end_at TIMESTAMPTZ
);

-- 10. ตาราง attempts (การตอบคำถามทีละข้อใน test_session)
CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.test_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  response_time INT NOT NULL DEFAULT 0, -- วินาที
  sequence INT NOT NULL,
  sub_domain_code TEXT,
  difficulty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ตาราง skill_profiles (โปรไฟล์ระดับความเชี่ยวชาญราย Sub-domain H1-H8)
CREATE TABLE IF NOT EXISTS public.skill_profiles (
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sub_domain_code TEXT NOT NULL CHECK (sub_domain_code IN ('H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8')),
  estimated_level NUMERIC(5,2) NOT NULL DEFAULT 0, -- ร้อยละ 0 - 100
  evidence_count INT NOT NULL DEFAULT 0,
  mastery_status TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN estimated_level >= 80 THEN 'mastery'
      WHEN estimated_level >= 60 THEN 'good'
      ELSE 'needs_improvement'
    END
  ) STORED,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, sub_domain_code)
);

-- 12. ตาราง recommendations (คำแนะนำการเรียนเฉพาะบุคคลจาก AI Advisor)
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sub_domain_code TEXT NOT NULL,
  resource_id UUID,
  resource_type TEXT DEFAULT 'lesson',
  reason TEXT NOT NULL,
  action_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'dismissed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ตาราง progress (ความก้าวหน้าในการเรียนบทเรียนและสื่อ)
CREATE TABLE IF NOT EXISTS public.progress (
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL,
  resource_type TEXT NOT NULL DEFAULT 'lesson',
  completion NUMERIC(5,2) NOT NULL DEFAULT 0,
  score NUMERIC(5,2) DEFAULT 0,
  slides_viewed INT DEFAULT 0,
  slides_total INT DEFAULT 0,
  video_duration_watched INT DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, resource_id)
);

-- 14. ตาราง submissions (การส่งงานจาก Code Lab และผลตรวจ AI Code Review)
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
  code TEXT NOT NULL,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  feedback TEXT,
  score NUMERIC(5,2) DEFAULT 0,
  checklist_passed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ตาราง audit_logs (บันทึก Audit การทำงานสำคัญ)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES เพื่อประสิทธิภาพการสืบค้น
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_units_course ON public.units(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_unit ON public.lessons(unit_id);
CREATE INDEX IF NOT EXISTS idx_media_lesson ON public.lesson_media(lesson_id);
CREATE INDEX IF NOT EXISTS idx_questions_subdomain ON public.questions(sub_domain_code, difficulty);
CREATE INDEX IF NOT EXISTS idx_test_sessions_student ON public.test_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_session ON public.attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_skill_profiles_student ON public.skill_profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_student ON public.recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_student ON public.progress(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for checking user roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_teacher_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Profiles: ทุกคนอ่านโปรไฟล์ของตนเองได้ ครู/แอดมินอ่านของทุกคนได้
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_teacher_or_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Courses, Units, Lessons, Media: ทุกคนที่ล็อกอินอ่านได้, ครู/แอดมินแก้ไขได้
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT TO authenticated USING (status = 'active' OR public.is_teacher_or_admin());

CREATE POLICY "Teachers can manage courses" ON public.courses
  FOR ALL TO authenticated USING (public.is_teacher_or_admin());

CREATE POLICY "Anyone can view units" ON public.units
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers can manage units" ON public.units
  FOR ALL TO authenticated USING (public.is_teacher_or_admin());

CREATE POLICY "Anyone can view lessons" ON public.lessons
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers can manage lessons" ON public.lessons
  FOR ALL TO authenticated USING (public.is_teacher_or_admin());

CREATE POLICY "Anyone can view media" ON public.lesson_media
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers can manage media" ON public.lesson_media
  FOR ALL TO authenticated USING (public.is_teacher_or_admin());

-- 3. Assignments: อ่านได้ทุกคน, ครูจัดการได้
CREATE POLICY "Anyone can view assignments" ON public.assignments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers can manage assignments" ON public.assignments
  FOR ALL TO authenticated USING (public.is_teacher_or_admin());

-- 4. Questions: นักเรียนอ่านเฉพาะตอนสอบ (หรือผ่าน server), ครูจัดการได้
CREATE POLICY "Teachers can manage questions" ON public.questions
  FOR ALL TO authenticated USING (public.is_teacher_or_admin());

CREATE POLICY "Students can view active questions" ON public.questions
  FOR SELECT TO authenticated USING (active = true);

-- 5. Test Sessions & Attempts: นักเรียนจัดการของตนเองได้, ครูอ่านได้
CREATE POLICY "Students manage own test sessions" ON public.test_sessions
  FOR ALL TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_admin());

CREATE POLICY "Students manage own attempts" ON public.attempts
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.test_sessions
      WHERE id = attempts.session_id AND (student_id = auth.uid() OR public.is_teacher_or_admin())
    )
  );

-- 6. Skill Profiles: นักเรียนดูของตนเองได้, ครูดูได้ทุกคน
CREATE POLICY "Users view skill profiles" ON public.skill_profiles
  FOR SELECT TO authenticated USING (student_id = auth.uid() OR public.is_teacher_or_admin());

CREATE POLICY "System/User update skill profiles" ON public.skill_profiles
  FOR ALL TO authenticated USING (student_id = auth.uid() OR public.is_teacher_or_admin());

-- 7. Recommendations: นักเรียนดูและอัปเดตสถานะของตนเองได้
CREATE POLICY "Students view own recommendations" ON public.recommendations
  FOR SELECT TO authenticated USING (student_id = auth.uid() OR public.is_teacher_or_admin());

CREATE POLICY "Students update own recommendations" ON public.recommendations
  FOR UPDATE TO authenticated USING (student_id = auth.uid());

-- 8. Progress: นักเรียนดูและบันทึกความก้าวหน้าของตนเองได้
CREATE POLICY "Students manage own progress" ON public.progress
  FOR ALL TO authenticated USING (student_id = auth.uid() OR public.is_teacher_or_admin());

-- 9. Submissions: นักเรียนส่งและดูงานของตนเองได้, ครูดูและให้คะแนนได้
CREATE POLICY "Students manage own submissions" ON public.submissions
  FOR ALL TO authenticated USING (student_id = auth.uid() OR public.is_teacher_or_admin());

-- 10. Audit Logs: บันทึกได้ทุกคน, อ่านได้เฉพาะครูและแอดมิน
CREATE POLICY "Anyone can insert audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Teachers and admins view audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (public.is_teacher_or_admin());

-- =====================================================
-- TRIGGER: สร้างโปรไฟล์ใหม่อัตโนมัติเมื่อผู้ใช้สมัครสมาชิกผ่าน Supabase Auth
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'นักเรียนใหม่'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
