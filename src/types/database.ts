export type UserRole = 'student' | 'teacher' | 'admin';

export type SubDomainCode = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'H7' | 'H8';

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
    title: 'H1: โครงสร้างเอกสาร HTML พื้นฐาน',
    name: 'โครงสร้างเอกสารพื้นฐาน',
    description: 'DOCTYPE, html, head, body, title, meta charset และ viewport',
    iconName: 'FileCode2',
  },
  H2: {
    code: 'H2',
    title: 'H2: การจัดการข้อความและ Heading/Paragraph',
    name: 'ข้อความและ Heading/Paragraph',
    description: 'h1-h6, p, br, hr, strong, em, mark และการจัดวรรคตอน',
    iconName: 'Type',
  },
  H3: {
    code: 'H3',
    title: 'H3: Hyperlink และการเชื่อมโยง',
    name: 'Hyperlink และการเชื่อมโยง',
    description: 'แท็ก a, แอตทริบิวต์ href, target="_blank", anchor # ภายในหน้า',
    iconName: 'Link',
  },
  H4: {
    code: 'H4',
    title: 'H4: รูปภาพและสื่อ',
    name: 'รูปภาพและสื่อประสม',
    description: 'แท็ก img, แอตทริบิวต์ alt, figure, figcaption, video และ audio เบื้องต้น',
    iconName: 'Image',
  },
  H5: {
    code: 'H5',
    title: 'H5: รายการข้อมูล',
    name: 'รายการข้อมูล (Lists)',
    description: 'รายการแบบไม่มีลำดับ ul, มีลำดับ ol, รายการ li และคำนิยาม dl/dt/dd',
    iconName: 'ListOrdered',
  },
  H6: {
    code: 'H6',
    title: 'H6: ตาราง',
    name: 'ตาราง (Tables)',
    description: 'table, tr, td, th, ส่วน thead/tbody/tfoot และ colspan/rowspan',
    iconName: 'Table',
  },
  H7: {
    code: 'H7',
    title: 'H7: ฟอร์ม',
    name: 'ฟอร์มและการรับข้อมูล',
    description: 'form, input ชนิดต่างๆ, label, select, textarea และปุ่ม button',
    iconName: 'CheckSquare',
  },
  H8: {
    code: 'H8',
    title: 'H8: Semantic HTML5 และโครงสร้างหน้าเว็บทั้งหน้า',
    name: 'Semantic HTML5 ทั้งหน้า',
    description: 'header, nav, main, section, article, aside และ footer',
    iconName: 'LayoutTemplate',
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
}

export interface TestSession {
  id: string;
  student_id: string;
  test_type: 'adaptive' | 'pre_test' | 'post_test' | 're_test';
  target_sub_domain?: SubDomainCode | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  total_questions: number;
  correct_count: number;
  score_percentage: number;
  start_at: string;
  end_at?: string | null;
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
