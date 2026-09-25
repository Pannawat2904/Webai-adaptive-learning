import { Question, SubDomainCode } from '@/types/database';
import { getQuestions } from './database-service';
import { normalizeUnit } from './progress-service';
import { OFFICIAL_PRETEST_QUESTIONS } from './pretest-data';

export { OFFICIAL_PRETEST_QUESTIONS };

/**
 * ดึงชุดข้อสอบ Pre-test แบบชุดคำถามคงที่ (Fixed question set)
 * ใช้ชุดข้อสอบทางการ 20 ข้อจากหลักสูตร "หน่วยที่ 3 งานสร้างหน้าเว็บด้วย HTML"
 * ครอบคลุมเนื้อหาภาพรวมทุกหน่วยย่อย ไม่ปรับระดับความยากตามคำตอบของผู้เรียน
 */
export function getFixedPretestQuestions(
  unitIdOrSubdomain?: string | null,
  pool?: Question[],
  count?: number
): Question[] {
  // หากมีชุดข้อสอบทางการ ให้ใช้เป็นค่าตั้งต้น
  let questions = [...OFFICIAL_PRETEST_QUESTIONS];

  // หากระบุ count ให้ตัดจำนวนข้อตามที่ต้องการ หรือคืนค่าทั้งหมด 20 ข้อ
  if (count && count > 0 && count < questions.length) {
    return questions.slice(0, count);
  }

  return questions;
}

/**
 * ดึงชุดข้อสอบแบบฝึกหัดท้ายหน่วย (Unit Quiz) สั้นๆ 3-4 ข้อเฉพาะเนื้อหาหน่วยนั้น
 * แบบชุดคำถามคงที่ (Fixed) แสดงหลังนักเรียนศึกษาเนื้อหาสไลด์/วิดีโอในแต่ละหน่วย
 */
export function getFixedUnitQuizQuestions(
  unitIdOrSubdomain: string,
  pool?: Question[],
  count: number = 4
): Question[] {
  const { subDomain } = normalizeUnit(unitIdOrSubdomain);
  const questionPool = pool && pool.length > 0 ? pool : getQuestions();

  const domainQuestions = questionPool.filter(
    (q) =>
      q.sub_domain_code === subDomain &&
      q.active !== false &&
      q.validated !== false &&
      q.id !== 'q-draft-unvalidated' &&
      !q.question_text.includes('[ข้อสอบร่าง')
  );

  // เรียงตาม ID
  domainQuestions.sort((a, b) => a.id.localeCompare(b.id));

  // เพื่อไม่ให้ซ้ำกับข้อแรกๆ ของ Pre-test ให้เลือกตั้งแต่ index 2 เป็นต้นไปถ้ามี
  let quizItems: Question[] = [];
  if (domainQuestions.length >= 6) {
    quizItems = domainQuestions.slice(2, 2 + count);
  } else if (domainQuestions.length > count) {
    quizItems = domainQuestions.slice(domainQuestions.length - count);
  } else {
    quizItems = domainQuestions.slice(0, count);
  }

  return quizItems;
}
