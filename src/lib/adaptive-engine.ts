import {
  Question,
  QuestionDifficulty,
  SubDomainCode,
  Attempt,
  SkillProfile,
  MasteryStatus,
} from '@/types/database';
import { MOCK_QUESTIONS } from './mock-data';

/**
 * =========================================================================================
 * Rule-based Adaptive Testing Engine (การทดสอบแบบปรับเหมาะเชิงกฎเกณฑ์)
 * =========================================================================================
 *
 * กรอบแนวคิดทางวิชาการและการอ้างอิง (Theoretical Framework & Academic Citations):
 *
 * 1. โครงสร้าง 4 องค์ประกอบหลักของ Adaptive Testing:
 *    - อ้างอิง: Wainer, H., Dorans, N. J., Flaugher, R., Green, B. F., & Mislevy, R. J. (2000).
 *      "Computerized Adaptive Testing: A Primer." Lawrence Erlbaum Associates.
 *    ระบบนี้ประกอบด้วย 4 เสาหลัก:
 *      (1) คลังข้อสอบ (Calibrated Item Pool) ที่ระบุ Sub-domain H1-H8, ระดับความยาก (Easy/Medium/Hard)
 *          และผ่านการประเมินความสอดคล้องเชิงเนื้อหา (IOC >= 0.67)
 *      (2) กฎจุดเริ่มต้น (Starting Rule): กำหนดให้เริ่มต้นที่ระดับความยากปานกลาง (Medium)
 *      (3) อัลกอริทึมเลือกข้อสอบ (Item Selection Algorithm): ปรับความยากขึ้น/ลงแบบ Stepwise
 *          ผสานกับการกระจายเนื้อหา (Content Balancing)
 *      (4) กฎการยุติการทดสอบ (Stopping Rule): กำหนดจำนวนข้อคงที่ (Fixed-length Stopping Rule)
 *
 * 2. หลักการควบคุมความสมดุลของเนื้อหา (Content Balancing):
 *    - อ้างอิง: Kingsbury, G. G., & Zara, A. R. (1989).
 *      "Procedures for selecting items for computerized adaptive tests."
 *      Applied Measurement in Education, 2(4), 359-375.
 *    - การคัดเลือกข้อสอบจะต้องครอบคลุมทุก Sub-domain H1-H8 ให้ครบถ้วนอย่างน้อย 1 รอบ
 *      ก่อนจะวนรอบใหม่ เพื่อประกันความครอบคลุมของหลักสูตรและเนื้อหาวิชา
 *
 * 3. กฎการยุติการทดสอบ (Stopping Rule):
 *    - อ้างอิง: Kingsbury, G. G., & Weiss, D. J. (1983).
 *      "A comparison of adaptive and conventional testing for problems of bias,
 *      content balance, and test length."
 *    - อ้างอิง: Choi, S. W., Grady, M. W., & Dodd, B. G. (2011).
 *      "A new stopping rule for computerized adaptive testing."
 *      Educational and Psychological Measurement, 71(1), 80-100.
 *    - ใช้เกณฑ์จำนวนข้อสอบคงที่ (Fixed-length Rule: 20 ข้อสำหรับแบบทดสอบรวม และ 10 ข้อสำหรับการ Re-test)
 *      ซึ่งเหมาะสมกับการทดสอบเพื่อการวินิจฉัยในชั้นเรียนอาชีวศึกษา
 *
 * 4. การประยุกต์ใช้ Adaptive Testing ในบริบทการศึกษา:
 *    - อ้างอิง: Weiss, D. J., & Kingsbury, G. G. (1984).
 *      "Application of computerized adaptive testing to educational problems."
 *      Journal of Educational Measurement, 21(4), 361-375.
 *    - เน้นการให้ข้อมูลย้อนกลับเพื่อวินิจฉัยจุดแข็ง-จุดอ่อน (Diagnostic Assessment)
 *      มากกว่าการจัดอันดับคะแนนเพียงอย่างเดียว
 *
 * หมายเหตุความน่าเชื่อถือทางวิชาการ:
 * ระบบนี้ทำงานแบบ "Rule-based Heuristic Adaptive Testing" ปรับความยากตามกฎเกณฑ์ (Stepwise)
 * ไม่ได้ประเมินค่าความสามารถ (Theta) ด้วยแบบจำลองทางสถิติ IRT (Item Response Theory)
 * เพื่อความโปร่งใส ถูกต้อง และไม่กล่าวอ้างเกินจริงในรายงานวิจัยและงานนวัตกรรม
 * =========================================================================================
 */

export interface AdaptiveEngineState {
  currentDifficulty: QuestionDifficulty;
  questionIndex: number; // 0 to 20
  usedQuestionIds: string[];
  subDomainCounts: Record<SubDomainCode, number>;
  attempts: Attempt[];
  targetSubDomain?: SubDomainCode | null; // For Re-test mode
}

export const ALL_SUB_DOMAINS: SubDomainCode[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];

/**
 * กำหนดสถานะเริ่มต้นของ Rule-based Adaptive Testing
 * อ้างอิง: Wainer et al. (2000) - Component 2: Starting Rule
 * กฎเริ่มต้น: เริ่มข้อแรกด้วยระดับความยากปานกลาง (Medium) เพื่อให้ผู้เรียนปรับตัวและประมาณการระดับความสามารถ
 */
export function createInitialAdaptiveState(targetSubDomain?: SubDomainCode | null): AdaptiveEngineState {
  return {
    currentDifficulty: 'medium', // Starting Rule: Wainer et al. (2000)
    questionIndex: 0,
    usedQuestionIds: [],
    subDomainCounts: {
      H1: 0,
      H2: 0,
      H3: 0,
      H4: 0,
      H5: 0,
      H6: 0,
      H7: 0,
      H8: 0,
    },
    attempts: [],
    targetSubDomain: targetSubDomain || null,
  };
}

/**
 * อัลกอริทึมคัดเลือกข้อสอบถัดไป (Next Item Selection Algorithm)
 *
 * อ้างอิง:
 * - Wainer et al. (2000) - Component 3: Item Selection Algorithm
 * - Kingsbury & Zara (1989) - Content Balancing Algorithm
 * - Kingsbury & Weiss (1983) - Fixed-length Stopping Rule
 *
 * ขั้นตอนการทำงาน:
 * 1. ตรวจสอบ Stopping Rule (ครบ 20 ข้อสำหรับชุดรวม หรือ 10 ข้อสำหรับชุด Re-test)
 * 2. กรองคลังข้อสอบเฉพาะข้อที่ validated !== false (ป้องกันข้อสอบที่ยังไม่ผ่านเกณฑ์การตรวจสอบ)
 * 3. ใช้ Content Balancing ค้นหา Sub-domain ที่ยังไม่ถูกทดสอบ หรือมีจำนวนข้อทดสอบน้อยที่สุด
 * 4. จับคู่ข้อสอบที่มีระดับความยากตรงกับ currentDifficulty
 */
export function getNextAdaptiveQuestion(
  state: AdaptiveEngineState,
  questionPool: Question[] = MOCK_QUESTIONS
): Question | null {
  const maxQuestions = state.targetSubDomain ? 10 : 20;

  // Stopping Rule: Kingsbury & Weiss (1983); Choi et al. (2011)
  if (state.questionIndex >= maxQuestions) {
    return null;
  }

  // กรองเฉพาะข้อสอบที่ active และผ่านการตรวจสอบคุณภาพ (validated !== false)
  const availableQuestions = questionPool.filter(
    (q) => !state.usedQuestionIds.includes(q.id) && q.active && q.validated !== false
  );

  if (availableQuestions.length === 0) {
    return null;
  }

  // กรณี Re-test มุ่งเน้น Sub-domain เป้าหมาย
  if (state.targetSubDomain) {
    const targetPool = availableQuestions.filter(
      (q) => q.sub_domain_code === state.targetSubDomain
    );
    const diffMatch = targetPool.find((q) => q.difficulty === state.currentDifficulty);
    if (diffMatch) return diffMatch;
    if (targetPool.length > 0) return targetPool[0];
  }

  // Content Balancing: Kingsbury & Zara (1989)
  // ตรวจสอบ Sub-domain ที่ยังไม่เคยได้รับการทดสอบเลยในรอบนี้
  const uncoveredSubDomains = ALL_SUB_DOMAINS.filter(
    (sub) => (state.subDomainCounts[sub] || 0) === 0
  );

  let candidateSubDomains: SubDomainCode[];
  if (uncoveredSubDomains.length > 0) {
    candidateSubDomains = uncoveredSubDomains;
  } else {
    // หากทดสอบครบทุก Sub-domain แล้ว ให้เลือกกลุ่มที่มีความถี่น้อยที่สุดเพื่อรักษาสมดุล
    const minCount = Math.min(...ALL_SUB_DOMAINS.map((s) => state.subDomainCounts[s] || 0));
    candidateSubDomains = ALL_SUB_DOMAINS.filter(
      (s) => (state.subDomainCounts[s] || 0) === minCount
    );
  }

  // เลือกข้อสอบในกลุ่ม Sub-domain เป้าหมายที่มีระดับความยากตรงกับระดับปัจจุบัน
  let matchedQuestion = availableQuestions.find(
    (q) =>
      candidateSubDomains.includes(q.sub_domain_code) &&
      q.difficulty === state.currentDifficulty
  );

  // ผ่อนปรนระดับความยากหากไม่มีข้อสอบความยากที่ต้องการในกลุ่ม Sub-domain นั้น
  if (!matchedQuestion) {
    matchedQuestion = availableQuestions.find((q) =>
      candidateSubDomains.includes(q.sub_domain_code)
    );
  }

  // กรณีฉุกเฉิน: ดึงข้อสอบที่มีความยากตรงกันจาก Sub-domain ใดก็ได้
  if (!matchedQuestion) {
    matchedQuestion = availableQuestions.find(
      (q) => q.difficulty === state.currentDifficulty
    );
  }

  // สำรองสุดท้าย: ดึงข้อสอบข้อแรกที่ยังไม่ได้ทำ
  if (!matchedQuestion) {
    matchedQuestion = availableQuestions[0];
  }

  return matchedQuestion || null;
}

/**
 * บันทึกผลการตอบและปรับระดับความยากสำหรับการทดสอบข้อถัดไป พร้อมบันทึก Audit Trail
 *
 * อ้างอิง:
 * - Wainer et al. (2000) - Stepwise Difficulty Transition Rule:
 *   * ตอบถูก -> ปรับระดับความยากขึ้น 1 ขั้น (Easy -> Medium -> Hard)
 *   * ตอบผิด -> ปรับระดับความยากลง 1 ขั้น (Hard -> Medium -> Easy)
 * - Weiss & Kingsbury (1984) - Continuous response tracking for diagnostic evidence
 *
 * ฟังก์ชันนี้บันทึกข้อมูล Audit Trail ครบถ้วน ได้แก่:
 * - previous_difficulty (ระดับความยากของข้อปัจจุบัน)
 * - selected_difficulty (ระดับความยากที่จะใช้ในข้อถัดไป)
 * - selection_reason (เหตุผลเชิงกฎเกณฑ์ของการตัดสินใจ)
 * - domain_coverage_snapshot (ภาพถ่ายจำนวนข้อสอบที่ทำไปแล้วในแต่ละ Sub-domain ณ ขณะนั้น)
 * - stop_reason (เหตุผลการยุติการทดสอบเมื่อถึงข้อสุดท้าย)
 */
export function recordAnswerAndUpdateState(
  state: AdaptiveEngineState,
  question: Question,
  selectedAnswer: string,
  responseTimeSec: number
): { newState: AdaptiveEngineState; isCorrect: boolean } {
  const isCorrect = selectedAnswer === question.correct_option;
  const previousDifficulty = question.difficulty;

  // กฎการปรับเปลี่ยนระดับความยาก (Stepwise Transition Rule)
  let nextDifficulty: QuestionDifficulty = state.currentDifficulty;
  let selectionReason = '';

  if (isCorrect) {
    if (state.currentDifficulty === 'easy') {
      nextDifficulty = 'medium';
      selectionReason = 'ตอบถูกต้อง -> ปรับเพิ่มระดับความยากจาก Easy เป็น Medium (Stepwise Up)';
    } else if (state.currentDifficulty === 'medium') {
      nextDifficulty = 'hard';
      selectionReason = 'ตอบถูกต้อง -> ปรับเพิ่มระดับความยากจาก Medium เป็น Hard (Stepwise Up)';
    } else {
      nextDifficulty = 'hard';
      selectionReason = 'ตอบถูกต้อง -> คงระดับความยากสูงสุด Hard (Ceiling Retained)';
    }
  } else {
    if (state.currentDifficulty === 'hard') {
      nextDifficulty = 'medium';
      selectionReason = 'ตอบไม่ถูกต้อง -> ปรับลดระดับความยากจาก Hard เป็น Medium (Stepwise Down)';
    } else if (state.currentDifficulty === 'medium') {
      nextDifficulty = 'easy';
      selectionReason = 'ตอบไม่ถูกต้อง -> ปรับลดระดับความยากจาก Medium เป็น Easy (Stepwise Down)';
    } else {
      nextDifficulty = 'easy';
      selectionReason = 'ตอบไม่ถูกต้อง -> คงระดับความยากต่ำสุด Easy (Floor Retained)';
    }
  }

  // ปรับปรุงสถิติความครอบคลุมของเนื้อหา (Content Balancing Snapshot)
  const newSubDomainCounts = {
    ...state.subDomainCounts,
    [question.sub_domain_code]: (state.subDomainCounts[question.sub_domain_code] || 0) + 1,
  };

  const nextQuestionIndex = state.questionIndex + 1;
  const maxQuestions = state.targetSubDomain ? 10 : 20;

  // ตรวจสอบ Stopping Rule สำหรับบันทึก stop_reason
  let stopReason: string | undefined = undefined;
  if (nextQuestionIndex >= maxQuestions) {
    stopReason = state.targetSubDomain
      ? 'ครบจำนวนข้อประเมินเฉพาะจุดประสงค์ Re-test (10 ข้อ)'
      : 'ครบเกณฑ์จำนวนข้อสอบสูงสุดตามแบบแผนความยาวคงที่ (Fixed-length Stopping Rule: 20 ข้อ ตามแนวคิด Kingsbury & Weiss, 1983)';
  }

  const attempt: Attempt = {
    id: 'att-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    session_id: 'session-curr',
    question_id: question.id,
    answer: selectedAnswer,
    correct: isCorrect,
    response_time: responseTimeSec,
    sequence: nextQuestionIndex,
    sub_domain_code: question.sub_domain_code,
    difficulty: question.difficulty,
    created_at: new Date().toISOString(),
    // Audit Trail Fields
    previous_difficulty: previousDifficulty,
    selected_difficulty: nextDifficulty,
    selection_reason: selectionReason,
    domain_coverage_snapshot: { ...newSubDomainCounts },
    stop_reason: stopReason,
  };

  const newState: AdaptiveEngineState = {
    ...state,
    currentDifficulty: nextDifficulty,
    questionIndex: nextQuestionIndex,
    usedQuestionIds: [...state.usedQuestionIds, question.id],
    subDomainCounts: newSubDomainCounts,
    attempts: [...state.attempts, attempt],
  };

  return { newState, isCorrect };
}

/**
 * วินิจฉัยระดับความรอบรู้ (Mastery Level) ราย Sub-domain H1-H8
 *
 * อ้างอิง: Weiss & Kingsbury (1984) - Diagnostic Criterion-Referenced Evaluation
 * เกณฑ์ประเมินระดับความรอบรู้ (Mastery Criteria):
 *  - >= 80% : ความเชี่ยวชาญระดับสูง (Mastery)
 *  - 60% - 79% : ความเชี่ยวชาญระดับดี (Good)
 *  - < 60% : ต้องการพัฒนาเพิ่มเติม (Needs Improvement)
 */
export function computeSkillProfiles(
  studentId: string,
  attempts: Attempt[]
): Record<SubDomainCode, SkillProfile> {
  const stats: Record<SubDomainCode, { total: number; correct: number }> = {
    H1: { total: 0, correct: 0 },
    H2: { total: 0, correct: 0 },
    H3: { total: 0, correct: 0 },
    H4: { total: 0, correct: 0 },
    H5: { total: 0, correct: 0 },
    H6: { total: 0, correct: 0 },
    H7: { total: 0, correct: 0 },
    H8: { total: 0, correct: 0 },
  };

  for (const att of attempts) {
    if (att.sub_domain_code && stats[att.sub_domain_code]) {
      stats[att.sub_domain_code].total += 1;
      if (att.correct) {
        stats[att.sub_domain_code].correct += 1;
      }
    }
  }

  const profiles: Partial<Record<SubDomainCode, SkillProfile>> = {};

  for (const code of ALL_SUB_DOMAINS) {
    const data = stats[code];
    let percentage = 0;
    if (data.total > 0) {
      percentage = Math.round((data.correct / data.total) * 100);
    } else {
      // ค่าฐานเริ่มต้นสำหรับหน่วยที่ยังไม่เคยมีข้อสอบทดสอบ
      percentage = 70;
    }

    let status: MasteryStatus = 'good';
    if (percentage >= 80) status = 'mastery';
    else if (percentage < 60) status = 'needs_improvement';

    profiles[code] = {
      student_id: studentId,
      sub_domain_code: code,
      estimated_level: percentage,
      evidence_count: data.total,
      mastery_status: status,
      updated_at: new Date().toISOString(),
    };
  }

  return profiles as Record<SubDomainCode, SkillProfile>;
}
