// Game Levels, Objectives, Code Parts, and Validation Rules for HTML5 Code Rescue

export interface GameObjective {
  id: string;
  label: string;
}

export interface GameStage {
  id: number;
  title: string;
  subtitle: string;
  mission: string;
  objectives: GameObjective[];
  initialCode: string;
  codeParts: string[];
  hint: string;
  expectedDescription: string;
  validate: (code: string) => { isValid: boolean; feedback: string; errors: string[] };
}

export interface PlayerRank {
  name: string;
  minScore: number;
  icon: string;
}

export interface PlayerLevel {
  level: number;
  title: string;
  minScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const RANKS: PlayerRank[] = [
  { name: '🌱 HTML Rookie', minScore: 0, icon: '🌱' },
  { name: '🔧 Tag Fixer', minScore: 100, icon: '🔧' },
  { name: '💻 Web Builder', minScore: 220, icon: '💻' },
  { name: '⚡ HTML Developer', minScore: 360, icon: '⚡' },
  { name: '👑 HTML5 Master', minScore: 500, icon: '👑' },
];

export const LEVELS: PlayerLevel[] = [
  { level: 1, title: 'Lv.1 Rookie', minScore: 0 },
  { level: 2, title: 'Lv.2 Tag Explorer', minScore: 80 },
  { level: 3, title: 'Lv.3 Code Fixer', minScore: 180 },
  { level: 4, title: 'Lv.4 Web Builder', minScore: 300 },
  { level: 5, title: 'Lv.5 HTML Developer', minScore: 420 },
  { level: 6, title: 'Lv.6 HTML Master', minScore: 540 },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_repair',
    title: 'First Repair',
    description: 'แก้ไข Code สำเร็จครั้งแรก',
    icon: '🏅',
  },
  {
    id: 'first_run',
    title: 'First Run',
    description: 'กด Run แสดงผลเว็บไซต์ครั้งแรก',
    icon: '⚡',
  },
  {
    id: 'bug_hunter',
    title: 'Bug Hunter',
    description: 'ซ่อมแซม Bug สำเร็จครบ 5 จุด',
    icon: '🎯',
  },
  {
    id: 'form_builder',
    title: 'Form Builder',
    description: 'สร้างฟอร์มรับข้อมูลสำเร็จในด่าน 4',
    icon: '📝',
  },
  {
    id: 'no_mistake',
    title: 'No Mistake',
    description: 'ผ่านด่านโดยไม่เสียพลังชีวิต ❤️',
    icon: '🛡️',
  },
  {
    id: 'html_master',
    title: 'HTML5 Master',
    description: 'เอาชนะบอสและผ่านครบทั้ง 5 ด่าน',
    icon: '🏆',
  },
];

export function getRankByScore(score: number): PlayerRank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].minScore) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

export function getLevelByScore(score: number): PlayerLevel {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].minScore) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export const GAME_STAGES: GameStage[] = [
  // Level 1 — 🚪 เปิดประตู HTML
  {
    id: 1,
    title: 'Level 1 — 🚪 เปิดประตู HTML',
    subtitle: 'โครงสร้างหลักของเอกสาร HTML5',
    mission: 'แก้โครงสร้าง HTML ที่เสียหายให้ถูกต้อง โดยเฉพาะส่วนหัวของเว็บ (<head>) และปิดแท็ก <title> ให้สมบูรณ์ เพื่อให้เว็บแสดงชื่อแท็บและข้อความต้อนรับได้',
    objectives: [
      { id: 'fix_title', label: 'ใส่แท็กปิด </title> ให้สมบูรณ์' },
      { id: 'check_head', label: 'ตรวจความถูกต้องของแท็ก <head> และ <body>' },
      { id: 'run_preview', label: 'กด ▶ Run เพื่อพรีวิวหน้าเว็บ' },
      { id: 'verify_pass', label: 'กด ✓ ตรวจสอบภารกิจ' },
    ],
    initialCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Website
</head>
<body>
  <h1>Welcome to HTML5</h1>
  <p>ยินดีต้อนรับสู่โลกของการพัฒนาเว็บไซต์</p>
</body>
</html>`,
    codeParts: [
      '</title>',
      '</head>',
      '<body>',
      '</html>',
      '<h1>',
      '</h1>',
    ],
    hint: 'ในส่วน <head> แท็ก <title> เปิดไว้แต่ยังไม่มีแท็กปิด </title> ลองนำแท็กปิดมาต่อท้าย My Website ดูสิครับ!',
    expectedDescription: 'หน้าเว็บที่มีแท็บชื่อ "My Website" และแสดงหัวข้อ "Welcome to HTML5" พร้อมคำอธิบาย',
    validate: (code: string) => {
      const errors: string[] = [];
      const clean = code.replace(/\s+/g, ' ');

      if (!/<title>.*?<\/title>/i.test(code)) {
        errors.push('ยังไม่พบแท็กปิด </title> หรือข้อความในแท็ก title ยังไม่สมบูรณ์');
      }
      if (!/<head>[\s\S]*?<\/head>/i.test(code)) {
        errors.push('โครงสร้าง <head>...</head> หายไปหรือไม่สมบูรณ์');
      }
      if (!/<body>[\s\S]*?<\/body>/i.test(code)) {
        errors.push('โครงสร้าง <body>...</body> หายไปหรือไม่สมบูรณ์');
      }

      if (errors.length > 0) {
        return {
          isValid: false,
          feedback: 'โครงสร้าง HTML ยังไม่ถูกต้องตามมาตรฐาน: ' + errors[0],
          errors,
        };
      }

      return {
        isValid: true,
        feedback: 'ยอดเยี่ยมมาก! โครงสร้าง HTML5 ถูกต้องสมบูรณ์ แท็ก <title> ปิดเรียบร้อย พร้อมลุยด่านต่อไปแล้ว 🎉',
        errors: [],
      };
    },
  },

  // Level 2 — 🏷️ Tag Hunter
  {
    id: 2,
    title: 'Level 2 — 🏷️ Tag Hunter',
    subtitle: 'หน้าที่และความเข้ากันได้ของ HTML Elements',
    mission: 'นักพัฒนาคนก่อนใช้แท็กไม่เข้าคู่กัน! จงแก้หัวข้อหลักให้เป็น <h1>...</h1> ที่แท็กเปิดปิดตรงกัน เปลี่ยน <div> ข้อความเป็นย่อหน้า <p> และเปลี่ยนรายการลำดับเป็นรายการสัญลักษณ์แบบจุด (<ul>)',
    objectives: [
      { id: 'match_heading', label: 'แก้คู่แท็กหัวข้อให้ตรงกัน (<h1>...</h1>)' },
      { id: 'semantic_p', label: 'ใช้แท็ก <p>...</p> สำหรับเนื้อหาย่อหน้า' },
      { id: 'bullet_list', label: 'ใช้รายการสัญลักษณ์ <ul>...</ul> แทน <ol>' },
      { id: 'verify_pass', label: 'กดตรวจสอบเพื่อผ่านภารกิจ' },
    ],
    initialCode: `<h2>Welcome to My Website</h1>

<div>
  This is my first website with HTML5.
</div>

<ol>
  <li>เรียนรู้แท็กพื้นฐาน</li>
  <li>จัดรูปแบบข้อความ</li>
</ol>`,
    codeParts: [
      '<h1>',
      '</h1>',
      '<p>',
      '</p>',
      '<ul>',
      '</ul>',
    ],
    hint: 'แท็กเปิด <h2> ไม่เข้าคู่กับแท็กปิด </h1> ให้เลือกเปลี่ยนให้เป็น <h1> ทั้งคู่ ส่วนข้อความเนื้อหาควรใช้ <p> และเปลี่ยน <ol> เป็น <ul> ครับ',
    expectedDescription: 'หัวข้อ <h1> ตัวหนาใหญ่, ย่อหน้า <p>, และรายการสัญลักษณ์แบบหัวข้อย่อยกลม (ul)',
    validate: (code: string) => {
      const errors: string[] = [];

      // Check heading matching
      const hasMismatchedH2H1 = /<h2>.*?<\/h1>/i.test(code) || /<h1>.*?<\/h2>/i.test(code);
      if (hasMismatchedH2H1) {
        errors.push('พบแท็กหัวข้อเปิดและปิดไม่ตรงกัน (เช่น <h2>...</h1>)');
      } else if (!/<h1>.*?<\/h1>/i.test(code) && !/<h2>.*?<\/h2>/i.test(code)) {
        errors.push('ไม่พบแท็กหัวข้อที่ถูกต้อง <h1>...</h1>');
      }

      // Check paragraph
      if (/<div>\s*This is my first website/i.test(code)) {
        errors.push('ข้อความเนื้อหายังอยู่ในแท็ก <div> ควรเปลี่ยนเป็นแท็กย่อหน้า <p>...</p>');
      } else if (!/<p>[\s\S]*?This is my first website[\s\S]*?<\/p>/i.test(code)) {
        errors.push('ควรใช้แท็ก <p> ครอบข้อความเนื้อหา "This is my first website with HTML5."');
      }

      // Check unordered list
      if (/<ol>/i.test(code) || /<\/ol>/i.test(code)) {
        errors.push('ยังพบแท็ก <ol> ซึ่งเป็นลำดับตัวเลข ภารกิจต้องการรายการแบบจุด <ul>...</ul>');
      } else if (!/<ul>[\s\S]*?<\/ul>/i.test(code)) {
        errors.push('ไม่พบแท็กรายการแบบจุด <ul>...</ul>');
      }

      if (errors.length > 0) {
        return {
          isValid: false,
          feedback: 'ยังพบแท็กที่ผิดประเภท: ' + errors[0],
          errors,
        };
      }

      return {
        isValid: true,
        feedback: 'ถูกต้องทั้งหมด! คุณใช้ <h1>, <p>, และ <ul> ได้อย่างถูกต้องตามหลัก Semantic HTML แล้ว 🏷️✨',
        errors: [],
      };
    },
  },

  // Level 3 — 🔗 Link & Image Repair
  {
    id: 3,
    title: 'Level 3 — 🔗 Link & Image Repair',
    subtitle: 'การเชื่อมโยง Hyperlink และการแทรกรูปภาพพร้อม Attribute',
    mission: 'ปุ่มลิงก์ยังชี้ไปที่ "#" ทำให้ไปไหนไม่ได้ และรูปภาพยังใช้ไฟล์ผิด! จงแก้ href ให้เชื่อมโยงไปที่ "home.html" และเปลี่ยนรูปภาพเป็น "cat.png" พร้อมใส่คำอธิบาย alt="น้องแมวพัฒนาเว็บ"',
    objectives: [
      { id: 'fix_link', label: 'กำหนด href="home.html" ให้แท็ก <a>' },
      { id: 'fix_img_src', label: 'กำหนด src="cat.png" ให้แท็ก <img>' },
      { id: 'fix_img_alt', label: 'ระบุ alt="น้องแมวพัฒนาเว็บ" ช่วยด้าน Accessibility' },
      { id: 'test_click', label: 'ทดสอบคลิกลิงก์และดูรูปใน Live Preview' },
    ],
    initialCode: `<div class="profile-card">
  <h2>โปรไฟล์นักพัฒนาเว็บ</h2>
  <img src="wrong-image.jpg" alt="">
  <p>คลิกเพื่อกลับไปยังหน้าหลักของเว็บไซต์:</p>
  <a href="#">หน้าแรก</a>
</div>`,
    codeParts: [
      'href="home.html"',
      'src="cat.png"',
      'alt="น้องแมวพัฒนาเว็บ"',
      'target="_blank"',
      'class="btn-link"',
    ],
    hint: 'สังเกตแท็ก <a> มี href="#" อยู่ ให้เปลี่ยนเป็น href="home.html" และในแท็ก <img> ให้เปลี่ยน src="cat.png" พร้อมใส่ alt="น้องแมวพัฒนาเว็บ" นะครับ',
    expectedDescription: 'การ์ดโปรไฟล์แสดงรูปน้องแมวนักพัฒนาเว็บอย่างสวยงาม พร้อมปุ่มลิงก์ที่กดแล้วนำทางไป home.html ได้จริง',
    validate: (code: string) => {
      const errors: string[] = [];

      // Check link
      if (/href="#"/i.test(code)) {
        errors.push('ลิงก์ยังเป็น href="#" อยู่ ต้องเปลี่ยนปลายทางเป็น href="home.html"');
      } else if (!/href=["']home\.html["']/i.test(code)) {
        errors.push('ไม่พบแอตทริบิวต์ href="home.html" ในแท็ก <a>');
      }

      // Check image src
      if (/src=["']wrong-image\.jpg["']/i.test(code)) {
        errors.push('รูปภาพยังใช้แหล่งที่มาผิด (wrong-image.jpg) จงเปลี่ยนเป็น cat.png');
      } else if (!/src=["']cat\.png["']/i.test(code)) {
        errors.push('ไม่พบแอตทริบิวต์ src="cat.png" ในแท็ก <img>');
      }

      // Check image alt
      if (/alt=["']\s*["']/i.test(code) || !/alt=/i.test(code)) {
        errors.push('คำอธิบายรูปภาพ alt ยังว่างเปล่า กรุณากำหนด alt="น้องแมวพัฒนาเว็บ"');
      } else if (!/alt=["'][^"']*แมว[^"']*["']/i.test(code)) {
        errors.push('ควรใส่คำอธิบาย alt ที่สื่อความหมาย เช่น alt="น้องแมวพัฒนาเว็บ"');
      }

      if (errors.length > 0) {
        return {
          isValid: false,
          feedback: 'ตรวจสอบแอตทริบิวต์อีกครั้ง: ' + errors[0],
          errors,
        };
      }

      return {
        isValid: true,
        feedback: 'ซ่อมลิงก์และรูปภาพสำเร็จ! ลิงก์คลิกได้จริงและรูปภาพแสดงผลสมบูรณ์พร้อมแท็ก alt ที่ได้มาตรฐาน 🔗🐱',
        errors: [],
      };
    },
  },

  // Level 4 — 📝 Form Factory
  {
    id: 4,
    title: 'Level 4 — 📝 Form Factory',
    subtitle: 'การสร้างฟอร์มรับข้อมูลและกำหนด Input Types ให้ถูกต้อง',
    mission: 'แบบฟอร์มนี้กำหนดประเภทของ input สลับกันหมด! ช่องชื่อกลับเป็น email ช่องอีเมลเป็น text และช่องเลือกเพศเป็น checkbox ทำให้เลือกได้หลายข้อ จงแก้ type ของแต่ละ input ให้ถูกต้องตามข้อมูลที่ต้องการ',
    objectives: [
      { id: 'fix_name_type', label: 'แก้ช่องชื่อให้เป็น type="text"' },
      { id: 'fix_email_type', label: 'แก้ช่องอีเมลให้เป็น type="email"' },
      { id: 'fix_gender_type', label: 'แก้ตัวเลือกเพศให้เป็น type="radio" (เลือกได้ 1 ตัวเลือก)' },
      { id: 'test_submit', label: 'ทดลองกรอกข้อมูลและกดปุ่มสมัครสมาชิกใน Preview' },
    ],
    initialCode: `<form id="regForm">
  <h3>แบบฟอร์มสมัครสมาชิก</h3>
  
  <label for="name">ชื่อ-นามสกุล:</label>
  <input type="email" id="name" placeholder="กรอกชื่อของคุณ">

  <label for="email">อีเมล:</label>
  <input type="text" id="email" placeholder="example@mail.com">

  <label>เพศ (เลือกข้อใดข้อหนึ่ง):</label>
  <input type="checkbox" name="gender" value="male"> ชาย
  <input type="checkbox" name="gender" value="female"> หญิง

  <button type="submit">สมัครสมาชิก</button>
</form>`,
    codeParts: [
      'type="text"',
      'type="email"',
      'type="radio"',
      'type="password"',
      'type="checkbox"',
    ],
    hint: 'ช่องชื่อควรใช้ type="text" ช่องอีเมลควรใช้ type="email" เพื่อให้บราวเซอร์ตรวจรูปแบบ @ และเพศควรเป็น type="radio" ที่มี name="gender" เดียวกันครับ',
    expectedDescription: 'แบบฟอร์มสมัครสมาชิกที่กรอกชื่อ อีเมล และเลือกเพศได้เพียงตัวเลือกเดียว พร้อมกดปุ่มสมัครสมาชิกเพื่อทดสอบการส่งข้อมูลได้จริง',
    validate: (code: string) => {
      const errors: string[] = [];

      // Check name input
      const nameInputMatch = code.match(/<input[^>]*id=["']name["'][^>]*>/i) || code.match(/<input[^>]*placeholder=["'][^"']*ชื่อ[^"']*["'][^>]*>/i);
      if (nameInputMatch) {
        if (/type=["']email["']/i.test(nameInputMatch[0])) {
          errors.push('ช่องชื่อยังเป็น type="email" อยู่ ต้องเปลี่ยนเป็น type="text"');
        } else if (!/type=["']text["']/i.test(nameInputMatch[0])) {
          errors.push('ช่องชื่อต้องใช้ type="text"');
        }
      }

      // Check email input
      const emailInputMatch = code.match(/<input[^>]*id=["']email["'][^>]*>/i) || code.match(/<input[^>]*placeholder=["'][^"']*mail[^"']*["'][^>]*>/i);
      if (emailInputMatch) {
        if (/type=["']text["']/i.test(emailInputMatch[0])) {
          errors.push('ช่องอีเมลยังเป็น type="text" อยู่ ต้องเปลี่ยนเป็น type="email"');
        } else if (!/type=["']email["']/i.test(emailInputMatch[0])) {
          errors.push('ช่องอีเมลต้องใช้ type="email" เพื่อรองรับการตรวจสอบอีเมล');
        }
      }

      // Check gender inputs
      if (/type=["']checkbox["'][^>]*name=["']gender["']/i.test(code) || /name=["']gender["'][^>]*type=["']checkbox["']/i.test(code)) {
        errors.push('การเลือกเพศต้องใช้ type="radio" เพราะต้องเลือกได้เพียงตัวเลือกเดียวเท่านั้น (checkbox ใช้สำหรับเลือกหลายข้อ)');
      } else if (!/type=["']radio["']/i.test(code)) {
        errors.push('ไม่พบแท็ก <input type="radio"> สำหรับตัวเลือกเพศ');
      }

      if (errors.length > 0) {
        return {
          isValid: false,
          feedback: 'ยังกำหนดประเภทของ Input ไม่ถูกต้อง: ' + errors[0],
          errors,
        };
      }

      return {
        isValid: true,
        feedback: 'ยอดเยี่ยมที่สุด! ฟอร์มรับข้อมูลถูกต้องสมบูรณ์ ทั้ง Text, Email และ Radio Button พร้อมใช้งานแล้ว 📝🎉',
        errors: [],
      };
    },
  },

  // Level 5 — 👾 BOSS: เว็บพัง (HTML Error Hunter)
  {
    id: 5,
    title: 'Level 5 — 👾 BOSS: เว็บพัง (HTML Error Hunter)',
    subtitle: 'ภารกิจขั้นสุดยอด: ค้นหาและปราบ Bug ทั้งหมดในเว็บพอร์ตโฟลิโอ!',
    mission: 'เว็บไซต์พอร์ตโฟลิโอนี้พังยับเยิน! มี Bug ซ่อนอยู่ถึง 6 จุด ทั้งหัวข้อแท็กไม่ตรง ลิงก์เสีย แท็กปิดไม่เข้าคู่ รูปภาพพัง และแท็ก footer ปิดหายไป จงใช้ทักษะทั้งหมดที่เรียนมาซ่อมแซมให้เว็บกลับมาใช้งานได้ 100%!',
    objectives: [
      { id: 'boss_bug1', label: 'แก้แท็ก <title> ให้มีแท็กปิด </title>' },
      { id: 'boss_bug2', label: 'แก้หัวข้อ <h2>...</h1> ให้แท็กตรงกัน' },
      { id: 'boss_bug3', label: 'แก้ลิงก์ผลงาน href="#" ให้เป็น href="#projects"' },
      { id: 'boss_bug4', label: 'แก้แท็กย่อหน้า <p> ที่ถูกปิดด้วย </div> ให้เป็น </p>' },
      { id: 'boss_bug5', label: 'แก้รูปโปรไฟล์ src="avatar.png" พร้อม alt="โปรไฟล์"' },
      { id: 'boss_bug6', label: 'ใส่แท็กปิด </footer> ก่อนปิดบอดี้ </body>' },
    ],
    initialCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Portfolio</head>
<body>
  <header>
    <h2>แฟ้มสะสมผลงาน Developer</h1>
    <nav>
      <a href="#about">เกี่ยวกับ</a>
      <a href="#">ผลงาน</a>
    </nav>
  </header>

  <main>
    <section>
      <p>ยินดีต้อนรับสู่พอร์ตโฟลิโอของผม</div>
      <img src="broken-avatar.png" alt="">
    </section>
  </main>

  <footer>
    <p>© 2026 Web Developer</p>
</body>
</html>`,
    codeParts: [
      '</title>',
      '</h1>',
      '</h2>',
      'href="#projects"',
      '</p>',
      'src="avatar.png" alt="รูปโปรไฟล์"',
      '</footer>',
      '<header>',
      '</header>',
    ],
    hint: 'ลองไล่ตรวจทีละบรรทัด: 1) title ไม่มีแท็กปิด 2) h2 ปิดด้วย h1 3) ลิงก์ผลงาน href="#" 4) p ปิดด้วย div 5) รูปภาพ broken 6) footer ไม่มีแท็กปิด </footer>',
    expectedDescription: 'เว็บไซต์ Portfolio ที่สวยงาม มี Header, เมนู Navigation ลิงก์ไปยังส่วนต่างๆ, รูปโปรไฟล์ และ Footer ที่สมบูรณ์ตามมาตรฐาน HTML5',
    validate: (code: string) => {
      const remainingBugs: string[] = [];

      // Bug 1: <title> closed?
      if (!/<title>.*?<\/title>/i.test(code)) {
        remainingBugs.push('แท็ก <title> ยังไม่มีแท็กปิด </title>');
      }

      // Bug 2: heading matched?
      if (/<h2>.*?<\/h1>/i.test(code) || /<h1>.*?<\/h2>/i.test(code)) {
        remainingBugs.push('แท็กหัวข้อ <h2> ยังปิดด้วย </h1> ไม่ตรงคู่กัน');
      }

      // Bug 3: link to projects
      if (/<a[^>]*href=["']#["'][^>]*>\s*ผลงาน\s*<\/a>/i.test(code)) {
        remainingBugs.push('ลิงก์ผลงานยังเป็น href="#" ควรแก้เป็น href="#projects"');
      }

      // Bug 4: paragraph closed with div
      if (/<p>[^<]*<\/div>/i.test(code)) {
        remainingBugs.push('แท็กย่อหน้า <p> ถูกปิดผิดด้วยแท็ก </div> (ควรเป็น </p>)');
      }

      // Bug 5: image src
      if (/src=["']broken-avatar\.png["']/i.test(code) || /alt=["']\s*["']/i.test(code)) {
        remainingBugs.push('รูปภาพยังใช้ไฟล์เสีย (broken-avatar.png) หรือยังไม่ได้ระบุ alt');
      }

      // Bug 6: footer tag closed
      if (/<footer[^>]*>/i.test(code) && !/<\/footer>/i.test(code)) {
        remainingBugs.push('แท็ก <footer> ยังไม่มีแท็กปิด </footer> ก่อน </body>');
      }

      if (remainingBugs.length > 0) {
        return {
          isValid: false,
          feedback: `ยังพบจุดผิดพลาดอีก ${remainingBugs.length} จุด: ${remainingBugs[0]}`,
          errors: remainingBugs,
        };
      }

      return {
        isValid: true,
        feedback: 'ปราบ BOSS สำเร็จแล้ว! คุณค้นพบและซ่อมแซม Bug ทั้งหมด 6 จุดได้อย่างยอดเยี่ยม ยินดีด้วยกับตำแหน่ง HTML5 MASTER! 👑👾🎉',
        errors: [],
      };
    },
  },
];
