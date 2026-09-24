import {
  Profile,
  Course,
  Unit,
  Lesson,
  Question,
  Assignment,
  SkillProfile,
  Recommendation,
  Progress,
} from '@/types/database';

export const MOCK_PROFILES: Record<string, Profile> = {
  student: {
    id: 's001-student-uuid-1111',
    role: 'student',
    full_name: 'สมชาย รักการเรียน (นักเรียน ปวช.1)',
    email: 'somchai.student@vec.mail.go.th',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    class_id: 'c001-it-year1',
    created_at: new Date().toISOString(),
  },
  teacher: {
    id: 't001-teacher-uuid-2222',
    role: 'teacher',
    full_name: 'อาจารย์ กานต์รวี พัฒนาเว็บ (ครูผู้สอน)',
    email: 'kanrawee.t@vec.mail.go.th',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    class_id: 'c001-it-year1',
    created_at: new Date().toISOString(),
  },
  admin: {
    id: 'a001-admin-uuid-3333',
    role: 'admin',
    full_name: 'ผู้ดูแลระบบ นวัตกรรม ปวช.',
    email: 'admin.tech@vec.mail.go.th',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
};

export const MOCK_COURSE: Course = {
  id: '11111111-1111-1111-1111-111111111111',
  code: 'HTML-VOC-101',
  name: 'การสร้างเว็บไซต์',
  description: 'การสร้างเว็บไซต์เบื้องต้น งานวิเคราะห์กระบวนการและโครงสร้างการทำงานของเว็บไซต์',
  status: 'active',
  created_at: new Date().toISOString(),
};

export const MOCK_UNITS: Unit[] = [
  {
    id: 'u-h1',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H1',
    title: '1.1 ความรู้พื้นฐานเกี่ยวกับอินเทอร์เน็ต',
    description: 'ความหมาย, การเชื่อมต่อ, IP Address และ URL',
    order_no: 1,
  },
  {
    id: 'u-h2',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H2',
    title: '1.2 การทำงานของเว็บไซต์เบื้องต้น',
    description: 'Domain Name, DNS, Web Hosting, Client-Server และ HTTP',
    order_no: 2,
  },
  {
    id: 'u-h3',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H3',
    title: '1.3 องค์ประกอบของเว็บไซต์',
    description: 'HTML, CSS, JavaScript, Frontend/Backend และโครงสร้างไฟล์',
    order_no: 3,
  },
  {
    id: 'u-h4',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H4',
    title: '1.4 การเขียนแผนภาพโครงสร้างเว็บไซต์',
    description: 'แผนภาพการทำงาน แผนภาพ Client-Server และแผนภาพโครงสร้างไฟล์',
    order_no: 4,
  },
  {
    id: 'u-h5',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H5',
    title: '1.5 ขั้นตอนการสร้างเว็บไซต์',
    description: 'การวางแผน ออกแบบ พัฒนา ทดสอบ เผยแพร่ และดูแลรักษา',
    order_no: 5,
  },
  {
    id: 'u-h6',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H6',
    title: '1.6 ประเภทของเว็บไซต์',
    description: 'เว็บไซต์ข่าว องค์กร พอร์ตโฟลิโอ อีคอมเมิร์ซ โซเชียลมีเดีย และ Static/Dynamic',
    order_no: 6,
  },
  {
    id: 'u-h7',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H7',
    title: '1.7 เครื่องมือพื้นฐานสำหรับพัฒนาเว็บไซต์',
    description: 'VS Code, Web Browser, Chrome DevTools และ Figma เบื้องต้น',
    order_no: 7,
  },
  {
    id: 'u-h8',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H8',
    title: '1.8 บทสรุปและทบทวน',
    description: 'ทบทวนความรู้และฝึกปฏิบัติเพื่อเตรียมสร้างเว็บไซต์',
    order_no: 8,
  },
];

export const MOCK_LESSONS: Record<string, Lesson> = {
  'u-h1': {
    id: 'l-h1',
    unit_id: 'u-h1',
    title: '1.1 ความรู้พื้นฐานเกี่ยวกับอินเทอร์เน็ต',
    content: `
### ความรู้พื้นฐานเกี่ยวกับอินเทอร์เน็ต
เรียนรู้เกี่ยวกับ:
- ความหมายของอินเทอร์เน็ต
- การเชื่อมต่ออินเทอร์เน็ต
- IP Address เบื้องต้น
- URL และส่วนประกอบของ URL

*(เนื้อหาวิดีโอและสไลด์จะถูกเพิ่มโดยคุณครูในภายหลังผ่านระบบจัดการ)*
    `,
    order_no: 1,
    media: [
      {
        id: 'm-h1-s1',
        lesson_id: 'l-h1',
        media_type: 'slide',
        title: 'ชุดสไลด์บรรยาย: โครงสร้างเอกสาร HTML5 พื้นฐาน',
        external_url: 'https://docs.google.com/presentation/d/e/2PACX-1vT-demo/embed',
        meta: {
          pages: 6,
          slides: [
            'สไลด์ 1: แนะนำวิชาและนวัตกรรมระบบเรียนรู้ปรับเหมาะเฉพาะบุคคล',
            'สไลด์ 2: โครงสร้าง DOCTYPE และความสำคัญของ Standards Mode',
            'สไลด์ 3: ส่วนประกอบแท็ก <html> และแอตทริบิวต์ lang="th"',
            'สไลด์ 4: หัวใจของ <head>: meta charset UTF-8 และ viewport',
            'สไลด์ 5: พื้นที่การแสดงผล <body>',
            'สไลด์ 6: สรุปและแบบตรวจสอบตนเอง',
          ],
        },
        order_no: 1,
      },
      {
        id: 'm-h1-v1',
        lesson_id: 'l-h1',
        media_type: 'video',
        title: 'วิดีโอสอน: เจาะลึกโครงสร้างพื้นฐาน HTML5 สำหรับเด็กช่าง ปวช.',
        external_url: 'https://www.youtube.com/embed/kUMe1FH4CHE',
        meta: { duration: 480 },
        order_no: 2,
      },
      {
        id: 'm-h1-d1',
        lesson_id: 'l-h1',
        media_type: 'document',
        title: 'เอกสารสรุปสูตรลัด: โครงสร้างไฟล์ HTML5 มาตรฐาน (PDF)',
        file_url: '#download-h1-cheatsheet',
        order_no: 3,
      },
    ],
  },
  'u-h2': {
    id: 'l-h2',
    unit_id: 'u-h2',
    title: 'บทเรียนที่ 2.1: การจัดระดับหัวเรื่องและย่อหน้าข้อความ',
    content: `
### การจัดการข้อความและลำดับขั้นของเนื้อหา

#### 1. ลำดับขั้นหัวเรื่อง (Heading Hierarchy)
- \`<h1>\` หัวเรื่องหลักสำคัญที่สุด ควรกำหนดเพียง 1 จุดต่อหน้า
- \`<h2>\` ถึง \`<h6>\` เป็นหัวเรื่องระดับย่อยตามลำดับความสำคัญ
- ห้ามใช้แท็ก Heading เพียงเพื่อหวังขนาดตัวอักษรใหญ่ ให้เน้นความหมายของเนื้อหา

#### 2. ย่อหน้าข้อความ \`<p>\`
- สำหรับแบ่งย่อหน้า เว็บเบราว์เซอร์จะเว้นช่องว่างบน-ล่าง (Margin) ให้อัตโนมัติ

#### 3. แท็กเดี่ยวควบคุมบรรทัด
- \`<br>\` ตัดขึ้นบรรทัดใหม่ทันทีในย่อหน้าเดิม
- \`<hr>\` ขีดเส้นคั่นแบ่งหัวข้อในแนวนอน

#### 4. แท็กเพิ่มความหมายข้อความ
- \`<strong>\`: ข้อความสำคัญ ตัวหนา
- \`<em>\`: ข้อความเน้นเสียง ตัวเอียง
- \`<mark>\`: ข้อความเน้นไฮไลต์สีเหลือง
    `,
    order_no: 1,
    media: [
      {
        id: 'm-h2-s1',
        lesson_id: 'l-h2',
        media_type: 'slide',
        title: 'สไลด์: การจัดลำดับ Heading และการแบ่งย่อหน้าอย่างมืออาชีพ',
        meta: {
          pages: 5,
          slides: [
            'สไลด์ 1: กฎการใช้ h1 ถึง h6',
            'สไลด์ 2: การใช้แท็ก p และการตัดบรรทัดด้วย br',
            'สไลด์ 3: ความแตกต่างระหว่าง <strong> กับ <b>',
            'สไลด์ 4: ตัวอย่างบทความข่าวสารบนเว็บจริง',
            'สไลด์ 5: สรุปแบบฝึกหัด',
          ],
        },
        order_no: 1,
      },
      {
        id: 'm-h2-v1',
        lesson_id: 'l-h2',
        media_type: 'video',
        title: 'วิดีโอสาธิต: เทคนิคการจัดรูปแบบข้อความใน HTML',
        external_url: 'https://www.youtube.com/embed/UB1O30fR-EE',
        meta: { duration: 360 },
        order_no: 2,
      },
    ],
  },
  'u-h3': {
    id: 'l-h3',
    unit_id: 'u-h3',
    title: 'บทเรียนที่ 3.1: การสร้าง Hyperlink และการเชื่อมโยงหน้าเว็บ',
    content: `
### การสร้างลิงก์ด้วยแท็ก \`<a>\` (Anchor)

Hyperlink คือแกนกลางของ World Wide Web ที่เชื่อมเอกสารหลายหน้าเข้าด้วยกัน

#### แอตทริบิวต์หลักของแท็ก \`<a>\`
1. \`href\` (Hypertext Reference): ที่อยู่ปลายทาง เช่น \`<a href="https://google.com">Google</a>\`
2. \`target="_blank"\`: เปิดหน้าต่างหรือแท็บใหม่
3. \`rel="noopener noreferrer"\`: ความปลอดภัยเมื่อเปิดแท็บใหม่
4. Anchor Link ภายในหน้าเดียวกัน:
   - จุดปลายทาง: \`<section id="contact">ติดต่อเรา</section>\`
   - จุดลิงก์: \`<a href="#contact">เลื่อนไปดูข้อมูลติดต่อ</a>\`
    `,
    order_no: 1,
    media: [
      {
        id: 'm-h3-s1',
        lesson_id: 'l-h3',
        media_type: 'slide',
        title: 'สไลด์: ลิงก์ภายในและภายนอกเว็บไซต์',
        meta: {
          pages: 4,
          slides: [
            'สไลด์ 1: แท็ก <a> และ href',
            'สไลด์ 2: การใช้ target="_blank"',
            'สไลด์ 3: เทคนิค Anchor Link #id',
            'สไลด์ 4: การทำลิงก์อีเมล mailto: และโทรศัพท์ tel:',
          ],
        },
        order_no: 1,
      },
    ],
  },
  'u-h4': {
    id: 'l-h4',
    unit_id: 'u-h4',
    title: 'บทเรียนที่ 4.1: การแทรกรูปภาพและสื่อประสม',
    content: `
### การแทรกรูปภาพด้วย \`<img>\` และสื่อมัลติมีเดีย

#### 1. แท็ก \`<img>\`
- เป็น Empty Tag / Void Element (ไม่มีแท็กปิด)
- แอตทริบิวต์จำเป็น:
  - \`src\`: เส้นทางไฟล์ภาพ
  - \`alt\`: คำบรรยายภาพ มีความสำคัญต่อ Accessibility และ SEO

#### 2. แท็กกลุ่มภาพประกอบ \`<figure>\` และ \`<figcaption>\`
\`\`\`html
<figure>
  <img src="student-project.jpg" alt="โครงงานหุ่นยนต์ของนักเรียน ปวช.">
  <figcaption>รูปที่ 1: ผลงานโครงงานหุ่นยนต์</figcaption>
</figure>
\`\`\`

#### 3. แท็ก \`<video controls>\`
- เล่นไฟล์วิดีโอโดยไม่ต้องพึ่งพา Flash
    `,
    order_no: 1,
    media: [
      {
        id: 'm-h4-s1',
        lesson_id: 'l-h4',
        media_type: 'slide',
        title: 'สไลด์: การใช้งานแท็ก img และการฝังวิดีโอ HTML5',
        meta: {
          pages: 5,
          slides: [
            'สไลด์ 1: แอตทริบิวต์ src และ alt',
            'สไลด์ 2: ทำไม alt จึงสำคัญยิ่งยวดต่อคนตาบอดและกูเกิล',
            'สไลด์ 3: การใช้ figure และ figcaption',
            'สไลด์ 4: แท็ก video และ audio พร้อม controls',
            'สไลด์ 5: สรุปภาพรวม',
          ],
        },
        order_no: 1,
      },
    ],
  },
  'u-h5': {
    id: 'l-h5',
    unit_id: 'u-h5',
    title: 'บทเรียนที่ 5.1: โครงสร้างรายการข้อมูล Lists',
    content: `
### รายการข้อมูล 3 ประเภทใน HTML

1. **รายการไม่มีลำดับ (Unordered List) \`<ul>\`**: หัวข้อแสดงเป็นจุด bullet
2. **รายการมีลำดับ (Ordered List) \`<ol>\`**: หัวข้อแสดงเป็นลำดับตัวเลข 1, 2, 3
3. **รายการคำนิยาม (Description List) \`<dl>\`**: คู่คำศัพท์ \`<dt>\` และคำอธิบาย \`<dd>\`

*ข้อสังเกต:* ภายใน \`<ul>\` หรือ \`<ol>\` สามารถมีลูกโดยตรงได้เพียงแท็ก \`<li>\` เท่านั้น
    `,
    order_no: 1,
    media: [
      {
        id: 'm-h5-s1',
        lesson_id: 'l-h5',
        media_type: 'slide',
        title: 'สไลด์: รายการข้อมูล ul ol dl ในงานพัฒนาเว็บไซต์',
        meta: {
          pages: 4,
          slides: [
            'สไลด์ 1: ul และ bullet styles',
            'สไลด์ 2: ol สำหรับแสดงขั้นตอน',
            'สไลด์ 3: การทำรายการซ้อนกัน (Nested Lists)',
            'สไลด์ 4: dl dt dd รายการคำอธิบายศัพท์',
          ],
        },
        order_no: 1,
      },
    ],
  },
  'u-h6': {
    id: 'l-h6',
    unit_id: 'u-h6',
    title: 'บทเรียนที่ 6.1: โครงสร้างตารางมาตรฐานและการผสานเซลล์',
    content: `
### โครงสร้างตาราง \`<table>\`

- \`<table>\`: ตัวครอบตาราง
- \`<tr>\`: แถวในตาราง
- \`<th>\`: เซลล์หัวตาราง (แสดงตัวหนากึ่งกลาง)
- \`<td>\`: เซลล์ข้อมูลทั่วไป
- ส่วนแบ่ง Semantic: \`<thead>\`, \`<tbody>\`, \`<tfoot>\`
- การผสานเซลล์:
  - \`colspan="2"\`: ขยาย 2 คอลัมน์ในแนวนอน
  - \`rowspan="2"\`: ขยาย 2 แถวในแนวตั้ง
    `,
    order_no: 1,
    media: [
      {
        id: 'm-h6-s1',
        lesson_id: 'l-h6',
        media_type: 'slide',
        title: 'สไลด์: การสร้างตารางข้อมูลและเทคนิค Colspan Rowspan',
        meta: {
          pages: 5,
          slides: [
            'สไลด์ 1: ตารางพื้นฐาน tr td th',
            'สไลด์ 2: โครงสร้าง thead tbody tfoot',
            'สไลด์ 3: ตัวอย่างการใช้ colspan',
            'สไลด์ 4: ตัวอย่างการใช้ rowspan',
            'สไลด์ 5: ข้อควรระวังการใช้ตารางจัดหน้าเว็บ (ห้ามใช้ layout ด้วยตาราง)',
          ],
        },
        order_no: 1,
      },
    ],
  },
  'u-h7': {
    id: 'l-h7',
    unit_id: 'u-h7',
    title: 'บทเรียนที่ 7.1: การสร้างฟอร์มและการรับข้อมูลผู้ใช้',
    content: `
### การสร้างแบบฟอร์มด้วย \`<form>\`

ฟอร์มเป็นส่วนสำคัญที่สุดในการโต้ตอบรับข้อมูลจากผู้ใช้งาน

#### แอตทริบิวต์หลักของ \`<form>\`
- \`action\`: URL ปลายทางที่ข้อมูลจะถูกส่งไป
- \`method\`: วิธีส่งข้อมูล (\`GET\` หรือ \`POST\`)

#### แท็กและชนิดของ Input
- \`<label for="uid">ชื่อผู้ใช้</label>\` คู่กับ \`<input id="uid" type="text">\`
- \`type="text"\`, \`type="password"\`, \`type="email"\`
- \`type="radio"\`: เลือก 1 จากกลุ่ม (name เดียวกัน)
- \`type="checkbox"\`: เลือกได้หลายตัวเลือก
- \`<select>\` และ \`<option>\`: กล่องเลือกแบบ Dropdown
- \`<textarea>\`: กล่องข้อความขนาดใหญ่
- \`<button type="submit">\`: ปุ่มกดส่งข้อมูล
    `,
    order_no: 1,
    media: [
      {
        id: 'm-h7-s1',
        lesson_id: 'l-h7',
        media_type: 'slide',
        title: 'สไลด์: เจาะลึกแท็ก Form, Input, Label, Select',
        meta: {
          pages: 6,
          slides: [
            'สไลด์ 1: แท็ก <form action="" method="">',
            'สไลด์ 2: การจับคู่ <label for> กับ <input id>',
            'สไลด์ 3: ชนิด Input พื้นฐาน (text, email, password)',
            'สไลด์ 4: Radio Button และ Checkbox',
            'สไลด์ 5: Dropdown ด้วย select และ textarea',
            'สไลด์ 6: ปุ่ม Submit และการตรวจสอบ Required',
          ],
        },
        order_no: 1,
      },
    ],
  },
  'u-h8': {
    id: 'l-h8',
    unit_id: 'u-h8',
    title: 'บทเรียนที่ 8.1: Semantic HTML5 และโครงสร้างหน้าเว็บทั้งหน้า',
    content: `
### โครงสร้าง Semantic HTML5 สำหรับโครงร่างหน้าเว็บทั้งหน้า

Semantic Elements ช่วยให้เอกสารมีความหมายเชิงโครงสร้าง

1. \`<header>\`: ส่วนหัวของหน้าเว็บ โลโก้ ชื่อสถาบัน
2. \`<nav>\`: เมนูนำทางหลักของเว็บไซต์
3. \`<main>\`: เนื้อหาหลักเฉพาะของหน้านั้น (มีได้เพียง 1 อันต่อหน้า)
4. \`<section>\`: หมวดหมู่เนื้อหาตามหัวข้อ
5. \`<article>\`: เนื้อหาที่สมบูรณ์ในตัวเอง เช่น ข่าว หรือโพสต์บล็อก
6. \`<aside>\`: เนื้อหาเสริม แถบข้าง
7. \`<footer>\`: ส่วนท้ายหน้าเว็บ ข้อมูลลิขสิทธิ์
    `,
    order_no: 1,
    media: [
      {
        id: 'm-h8-s1',
        lesson_id: 'l-h8',
        media_type: 'slide',
        title: 'สไลด์: การประกอบหน้าเว็บทั้งหน้าด้วย Semantic HTML5',
        meta: {
          pages: 5,
          slides: [
            'สไลด์ 1: ทำไมต้อง Semantic HTML5',
            'สไลด์ 2: header, nav, main',
            'สไลด์ 3: section, article, aside',
            'สไลด์ 4: footer และโครงสร้างหน้าเว็บมาตรฐาน',
            'สไลด์ 5: แผนผังภาพรวมหน้าเว็บยุคใหม่',
          ],
        },
        order_no: 1,
      },
    ],
  },
};

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a-h1',
    unit_id: 'u-h1',
    sub_domain_code: 'H1',
    title: 'ภารกิจที่ 1: สร้างกระดูกงูโครงสร้างเอกสาร HTML5',
    description: 'เขียนโครงสร้างมาตรฐานของ HTML5 โดยมี DOCTYPE, html lang="th", head ที่มี meta charset UTF-8 และ title, และส่วน body ที่มีข้อความ',
    starter_code: `<!DOCTYPE html>
<html lang="th">
<head>
  <!-- ให้นักเรียนเพิ่ม meta charset และ title ที่นี่ -->
</head>
<body>
  <h1>สวัสดีชาวโลก!</h1>
  <!-- ให้นักเรียนเขียนเนื้อหาต้อนรับเพิ่มเติมที่นี่ -->
</body>
</html>`,
    checklist: [
      { id: 'c1', label: 'มีคำประกาศ <!DOCTYPE html>', selector: '!doctype' },
      { id: 'c2', label: 'แท็ก <html> มีแอตทริบิวต์ lang="th"', selector: 'html[lang=th]' },
      { id: 'c3', label: 'มีแท็ก <meta charset="UTF-8"> ใน <head>', selector: 'head meta[charset]' },
      { id: 'c4', label: 'มีแท็ก <title> ระบุชื่อหัวข้อหน้าเว็บ', selector: 'head title' },
      { id: 'c5', label: 'มีส่วน <body> สำหรับวางเนื้อหา', selector: 'body' },
    ],
    difficulty: 'easy',
    order_no: 1,
  },
  {
    id: 'a-h2',
    unit_id: 'u-h2',
    sub_domain_code: 'H2',
    title: 'ภารกิจที่ 2: จัดหน้าบทความแนะนำตนเองด้วย Headings และ Paragraphs',
    description: 'สร้างหน้าประวัติส่วนตัวโดยใช้หัวเรื่อง h1 หนึ่งจุด, หัวเรื่องย่อย h2 อย่างน้อยสองจุด, ย่อหน้า p อย่างน้อยสองย่อหน้า และมีเส้นคั่น hr',
    starter_code: `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ประวัติส่วนตัวของฉัน</title>
</head>
<body>
  <!-- เริ่มเขียน h1, h2, p และ hr ที่นี่ -->
</body>
</html>`,
    checklist: [
      { id: 'c1', label: 'มีหัวเรื่องหลัก <h1> 1 จุด', selector: 'h1', minCount: 1 },
      { id: 'c2', label: 'มีหัวเรื่องย่อย <h2> อย่างน้อย 2 จุด', selector: 'h2', minCount: 2 },
      { id: 'c3', label: 'มีย่อหน้าข้อความ <p> อย่างน้อย 2 ย่อหน้า', selector: 'p', minCount: 2 },
      { id: 'c4', label: 'มีเส้นคั่นแนวนอน <hr>', selector: 'hr', minCount: 1 },
    ],
    difficulty: 'easy',
    order_no: 2,
  },
  {
    id: 'a-h4',
    unit_id: 'u-h4',
    sub_domain_code: 'H4',
    title: 'ภารกิจที่ 3: แทรกภาพพร้อมคำบรรยายและ alt attribute',
    description: 'แทรกรูปภาพโดยใช้แท็ก <img> ที่มีแอตทริบิวต์ alt และครอบด้วยแท็ก <figure> คู่กับ <figcaption>',
    starter_code: `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>แกลเลอรีผลงาน</title>
</head>
<body>
  <!-- เขียนแท็ก figure, img ที่มี alt, และ figcaption -->
</body>
</html>`,
    checklist: [
      { id: 'c1', label: 'มีแท็ก <figure> ครอบภาพ', selector: 'figure', minCount: 1 },
      { id: 'c2', label: 'มีแท็ก <img> พร้อมแอตทริบิวต์ alt อธิบายภาพ', selector: 'figure img[alt]', minCount: 1 },
      { id: 'c3', label: 'มีแท็ก <figcaption> สำหรับคำบรรยายภาพ', selector: 'figure figcaption', minCount: 1 },
    ],
    difficulty: 'medium',
    order_no: 3,
  },
  {
    id: 'a-h7',
    unit_id: 'u-h7',
    sub_domain_code: 'H7',
    title: 'ภารกิจที่ 4: สร้างฟอร์มสมัครสมาชิกแผนกวิชา',
    description: 'สร้างแบบฟอร์ม <form> มีช่องกรอกชื่อผู้ใช้, รหัสผ่าน, อีเมล, การผูก <label for> กับ <input id> และปุ่มส่งข้อมูล',
    starter_code: `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ฟอร์มลงทะเบียน</title>
</head>
<body>
  <!-- สร้างแบบฟอร์มพร้อม input และ label ที่นี่ -->
</body>
</html>`,
    checklist: [
      { id: 'c1', label: 'มีแท็ก <form>', selector: 'form', minCount: 1 },
      { id: 'c2', label: 'มีช่องกรอกชื่อผู้ใช้ หรืออีเมล', selector: 'form input[type=text], form input[type=email]', minCount: 1 },
      { id: 'c3', label: 'มีช่องกรอกรหัสผ่าน type="password"', selector: 'form input[type=password]', minCount: 1 },
      { id: 'c4', label: 'มีการใช้แท็ก <label>', selector: 'form label', minCount: 1 },
      { id: 'c5', label: 'มีปุ่มส่งข้อมูล (button หรือ input submit)', selector: 'button[type=submit], input[type=submit], form button', minCount: 1 },
    ],
    difficulty: 'medium',
    order_no: 4,
  },
  {
    id: 'a-h8',
    unit_id: 'u-h8',
    sub_domain_code: 'H8',
    title: 'ภารกิจที่ 5: ประกอบหน้าเว็บโครงสร้าง Semantic HTML5 ทั้งหน้า',
    description: 'ออกแบบโครงสร้างหน้าแรกของเว็บไซต์วิทยาลัย โดยใช้ Semantic HTML5 ครบถ้วน ได้แก่ header, nav, main, section, aside และ footer',
    starter_code: `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>เว็บไซต์วิทยาลัยอาชีวศึกษา</title>
</head>
<body>
  <!-- เขียนโครงสร้าง Semantic HTML5 ครบทุกส่วนที่นี่ -->
</body>
</html>`,
    checklist: [
      { id: 'c1', label: 'มีส่วนหัว <header>', selector: 'header', minCount: 1 },
      { id: 'c2', label: 'มีเมนูนำทาง <nav> พร้อมลิงก์ <a>', selector: 'nav a', minCount: 1 },
      { id: 'c3', label: 'มีเนื้อหาหลัก <main>', selector: 'main', minCount: 1 },
      { id: 'c4', label: 'มีส่วนเนื้อหาย่อย <section> หรือ <article>', selector: 'section, article', minCount: 1 },
      { id: 'c5', label: 'มีแถบข้างเสริม <aside>', selector: 'aside', minCount: 1 },
      { id: 'c6', label: 'มีส่วนท้ายเว็บ <footer>', selector: 'footer', minCount: 1 },
    ],
    difficulty: 'hard',
    order_no: 5,
  },
];

// 40 Realistic Questions covering H1 to H8
export const MOCK_QUESTIONS: Question[] = [
  // H1
  {
    id: 'q-h1-1',
    sub_domain_code: 'H1',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'คำสั่งใดต้องอยู่บรรทัดแรกสุดของเอกสาร HTML5 เสมอ?',
    choices: {
      A: '<!DOCTYPE html>',
      B: '<html>',
      C: '<head>',
      D: '<meta charset="UTF-8">',
    },
    correct_option: 'A',
    explanation: '<!DOCTYPE html> ต้องอยู่บรรทัดแรกสุดเสมอเพื่อประกาศให้เบราว์เซอร์ทราบว่าเอกสารนี้ใช้มาตรฐาน HTML5',
    active: true,
  },
  {
    id: 'q-h1-2',
    sub_domain_code: 'H1',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สำหรับกำหนดชื่อหัวข้อที่แสดงบนแท็บของโปรแกรมเว็บเบราว์เซอร์?',
    choices: {
      A: '<header>',
      B: '<title>',
      C: '<heading>',
      D: '<h1>',
    },
    correct_option: 'B',
    explanation: 'แท็ก <title> อยู่ในส่วน <head> ทำหน้าที่กำหนดชื่อหัวข้อที่แสดงบนแถบแท็บของเว็บเบราว์เซอร์',
    active: true,
  },
  {
    id: 'q-h1-3',
    sub_domain_code: 'H1',
    difficulty: 'medium',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'การใส่แท็ก <meta charset="UTF-8"> ในส่วน <head> มีวัตถุประสงค์หลักเพื่ออะไร?',
    choices: {
      A: 'เพื่อเชื่อมต่อไปยังไฟล์ CSS ภายนอก',
      B: 'เพื่อรองรับการแสดงผลตัวอักษรภาษาไทยและสากลได้อย่างถูกต้อง ป้องกันปัญหาตัวอักษรต่างดาว',
      C: 'เพื่อกำหนดให้หน้าเว็บโหลดเร็วขึ้น',
      D: 'เพื่อปรับขนาดหน้าเว็บให้เข้ากับจอมือถือ',
    },
    correct_option: 'B',
    explanation: 'UTF-8 คือการเข้ารหัสชุดอักขระสากล ช่วยป้องกันปัญหาข้อความภาษาไทยแสดงผลเป็นภาษาต่างดาว',
    active: true,
  },
  {
    id: 'q-h1-4',
    sub_domain_code: 'H1',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'จากโครงสร้างต่อไปนี้ ส่วนใดแสดงข้อผิดพลาดทางลำดับมาตรฐานของ HTML?',
    code_snippet: '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>สวัสดี</h1>\n  </body>\n  <head>\n    <title>หน้าแรก</title>\n  </head>\n</html>',
    choices: {
      A: 'ไม่มีแท็ก <main>',
      B: 'ส่วน <head> ต้องมาก่อนส่วน <body> เสมอ',
      C: 'ห้ามใส่ <h1> ใน <body>',
      D: 'ไม่มีแอตทริบิวต์ lang ใน html',
    },
    correct_option: 'B',
    explanation: 'ตามโครงสร้างมาตรฐานของ HTML ส่วน <head> จะต้องอยู่ก่อนส่วน <body> เสมอ',
    active: true,
  },
  {
    id: 'q-h1-5',
    sub_domain_code: 'H1',
    difficulty: 'hard',
    cognitive_level: 'analysis',
    answer_type: 'single_choice',
    question_text: 'แท็ก <meta name="viewport" content="width=device-width, initial-scale=1.0"> ส่งผลต่อการแสดงผลหน้าเว็บอย่างไร?',
    choices: {
      A: 'ขยายความละเอียดของภาพในหน้าเว็บให้เป็นระบบ 4K',
      B: 'ควบคุมขนาดของ viewport ให้ตรงกับความกว้างหน้าจออุปกรณ์และกำหนดระดับการซูมเริ่มต้นเป็น 1:1',
      C: 'ป้องกันไม่ให้ผู้ใช้สามารถซูมหน้าเว็บบนสมาร์ทโฟนได้',
      D: 'แปลงเค้าโครงเดสก์ท็อปให้เป็นแอปพลิเคชันมือถืออัตโนมัติ',
    },
    correct_option: 'B',
    explanation: 'Viewport meta tag กำหนดความกว้างพื้นที่แสดงผลให้ตรงกับหน้าจอของอุปกรณ์ (width=device-width) และกำหนดมาตราส่วนเริ่มต้นเป็น 1.0 ซึ่งเป็นพื้นฐานสำคัญของ Responsive Web Design',
    active: true,
  },

  // H2
  {
    id: 'q-h2-1',
    sub_domain_code: 'H2',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กหัวเรื่อง (Heading) ใดมีระดับความสำคัญสูงสุดและขนาดตัวอักษรเริ่มต้นใหญ่ที่สุด?',
    choices: {
      A: '<h6>',
      B: '<head>',
      C: '<h1>',
      D: '<header>',
    },
    correct_option: 'C',
    explanation: '<h1> เป็นหัวเรื่องระดับสูงสุด (Main heading) ตามมาตรฐานโครงสร้าง HTML',
    active: true,
  },
  {
    id: 'q-h2-2',
    sub_domain_code: 'H2',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'หากต้องการขึ้นบรรทัดใหม่ภายในย่อหน้าเดิมโดยไม่ต้องเปิดย่อหน้าใหม่ ควรใช้แท็กใด?',
    choices: {
      A: '<p>',
      B: '<hr>',
      C: '<br>',
      D: '<line>',
    },
    correct_option: 'C',
    explanation: 'แท็ก <br> (Line Break) เป็นแท็กเดี่ยว ใช้สำหรับสั่งตัดบรรทัดขึ้นบรรทัดใหม่ทันทีในย่อหน้าเดิม',
    active: true,
  },
  {
    id: 'q-h2-3',
    sub_domain_code: 'H2',
    difficulty: 'medium',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'ความแตกต่างเชิงความหมาย (Semantic Meaning) ระหว่างแท็ก <strong> กับ <b> คือข้อใด?',
    choices: {
      A: '<strong> แสดงข้อความเอียง ส่วน <b> แสดงข้อความหนา',
      B: '<strong> สื่อถึงความสำคัญของเนื้อหา ในขณะที่ <b> เน้นเพียงความหนาทางสายตาโดยไม่มีนัยความสำคัญเชิงโครงสร้าง',
      C: '<strong> ใช้สำหรับหัวเรื่องเท่านั้น ส่วน <b> ใช้ในย่อหน้า',
      D: 'ไม่มีความแตกต่างใดๆ ทั้งสองแท็กทำหน้าที่เหมือนกันทุกประการ',
    },
    correct_option: 'B',
    explanation: '<strong> มีความหมายเชิง Semantic สื่อว่าข้อความนี้มีความสำคัญยิ่งยวด ส่วน <b> เป็นแท็กเชิงนำเสนอทางสายตาเท่านั้น',
    active: true,
  },
  {
    id: 'q-h2-4',
    sub_domain_code: 'H2',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'หากต้องการสร้างเส้นคั่นแนวนอนเพื่อแบ่งเนื้อหาออกจากกัน ควรใช้แท็กใด?',
    choices: {
      A: '<divider>',
      B: '<border>',
      C: '<hr>',
      D: '<split>',
    },
    correct_option: 'C',
    explanation: 'แท็ก <hr> (Horizontal Rule) ใช้สร้างเส้นคั่นแนวนอนเพื่อระบุการเปลี่ยนหัวข้อหรือแบ่งส่วนเนื้อหา',
    active: true,
  },
  {
    id: 'q-h2-5',
    sub_domain_code: 'H2',
    difficulty: 'hard',
    cognitive_level: 'analysis',
    answer_type: 'single_choice',
    question_text: 'ข้อใดเป็นแนวปฏิบัติด้านโครงสร้างลำดับชั้นหัวเรื่อง (Heading Hierarchy) ที่ถูกต้องตามหลัก Accessibility และ SEO?',
    choices: {
      A: 'ข้ามจาก <h1> ไปยัง <h3> ได้ทันทีหากต้องการให้ข้อความมีขนาดเล็ก',
      B: 'ควรมี <h1> เพียง 1 จุดต่อหน้า และเรียงลำดับหัวเรื่องย่อย <h2> ต่อด้วย <h3> ตามลำดับโดยไม่ข้ามขั้น',
      C: 'สามารถใช้ <h1> ซ้ำๆ ได้ทุกจุดในย่อหน้าเพื่อเน้นคำสำคัญ',
      D: 'ใช้ <h6> สำหรับข้อความทั่วไปเพื่อประหยัดเนื้อที่หน้าจอ',
    },
    correct_option: 'B',
    explanation: 'โครงสร้าง Heading ที่ดีควรมี <h1> เพียงจุดเดียวต่อหน้าสำหรับชื่อเรื่องหลัก และจัดลำดับย่อย <h2>, <h3> เป็นขั้นบันไดโดยไม่ข้ามขั้น เพื่อช่วยให้อุปกรณ์อ่านหน้าจอเข้าใจลำดับของข้อมูล',
    active: true,
  },

  // H3
  {
    id: 'q-h3-1',
    sub_domain_code: 'H3',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สำหรับการสร้าง Hyperlink เชื่อมโยงไปยังหน้าเว็บอื่น?',
    choices: {
      A: '<link>',
      B: '<a>',
      C: '<href>',
      D: '<url>',
    },
    correct_option: 'B',
    explanation: 'แท็ก <a> (Anchor) เป็นแท็กสำหรับสร้างจุดเชื่อมโยงหลายมิติ (Hyperlink)',
    active: true,
  },
  {
    id: 'q-h3-2',
    sub_domain_code: 'H3',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แอตทริบิวต์ใดในแท็ก <a> ใช้สำหรับระบุที่อยู่ URL ปลายทางที่ต้องการเชื่อมโยงไป?',
    choices: {
      A: 'src',
      B: 'to',
      C: 'href',
      D: 'target',
    },
    correct_option: 'C',
    explanation: 'แอตทริบิวต์ href (Hypertext Reference) ใช้ระบุปลายทางของลิงก์',
    active: true,
  },
  {
    id: 'q-h3-3',
    sub_domain_code: 'H3',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'หากต้องการให้ลิงก์เปิดหน้าต่างหรือแท็บใหม่ของเบราว์เซอร์ ต้องกำหนดแอตทริบิวต์อย่างไร?',
    choices: {
      A: 'target="_blank"',
      B: 'target="_new"',
      C: 'open="new_tab"',
      D: 'window="blank"',
    },
    correct_option: 'A',
    explanation: 'target="_blank" เป็นค่ามาตรฐานที่สั่งให้เบราว์เซอร์เปิดเอกสารปลายทางในหน้าต่างหรือแท็บใหม่',
    active: true,
  },
  {
    id: 'q-h3-4',
    sub_domain_code: 'H3',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'การสร้าง Anchor Link เพื่อเลื่อนไปยังส่วนที่มี id="contact" ภายในหน้าเดียวกัน ต้องเขียน href อย่างไร?',
    choices: {
      A: 'href="id:contact"',
      B: 'href="@contact"',
      C: 'href="#contact"',
      D: 'href="/contact"',
    },
    correct_option: 'C',
    explanation: 'การอ้างอิง id ภายในหน้าเดียวกันต้องใช้สัญลักษณ์ชาร์ป (#) ตามด้วยชื่อ id เช่น href="#contact"',
    active: true,
  },
  {
    id: 'q-h3-5',
    sub_domain_code: 'H3',
    difficulty: 'hard',
    cognitive_level: 'analysis',
    answer_type: 'single_choice',
    question_text: 'เมื่อใช้ <a href="https://example.com" target="_blank"> ควรเพิ่มแอตทริบิวต์ใดเพื่อความปลอดภัยและป้องกันช่องโหว่?',
    choices: {
      A: 'rel="noopener noreferrer"',
      B: 'secure="true"',
      C: 'sandbox="allow-same-origin"',
      D: 'type="external"',
    },
    correct_option: 'A',
    explanation: 'rel="noopener noreferrer" ป้องกันไม่ให้หน้าเว็บปลายทางเข้าถึง window.opener ของหน้าเว็บต้นทาง ป้องกันช่องโหว่ Reverse Tabnabbing',
    active: true,
  },

  // H4
  {
    id: 'q-h4-1',
    sub_domain_code: 'H4',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สำหรับการแทรกรูปภาพลงในเอกสาร HTML?',
    choices: {
      A: '<picture>',
      B: '<image>',
      C: '<img>',
      D: '<media>',
    },
    correct_option: 'C',
    explanation: 'แท็ก <img> เป็นแท็กมาตรฐานสำหรับแทรกรูปภาพลงในเอกสาร',
    active: true,
  },
  {
    id: 'q-h4-2',
    sub_domain_code: 'H4',
    difficulty: 'easy',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'แอตทริบิวต์ alt ในแท็ก <img> มีไว้เพื่อวัตถุประสงค์ใดเป็นหลัก?',
    choices: {
      A: 'กำหนดขนาดความกว้างและความสูงของภาพ',
      B: 'กำหนดข้อความอธิบายภาพเมื่อภาพไม่แสดงผลและเพื่อการเข้าถึง (Accessibility) สำหรับผู้พิการทางสายตา',
      C: 'ระบุฟิลเตอร์เอฟเฟกต์ของภาพ',
      D: 'กำหนดตำแหน่งภาพให้อยู่กึ่งกลาง',
    },
    correct_option: 'B',
    explanation: 'alt (Alternative text) แสดงข้อความแทนเมื่อไฟล์ภาพโหลดไม่ติด และช่วยให้โปรแกรมอ่านหน้าจอสำหรับผู้พิการทางสายตาสามารถอ่านอธิบายความหมายของภาพได้',
    active: true,
  },
  {
    id: 'q-h4-3',
    sub_domain_code: 'H4',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'หากต้องการจัดกลุ่มรูปภาพคู่กับคำบรรยายใต้ภาพอย่างมีความหมาย (Semantic) ควรใช้คู่แท็กใด?',
    choices: {
      A: '<div> คู่กับ <span>',
      B: '<figure> คู่กับ <figcaption>',
      C: '<image> คู่กับ <label>',
      D: '<media> คู่กับ <desc>',
    },
    correct_option: 'B',
    explanation: '<figure> ใช้ครอบรูปภาพหรือภาพประกอบ และ <figcaption> ใช้สำหรับระบุคำบรรยายใต้ภาพนั้น',
    active: true,
  },
  {
    id: 'q-h4-4',
    sub_domain_code: 'H4',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'การแทรกวิดีโอด้วยแท็ก <video> ต้องใส่แอตทริบิวต์ใดเพื่อให้มีปุ่มเล่น/หยุด และแถบปรับระดับเสียงแสดงขึ้นมา?',
    choices: {
      A: 'autoplay',
      B: 'controls',
      C: 'buttons',
      D: 'player',
    },
    correct_option: 'B',
    explanation: 'แอตทริบิวต์ controls สั่งให้เบราว์เซอร์แสดงชุดควบคุมการเล่นวิดีโอ (เล่น, หยุด, ระดับเสียง, ขยายเต็มจอ)',
    active: true,
  },
  {
    id: 'q-h4-5',
    sub_domain_code: 'H4',
    difficulty: 'hard',
    cognitive_level: 'analysis',
    answer_type: 'single_choice',
    question_text: 'ข้อใดอธิบายคุณสมบัติการทำงานของแท็ก <img> ได้ถูกต้องตามข้อกำหนด HTML5?',
    choices: {
      A: 'เป็น Block-level element และต้องมีแท็กปิด </img> เสมอ',
      B: 'เป็น Void element (ไม่มีแท็กปิด) มีพฤติกรรมแสดงผลแบบ Inline-block/Replaced element และดึงข้อมูลภาพจากภายนอกผ่าน src',
      C: 'เก็บข้อมูลพิกเซลรูปภาพไว้ภายในตัวไฟล์ HTML โดยตรงเสมอ',
      D: 'ต้องประกาศ width และ height ในส่วน <head> ของเอกสารเท่านั้น',
    },
    correct_option: 'B',
    explanation: '<img> เป็น Void element (ไม่มีแท็กปิด) โดยมีพฤติกรรมการแสดงผลแบบ Replaced inline element และโหลดภาพจาก URL ที่ระบุใน src',
    active: true,
  },

  // H5
  {
    id: 'q-h5-1',
    sub_domain_code: 'H5',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สร้างรายการแบบไม่มีลำดับ (แสดงสัญลักษณ์จุด Bullet points)?',
    choices: {
      A: '<ol>',
      B: '<ul>',
      C: '<li>',
      D: '<list>',
    },
    correct_option: 'B',
    explanation: '<ul> (Unordered List) ใช้สร้างรายการแบบไม่มีลำดับ',
    active: true,
  },
  {
    id: 'q-h5-2',
    sub_domain_code: 'H5',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้ระบุรายการข้อมูลแต่ละรายการภายใน <ul> หรือ <ol>?',
    choices: {
      A: '<li>',
      B: '<item>',
      C: '<dt>',
      D: '<dd>',
    },
    correct_option: 'A',
    explanation: '<li> (List Item) ใช้ระบุข้อมูลในแต่ละรายการ',
    active: true,
  },
  {
    id: 'q-h5-3',
    sub_domain_code: 'H5',
    difficulty: 'medium',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'หากต้องการสร้างรายการขั้นตอนที่มีลำดับขั้นตอนชัดเจน (1, 2, 3...) ควรเลือกใช้แท็กใด?',
    choices: {
      A: '<ul>',
      B: '<dl>',
      C: '<ol>',
      D: '<step>',
    },
    correct_option: 'C',
    explanation: '<ol> (Ordered List) ใช้สำหรับรายการที่มีลำดับตัวเลข 1, 2, 3...',
    active: true,
  },
  {
    id: 'q-h5-4',
    sub_domain_code: 'H5',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'โครงสร้าง Description List (<dl>) ประกอบด้วยแท็กคู่ใด?',
    choices: {
      A: '<dt> (คำศัพท์) และ <dd> (คำอธิบาย)',
      B: '<th> (หัวข้อ) และ <td> (ข้อมูล)',
      C: '<ul> (กลุ่ม) และ <li> (ย่อย)',
      D: '<item> (รายการ) และ <desc> (รายละเอียด)',
    },
    correct_option: 'A',
    explanation: '<dl> ประกอบด้วย <dt> (Definition Term) สำหรับชื่อคำศัพท์ และ <dd> (Definition Description) สำหรับคำนิยาม',
    active: true,
  },
  {
    id: 'q-h5-5',
    sub_domain_code: 'H5',
    difficulty: 'hard',
    cognitive_level: 'analysis',
    answer_type: 'single_choice',
    question_text: 'โครงสร้างการทำ Nested List (รายการซ้อนกัน) ใน HTML ข้อใดถูกต้องตามมาตรฐานไวยากรณ์?',
    choices: {
      A: '<ul> ย่อยต้องถูกบรรจุอยู่ภายในแท็ก <li> ของรายการแม่',
      B: '<ul> สามารถซ้อนอยู่ใต้แท็ก <ul> ได้โดยตรงโดยไม่ต้องมี <li> ครอบ',
      C: 'HTML ไม่อนุญาตให้สร้างรายการซ้อนกันในทุกกรณี',
      D: 'ต้องใช้แท็ก <nested> ครอบเท่านั้น',
    },
    correct_option: 'A',
    explanation: 'ตามมาตรฐาน HTML เนื้อหาที่เป็นลูกของ <ul> หรือ <ol> ต้องเป็นแท็ก <li> เท่านั้น ดังนั้นหากจะซ้อน <ul> ใหม่ จะต้องนำไปวางไว้ข้างในแท็ก <li> ของรายการนั้น',
    active: true,
  },

  // H6
  {
    id: 'q-h6-1',
    sub_domain_code: 'H6',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สำหรับสร้างแถวของตาราง (Table Row)?',
    choices: {
      A: '<td>',
      B: '<th>',
      C: '<tr>',
      D: '<row>',
    },
    correct_option: 'C',
    explanation: '<tr> (Table Row) ใช้กำหนดแถวแต่ละแถวในตาราง',
    active: true,
  },
  {
    id: 'q-h6-2',
    sub_domain_code: 'H6',
    difficulty: 'easy',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'เซลล์ที่เป็นหัวตาราง (Table Header) ควรใช้แท็กใด ซึ่งเบราว์เซอร์จะแสดงผลเป็นตัวหนาและกึ่งกลาง?',
    choices: {
      A: '<td>',
      B: '<th>',
      C: '<thead-cell>',
      D: '<title>',
    },
    correct_option: 'B',
    explanation: '<th> (Table Header) ใช้สำหรับเซลล์หัวตาราง',
    active: true,
  },
  {
    id: 'q-h6-3',
    sub_domain_code: 'H6',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'หากต้องการให้เซลล์หนึ่งช่องขยายครอบคลุม 3 คอลัมน์ในแนวนอน ต้องใช้แอตทริบิวต์ใด?',
    choices: {
      A: 'rowspan="3"',
      B: 'colspan="3"',
      C: 'width="3"',
      D: 'merge="column-3"',
    },
    correct_option: 'B',
    explanation: 'colspan (Column Span) ใช้สำหรับผสานหรือขยายเซลล์ครอบคลุมหลายคอลัมน์ในแนวนอน',
    active: true,
  },
  {
    id: 'q-h6-4',
    sub_domain_code: 'H6',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'หากต้องการผสานเซลล์ในแนวตั้งควบ 2 แถว ต้องใช้แอตทริบิวต์ใด?',
    choices: {
      A: 'rowspan="2"',
      B: 'colspan="2"',
      C: 'linespan="2"',
      D: 'height="2"',
    },
    correct_option: 'A',
    explanation: 'rowspan (Row Span) ใช้ขยายเซลล์ครอบคลุมหลายแถวในแนวตั้ง',
    active: true,
  },
  {
    id: 'q-h6-5',
    sub_domain_code: 'H6',
    difficulty: 'hard',
    cognitive_level: 'analysis',
    answer_type: 'single_choice',
    question_text: 'โครงสร้างตาราง HTML ที่สมบูรณ์ตามหลัก Semantic ควรประกอบด้วยแท็กแบ่งส่วนกลุ่มใด?',
    choices: {
      A: '<top>, <middle>, <bottom>',
      B: '<thead>, <tbody>, <tfoot>',
      C: '<header>, <content>, <footer>',
      D: '<start>, <data>, <end>',
    },
    correct_option: 'B',
    explanation: '<thead> (หัวตาราง), <tbody> (เนื้อหาตาราง) และ <tfoot> (ท้ายตาราง/สรุป) เป็นแท็กกลุ่ม Semantic สำหรับจัดระเบียบตารางข้อมูล',
    active: true,
  },

  // H7
  {
    id: 'q-h7-1',
    sub_domain_code: 'H7',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้เป็นภาชนะหลักในการรวบรวมองค์ประกอบการรับข้อมูลเพื่อส่งไปยังเซิร์ฟเวอร์?',
    choices: {
      A: '<input>',
      B: '<form>',
      C: '<fieldset>',
      D: '<submit>',
    },
    correct_option: 'B',
    explanation: '<form> เป็นแท็กหลักที่ครอบส่วนการรับข้อมูลทั้งหมด',
    active: true,
  },
  {
    id: 'q-h7-2',
    sub_domain_code: 'H7',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'หากต้องการให้ผู้ใช้งานกรอกรหัสผ่านโดยไม่แสดงตัวอักษรบนหน้าจอ ควรใช้ <input> ชนิดใด?',
    choices: {
      A: 'type="text"',
      B: 'type="secret"',
      C: 'type="password"',
      D: 'type="hidden"',
    },
    correct_option: 'C',
    explanation: 'type="password" จะซ่อนตัวอักษรที่ผู้ใช้พิมพ์โดยแสดงเป็นจุดหรือดอกจันแทน',
    active: true,
  },
  {
    id: 'q-h7-3',
    sub_domain_code: 'H7',
    difficulty: 'medium',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'เหตุใดจึงควรจับคู่ <label for="..."> ให้ตรงกับ id ของแท็ก <input>?',
    choices: {
      A: 'เพื่อเปลี่ยนสีข้อความของช่องกรอกให้สวยงาม',
      B: 'เพื่อให้ผู้ใช้สามารถคลิกที่ข้อความ label แล้วเคอร์เซอร์จะกระโดดไปโฟกัสที่ช่อง input นั้นทันที',
      C: 'เพื่อป้องกันไม่ให้ผู้ใช้ส่งแบบฟอร์มเปล่า',
      D: 'เพื่อบังคับให้เบราว์เซอร์เข้ารหัส SSL',
    },
    correct_option: 'B',
    explanation: 'การใช้ label for="x" คู่กับ input id="x" ช่วยเพิ่มพื้นที่คลิก (ผู้ใช้คลิกข้อความ label เพื่อเลือกช่องได้) และช่วยให้โปรแกรมอ่านหน้าจอ Screen Reader แจ้งชื่อช่องกรอกได้อย่างถูกต้อง',
    active: true,
  },
  {
    id: 'q-h7-4',
    sub_domain_code: 'H7',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'หากต้องการสร้างตัวเลือกแบบ Radio Button ให้ผู้ใช้เลือกได้เพียงตัวเลือกเดียวในกลุ่ม ต้องทำอย่างไร?',
    choices: {
      A: 'ตั้งชื่อแอตทริบิวต์ name ของทุกตัวเลือกให้เหมือนกัน',
      B: 'ตั้งแอตทริบิวต์ id ให้เหมือนกันทุกตัว',
      C: 'ใส่แอตทริบิวต์ single="true"',
      D: 'ใช้แท็ก <select> เท่านั้น',
    },
    correct_option: 'A',
    explanation: 'อินพุตแบบ radio ที่มีค่าแอตทริบิวต์ name เหมือนกันจะถูกจัดเป็นกลุ่มเดียวกัน ทำให้เลือกได้เพียง 1 ตัวเลือกเท่านั้น',
    active: true,
  },
  {
    id: 'q-h7-5',
    sub_domain_code: 'H7',
    difficulty: 'hard',
    cognitive_level: 'analysis',
    answer_type: 'single_choice',
    question_text: 'ข้อใดระบุความแตกต่างระหว่าง method="GET" และ method="POST" ในแท็ก <form> ได้ถูกต้องที่สุด?',
    choices: {
      A: 'GET ใช้กับแบบฟอร์มที่มีรหัสผ่าน ส่วน POST ใช้ค้นหาข้อมูลทั่วไป',
      B: 'GET แนบข้อมูลต่อท้าย URL ใน Query String จึงไม่เหมาะกับข้อมูลสำคัญ ส่วน POST ส่งข้อมูลใน Request Body มีความปลอดภัยมากกว่า',
      C: 'GET สามารถส่งไฟล์รูปภาพได้ดีกว่า POST',
      D: 'GET และ POST ไม่มีความแตกต่างในฝั่งเซิร์ฟเวอร์',
    },
    correct_option: 'B',
    explanation: 'method="GET" จะแนบข้อมูลไปกับ URL ทำให้ปรากฏใน Address Bar และประวัติเบราว์เซอร์ จึงไม่ควรใช้ส่งข้อมูลสำคัญ ส่วน POST ส่งข้อมูลแนบใน Body ของ HTTP Request',
    active: true,
  },

  // H8
  {
    id: 'q-h8-1',
    sub_domain_code: 'H8',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สำหรับกำหนดพื้นที่เมนูนำทางหลักของเว็บไซต์ (Navigation links)?',
    choices: {
      A: '<menu>',
      B: '<nav>',
      C: '<navigate>',
      D: '<links>',
    },
    correct_option: 'B',
    explanation: '<nav> เป็นแท็ก Semantic ที่ใช้ระบุส่วนของเมนูนำทางหลักของเว็บไซต์',
    active: true,
  },
  {
    id: 'q-h8-2',
    sub_domain_code: 'H8',
    difficulty: 'easy',
    cognitive_level: 'remembering',
    answer_type: 'single_choice',
    question_text: 'แท็กใดใช้สำหรับระบุส่วนท้ายของหน้าเว็บ ซึ่งมักมีข้อมูลลิขสิทธิ์และช่องทางติดต่อ?',
    choices: {
      A: '<bottom>',
      B: '<end>',
      C: '<footer>',
      D: '<tail>',
    },
    correct_option: 'C',
    explanation: '<footer> ใช้สำหรับระบุส่วนท้ายของเอกสารหรือส่วนท้ายของ section',
    active: true,
  },
  {
    id: 'q-h8-3',
    sub_domain_code: 'H8',
    difficulty: 'medium',
    cognitive_level: 'understanding',
    answer_type: 'single_choice',
    question_text: 'แท็ก <article> เหมาะสมที่สุดสำหรับการนำไปใช้กับเนื้อหาลักษณะใด?',
    choices: {
      A: 'เมนูแถบข้างแสดงลิงก์โฆษณา',
      B: 'เนื้อหาที่สมบูรณ์และเป็นอิสระในตัวเอง เช่น บทความบล็อก ข่าวสาร หรือโพสต์เว็บบอร์ด',
      C: 'โลโก้และสโลแกนส่วนหัวของเว็บไซต์',
      D: 'ปุ่มสำหรับส่งแบบฟอร์ม',
    },
    correct_option: 'B',
    explanation: '<article> ออกแบบมาสำหรับเนื้อหาที่สมบูรณ์ในตัวเอง สามารถนำไปเผยแพร่ต่อ (Syndicate) แยกต่างหากได้ เช่น บทความข่าว โพสต์บล็อก',
    active: true,
  },
  {
    id: 'q-h8-4',
    sub_domain_code: 'H8',
    difficulty: 'medium',
    cognitive_level: 'application',
    answer_type: 'single_choice',
    question_text: 'ข้อใดคือข้อกำหนดสำคัญของการใช้แท็ก <main> ในเอกสาร HTML5?',
    choices: {
      A: 'สามารถใส่แท็ก <main> ซ้ำได้หลายจุดในหน้าเดียวกัน',
      B: 'ต้องมี <main> เพียงอันเดียวต่อหน้า และไม่ควรมีแท็ก <main> ซ้อนใน <header> หรือ <footer>',
      C: 'ต้องใส่ไว้ในส่วน <head> ของเอกสารเท่านั้น',
      D: 'ห้ามมีหัวเรื่อง <h1> อยู่ภายใน <main>',
    },
    correct_option: 'B',
    explanation: 'แท็ก <main> สื่อถึงเนื้อหาหลักที่เป็นเอกลักษณ์ของหน้านั้น ในเอกสารแต่ละหน้าควรมี <main> เพียงจุดเดียว และไม่ควรไปซ้อนอยู่ใน <header>, <footer> หรือ <nav>',
    active: true,
  },
  {
    id: 'q-h8-5',
    sub_domain_code: 'H8',
    difficulty: 'hard',
    cognitive_level: 'analysis',
    answer_type: 'single_choice',
    question_text: 'เหตุใดการใช้ Semantic HTML5 จึงดีกว่าการใช้ <div class="..."> ในการวางโครงสร้างหน้าเว็บทั้งหมด?',
    choices: {
      A: 'เพราะทำให้โค้ดสั้นลงเพียงอย่างเดียว แต่ไม่มีผลต่อบอทค้นหา',
      B: 'เพราะช่วยให้อุปกรณ์อ่านหน้าจอสำหรับผู้พิการ (Screen Readers) และโปรแกรมสืบค้น (Search Engines) เข้าใจโครงสร้างและความหมายของเนื้อหาได้อย่างแม่นยำ',
      C: 'เพราะทำให้เว็บไซต์โหลดโดยไม่ต้องอาศัยไฟล์ CSS',
      D: 'เพราะเป็นข้อบังคับตามกฎหมายคอมพิวเตอร์สากล',
    },
    correct_option: 'B',
    explanation: 'Semantic HTML มีความหมายในตัวเอง ช่วยเพิ่ม Accessibility สำหรับผู้ใช้อุปกรณ์ช่วยเหลือ (Assistive Technologies) และช่วยระบบ Search Engine Optimization (SEO) ในการจัดหมวดหมู่เนื้อหาอย่างมีประสิทธิภาพ',
    active: true,
  },
  {
    id: 'q-draft-unvalidated',
    sub_domain_code: 'H1',
    difficulty: 'medium',
    cognitive_level: 'applying',
    answer_type: 'single_choice',
    question_text: '[ข้อสอบร่างยังไม่ผ่านการตรวจสอบ] ตัวอย่างข้อสอบทดสอบระบบความปลอดภัย (validated = false)',
    choices: {
      A: 'ตัวเลือกที่ 1 (ถูกต้อง)',
      B: 'ตัวเลือกที่ 2',
      C: 'ตัวเลือกที่ 3',
      D: 'ตัวเลือกที่ 4',
    },
    correct_option: 'A',
    explanation: 'ข้อสอบนี้มีสถานะ validated = false ตามข้อกำหนดเชิงวิชาการ ต้องไม่ถูกสุ่มให้นักเรียนทำใน Adaptive Test เด็ดขาด',
    active: true,
    ioc_score: 0.40,
    validated: false,
    difficulty_index: 0.50,
    discrimination_index: 0.12,
    total_attempts: 6,
  },
];

// กำหนดค่าเริ่มต้นทางจิตมิติ (Psychometric defaults) ให้กับคลังข้อสอบ
MOCK_QUESTIONS.forEach((q, idx) => {
  if (q.ioc_score === undefined) q.ioc_score = idx % 7 === 0 ? 0.80 : 1.0;
  if (q.validated === undefined) q.validated = true;
  if (q.difficulty_index === undefined) {
    q.difficulty_index = q.difficulty === 'easy' ? 0.74 : q.difficulty === 'medium' ? 0.52 : 0.36;
  }
  if (q.discrimination_index === undefined) {
    q.discrimination_index = q.difficulty === 'easy' ? 0.38 : q.difficulty === 'medium' ? 0.46 : 0.44;
  }
  if (q.total_attempts === undefined) {
    q.total_attempts = 45;
  }
});


// Initial realistic student skill profiles across H1-H8
export const MOCK_STUDENT_SKILLS: Record<string, SkillProfile> = {
  H1: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H1', estimated_level: 85, evidence_count: 5, mastery_status: 'mastery', updated_at: new Date().toISOString() },
  H2: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H2', estimated_level: 90, evidence_count: 6, mastery_status: 'mastery', updated_at: new Date().toISOString() },
  H3: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H3', estimated_level: 70, evidence_count: 4, mastery_status: 'good', updated_at: new Date().toISOString() },
  H4: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H4', estimated_level: 65, evidence_count: 4, mastery_status: 'good', updated_at: new Date().toISOString() },
  H5: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H5', estimated_level: 75, evidence_count: 4, mastery_status: 'good', updated_at: new Date().toISOString() },
  H6: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H6', estimated_level: 50, evidence_count: 5, mastery_status: 'needs_improvement', updated_at: new Date().toISOString() },
  H7: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H7', estimated_level: 55, evidence_count: 6, mastery_status: 'needs_improvement', updated_at: new Date().toISOString() },
  H8: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H8', estimated_level: 60, evidence_count: 4, mastery_status: 'good', updated_at: new Date().toISOString() },
};

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    student_id: 's001-student-uuid-1111',
    sub_domain_code: 'H6',
    resource_type: 'lesson',
    reason: 'ทบทวนโครงสร้างตารางและการผสานเซลล์ด้วย colspan/rowspan (คะแนนปัจจุบัน 50%)',
    action_url: '/student/lessons/u-h6',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'rec-2',
    student_id: 's001-student-uuid-1111',
    sub_domain_code: 'H7',
    resource_type: 'code_lab',
    reason: 'ฝึกปฏิบัติสร้างฟอร์มรับข้อมูลและการผูก label คู่กับ input ใน Code Lab (คะแนนปัจจุบัน 55%)',
    action_url: '/student/codelab?assignment=a-h7',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'rec-3',
    student_id: 's001-student-uuid-1111',
    sub_domain_code: 'H7',
    resource_type: 're_test',
    reason: 'ทดสอบซ้ำ (Re-test) เฉพาะหัวข้อ H7: ฟอร์มและการรับข้อมูล เพื่อประเมินความก้าวหน้า',
    action_url: '/student/assessment?type=re_test&subdomain=H7',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_CLASS_STUDENTS = [
  { id: 'std-1', name: 'สมชาย รักการเรียน', scores: { H1: 85, H2: 90, H3: 70, H4: 65, H5: 75, H6: 50, H7: 55, H8: 60 }, completion: 82, avgScore: 68.4 },
  { id: 'std-2', name: 'กานต์ดา มุ่งมั่นวิชา', scores: { H1: 95, H2: 85, H3: 90, H4: 80, H5: 85, H6: 75, H7: 80, H8: 85 }, completion: 95, avgScore: 84.4 },
  { id: 'std-3', name: 'ธนกร เขียนโค้ดไว', scores: { H1: 75, H2: 80, H3: 60, H4: 55, H5: 70, H6: 45, H7: 50, H8: 65 }, completion: 70, avgScore: 62.5 },
  { id: 'std-4', name: 'ปาณิศา พัฒนาเว็บ', scores: { H1: 90, H2: 95, H3: 85, H4: 90, H5: 90, H6: 80, H7: 85, H8: 90 }, completion: 100, avgScore: 88.8 },
  { id: 'std-5', name: 'วรพล คนขยัน', scores: { H1: 65, H2: 70, H3: 50, H4: 45, H5: 60, H6: 40, H7: 45, H8: 50 }, completion: 60, avgScore: 53.1 },
  { id: 'std-6', name: 'ชลธิชา ใฝ่เรียนรู้', scores: { H1: 80, H2: 85, H3: 75, H4: 70, H5: 80, H6: 65, H7: 70, H8: 75 }, completion: 88, avgScore: 75.0 },
  { id: 'std-7', name: 'ภานุพงศ์ เทคนิคอล', scores: { H1: 85, H2: 80, H3: 65, H4: 60, H5: 70, H6: 55, H7: 50, H8: 60 }, completion: 78, avgScore: 65.6 },
  { id: 'std-8', name: 'นภัสสร ออกแบบสวย', scores: { H1: 90, H2: 90, H3: 80, H4: 85, H5: 80, H6: 70, H7: 75, H8: 80 }, completion: 90, avgScore: 81.3 },
];
