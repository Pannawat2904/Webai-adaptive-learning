export type UserRole = 'student' | 'teacher' | 'admin';

export type SubDomainCode = 'H1' | 'H2' | 'H3' | 'H4' | 'H5';

export interface SubDomainInfo {
  code: SubDomainCode;
  title: string;
  name: string;
  description: string;
  iconName: string;
}

export const SUB_DOMAINS: Record<SubDomainCode, SubDomainInfo> = {
  H1: {
    code: 'H1',
    title: 'โครงสร้างพื้นฐานของภาษา HTML',
    name: 'โครงสร้างพื้นฐานของภาษา HTML',
    description: 'โครงสร้างเอกสาร HTML5, ความหมายของ Tag, Tag เปิด-ปิด, Comment และส่วนประกอบ <head>, <body>, <title>',
    iconName: 'FileCode2',
  },
  H2: {
    code: 'H2',
    title: 'การแทรกข้อความและลิงก์ในหน้าเว็บ',
    name: 'การแทรกข้อความและลิงก์ในหน้าเว็บ',
    description: 'Heading Tags, Paragraph Tag, การจัดรูปแบบข้อความ, การขึ้นบรรทัดและเส้นคั่น, Lists (Ordered/Unordered List) และการสร้างลิงก์ภายใน-ภายนอก',
    iconName: 'Type',
  },
  H3: {
    code: 'H3',
    title: 'การแทรกรูปภาพและตารางในหน้าเว็บ',
    name: 'การแทรกรูปภาพและตารางในหน้าเว็บ',
    description: 'การแทรกรูปภาพ <img>, กำหนดขนาดรูปภาพ, Relative/Absolute Path, ตาราง <table>, แถว, คอลัมน์ และหัวตาราง',
    iconName: 'Image',
  },
  H4: {
    code: 'H4',
    title: 'การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML',
    name: 'การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML',
    description: 'Semantic HTML (Header, Navigation, Main, Section, Article, Aside, Footer), Div & Span, Block Element และ Inline Element',
    iconName: 'LayoutTemplate',
  },
  H5: {
    code: 'H5',
    title: 'การสร้างฟอร์มรับข้อมูล',
    name: 'การสร้างฟอร์มรับข้อมูล',
    description: 'Form Tag, Label & Input ชนิดต่างๆ (Text, Email, Password, Number, Date), Textarea, Select, Radio, Checkbox, Button',
    iconName: 'CheckSquare',
  },
};

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email?: string;
  avatar_url?: string;
  class_id?: string;
  created_at: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  created_at: string;
}

export interface Unit {
  id: string;
  course_id: string;
  sub_domain_code: SubDomainCode;
  title: string;
  description?: string;
  order_no: number;
}

export interface Lesson {
  id: string;
  unit_id: string;
  title: string;
  content: string;
  order_no: number;
  media?: LessonMedia[];
}

export interface LessonMedia {
  id: string;
  lesson_id: string;
  media_type: 'slide' | 'video' | 'document';
  title: string;
  file_url?: string | null;
  external_url?: string | null;
  meta?: {
    pages?: number;
    slides?: string[];
    duration?: number;
    author?: string;
    [key: string]: unknown;
  };
  order_no: number;
  created_at?: string;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestionChoices {
  A: string;
  B: string;
  C: string;
  D: string;
  [key: string]: string;
}

export interface Question {
  id: string;
  sub_domain_code: SubDomainCode;
  difficulty: QuestionDifficulty;
  cognitive_level: string;
  answer_type: 'single_choice' | 'multiple_choice';
  question_text: string;
  code_snippet?: string | null;
  choices: QuestionChoices;
  correct_option: string;
  explanation?: string;
  active: boolean;
  // Academic Validation & Quality Metrics
  ioc_score?: number; // Index of Item-Objective Congruence (expert score, e.g. 0.67 - 1.00)
  validated?: boolean; // If false, question MUST NOT be selected in Rule-based Adaptive Testing for students
  difficulty_index?: number; // p-value (สัดส่วนคนตอบถูก 0.0 - 1.0)
  discrimination_index?: number; // D-value (อำนาจจำแนกกลุ่มสูง 27% vs ต่ำ 27%, -1.0 to 1.0)
  total_attempts?: number;
  
  // IRT 3PL Parameters
  irt_model?: string;
  irt_a?: number | null; // Discrimination
  irt_b?: number | null; // Difficulty
  irt_c?: number | null; // Pseudo-guessing
  irt_calibration_status?: 'pending' | 'calibrated' | 'draft' | 'expert_reviewed' | 'pilot';
}

export interface TestSession {
  id: string;
  student_id: string;
  student_name?: string;
  test_type: 'adaptive' | 'pre_test' | 'post_test' | 're_test' | 'unit_quiz';
  target_sub_domain?: SubDomainCode | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  total_questions: number;
  correct_count: number;
  score_percentage: number;
  start_at: string;
  end_at?: string | null;
  stop_reason?: string;
  attempts?: Attempt[];
}

export interface Attempt {
  id: string;
  session_id: string;
  question_id: string;
  answer: string;
  correct: boolean;
  response_time: number;
  sequence: number;
  sub_domain_code?: SubDomainCode;
  difficulty?: QuestionDifficulty;
  created_at: string;
  // Audit Trail (ประวัติการตัดสินใจของ Rule-based Adaptive Engine)
  previous_difficulty?: QuestionDifficulty;
  selected_difficulty?: QuestionDifficulty;
  selection_reason?: string;
  domain_coverage_snapshot?: Record<SubDomainCode, number>;
  stop_reason?: string;
}

// Psychometric Types for Item Analysis & Evaluation
export interface ItemPsychometrics {
  question_id: string;
  question_text: string;
  sub_domain_code: SubDomainCode;
  difficulty: QuestionDifficulty;
  p_value: number; // ความยากง่าย (0.20 - 0.80 ถือว่าเหมาะสม)
  d_value: number; // อำนาจจำแนก (>= 0.20 ถือว่าใช้ได้, >= 0.40 ดีมาก)
  ioc_score: number;
  validated: boolean;
  total_responses: number;
  high_group_correct_pct: number;
  low_group_correct_pct: number;
  evaluation: string;
}

// Reliability KR-20 per Sub-domain
export interface SubDomainReliability {
  sub_domain_code: SubDomainCode;
  sub_domain_title: string;
  item_count: number;
  sample_size: number;
  kr20: number; // Formula: [k/(k-1)] * [1 - (sum_pq / variance)]
  variance: number;
  sum_pq: number;
  is_acceptable: boolean; // >= 0.70
  interpretation: 'ดีมาก (>= 0.80)' | 'ยอมรับได้ (0.70 - 0.79)' | 'ควรปรับปรุง (< 0.70)';
}

// Pre/Post-test Comparison & Cohen's d Effect Size
export interface PrePostComparison {
  student_id: string;
  student_name: string;
  sub_domain_code?: SubDomainCode | 'ALL';
  sub_domain_title?: string;
  pre_score: number;
  post_score: number;
  gain_score: number;
  cohens_d: number;
  effect_magnitude: 'น้อย (Small: 0.2)' | 'ปานกลาง (Medium: 0.5)' | 'มาก (Large: >= 0.8)' | 'ไม่มีนัยสำคัญ (< 0.2)';
  interpretation: string;
}

export type MasteryStatus = 'mastery' | 'good' | 'needs_improvement';

export interface SkillProfile {
  student_id: string;
  sub_domain_code: SubDomainCode;
  estimated_level: number; // 0 - 100%
  evidence_count: number;
  mastery_status?: MasteryStatus;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  student_id: string;
  sub_domain_code: SubDomainCode;
  resource_id?: string;
  resource_type: 'lesson' | 'code_lab' | 're_test';
  reason: string;
  action_url?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  created_at: string;
}

export interface Progress {
  student_id: string;
  resource_id: string;
  resource_type: string;
  completion: number;
  score: number;
  slides_viewed?: number;
  slides_total?: number;
  video_duration_watched?: number;
  last_activity: string;
}

export interface AssignmentChecklistItem {
  id: string;
  label: string;
  selector: string;
  minCount?: number;
}

export interface Assignment {
  id: string;
  unit_id: string;
  sub_domain_code: SubDomainCode;
  title: string;
  description: string;
  starter_code: string;
  checklist: AssignmentChecklistItem[];
  difficulty: QuestionDifficulty;
  order_no: number;
}

export interface Submission {
  id: string;
  student_id: string;
  assignment_id: string;
  code: string;
  result: {
    passed: boolean;
    checklistResults?: { id: string; label: string; passed: boolean }[];
    [key: string]: unknown;
  };
  feedback?: string;
  score: number;
  checklist_passed: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  action: string;
  entity: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// =====================================================
// IRT & CAT Types
// =====================================================

export interface IRTItem extends Question {
  irt_model: '3PL';
  irt_a: number;
  irt_b: number;
  irt_c: number;
  irt_calibration_status: 'pending' | 'calibrated' | 'draft' | 'expert_reviewed' | 'pilot';
}

export interface CATSession {
  id: string;
  session_id: string;
  student_id: string;
  test_id?: string;
  initial_theta: number;
  current_theta: number;
  standard_error: number;
  estimation_method: 'MLE' | 'MAP' | 'EAP';
  items_answered: number;
  min_items: number;
  max_items: number;
  target_standard_error: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  started_at: string;
  completed_at?: string;
}

export interface CATResponse {
  id: string;
  session_id: string;
  question_id: string;
  student_id: string;
  sequence: number;
  answer: string;
  is_correct: boolean;
  theta_before: number;
  theta_after: number;
  item_information: number;
  standard_error_after: number;
  response_time: number;
  created_at: string;
}

export interface AbilityEstimate {
  student_id: string;
  theta: number;
  standard_error: number;
  updated_at: string;
}

export interface DomainAbility {
  student_id: string;
  sub_domain_code: SubDomainCode;
  theta: number;
  standard_error: number;
  updated_at: string;
}

export interface LearningProfile {
  overall_ability: AbilityEstimate;
  domain_abilities: Record<SubDomainCode, DomainAbility>;
  strengths: SubDomainCode[];
  developing: SubDomainCode[];
  needs_improvement: SubDomainCode[];
}
