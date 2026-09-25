import { Question, SubDomainCode } from '@/types/database';
import { getQuestions } from './database-service';
import { normalizeUnit } from './progress-service';

/**
 * ดึงชุดข้อสอบ Pre-test แบบชุดคำถามคงที่ (Fixed question set) เฉพาะหน่วยนั้นๆ
 * ไม่ใช้ Adaptive Engine และไม่ปรับระดับความยากตามคำตอบของผู้เรียน
 * ทุกคนทำข้อสอบชุดเดียวกัน ในลำดับเดียวกัน
 */
export function getFixedPretestQuestions(
  unitIdOrSubdomain: string,
  pool?: Question[],
  count: number = 5
): Question[] {
  const { subDomain } = normalizeUnit(unitIdOrSubdomain);
  const questionPool = pool && pool.length > 0 ? pool : getQuestions();

  // กรองข้อสอบเฉพาะ Sub-domain ของหน่วยนี้ และมีสถานะ active
  const domainQuestions = questionPool.filter(
    (q) => q.sub_domain_code === subDomain && q.active !== false
  );

  // เรียงลำดับตาม ID หรือลำดับที่กำหนดแน่นอน เพื่อให้ทุกคนได้ลำดับเดียวกันเสมอ
  domainQuestions.sort((a, b) => a.id.localeCompare(b.id));

  // เลือกจำนวนข้อตามที่กำหนด (ค่าเริ่มต้น 5 ข้อ)
  const selected = domainQuestions.slice(0, count);

  // หากข้อสอบในโดเมนไม่พอ ดึงข้อสอบ active อื่นๆ มาเสริม
  if (selected.length < count) {
    const others = questionPool.filter(
      (q) => q.sub_domain_code !== subDomain && q.active !== false && !selected.some((s) => s.id === q.id)
    );
    others.sort((a, b) => a.id.localeCompare(b.id));
    selected.push(...others.slice(0, count - selected.length));
  }

  return selected;
}

/**
 * ดึงชุดข้อสอบแบบฝึกหัดท้ายหน่วย (Unit Quiz) สั้นๆ 3-4 ข้อเฉพาะเนื้อหาหน่วยนั้น
 * แบบชุดคำถามคงที่ (Fixed) แสดงหลังเรียนจบสไลด์/วิดีโอ
 */
export function getFixedUnitQuizQuestions(
  unitIdOrSubdomain: string,
  pool?: Question[],
  count: number = 4
): Question[] {
  const { subDomain } = normalizeUnit(unitIdOrSubdomain);
  const questionPool = pool && pool.length > 0 ? pool : getQuestions();

  const domainQuestions = questionPool.filter(
    (q) => q.sub_domain_code === subDomain && q.active !== false
  );

  // เรียงตาม ID
  domainQuestions.sort((a, b) => a.id.localeCompare(b.id));

  // เพื่อไม่ให้ซ้ำกับ Pre-test (ซึ่งใช้ index 0-4) ให้เลือกตั้งแต่ index 4 เป็นต้นไปถ้ามี
  let quizItems: Question[] = [];
  if (domainQuestions.length >= 8) {
    quizItems = domainQuestions.slice(4, 4 + count);
  } else if (domainQuestions.length > count) {
    quizItems = domainQuestions.slice(domainQuestions.length - count);
  } else {
    quizItems = domainQuestions.slice(0, count);
  }

  return quizItems;
}
