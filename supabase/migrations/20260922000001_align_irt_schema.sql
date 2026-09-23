-- =====================================================
-- Migration: Align IRT Schema with Requirements
-- Description: ปรับแก้ชื่อคอลัมน์และสร้างตารางตามโครงสร้าง IRT 3PL ที่ผู้ใช้งานกำหนด
-- ห้ามลบข้อมูลเดิม
-- =====================================================

-- 1. เพิ่ม/เปลี่ยนคอลัมน์ในตาราง questions ตาม requirement (irt_a, irt_b, irt_c, irt_model, irt_calibration_status)
ALTER TABLE public.questions 
  ADD COLUMN IF NOT EXISTS irt_model TEXT DEFAULT '3PL',
  ADD COLUMN IF NOT EXISTS irt_a NUMERIC(10,5) DEFAULT NULL, -- Discrimination (Can be NULL)
  ADD COLUMN IF NOT EXISTS irt_b NUMERIC(10,5) DEFAULT NULL, -- Difficulty (Can be NULL)
  ADD COLUMN IF NOT EXISTS irt_c NUMERIC(10,5) DEFAULT NULL, -- Pseudo-guessing (Can be NULL)
  ADD COLUMN IF NOT EXISTS irt_calibration_status TEXT DEFAULT 'pending';

-- Note: We keep the old rule-based sub_domain_code (H1-H8) as the source of truth for content.

-- 2. สร้างตาราง student_ability สำหรับเก็บ Overall Ability (ถ้ายังไม่มี)
CREATE TABLE IF NOT EXISTS public.student_ability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  theta NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
  standard_error NUMERIC(10,5) NOT NULL DEFAULT 1.00000,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id)
);

-- 3. ตาราง domain_ability สำหรับ H1-H8
CREATE TABLE IF NOT EXISTS public.domain_ability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sub_domain_code TEXT NOT NULL, -- H1 to H8
  theta NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
  standard_error NUMERIC(10,5) NOT NULL DEFAULT 1.00000,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, sub_domain_code)
);

-- 4. ตาราง Item Statistics (การวิเคราะห์ข้อสอบภาพรวม)
CREATE TABLE IF NOT EXISTS public.item_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  total_attempts INT DEFAULT 0,
  correct_attempts INT DEFAULT 0,
  exposure_count INT DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id)
);

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE public.student_ability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_ability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students view own ability" ON public.student_ability FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_admin());
CREATE POLICY "System update student ability" ON public.student_ability FOR ALL TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_admin());

CREATE POLICY "Students view own domain ability" ON public.domain_ability FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_admin());
CREATE POLICY "System update domain ability" ON public.domain_ability FOR ALL TO authenticated USING (auth.uid() = student_id OR public.is_teacher_or_admin());

CREATE POLICY "Teachers manage item statistics" ON public.item_statistics FOR ALL TO authenticated USING (public.is_teacher_or_admin());
CREATE POLICY "Students can read item statistics" ON public.item_statistics FOR SELECT TO authenticated USING (true);
