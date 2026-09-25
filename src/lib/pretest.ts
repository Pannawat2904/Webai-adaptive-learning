import { Question, SubDomainCode } from '@/types/database';
import { getQuestions } from './database-service';
import { normalizeUnit } from './progress-service';

/**
 * ชุดข้อสอบทางการของแบบทดสอบก่อนเรียน (Pre-test)
 * หน่วยที่ 3 งานสร้างหน้าเว็บด้วย HTML (จำนวน 20 ข้อตรงตามเอกสารหลักสูตร)
 * ครอบคลุมเนื้อหาภาพรวมทุกหน่วยย่อย (H1 โครงสร้างพื้นฐาน, H2 ข้อความและลิงก์, H3 รูปภาพและตาราง)
 */
export const OFFICIAL_PRETEST_QUESTIONS: Question[] = [
  {
    id: 'pre-1',
    sub_domain_code: 'H1',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'เอกสาร HTML5 ต้องขึ้นต้นด้วยคำสั่งใด',
    choices: {
      A: '<!DOCTYPE html>',
      B: '<html5>',
      C: '<start>',
      D: '<web>',
    },
    correct_option: 'A',
    explanation: '<!DOCTYPE html> เป็นคำสั่งประกาศประเภทเอกสาร (Doctype Declaration) ที่ต้องอยู่บรรทัดแรกสุดเสมอเพื่อแจ้งเบราว์เซอร์ว่าเอกสารนี้ใช้มาตรฐาน HTML5',
    active: true,
    validated: true,
  },
  {
    id: 'pre-2',
    sub_domain_code: 'H1',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้บรรจุเนื้อหาที่แสดงผลจริงบนหน้าเว็บ',
    choices: {
      A: '<head>',
      B: '<body>',
      C: '<title>',
      D: '<meta>',
    },
    correct_option: 'B',
    explanation: 'แท็ก <body> ใช้สำหรับบรรจุเนื้อหาทั้งหมดที่จะแสดงผลให้ผู้ใช้มองเห็นบนหน้าเว็บ เช่น ข้อความ รูปภาพ ลิงก์ และตาราง',
    active: true,
    validated: true,
  },
  {
    id: 'pre-3',
    sub_domain_code: 'H1',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็ก <title> ใช้สำหรับอะไร',
    choices: {
      A: 'กำหนดหัวข้อใหญ่ในหน้าเว็บ',
      B: 'กำหนดชื่อที่แสดงบนแท็บของเบราว์เซอร์',
      C: 'กำหนดสีพื้นหลัง',
      D: 'กำหนดฟอนต์ของเว็บ',
    },
    correct_option: 'B',
    explanation: 'แท็ก <title> อยู่ในส่วน <head> ทำหน้าที่กำหนดชื่อเรื่องที่แสดงบนแถบแท็บของโปรแกรมเว็บเบราว์เซอร์',
    active: true,
    validated: true,
  },
  {
    id: 'pre-4',
    sub_domain_code: 'H1',
    difficulty: 'easy',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'ส่วนใดของ HTML ใช้เก็บข้อมูลเกี่ยวกับเอกสาร (metadata) เช่น title, meta, link',
    choices: {
      A: '<body>',
      B: '<head>',
      C: '<footer>',
      D: '<main>',
    },
    correct_option: 'B',
    explanation: 'ส่วน <head> ใช้เก็บข้อมูลเกี่ยวกับเอกสาร (Metadata) เช่น การเข้ารหัสอักขระ, ชื่อหน้าเว็บ, ลิงก์ไปยังไฟล์ CSS หรือสคริปต์ภายนอก ซึ่งจะไม่แสดงบนหน้าเว็บโดยตรง',
    active: true,
    validated: true,
  },
  {
    id: 'pre-5',
    sub_domain_code: 'H1',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'ข้อใดคือแท็กเปิดและแท็กปิดที่ถูกต้องของย่อหน้า',
    choices: {
      A: '<p> ... </p>',
      B: '<p> ... <p/>',
      C: '<para> ... </para>',
      D: '<p> เท่านั้น',
    },
    correct_option: 'A',
    explanation: 'แท็กย่อหน้า (Paragraph) มีรูปแบบแท็กเปิดคือ <p> และแท็กปิดคือ </p> โดยมีเครื่องหมาย Slash นำหน้าชื่อแท็ก',
    active: true,
    validated: true,
  },
  {
    id: 'pre-6',
    sub_domain_code: 'H1',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'การเขียนคำอธิบายกำกับโค้ด (Comment) ใน HTML เขียนอย่างไร',
    choices: {
      A: '// comment',
      B: '<!-- comment -->',
      C: '# comment',
      D: '/* comment */',
    },
    correct_option: 'B',
    explanation: 'การเขียน Comment ในภาษา HTML ต้องขึ้นต้นด้วย <!-- และลงท้ายด้วย --> ซึ่งเบราว์เซอร์จะไม่นำข้อความข้างในมาประมวลผลแสดงผล',
    active: true,
    validated: true,
  },
  {
    id: 'pre-7',
    sub_domain_code: 'H2',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็ก Heading ที่มีขนาดใหญ่ที่สุดคือข้อใด',
    choices: {
      A: '<h6>',
      B: '<h1>',
      C: '<head>',
      D: '<h0>',
    },
    correct_option: 'B',
    explanation: 'แท็กหัวเรื่อง (Heading) ใน HTML มีระดับตั้งแต่ <h1> ถึง <h6> โดย <h1> เป็นหัวเรื่องระดับสำคัญที่สุดและมีขนาดใหญ่ที่สุด',
    active: true,
    validated: true,
  },
  {
    id: 'pre-8',
    sub_domain_code: 'H2',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สำหรับขึ้นบรรทัดใหม่โดยไม่ต้องมีแท็กปิด',
    choices: {
      A: '<br>',
      B: '<newline>',
      C: '<hr>',
      D: '<line>',
    },
    correct_option: 'A',
    explanation: 'แท็ก <br> (Line Break) เป็นแท็กเดี่ยว (Empty Tag หรือ Void Element) ใช้สำหรับการขึ้นบรรทัดใหม่โดยไม่ต้องมีแท็กปิด',
    active: true,
    validated: true,
  },
  {
    id: 'pre-9',
    sub_domain_code: 'H2',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สร้างเส้นคั่นแนวนอนในหน้าเว็บ',
    choices: {
      A: '<line>',
      B: '<hr>',
      C: '<br>',
      D: '<divider>',
    },
    correct_option: 'B',
    explanation: 'แท็ก <hr> (Horizontal Rule) ใช้สร้างเส้นแบ่งคั่นแนวนอนเพื่อแยกเนื้อหาออกเป็นสัดส่วน',
    active: true,
    validated: true,
  },
  {
    id: 'pre-10',
    sub_domain_code: 'H2',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'รายการแบบมีลำดับ (Ordered List) ใช้แท็กใด',
    choices: {
      A: '<ul>',
      B: '<ol>',
      C: '<li>',
      D: '<list>',
    },
    correct_option: 'B',
    explanation: 'แท็ก <ol> ย่อมาจาก Ordered List ใช้สร้างรายการที่มีลำดับตัวเลขหรือตัวอักษรเรียงลำดับ',
    active: true,
    validated: true,
  },
  {
    id: 'pre-11',
    sub_domain_code: 'H2',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้กำหนดแต่ละรายการย่อยในลิสต์ ทั้งแบบมีลำดับและไม่มีลำดับ',
    choices: {
      A: '<item>',
      B: '<li>',
      C: '<row>',
      D: '<point>',
    },
    correct_option: 'B',
    explanation: 'แท็ก <li> (List Item) ใช้กำหนดแต่ละรายการย่อยที่อยู่ภายในแท็ก <ol> หรือ <ul>',
    active: true,
    validated: true,
  },
  {
    id: 'pre-12',
    sub_domain_code: 'H2',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'การสร้างลิงก์ไปยังหน้าเว็บอื่นใช้แท็กและแอตทริบิวต์ใด',
    choices: {
      A: '<link src="...">',
      B: '<a href="...">',
      C: '<url link="...">',
      D: '<a src="...">',
    },
    correct_option: 'B',
    explanation: 'แท็ก <a> (Anchor) ร่วมกับแอตทริบิวต์ href (Hypertext Reference) ใช้สำหรับสร้างจุดเชื่อมโยง (Hyperlink) ไปยังหน้าเว็บอื่น',
    active: true,
    validated: true,
  },
  {
    id: 'pre-13',
    sub_domain_code: 'H2',
    difficulty: 'easy',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'ลิงก์ที่เชื่อมโยงไปยังส่วนอื่นภายในหน้าเว็บเดียวกัน เรียกว่าอะไร',
    choices: {
      A: 'External Link',
      B: 'Internal Link',
      C: 'Absolute Link',
      D: 'Remote Link',
    },
    correct_option: 'B',
    explanation: 'Internal Link (หรือ Bookmark Link) คือการสร้างลิงก์เชื่อมโยงไปยังตำแหน่งหรือส่วนอื่นๆ ภายในหน้าเว็บหน้าเดียวกัน เช่น href="#section1"',
    active: true,
    validated: true,
  },
  {
    id: 'pre-14',
    sub_domain_code: 'H3',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สำหรับแทรกรูปภาพในหน้าเว็บ',
    choices: {
      A: '<picture-tag>',
      B: '<img>',
      C: '<image>',
      D: '<src>',
    },
    correct_option: 'B',
    explanation: 'แท็ก <img> (Image) เป็นแท็กเดี่ยวที่ใช้สำหรับแทรกรูปภาพลงบนหน้าเว็บ โดยระบุที่อยู่ไฟล์ด้วยแอตทริบิวต์ src',
    active: true,
    validated: true,
  },
  {
    id: 'pre-15',
    sub_domain_code: 'H3',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แอตทริบิวต์ใดใช้กำหนดความกว้างและความสูงของรูปภาพ',
    choices: {
      A: 'size',
      B: 'width และ height',
      C: 'scale',
      D: 'dimension',
    },
    correct_option: 'B',
    explanation: 'แอตทริบิวต์ width ใช้กำหนดความกว้าง และ height ใช้กำหนดความสูงของรูปภาพในหน่วยพิกเซล (px)',
    active: true,
    validated: true,
  },
  {
    id: 'pre-16',
    sub_domain_code: 'H3',
    difficulty: 'easy',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'Path ที่อ้างอิงตำแหน่งไฟล์แบบเต็มรูปแบบ เช่น https://www.example.com/img.jpg เรียกว่าอะไร',
    choices: {
      A: 'Relative Path',
      B: 'Absolute Path',
      C: 'Local Path',
      D: 'Short Path',
    },
    correct_option: 'B',
    explanation: 'Absolute Path คือการระบุตำแหน่งที่อยู่ไฟล์แบบเต็มรูปแบบ รวมถึงโปรโตคอลและโดเมนเนม เช่น URL บนอินเทอร์เน็ต',
    active: true,
    validated: true,
  },
  {
    id: 'pre-17',
    sub_domain_code: 'H3',
    difficulty: 'easy',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'Path ที่อ้างอิงตำแหน่งไฟล์โดยเทียบจากตำแหน่งไฟล์ปัจจุบัน เช่น images/pic.jpg เรียกว่าอะไร',
    choices: {
      A: 'Absolute Path',
      B: 'Relative Path',
      C: 'Global Path',
      D: 'Full Path',
    },
    correct_option: 'B',
    explanation: 'Relative Path คือการระบุตำแหน่งไฟล์โดยอ้างอิงเปรียบเทียบจากโฟลเดอร์หรือตำแหน่งของไฟล์เอกสาร HTML ปัจจุบัน',
    active: true,
    validated: true,
  },
  {
    id: 'pre-18',
    sub_domain_code: 'H3',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สร้างตารางในหน้าเว็บ',
    choices: {
      A: '<table>',
      B: '<grid>',
      C: '<tab>',
      D: '<data>',
    },
    correct_option: 'A',
    explanation: 'แท็ก <table> เป็นแท็กหลักที่ใช้สำหรับสร้างโครงสร้างตารางแสดงข้อมูลในหน้าเว็บ',
    active: true,
    validated: true,
  },
  {
    id: 'pre-19',
    sub_domain_code: 'H3',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้กำหนดหัวข้อของคอลัมน์ในตาราง (ตัวหนาและจัดกึ่งกลางโดยค่าเริ่มต้น)',
    choices: {
      A: '<td>',
      B: '<tr>',
      C: '<th>',
      D: '<head>',
    },
    correct_option: 'C',
    explanation: 'แท็ก <th> (Table Header) ใช้กำหนดเซลล์หัวตาราง โดยเนื้อหาภายในจะแสดงผลเป็นตัวหนาและจัดกึ่งกลางโดยค่าเริ่มต้น',
    active: true,
    validated: true,
  },
  {
    id: 'pre-20',
    sub_domain_code: 'H3',
    difficulty: 'easy',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้กำหนดแถวในตาราง และแท็กใดใช้กำหนดข้อมูลแต่ละช่อง',
    choices: {
      A: '<tr> สำหรับแถว, <td> สำหรับข้อมูล',
      B: '<td> สำหรับแถว, <tr> สำหรับข้อมูล',
      C: '<row> สำหรับแถว, <col> สำหรับข้อมูล',
      D: '<tr> สำหรับแถว, <th> สำหรับข้อมูล',
    },
    correct_option: 'A',
    explanation: 'แท็ก <tr> (Table Row) ใช้กำหนดแถวของตาราง และแท็ก <td> (Table Data) ใช้กำหนดเซลล์ข้อมูลย่อยในแต่ละแถว',
    active: true,
    validated: true,
  },
];

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
