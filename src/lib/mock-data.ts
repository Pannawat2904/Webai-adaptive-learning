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
import { OFFICIAL_PRETEST_QUESTIONS } from './pretest-data';
import { ADAPTIVE_QUESTION_BANK } from './adaptive-item-bank';

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

export interface CanvaSlideConfig {
  shareUrl: string;
  embedUrl: string;
  title: string;
}

export const CANVA_SLIDES: Record<string, CanvaSlideConfig> = {
  'u-h1': {
    shareUrl: 'https://canva.link/geq34d04rrro6hn',
    embedUrl: 'https://www.canva.com/design/DAHV5UVIPDU/AFS3va1WqPwspZLy-ifa2Q/view?embed',
    title: 'โครงสร้างพื้นฐานของภาษา HTML',
  },
  'u-h2': {
    shareUrl: 'https://canva.link/iizp2n89b4dfynx',
    embedUrl: 'https://www.canva.com/design/DAHV-2jpdqc/G8-EZ9NaGqPb6CiKLuEB_Q/view?embed',
    title: 'การแทรกข้อความและลิงก์ในหน้าเว็บ',
  },
  'u-h3': {
    shareUrl: 'https://canva.link/du1a7rkdkkt93vk',
    embedUrl: 'https://www.canva.com/design/DAHV_MAgbis/UTy0q7K2uxAlNj8Q9GOhPg/view?embed',
    title: 'การแทรกรูปภาพและตารางในหน้าเว็บ',
  },
  'u-h4': {
    shareUrl: 'https://canva.link/ugxpjq3x6j5u94a',
    embedUrl: 'https://www.canva.com/design/DAHV_XO5tZQ/-CJ3FKM0Uwlg8kbCJ6dbOQ/view?embed',
    title: 'การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML',
  },
  'u-h5': {
    shareUrl: 'https://canva.link/rhckotlpvhashhg',
    embedUrl: 'https://www.canva.com/design/DAHV_ZnF178/SkcOPvSGg3mER9of0MhyxQ/view?embed',
    title: 'การสร้างฟอร์มรับข้อมูล',
  },
};

export function getCanvaEmbedUrl(url?: string | null, unitId?: string): string {
  if (!url || url.trim() === '') {
    return unitId && CANVA_SLIDES[unitId] ? CANVA_SLIDES[unitId].embedUrl : '';
  }
  const cleanUrl = url.trim();
  for (const item of Object.values(CANVA_SLIDES)) {
    if (cleanUrl === item.shareUrl) {
      return item.embedUrl;
    }
  }
  if (cleanUrl.includes('/edit')) {
    return cleanUrl.split('/edit')[0] + '/view?embed';
  }
  if (cleanUrl.includes('canva.com/design/') && cleanUrl.includes('/view') && !cleanUrl.includes('embed')) {
    return cleanUrl.includes('?') ? `${cleanUrl}&embed` : `${cleanUrl}?embed`;
  }
  return cleanUrl;
}

export function getCanvaShareUrl(url?: string | null, unitId?: string): string {
  if (unitId && CANVA_SLIDES[unitId]) {
    return CANVA_SLIDES[unitId].shareUrl;
  }
  return url || '';
}

export const MOCK_COURSE: Course = {
  id: '11111111-1111-1111-1111-111111111111',
  code: 'HTML-VOC-101',
  name: 'หน่วยที่ 3 งานสร้างหน้าเว็บด้วย HTML',
  description: 'การพัฒนานวัตกรรมการเรียนรู้แบบปรับเหมาะเฉพาะบุคคล เรื่อง โครงสร้างภาษา HTML เพื่อส่งเสริมทักษะทางวิชาชีพด้านการพัฒนาเว็บไซต์ สำหรับนักเรียนระดับชั้นประกาศนียบัตรวิชาชีพ',
  status: 'active',
  created_at: new Date().toISOString(),
};

export const MOCK_UNITS: Unit[] = [
  {
    id: 'u-h1',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H1',
    title: 'โครงสร้างพื้นฐานของภาษา HTML',
    description: 'โครงสร้างเอกสาร HTML5, ความหมายของ Tag ใน HTML, Tag เปิดและ Tag ปิด, Comment ใน HTML และส่วนประกอบของหน้าเว็บ (<head>, <body>, <title>)',
    order_no: 1,
  },
  {
    id: 'u-h2',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H2',
    title: 'การแทรกข้อความและลิงก์ในหน้าเว็บ',
    description: 'Heading Tags, Paragraph Tag, การจัดรูปแบบข้อความ, การขึ้นบรรทัดและเส้นคั่น, Lists (Ordered/Unordered List) และการสร้างลิงก์ภายในและภายนอกเว็บไซต์',
    order_no: 2,
  },
  {
    id: 'u-h3',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H3',
    title: 'การแทรกรูปภาพและตารางในหน้าเว็บ',
    description: 'การแทรกรูปภาพด้วย <img>, การกำหนดขนาดรูปภาพ, Relative Path และ Absolute Path, การสร้างตารางด้วย <table>, แถวและคอลัมน์ของตาราง, หัวตารางและข้อมูลในตาราง',
    order_no: 3,
  },
  {
    id: 'u-h4',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H4',
    title: 'การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML',
    description: 'Semantic HTML (Header, Navigation, Main, Section, Article, Aside, Footer), เปรียบเทียบกับ Div และ Span, Block Element และ Inline Element',
    order_no: 4,
  },
  {
    id: 'u-h5',
    course_id: MOCK_COURSE.id,
    sub_domain_code: 'H5',
    title: 'การสร้างฟอร์มรับข้อมูล',
    description: 'Form Tag, Label และ Input ชนิดต่างๆ (Text, Email, Password, Number, Date), Textarea, Select, Radio Button, Checkbox และ Button',
    order_no: 5,
  },
];

export const MOCK_LESSONS: Record<string, Lesson> = {
  'u-h1': {
    id: 'l-h1',
    unit_id: 'u-h1',
    title: 'โครงสร้างพื้นฐานของภาษา HTML',
    content: `
# โครงสร้างพื้นฐานของภาษา HTML

---

### 🎯 วัตถุประสงค์เชิงพฤติกรรม
1. **ด้านพุทธิพิสัย (ความรู้ ความคิด):** เพื่อให้ผู้เรียนสามารถอธิบายโครงสร้างพื้นฐานของเอกสาร HTML5 ความหมายและหน้าที่ของแท็ก (Tag) เปิดและแท็กปิด ตลอดจนหน้าที่ของส่วนประกอบหลักของหน้าเว็บ ได้แก่ \`<head>\`, \`<body>\` และ \`<title>\` ได้อย่างถูกต้อง
2. **ด้านทักษะพิสัย (ทักษะ การปฏิบัติ):** เพื่อให้ผู้เรียนสามารถเขียนโครงสร้างเอกสาร HTML5 พื้นฐาน พร้อมทั้งกำหนดส่วนประกอบของหน้าเว็บและเขียนคำอธิบายกำกับโค้ด (Comment) ได้อย่างถูกต้องตามหลักไวยากรณ์ของภาษา HTML
3. **ด้านจิตพิสัย (เจตคติ คุณลักษณะ):** เพื่อให้ผู้เรียนเห็นความสำคัญของการเขียนโค้ดที่มีโครงสร้างถูกต้อง เป็นระเบียบ และมีความรับผิดชอบต่อผลงานของตนเอง

---

### 📚 เนื้อหาบทเรียน

#### 1. โครงสร้างเอกสาร HTML5
เอกสาร HTML5 ทุกหน้าต้องเริ่มต้นด้วยการประกาศชนิดเอกสาร (DOCTYPE Declaration):
\`\`\`html
<!DOCTYPE html>
<html lang="th">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ชื่อหน้าเว็บ</title>
  </head>
  <body>
    <!-- เนื้อหาที่จะแสดงผลบนหน้าจอ -->
  </body>
</html>
\`\`\`

#### 2. ความหมายของ Tag ใน HTML
- **Tag (แท็ก)** คือคำสั่งหรือสัญลักษณ์ที่ใช้กำหนดความหมายและโครงสร้างของข้อมูลบนหน้าเว็บ โดยเขียนอยู่ภายในเครื่องหมายวงเล็บแหลม \`< >\`

#### 3. Tag เปิด และ Tag ปิด
- **แท็กคู่ (Container Tags):** ประกอบด้วยแท็กเปิดและแท็กปิด เช่น \`<title>...</title>\`, \`<p>...</p>\`
- **แท็กเดี่ยว (Empty/Void Tags):** ไม่มีแท็กปิด เช่น \`<br>\`, \`<hr>\`, \`<img>\`

#### 4. Comment ใน HTML
ใช้สำหรับบันทึกคำอธิบายหรือหมายเหตุในโค้ด โดยเบราว์เซอร์จะไม่นำมาแสดงผล:
\`\`\`html
<!-- นี่คือคอมเมนต์ในภาษา HTML -->
\`\`\`

#### 5. ส่วนประกอบของหน้าเว็บ
- **\`<head>\`**: ส่วนหัวของเอกสาร เก็บข้อมูลเมตาดาต้า (Metadata) เช่น การเข้ารหัสอักขระ, ลิงก์เชื่อมโยงสไตล์ชีต, และการตั้งค่าหน้าจอ
- **\`<body>\`**: ส่วนเนื้อหาหลักที่จะแสดงผลบนหน้าต่างเว็บเบราว์เซอร์ให้ผู้ใช้งานมองเห็น
- **\`<title>\`**: ข้อความที่แสดงบนแท็บของเว็บเบราว์เซอร์และผลการค้นหาของ Search Engine
    `,
    order_no: 1,
    media: [
      {
        id: 'm-h1-s1',
        lesson_id: 'l-h1',
        media_type: 'slide',
        title: 'ชุดสไลด์: โครงสร้างพื้นฐานของภาษา HTML',
        external_url: 'https://www.canva.com/design/DAHV5UVIPDU/AFS3va1WqPwspZLy-ifa2Q/view?embed',
        meta: {
          pages: 6,
          share_url: 'https://canva.link/geq34d04rrro6hn',
          slides: [
            'สไลด์ 1: แนะนำหน่วยที่ 3 งานสร้างหน้าเว็บด้วย HTML',
            'สไลด์ 2: โครงสร้างเอกสาร HTML5 และ DOCTYPE',
            'สไลด์ 3: ความหมายของ Tag, แท็กเปิด และแท็กปิด',
            'สไลด์ 4: การเขียน Comment ในโค้ด HTML',
            'สไลด์ 5: ส่วนประกอบหลัก: head, body, title',
            'สไลด์ 6: สรุปและแบบประเมินตนเอง',
          ],
        },
        order_no: 1,
      },
      {
        id: 'm-h1-v1',
        lesson_id: 'l-h1',
        media_type: 'video',
        title: 'วิดีโอสอน: โครงสร้างพื้นฐานของภาษา HTML',
        external_url: 'https://www.youtube.com/embed/kUMe1FH4CHE',
        meta: { duration: 480 },
        order_no: 2,
      },
    ],
  },
  'u-h2': {
    id: 'l-h2',
    unit_id: 'u-h2',
    title: 'การแทรกข้อความและลิงก์ในหน้าเว็บ',
    content: `
# การแทรกข้อความและลิงก์ในหน้าเว็บ

---

### 🎯 วัตถุประสงค์เชิงพฤติกรรม
1. **ด้านพุทธิพิสัย (ความรู้ ความคิด):** เพื่อให้ผู้เรียนสามารถอธิบายหน้าที่และความแตกต่างของ Heading Tag, Paragraph Tag, การขึ้นบรรทัดใหม่ เส้นคั่น รายการแบบมีลำดับ (Ordered List) และรายการแบบไม่มีลำดับ (Unordered List) รวมทั้งหลักการสร้างลิงก์ภายในและภายนอกเว็บไซต์ได้อย่างถูกต้อง
2. **ด้านทักษะพิสัย (ทักษะ การปฏิบัติ):** เพื่อให้ผู้เรียนสามารถสร้างหน้าเว็บที่มีการจัดรูปแบบข้อความ การสร้างรายการ และการเชื่อมโยงลิงก์ทั้งภายในและภายนอกเว็บไซต์ได้อย่างถูกต้องและเหมาะสม
3. **ด้านจิตพิสัย (เจตคติ คุณลักษณะ):** เพื่อให้ผู้เรียนมีความละเอียดรอบคอบและใส่ใจในการจัดเรียงเนื้อหาให้มีความชัดเจน อ่านง่าย และเป็นประโยชน์ต่อผู้ใช้งาน

---

### 📚 เนื้อหาบทเรียน

#### 1. Heading Tags (หัวเรื่อง \`<h1>\` - \`<h6>\`)
- ใช้จัดลำดับความสำคัญของหัวข้อ โดย \`<h1>\` มีความสำคัญสูงสุด (ควรมี 1 จุดต่อหน้า) ไล่ระดับความสำคัญลงไปจนถึง \`<h6>\`

#### 2. Paragraph Tag (ย่อหน้า \`<p>\`)
- ใช้แบ่งเนื้อหาออกเป็นย่อหน้า เว็บเบราว์เซอร์จะเว้นช่องว่าง (Margin) ด้านบนและด้านล่างให้อัตโนมัติ

#### 3. การจัดรูปแบบข้อความ
- \`<strong>\`: ข้อความสำคัญ มีผลแสดงผลเป็นตัวหนา
- \`<em>\`: ข้อความเน้น มีผลแสดงผลเป็นตัวเอียง
- \`<mark>\`: ข้อความไฮไลต์สีพื้นหลัง

#### 4. การขึ้นบรรทัดและเส้นคั่น
- \`<br>\`: สั่งตัดขึ้นบรรทัดใหม่ทันทีภายในย่อหน้าเดิม (แท็กเดี่ยว)
- \`<hr>\`: เส้นคั่นแนวนอนสำหรับแบ่งเนื้อหาหรือเปลี่ยนหัวข้อ

#### 5. Lists (รายการข้อมูล)
- **Ordered List (\`<ol>\`):** รายการแบบมีลำดับตัวเลข 1, 2, 3
- **Unordered List (\`<ul>\`):** รายการแบบไม่มีลำดับ (แสดงเป็นจุดสัญลักษณ์ Bullet)
- แต่ละรายการจะครอบด้วยแท็ก \`<li>\` (List Item)

#### 6. การสร้างลิงก์ภายในและภายนอกเว็บไซต์ (\`<a>\`)
- **ลิงก์ภายนอก:** \`<a href="https://example.com" target="_blank">เปิดเว็บภายนอก</a>\`
- **ลิงก์ภายในเว็บไซต์:** \`<a href="/about.html">เกี่ยวกับเรา</a>\`
- **ลิงก์ภายในหน้าเดียวกัน (Anchor Link):** \`<a href="#contact">ไปยังส่วนติดต่อเรา</a>\`
    `,
    order_no: 2,
    media: [
      {
        id: 'm-h2-s1',
        lesson_id: 'l-h2',
        media_type: 'slide',
        title: 'ชุดสไลด์: การแทรกข้อความและลิงก์ในหน้าเว็บ',
        external_url: 'https://www.canva.com/design/DAHV-2jpdqc/G8-EZ9NaGqPb6CiKLuEB_Q/view?embed',
        meta: {
          pages: 5,
          share_url: 'https://canva.link/iizp2n89b4dfynx',
          slides: [
            'สไลด์ 1: Heading Tags h1-h6 และ Paragraph Tag',
            'สไลด์ 2: การจัดรูปแบบข้อความ strong, em, mark',
            'สไลด์ 3: การตัดบรรทัด br และเส้นคั่น hr',
            'สไลด์ 4: รายการข้อมูล ol และ ul',
            'สไลด์ 5: การสร้างไฮเปอร์ลิงก์ด้วยแท็ก <a>',
          ],
        },
        order_no: 1,
      },
      {
        id: 'm-h2-v1',
        lesson_id: 'l-h2',
        media_type: 'video',
        title: 'วิดีโอสอน: การแทรกข้อความและลิงก์ในหน้าเว็บ',
        external_url: 'https://www.youtube.com/embed/MDLn5-zSQQI',
        meta: { duration: 420 },
        order_no: 2,
      },
    ],
  },
  'u-h3': {
    id: 'l-h3',
    unit_id: 'u-h3',
    title: 'การแทรกรูปภาพและตารางในหน้าเว็บ',
    content: `
# การแทรกรูปภาพและตารางในหน้าเว็บ

---

### 🎯 วัตถุประสงค์เชิงพฤติกรรม
1. **ด้านพุทธิพิสัย (ความรู้ ความคิด):** เพื่อให้ผู้เรียนสามารถอธิบายวิธีการแทรกรูปภาพด้วยแท็ก \`<img>\` การกำหนดขนาดรูปภาพ ความแตกต่างระหว่าง Relative Path กับ Absolute Path และโครงสร้างของตารางในภาษา HTML ได้อย่างถูกต้อง
2. **ด้านทักษะพิสัย (ทักษะ การปฏิบัติ):** เพื่อให้ผู้เรียนสามารถแทรกรูปภาพพร้อมกำหนดขนาดที่เหมาะสม และสร้างตารางแสดงข้อมูลที่ประกอบด้วยหัวตาราง แถว และคอลัมน์ ได้อย่างถูกต้องตามวัตถุประสงค์การใช้งาน
3. **ด้านจิตพิสัย (เจตคติ คุณลักษณะ):** เพื่อให้ผู้เรียนตระหนักถึงความเหมาะสมในการเลือกใช้รูปภาพและการจัดวางข้อมูลในตาราง เพื่อประโยชน์สูงสุดของผู้ใช้งานเว็บไซต์

---

### 📚 เนื้อหาบทเรียน

#### 1. การแทรกรูปภาพด้วย \`<img>\`
- แท็ก \`<img>\` เป็นแท็กเดี่ยว มีแอตทริบิวต์จำเป็น:
  - \`src\`: ที่อยู่หรือแหล่งที่มาของไฟล์รูปภาพ
  - \`alt\`: ข้อความอธิบายภาพ (สำคัญมากต่อการเข้าถึงของผู้พิการทางสายตาและ SEO)

#### 2. การกำหนดขนาดรูปภาพ
- กำหนดความกว้างและสูงด้วยแอตทริบิวต์ \`width\` และ \`height\` เช่น:
\`\`\`html
<img src="images/logo.png" alt="โลโก้สถาบัน" width="200" height="100">
\`\`\`

#### 3. Relative Path และ Absolute Path
- **Relative Path (เส้นทางสัมพันธ์):** อ้างอิงจากตำแหน่งของไฟล์ปัจจุบัน เช่น \`images/pic.jpg\`, \`../assets/photo.png\`
- **Absolute Path (เส้นทางสัมบูรณ์):** ระบุ URL เต็มรูปแบบจากอินเทอร์เน็ต เช่น \`https://example.com/logo.png\`

#### 4. การสร้างตารางด้วย \`<table>\`
ตารางใช้สำหรับแสดงข้อมูลที่มีความสัมพันธ์เป็นแถวและคอลัมน์:
- **\`<table>\`**: แท็กครอบตารางทั้งหมด
- **\`<tr>\` (Table Row)**: แถวของตาราง
- **\`<th>\` (Table Header)**: เซลล์หัวตาราง (แสดงผลเป็นตัวหนากึ่งกลาง)
- **\`<td>\` (Table Data)**: เซลล์ข้อมูลปกติ

\`\`\`html
<table border="1">
  <tr>
    <th>ลำดับ</th>
    <th>ชื่อวิชา</th>
    <th>หน่วยกิต</th>
  </tr>
  <tr>
    <td>1</td>
    <td>การสร้างเว็บไซต์</td>
    <td>3</td>
  </tr>
</table>
\`\`\`
    `,
    order_no: 3,
    media: [
      {
        id: 'm-h3-s1',
        lesson_id: 'l-h3',
        media_type: 'slide',
        title: 'ชุดสไลด์: การแทรกรูปภาพและตารางในหน้าเว็บ',
        external_url: 'https://www.canva.com/design/DAHV_MAgbis/UTy0q7K2uxAlNj8Q9GOhPg/view?embed',
        meta: {
          pages: 5,
          share_url: 'https://canva.link/du1a7rkdkkt93vk',
          slides: [
            'สไลด์ 1: การใช้แท็ก <img> และแอตทริบิวต์ src, alt',
            'สไลด์ 2: การกำหนดขนาดรูปภาพ width, height',
            'สไลด์ 3: ความแตกต่างระหว่าง Relative Path กับ Absolute Path',
            'สไลด์ 4: โครงสร้างตาราง table, tr, th, td',
            'สไลด์ 5: ตัวอย่างการสร้างตารางแสดงข้อมูลอย่างถูกต้อง',
          ],
        },
        order_no: 1,
      },
      {
        id: 'm-h3-v1',
        lesson_id: 'l-h3',
        media_type: 'video',
        title: 'วิดีโอสอน: การแทรกรูปภาพและตารางในหน้าเว็บ',
        external_url: 'https://www.youtube.com/embed/kM2nZg5l0hE',
        meta: { duration: 450 },
        order_no: 2,
      },
    ],
  },
  'u-h4': {
    id: 'l-h4',
    unit_id: 'u-h4',
    title: 'การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML',
    content: `
# การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML

---

### 🎯 วัตถุประสงค์เชิงพฤติกรรม
1. **ด้านพุทธิพิสัย (ความรู้ ความคิด):** เพื่อให้ผู้เรียนสามารถอธิบายความหมายและหน้าที่ของแท็กเชิงความหมาย (Semantic Tag) ได้แก่ Header, Navigation, Main, Section, Article, Aside และ Footer เปรียบเทียบกับการใช้ Div และ Span ตลอดจนจำแนกความแตกต่างระหว่าง Block Element และ Inline Element ได้อย่างถูกต้อง
2. **ด้านทักษะพิสัย (ทักษะ การปฏิบัติ):** เพื่อให้ผู้เรียนสามารถออกแบบและสร้างโครงสร้างหน้าเว็บอย่างง่ายโดยใช้ Semantic HTML ได้อย่างเหมาะสมและสอดคล้องกับความหมายของแต่ละแท็ก
3. **ด้านจิตพิสัย (เจตคติ คุณลักษณะ):** เพื่อให้ผู้เรียนเห็นคุณค่าของการใช้ Semantic HTML ในการพัฒนาเว็บไซต์ให้มีโครงสร้างชัดเจน เข้าถึงง่าย และมีมาตรฐานสากล

---

### 📚 เนื้อหาบทเรียน

#### 1. ความหมายของ Semantic HTML
- **Semantic Tag** คือแท็กที่สื่อความหมายในตัวเองอย่างชัดเจนทั้งต่อมนุษย์ เบราว์เซอร์ และโปรแกรมค้นหา (Search Engine) ช่วยให้โครงสร้างหน้าเว็บเป็นมาตรฐานสากล

#### 2. แท็กเชิงความหมายหลัก
- **\`<header>\`**: ส่วนหัวของเว็บไซต์หรือส่วนหัวของเนื้อหา (ประกอบด้วยโลโก้, ชื่อเรื่อง)
- **\`<nav>\`**: เมนูนำทางหลักของเว็บไซต์ (Navigation Links)
- **\`<main>\`**: พื้นที่เนื้อหาหลักเฉพาะของหน้านั้น (มีได้เพียงจุดเดียวต่อหน้า)
- **\`<section>\`**: ส่วนแบ่งหมวดหมู่เนื้อหาตามหัวข้อ
- **\`<article>\`**: เนื้อหาที่สมบูรณ์และเป็นอิสระในตัวเอง เช่น บทความ, ข่าว, โพสต์บล็อก
- **\`<aside>\`**: แถบเนื้อหาเสริมด้านข้าง เช่น ข้อมูลเพิ่มเติม, ลิงก์ที่เกี่ยวข้อง
- **\`<footer>\`**: ส่วนท้ายของหน้าเว็บ (ข้อมูลลิขสิทธิ์, ข้อมูลติดต่อ)

#### 3. เปรียบเทียบกับ \`<div>\` และ \`<span>\`
- \`<div>\` และ \`<span>\` เป็น Non-semantic Tag ที่ไม่มีความหมายในตัวเอง ใช้สำหรับจัดกลุ่มสไตล์เท่านั้น
- ควรใช้ Semantic HTML แทนการใช้ \`<div class="header">\` หรือ \`<div class="footer">\`

#### 4. Block Element และ Inline Element
- **Block Element:** กินพื้นที่เต็มความกว้างของหน้าจอ ขึ้นบรรทัดใหม่เสมอ เช่น \`<div>\`, \`<p>\`, \`<h1>-<h6>\`, \`<header>\`, \`<section>\`
- **Inline Element:** กินพื้นที่เท่ากับขนาดของเนื้อหา ไม่ขึ้นบรรทัดใหม่ เช่น \`<span>\`, \`<a>\`, \`<strong>\`, \`<em>\`, \`<img>\`
    `,
    order_no: 4,
    media: [
      {
        id: 'm-h4-s1',
        lesson_id: 'l-h4',
        media_type: 'slide',
        title: 'ชุดสไลด์: การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML',
        external_url: 'https://www.canva.com/design/DAHV_XO5tZQ/-CJ3FKM0Uwlg8kbCJ6dbOQ/view?embed',
        meta: {
          pages: 5,
          share_url: 'https://canva.link/ugxpjq3x6j5u94a',
          slides: [
            'สไลด์ 1: ความหมายและประโยชน์ของ Semantic HTML',
            'สไลด์ 2: โครงสร้างหลัก header, nav, main, footer',
            'สไลด์ 3: การใช้ section, article, aside',
            'สไลด์ 4: เปรียบเทียบ Semantic HTML กับ div และ span',
            'สไลด์ 5: ความแตกต่างระหว่าง Block Element กับ Inline Element',
          ],
        },
        order_no: 1,
      },
      {
        id: 'm-h4-v1',
        lesson_id: 'l-h4',
        media_type: 'video',
        title: 'วิดีโอสอน: การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML',
        external_url: 'https://www.youtube.com/embed/kGW8Al_cga4',
        meta: { duration: 510 },
        order_no: 2,
      },
    ],
  },
  'u-h5': {
    id: 'l-h5',
    unit_id: 'u-h5',
    title: 'การสร้างฟอร์มรับข้อมูล',
    content: `
# การสร้างฟอร์มรับข้อมูล

---

### 🎯 วัตถุประสงค์เชิงพฤติกรรม
1. **ด้านพุทธิพิสัย (ความรู้ ความคิด):** เพื่อให้ผู้เรียนสามารถอธิบายหน้าที่ของ Form Tag, Label, Input ประเภทต่าง ๆ (Text, Email, Password, Number, Date) รวมถึง Textarea, Select, Radio Button, Checkbox และ Button ได้อย่างถูกต้อง
2. **ด้านทักษะพิสัย (ทักษะ การปฏิบัติ):** เพื่อให้ผู้เรียนสามารถออกแบบและสร้างฟอร์มรับข้อมูลที่ประกอบด้วยองค์ประกอบของ Input หลากหลายประเภทตามความเหมาะสมกับลักษณะของข้อมูลที่ต้องการจัดเก็บ พร้อมทั้งกำหนด Label ให้สื่อความหมายได้ชัดเจน
3. **ด้านจิตพิสัย (เจตคติ คุณลักษณะ):** เพื่อให้ผู้เรียนมีความละเอียดรอบคอบในการออกแบบฟอร์ม โดยคำนึงถึงความสะดวกและประสบการณ์การใช้งานที่ดีของผู้ใช้เว็บไซต์

---

### 📚 เนื้อหาบทเรียน

#### 1. แท็ก \`<form>\`
- ทำหน้าที่ครอบองค์ประกอบการรับข้อมูลทั้งหมด เพื่อส่งข้อมูลไปยังเซิร์ฟเวอร์
- แอตทริบิวต์หลัก:
  - \`action\`: ปลายทางที่ต้องการส่งข้อมูลไปประมวลผล
  - \`method\`: วิธีส่งข้อมูล เช่น \`GET\` หรือ \`POST\`

#### 2. แท็ก \`<label>\` และ \`<input>\`
- **\`<label>\`**: ป้ายชื่ออธิบายช่องรับข้อมูล ผูกกับ input โดยใช้แอตทริบิวต์ \`for\` คู่กับ \`id\` ของ input เพื่อเพิ่มความสะดวกในการคลิกเลือก
\`\`\`html
<label for="username">ชื่อผู้ใช้งาน:</label>
<input type="text" id="username" name="username">
\`\`\`

#### 3. ประเภทของ Input (\`type="..."\`)
- **\`type="text"\`**: ข้อความตัวอักษรทั่วไป
- **\`type="email"\`**: ที่อยู่อีเมล พร้อมระบบตรวจสอบรูปแบบอัตโนมัติ
- **\`type="password"\`**: รหัสผ่าน ซ่อนตัวอักษรด้วยจุดวงกลม
- **\`type="number"\`**: ตัวเลข สามารถกำหนด min, max, step ได้
- **\`type="date"\`**: ปฏิทินเลือกวันที่

#### 4. ตัวเลือกและปุ่มในฟอร์ม
- **\`<textarea>\`**: กล่องข้อความขนาดใหญ่สำหรับกรอกข้อความหลายบรรทัด
- **\`<select>\` และ \`<option>\`**: เมนูแบบเลื่อนเลือก (Dropdown List)
- **\`type="radio"\`**: ปุ่มเลือกได้เพียงข้อเดียวในกลุ่มเดียวกัน (กำหนด \`name\` เดียวกัน)
- **\`type="checkbox"\`**: กล่องกาเครื่องหมาย สามารถเลือกได้หลายตัวเลือก
- **\`<button type="submit">\`**: ปุ่มกดส่งข้อมูลในฟอร์ม
    `,
    order_no: 5,
    media: [
      {
        id: 'm-h5-s1',
        lesson_id: 'l-h5',
        media_type: 'slide',
        title: 'ชุดสไลด์: การสร้างฟอร์มรับข้อมูล',
        external_url: 'https://www.canva.com/design/DAHV_ZnF178/SkcOPvSGg3mER9of0MhyxQ/view?embed',
        meta: {
          pages: 6,
          share_url: 'https://canva.link/rhckotlpvhashhg',
          slides: [
            'สไลด์ 1: การใช้แท็ก <form> แอตทริบิวต์ action และ method',
            'สไลด์ 2: การจับคู่ <label for> กับ <input id>',
            'สไลด์ 3: ชนิดของ Input: text, email, password, number, date',
            'สไลด์ 4: กล่องข้อความ textarea และเมนู select / option',
            'สไลด์ 5: ความแตกต่างของ Radio Button กับ Checkbox',
            'สไลด์ 6: ปุ่ม Button และการตรวจสอบข้อมูลก่อนส่ง',
          ],
        },
        order_no: 1,
      },
      {
        id: 'm-h5-v1',
        lesson_id: 'l-h5',
        media_type: 'video',
        title: 'วิดีโอสอน: การสร้างฟอร์มรับข้อมูล HTML Form',
        external_url: 'https://www.youtube.com/embed/fNcJuPIZ2WE',
        meta: { duration: 540 },
        order_no: 2,
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
    id: 'a-h3',
    unit_id: 'u-h3',
    sub_domain_code: 'H3',
    title: 'ภารกิจที่ 3: แทรกรูปภาพและตารางแสดงข้อมูล',
    description: 'แทรกรูปภาพด้วยแท็ก <img> พร้อมกำหนดขนาดและ alt และสร้างตาราง <table> ที่มีแถว <tr> และคอลัมน์ <td>',
    starter_code: `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>รูปภาพและตาราง</title>
</head>
<body>
  <!-- แทรกภาพ img และสร้างตาราง table ที่นี่ -->
</body>
</html>`,
    checklist: [
      { id: 'c1', label: 'มีแท็ก <img> พร้อมแอตทริบิวต์ alt', selector: 'img[alt]', minCount: 1 },
      { id: 'c2', label: 'มีแท็กตาราง <table>', selector: 'table', minCount: 1 },
      { id: 'c3', label: 'มีแถวตาราง <tr> และเซลล์ <td> หรือ <th>', selector: 'table tr td, table tr th', minCount: 1 },
    ],
    difficulty: 'medium',
    order_no: 3,
  },
  {
    id: 'a-h4',
    unit_id: 'u-h4',
    sub_domain_code: 'H4',
    title: 'ภารกิจที่ 4: จัดโครงสร้างหน้าเว็บด้วย Semantic HTML',
    description: 'ออกแบบโครงสร้างหน้าเว็บโดยใช้แท็กเชิงความหมายครบถ้วน ได้แก่ header, nav, main, section และ footer',
    starter_code: `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>หน้าเว็บ Semantic HTML</title>
</head>
<body>
  <!-- เขียนโครงสร้าง Semantic HTML ครบทุกส่วนที่นี่ -->
</body>
</html>`,
    checklist: [
      { id: 'c1', label: 'มีส่วนหัว <header>', selector: 'header', minCount: 1 },
      { id: 'c2', label: 'มีเมนูนำทาง <nav> พร้อมลิงก์ <a>', selector: 'nav a', minCount: 1 },
      { id: 'c3', label: 'มีเนื้อหาหลัก <main>', selector: 'main', minCount: 1 },
      { id: 'c4', label: 'มีส่วนเนื้อหาย่อย <section> หรือ <article>', selector: 'section, article', minCount: 1 },
      { id: 'c5', label: 'มีส่วนท้ายเว็บ <footer>', selector: 'footer', minCount: 1 },
    ],
    difficulty: 'medium',
    order_no: 4,
  },
  {
    id: 'a-h5',
    unit_id: 'u-h5',
    sub_domain_code: 'H5',
    title: 'ภารกิจที่ 5: สร้างฟอร์มรับข้อมูลสมาชิก',
    description: 'สร้างแบบฟอร์ม <form> มีช่องกรอกข้อความ, รหัสผ่าน, อีเมล, การผูก <label for> กับ <input id> และปุ่มส่งข้อมูล',
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
      { id: 'c2', label: 'มีช่องกรอกข้อความหรืออีเมล', selector: 'form input[type=text], form input[type=email]', minCount: 1 },
      { id: 'c3', label: 'มีช่องกรอกรหัสผ่าน type="password"', selector: 'form input[type=password]', minCount: 1 },
      { id: 'c4', label: 'มีการใช้แท็ก <label>', selector: 'form label', minCount: 1 },
      { id: 'c5', label: 'มีปุ่มส่งข้อมูล (button หรือ input submit)', selector: 'button[type=submit], input[type=submit], form button', minCount: 1 },
    ],
    difficulty: 'hard',
    order_no: 5,
  },
];

// 300 Adaptive Questions (H1-H5, 3 sets × 20 questions) + 20 Official Pre-test Questions = 320 items total
export const MOCK_QUESTIONS: Question[] = [
  ...OFFICIAL_PRETEST_QUESTIONS,
  ...ADAPTIVE_QUESTION_BANK,
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


// Initial realistic student skill profiles across H1-H5 (Topics 3.1 to 3.5)
export const MOCK_STUDENT_SKILLS: Record<string, SkillProfile> = {
  H1: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H1', estimated_level: 85, evidence_count: 5, mastery_status: 'mastery', updated_at: new Date().toISOString() },
  H2: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H2', estimated_level: 90, evidence_count: 6, mastery_status: 'mastery', updated_at: new Date().toISOString() },
  H3: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H3', estimated_level: 70, evidence_count: 4, mastery_status: 'good', updated_at: new Date().toISOString() },
  H4: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H4', estimated_level: 65, evidence_count: 4, mastery_status: 'good', updated_at: new Date().toISOString() },
  H5: { student_id: 's001-student-uuid-1111', sub_domain_code: 'H5', estimated_level: 55, evidence_count: 6, mastery_status: 'needs_improvement', updated_at: new Date().toISOString() },
};

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    student_id: 's001-student-uuid-1111',
    sub_domain_code: 'H3',
    resource_type: 'lesson',
    reason: 'ทบทวนโครงสร้างรูปภาพและตาราง (คะแนนปัจจุบัน 70%)',
    action_url: '/student/lessons/u-h3',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'rec-2',
    student_id: 's001-student-uuid-1111',
    sub_domain_code: 'H5',
    resource_type: 'code_lab',
    reason: 'ฝึกปฏิบัติสร้างฟอร์มรับข้อมูลและการผูก label คู่กับ input ใน Code Lab (คะแนนปัจจุบัน 55%)',
    action_url: '/student/codelab?assignment=a-h5',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'rec-3',
    student_id: 's001-student-uuid-1111',
    sub_domain_code: 'H5',
    resource_type: 're_test',
    reason: 'ทดสอบซ้ำ (Re-test) เฉพาะหัวข้อการสร้างฟอร์มรับข้อมูล เพื่อประเมินความก้าวหน้า',
    action_url: '/student/assessment?type=re_test&subdomain=H5',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_CLASS_STUDENTS = [
  { id: 'std-1', name: 'สมชาย รักการเรียน', scores: { H1: 85, H2: 90, H3: 70, H4: 65, H5: 75 }, completion: 82, avgScore: 77.0 },
  { id: 'std-2', name: 'กานต์ดา มุ่งมั่นวิชา', scores: { H1: 95, H2: 85, H3: 90, H4: 80, H5: 85 }, completion: 95, avgScore: 87.0 },
  { id: 'std-3', name: 'ธนกร เขียนโค้ดไว', scores: { H1: 75, H2: 80, H3: 60, H4: 55, H5: 70 }, completion: 70, avgScore: 68.0 },
  { id: 'std-4', name: 'ปาณิศา พัฒนาเว็บ', scores: { H1: 90, H2: 95, H3: 85, H4: 90, H5: 90 }, completion: 100, avgScore: 90.0 },
  { id: 'std-5', name: 'วรพล คนขยัน', scores: { H1: 65, H2: 70, H3: 50, H4: 45, H5: 60 }, completion: 60, avgScore: 58.0 },
  { id: 'std-6', name: 'ชลธิชา ใฝ่เรียนรู้', scores: { H1: 80, H2: 85, H3: 75, H4: 70, H5: 80 }, completion: 88, avgScore: 78.0 },
  { id: 'std-7', name: 'ภานุพงศ์ เทคนิคอล', scores: { H1: 85, H2: 80, H3: 65, H4: 60, H5: 70 }, completion: 78, avgScore: 72.0 },
  { id: 'std-8', name: 'นภัสสร ออกแบบสวย', scores: { H1: 90, H2: 90, H3: 80, H4: 85, H5: 80 }, completion: 90, avgScore: 85.0 },
];
