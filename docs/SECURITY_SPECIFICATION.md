# Security Specification

## 1. Overview
WebAI Adaptive Learning Platform จัดการกับข้อมูลการศึกษาของนักเรียน การประเมินผล และการทำงานของโค้ด จึงต้องการมาตรการรักษาความปลอดภัยขั้นสูงในหลายมิติ

## 2. Role-Based Access Control (RBAC)
ระบบจำแนกผู้ใช้ผ่าน `roles` (Student, Teacher, Admin) โดยบังคับใช้ในระดับ Application Layer (Middleware/Guards) และ Data Layer (Row Level Security ใน Supabase)

*   **Student**:
    *   **ห้าม** เข้าถึงข้อมูล IRT Calibration Data (a, b, c parameters ไม่ควรให้เด็กเห็นตรงๆ ป้องกันการ reverse engineer ข้อสอบ)
    *   **ห้าม** เข้าถึง Correct Answer ล่วงหน้าจาก API โดยตรง (API ส่งเฉพาะคำถาม ส่งคำตอบกลับไปค่อยรู้ผล)
    *   **ห้าม** เข้าถึงข้อมูลของ Student คนอื่น (Enforced by RLS)
*   **Teacher**:
    *   ดูผลของนักเรียนได้เฉพาะในคลาสตัวเอง
    *   จัดการข้อสอบและค่าพารามิเตอร์ได้ แต่แก้ Log การสอบไม่ได้
*   **Admin**:
    *   เข้าถึงสิทธิ์การตั้งค่าระบบ จัดการ Role และ Audit Logs

## 3. Code Lab Sandbox (Code Execution Security)
**กฎเหล็ก:** ห้ามรัน User Code (HTML, CSS, JS ของนักเรียน) บน Main Backend Server โดยตรง

**แนวทางการแก้ปัญหา (Isolation):**
1.  **Frontend Isolation (แนะนำสำหรับ ปวช. ที่เน้น HTML/CSS/JS)**:
    *   ใช้ `<iframe sandbox="allow-scripts">` โดย**ไม่เปิด** `allow-same-origin` เพื่อแยก Environment 
    *   โค้ดทำงานอยู่บนเครื่องเบราว์เซอร์นักเรียน 100% ไม่เสี่ยงต่อเซิร์ฟเวอร์หลัก
2.  **WebContainers (ทางเลือกขั้นสูง)**:
    *   รัน Node.js environment ภายในเบราว์เซอร์ผ่าน WebAssembly (แยกตัวสมบูรณ์)

## 4. API & Data Protection
*   **AI API Key (Gemini)**: ต้องเก็บเป็น Server Environment Variable เท่านั้น ห้ามหลุดไปใน Frontend Code (Client Component) เด็ดขาด ทุกคำขอถึง AI ต้องผ่าน Next.js Route Handlers (Backend)
*   **Rate Limiting**: ป้องกันการสแปมการตอบข้อสอบ (Brute-force guessing) หรือการยิงคำสั่ง Code Lab รัวๆ
*   **Audit Logs**: บันทึกการกระทำที่สำคัญของ Admin และ Teacher (เช่น การแก้ค่า parameter, ลบข้อมูลนักเรียน)
