# API Specification

## 1. REST API (Application Layer)

### Authentication
*   `POST /auth/login` - เข้าสู่ระบบผ่าน Supabase Auth

### Courses & Lessons
*   `GET /courses` - ดึงรายวิชา
*   `GET /courses/:id` - ดึงโครงสร้างหน่วยและบทเรียน
*   `GET /lessons/:id` - ดึงเนื้อหาบทเรียน

### Code Lab
*   `POST /code/run` - สั่งรันโค้ดใน Sandbox Environment
*   `POST /code/submit` - ส่งโค้ดเพื่อบันทึกผล
*   `POST /code/review` - ส่งโค้ดให้ AI Code Review วิเคราะห์

### Question Bank & Teacher
*   `GET /questions` - ดึงข้อสอบ (Filter ตาม status, domain)
*   `POST /questions` - สร้างข้อสอบใหม่ (Draft status)
*   `PUT /questions/:id` - อัปเดตข้อสอบ / เปลี่ยนสถานะ
*   `GET /teacher/item-analysis` - ดึงข้อมูล Item Analysis (a, b, c, exposure)

### Assessment (CAT)
*   `POST /assessment/start` - สร้าง CAT Session ใหม่ (Initialize $\theta$)
*   `POST /assessment/:sessionId/answer` - ส่งคำตอบ และรับผล (Response_time, next item หรือ stop rule)
*   `GET /assessment/:sessionId` - ดึงสถานะปัจจุบันของการสอบ
*   `POST /assessment/:sessionId/finish` - บังคับจบการสอบล่วงหน้า

### Analytics & Profile
*   `GET /student/:id/learning-profile` - ดึงข้อมูล Skill Profile (Overall & Domains)
*   `GET /analytics/student/:studentId` - ข้อมูลความก้าวหน้าสำหรับครู
*   `GET /analytics/class/:classId` - ภาพรวมทั้งห้อง
*   `POST /recommendations/generate` - สั่งให้ AI Learning Advisor สร้างแผนการเรียน (Personalized Path)
*   `POST /assessment/retest` - สร้าง Session สำหรับ Re-Test หลังเรียนรู้

## 2. IRT Internal Engine API (Internal Services)
ส่วนนี้ถูกแยกออกมาเป็น Core Module ที่ไม่ต้องผ่าน HTTP ตรงๆ แต่ถูกเรียกใช้งานจาก Assessment Route เพื่อความปลอดภัยและประสิทธิภาพ

```typescript
// คำนวณความน่าจะเป็นของการตอบถูกตามสมการ 3PL
calculate3PLProbability(theta: number, a: number, b: number, c: number, D?: number = 1.7): number;

// คำนวณ Item Information ณ จุดความสามารถ theta ปัจจุบัน
calculateItemInformation(theta: number, a: number, b: number, c: number, D?: number = 1.7): number;

// ประมาณค่าความสามารถ (Theta) และค่าความคลาดเคลื่อนมาตรฐาน (SE)
estimateTheta(
    responses: Array<{ is_correct: boolean, a: number, b: number, c: number }>, 
    method: 'MLE' | 'MAP' | 'EAP' = 'MLE'
): { theta: number, standardError: number };

// ฟังก์ชันเลือกข้อสอบข้อต่อไป (MFI + Content Balancing + Exposure)
selectNextItem(
    currentTheta: number, 
    eligibleItems: Question[], 
    sessionHistory: string[],
    blueprint: TestBlueprint
): Question;

// ฟังก์ชันตรวจสอบกฎการหยุดสอบ
checkStoppingRule(
    itemsAnswered: number, 
    currentSE: number, 
    rules: { minItems: number, maxItems: number, targetSE: number }
): boolean;
```
