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
        external_url: 'https://docs.google.com/presentation/d/e/2PACX-1vT-demo/embed',
        meta: {
          pages: 6,
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
        meta: {
          pages: 5,
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
        meta: {
          pages: 5,
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
        meta: {
          pages: 5,
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
        meta: {
          pages: 6,
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

  // H2 (Links - 3.2 การแทรกข้อความและลิงก์ในหน้าเว็บ)
  {
    id: 'q-h3-1',
    sub_domain_code: 'H2',
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
    sub_domain_code: 'H2',
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
    sub_domain_code: 'H2',
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
    sub_domain_code: 'H2',
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
    sub_domain_code: 'H2',
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

  // H3 (Images - 3.3 การแทรกรูปภาพและตารางในหน้าเว็บ)
  {
    id: 'q-h4-1',
    sub_domain_code: 'H3',
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
    sub_domain_code: 'H3',
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
    sub_domain_code: 'H3',
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
    sub_domain_code: 'H3',
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
    sub_domain_code: 'H3',
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

  // H2 (Lists - 3.2 การแทรกข้อความและลิงก์ในหน้าเว็บ)
  {
    id: 'q-h5-1',
    sub_domain_code: 'H2',
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
    sub_domain_code: 'H2',
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
    sub_domain_code: 'H2',
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
    sub_domain_code: 'H2',
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
    sub_domain_code: 'H2',
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

  // H3 (Tables - 3.3 การแทรกรูปภาพและตารางในหน้าเว็บ)
  {
    id: 'q-h6-1',
    sub_domain_code: 'H3',
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
    sub_domain_code: 'H3',
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
    sub_domain_code: 'H3',
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
    sub_domain_code: 'H3',
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
    sub_domain_code: 'H3',
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

  // H5 (Forms - 3.5 การสร้างฟอร์มรับข้อมูล)
  {
    id: 'q-h7-1',
    sub_domain_code: 'H5',
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
    sub_domain_code: 'H5',
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
    sub_domain_code: 'H5',
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
    sub_domain_code: 'H5',
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
    sub_domain_code: 'H5',
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

  // H4 (Semantic HTML - 3.4 การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML)
  {
    id: 'q-h8-1',
    sub_domain_code: 'H4',
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
    sub_domain_code: 'H4',
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
    sub_domain_code: 'H4',
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
    sub_domain_code: 'H4',
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
    sub_domain_code: 'H4',
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
