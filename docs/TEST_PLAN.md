# Test Plan

## 1. Overview
เนื่องจากระบบ IRT 3PL อิงพื้นฐานทางคณิตศาสตร์สถิติ การทดสอบจึงไม่ใช่แค่ "โค้ดรันผ่านหรือไม่" แต่รวมถึง "ผลลัพธ์ทางคณิตศาสตร์ถูกต้องแม่นยำหรือไม่"

## 2. Unit Testing สำหรับ IRT Core Modules
เครื่องมือที่ใช้: Jest หรือ Vitest

### 2.1 3PL Probability Test
*   **Scenario**: Input $\theta$, $a$, $b$, $c$ ค่าคงที่, คาดหวังผลลัพธ์ $P(\theta)$
*   **Example Case**:
    *   `theta = 0, a = 1.2, b = 0, c = 0.25, D = 1.7`
    *   `Expected Probability` $\approx 0.625$
*   **Numerical Tolerance**: ใช้ฟังก์ชันคล้าย `toBeCloseTo(expected, 4)` เพื่อยอมรับความคลาดเคลื่อนทางจุดทศนิยมจาก Floating Point (Floating Point Math)

### 2.2 Item Information Test
*   **Scenario**: ทดสอบสมการคำนวณ Fisher Information
*   **Case**: ทดสอบค่า $I(\theta)$ เมื่อ $\theta$ อยู่ห่างจาก $b$ มากๆ ค่า Information ควรเข้าใกล้ $0$

### 2.3 Theta Estimation (MLE) Test
*   **Scenario**: ป้อน Response Pattern ที่รู้ผลลัพธ์ล่วงหน้า (เช่น $[1, 0, 1]$ บนไอเทมที่กำหนดค่าพารามิเตอร์)
*   **Expected**: ฟังก์ชัน `estimateThetaMLE` จะต้องหมุนลูป (เช่น Newton-Raphson) จนบรรจบหาค่า $\theta$ และ SE ที่ถูกต้องได้

## 3. CAT Simulation Testing
*   **Scenario**: สร้างผู้เรียนจำลอง (Simulee) กำหนดให้มีความสามารถ $\theta_{true} = 1.0$
*   ให้ Simulee ตอบข้อสอบจำลองจาก Item Bank (ตอบแบบสุ่มโดยอิงความน่าจะเป็น 3PL)
*   ตรวจสอบว่าระบบ CAT เลือกข้อสอบได้เหมาะสม และท้ายที่สุดค่า $\theta_{estimated}$ ลู่เข้าใกล้ $1.0$ จริง และระบบหยุดการสอบตาม Target SE ที่กำหนด

## 4. UI & End-to-End (E2E) Testing
*   **Authentication**: ทดสอบ Login หลาย Role
*   **Code Lab**: ป้อนโค้ดอันตราย (XSS/Infinite Loop) แล้วตรวจสอบว่า Sandbox พังหรือหลุดออกมานอก Iframe หรือไม่
