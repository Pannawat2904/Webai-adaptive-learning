import {
  TestSession,
  Attempt,
  SubDomainCode,
  QuestionDifficulty,
} from '@/types/database';

/**
 * =========================================================================================
 * Mock Completed Test Sessions & Audit Logs for Academic Evaluation
 * =========================================================================================
 * ข้อมูลจำลองเซสชันการทดสอบแบบ Rule-based Adaptive Testing พร้อมบันทึก Audit Trail ครบถ้วน
 * เพื่อการตรวจสอบย้อนหลัง (Auditability), การคำนวณ KR-20, และการวิเคราะห์ Pre/Post Effect Size
 */

// ฟังก์ชันสร้าง Mock Attempt พร้อม Audit Trail
function createMockAttempt(
  sessionId: string,
  seq: number,
  qId: string,
  subCode: SubDomainCode,
  prevDiff: QuestionDifficulty,
  selDiff: QuestionDifficulty,
  correct: boolean,
  reason: string,
  coverage: Record<SubDomainCode, number>,
  stopReason?: string
): Attempt {
  return {
    id: `att-${sessionId}-${seq}`,
    session_id: sessionId,
    question_id: qId,
    answer: correct ? 'A' : 'B',
    correct,
    response_time: Math.floor(Math.random() * 25) + 12,
    sequence: seq,
    sub_domain_code: subCode,
    difficulty: prevDiff,
    previous_difficulty: prevDiff,
    selected_difficulty: selDiff,
    selection_reason: reason,
    domain_coverage_snapshot: coverage,
    stop_reason: stopReason,
    created_at: new Date(Date.now() - (20 - seq) * 60000).toISOString(),
  };
}

// 1. Session สมชาย (นักเรียนหลัก - Adaptive Test 20 ข้อ สมบูรณ์)
const SOMCHAI_COVERAGE_SEQUENCE: {
  sub: SubDomainCode;
  prev: QuestionDifficulty;
  sel: QuestionDifficulty;
  correct: boolean;
  reason: string;
}[] = [
  { sub: 'H1', prev: 'medium', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> ปรับเพิ่มระดับความยากจาก Medium เป็น Hard (Stepwise Up)' },
  { sub: 'H2', prev: 'hard', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> คงระดับความยากสูงสุด Hard (Ceiling Retained)' },
  { sub: 'H3', prev: 'hard', sel: 'medium', correct: false, reason: 'ตอบไม่ถูกต้อง -> ปรับลดระดับความยากจาก Hard เป็น Medium (Stepwise Down)' },
  { sub: 'H4', prev: 'medium', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> ปรับเพิ่มระดับความยากจาก Medium เป็น Hard (Stepwise Up)' },
  { sub: 'H5', prev: 'hard', sel: 'medium', correct: false, reason: 'ตอบไม่ถูกต้อง -> ปรับลดระดับความยากจาก Hard เป็น Medium (Stepwise Down)' },
  { sub: 'H6', prev: 'medium', sel: 'easy', correct: false, reason: 'ตอบไม่ถูกต้อง -> ปรับลดระดับความยากจาก Medium เป็น Easy (Stepwise Down)' },
  { sub: 'H7', prev: 'easy', sel: 'medium', correct: true, reason: 'ตอบถูกต้อง -> ปรับเพิ่มระดับความยากจาก Easy เป็น Medium (Stepwise Up)' },
  { sub: 'H8', prev: 'medium', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> ปรับเพิ่มระดับความยากจาก Medium เป็น Hard (Stepwise Up)' },
  // Round 2 Content Balancing
  { sub: 'H1', prev: 'hard', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> คงระดับความยากสูงสุด Hard (Ceiling Retained)' },
  { sub: 'H2', prev: 'hard', sel: 'medium', correct: false, reason: 'ตอบไม่ถูกต้อง -> ปรับลดระดับความยากจาก Hard เป็น Medium (Stepwise Down)' },
  { sub: 'H3', prev: 'medium', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> ปรับเพิ่มระดับความยากจาก Medium เป็น Hard (Stepwise Up)' },
  { sub: 'H4', prev: 'hard', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> คงระดับความยากสูงสุด Hard (Ceiling Retained)' },
  { sub: 'H5', prev: 'hard', sel: 'medium', correct: false, reason: 'ตอบไม่ถูกต้อง -> ปรับลดระดับความยากจาก Hard เป็น Medium (Stepwise Down)' },
  { sub: 'H6', prev: 'medium', sel: 'medium', correct: false, reason: 'ตอบไม่ถูกต้อง -> ปรับลดระดับความยากจาก Medium เป็น Easy (Stepwise Down)' },
  { sub: 'H7', prev: 'easy', sel: 'medium', correct: true, reason: 'ตอบถูกต้อง -> ปรับเพิ่มระดับความยากจาก Easy เป็น Medium (Stepwise Up)' },
  { sub: 'H8', prev: 'medium', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> ปรับเพิ่มระดับความยากจาก Medium เป็น Hard (Stepwise Up)' },
  // Round 3 (Targeted)
  { sub: 'H6', prev: 'hard', sel: 'medium', correct: false, reason: 'ตอบไม่ถูกต้อง -> ปรับลดระดับความยากจาก Hard เป็น Medium (Stepwise Down)' },
  { sub: 'H5', prev: 'medium', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> ปรับเพิ่มระดับความยากจาก Medium เป็น Hard (Stepwise Up)' },
  { sub: 'H1', prev: 'hard', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> คงระดับความยากสูงสุด Hard (Ceiling Retained)' },
  { sub: 'H3', prev: 'hard', sel: 'hard', correct: true, reason: 'ตอบถูกต้อง -> คงระดับความยากสูงสุด Hard (Ceiling Retained)' },
];

const somchaiSnapshot: Record<SubDomainCode, number> = { H1: 0, H2: 0, H3: 0, H4: 0, H5: 0, H6: 0, H7: 0, H8: 0 };
export const MOCK_ATTEMPTS_SOMCHAI: Attempt[] = SOMCHAI_COVERAGE_SEQUENCE.map((item, idx) => {
  somchaiSnapshot[item.sub] = (somchaiSnapshot[item.sub] || 0) + 1;
  const isLast = idx === 19;
  return createMockAttempt(
    'sess-somchai-adaptive-01',
    idx + 1,
    `q-${item.sub.toLowerCase()}-${(idx % 5) + 1}`,
    item.sub,
    item.prev,
    item.sel,
    item.correct,
    item.reason,
    { ...somchaiSnapshot },
    isLast ? 'ครบเกณฑ์จำนวนข้อสอบสูงสุดตามแบบแผนความยาวคงที่ (Fixed-length Stopping Rule: 20 ข้อ ตามแนวคิด Kingsbury & Weiss, 1983)' : undefined
  );
});

// 2. Mock Test Sessions List สำหรับ Teacher Backoffice
export const MOCK_TEST_SESSIONS: TestSession[] = [
  {
    id: 'sess-somchai-adaptive-01',
    student_id: 's001-student-uuid-1111',
    student_name: 'สมชาย รักการเรียน (ปวช.1/1)',
    test_type: 'adaptive',
    status: 'completed',
    total_questions: 20,
    correct_count: 14,
    score_percentage: 70,
    start_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    end_at: new Date(Date.now() - 3600000 * 2 + 18 * 60000).toISOString(),
    stop_reason: 'ครบเกณฑ์จำนวนข้อสอบสูงสุดตามแบบแผนความยาวคงที่ (Fixed-length Stopping Rule: 20 ข้อ)',
    attempts: MOCK_ATTEMPTS_SOMCHAI,
  },
  {
    id: 'sess-somหญิง-post-02',
    student_id: 's002-student-uuid-2222',
    student_name: 'สมหญิง ตั้งใจดี (ปวช.1/1)',
    test_type: 'post_test',
    status: 'completed',
    total_questions: 20,
    correct_count: 17,
    score_percentage: 85,
    start_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    end_at: new Date(Date.now() - 3600000 * 4 + 15 * 60000).toISOString(),
    stop_reason: 'ครบเกณฑ์จำนวนข้อสอบสูงสุดตามแบบแผนความยาวคงที่ (Fixed-length Stopping Rule: 20 ข้อ)',
    attempts: MOCK_ATTEMPTS_SOMCHAI.map((a, i) => ({
      ...a,
      id: `att-somying-${i + 1}`,
      session_id: 'sess-somหญิง-post-02',
      correct: i % 4 !== 0,
    })),
  },
  {
    id: 'sess-ธีรภัทร์-adaptive-03',
    student_id: 's003-student-uuid-3333',
    student_name: 'ธีรภัทร์ เก่งโค้ด (ปวช.1/1)',
    test_type: 'adaptive',
    status: 'completed',
    total_questions: 20,
    correct_count: 18,
    score_percentage: 90,
    start_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    end_at: new Date(Date.now() - 3600000 * 6 + 14 * 60000).toISOString(),
    stop_reason: 'ครบเกณฑ์จำนวนข้อสอบสูงสุดตามแบบแผนความยาวคงที่ (Fixed-length Stopping Rule: 20 ข้อ)',
    attempts: MOCK_ATTEMPTS_SOMCHAI.map((a, i) => ({
      ...a,
      id: `att-theeraphat-${i + 1}`,
      session_id: 'sess-ธีรภัทร์-adaptive-03',
      correct: i % 7 !== 0,
    })),
  },
  {
    id: 'sess-กานดา-adaptive-04',
    student_id: 's004-student-uuid-4444',
    student_name: 'กานดา วิจิตรสื่อ (ปวช.1/1)',
    test_type: 'adaptive',
    status: 'completed',
    total_questions: 20,
    correct_count: 12,
    score_percentage: 60,
    start_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    end_at: new Date(Date.now() - 3600000 * 8 + 20 * 60000).toISOString(),
    stop_reason: 'ครบเกณฑ์จำนวนข้อสอบสูงสุดตามแบบแผนความยาวคงที่ (Fixed-length Stopping Rule: 20 ข้อ)',
    attempts: MOCK_ATTEMPTS_SOMCHAI.map((a, i) => ({
      ...a,
      id: `att-kanda-${i + 1}`,
      session_id: 'sess-กานดา-adaptive-04',
      correct: i % 2 === 0,
    })),
  },
];

// 3. Pre-test & Post-test Dataset สำหรับการคำนวณ Cohen's d Effect Size ทั้งรายบุคคลและรายห้อง
export interface StudentPrePostRecord {
  studentId: string;
  studentName: string;
  preTotal: number; // เต็ม 100
  postTotal: number; // เต็ม 100
  subDomainPre: Record<SubDomainCode, number>; // คะแนนย่อย 0-100
  subDomainPost: Record<SubDomainCode, number>; // คะแนนย่อย 0-100
}

export const MOCK_CLASS_PRE_POST: StudentPrePostRecord[] = [
  {
    studentId: 's001-student-uuid-1111',
    studentName: 'สมชาย รักการเรียน',
    preTotal: 45,
    postTotal: 75,
    subDomainPre: { H1: 50, H2: 40, H3: 45, H4: 55, H5: 35, H6: 30, H7: 45, H8: 60 },
    subDomainPost: { H1: 85, H2: 75, H3: 80, H4: 85, H5: 70, H6: 60, H7: 75, H8: 85 },
  },
  {
    studentId: 's002-student-uuid-2222',
    studentName: 'สมหญิง ตั้งใจดี',
    preTotal: 52,
    postTotal: 88,
    subDomainPre: { H1: 60, H2: 50, H3: 50, H4: 60, H5: 45, H6: 40, H7: 55, H8: 65 },
    subDomainPost: { H1: 95, H2: 90, H3: 85, H4: 90, H5: 80, H6: 80, H7: 85, H8: 95 },
  },
  {
    studentId: 's003-student-uuid-3333',
    studentName: 'ธีรภัทร์ เก่งโค้ด',
    preTotal: 58,
    postTotal: 92,
    subDomainPre: { H1: 65, H2: 60, H3: 55, H4: 65, H5: 50, H6: 45, H7: 60, H8: 70 },
    subDomainPost: { H1: 100, H2: 95, H3: 90, H4: 95, H5: 85, H6: 85, H7: 90, H8: 95 },
  },
  {
    studentId: 's004-student-uuid-4444',
    studentName: 'กานดา วิจิตรสื่อ',
    preTotal: 38,
    postTotal: 68,
    subDomainPre: { H1: 45, H2: 35, H3: 35, H4: 40, H5: 30, H6: 30, H7: 40, H8: 50 },
    subDomainPost: { H1: 80, H2: 70, H3: 65, H4: 75, H5: 60, H6: 55, H7: 65, H8: 75 },
  },
  {
    studentId: 's005-student-uuid-5555',
    studentName: 'นภัสสร อักษรศิลป์',
    preTotal: 42,
    postTotal: 80,
    subDomainPre: { H1: 45, H2: 45, H3: 40, H4: 45, H5: 35, H6: 35, H7: 45, H8: 55 },
    subDomainPost: { H1: 90, H2: 85, H3: 80, H4: 85, H5: 75, H6: 70, H7: 80, H8: 85 },
  },
  {
    studentId: 's006-student-uuid-6666',
    studentName: 'วรเมธ เทคโนล้ำ',
    preTotal: 50,
    postTotal: 84,
    subDomainPre: { H1: 55, H2: 50, H3: 45, H4: 55, H5: 45, H6: 40, H7: 50, H8: 60 },
    subDomainPost: { H1: 90, H2: 85, H3: 85, H4: 90, H5: 80, H6: 75, H7: 80, H8: 90 },
  },
  {
    studentId: 's007-student-uuid-7777',
    studentName: 'ชญานิศ ขยันยิ่ง',
    preTotal: 46,
    postTotal: 82,
    subDomainPre: { H1: 50, H2: 45, H3: 40, H4: 50, H5: 40, H6: 35, H7: 45, H8: 60 },
    subDomainPost: { H1: 90, H2: 80, H3: 85, H4: 85, H5: 75, H6: 75, H7: 85, H8: 90 },
  },
  {
    studentId: 's008-student-uuid-8888',
    studentName: 'ปวีณ์กร เขียนเว็บ',
    preTotal: 40,
    postTotal: 74,
    subDomainPre: { H1: 45, H2: 40, H3: 35, H4: 45, H5: 35, H6: 30, H7: 40, H8: 50 },
    subDomainPost: { H1: 85, H2: 75, H3: 70, H4: 80, H5: 70, H6: 65, H7: 70, H8: 80 },
  },
];
