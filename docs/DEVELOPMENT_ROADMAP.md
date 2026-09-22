# Development Roadmap

อิงจากข้อกำหนด 46. DEVELOPMENT ORDER ของโปรเจกต์ ลำดับการพัฒนาระบบจะแบ่งออกเป็น 12 เฟส เพื่อให้ระบบมีความเสถียรตั้งแต่แกนกลาง (IRT) ก่อนเชื่อมต่อกับ AI

## 🟦 Foundation & Structural Phases
*   **PHASE 1: Project Setup & Authentication**
    *   Setup Next.js, Tailwind v4
    *   กำหนด Database Schema (PostgreSQL/Supabase)
    *   ทำระบบ Authentication & Role System (Student, Teacher, Admin)
*   **PHASE 2: Course Management**
    *   สร้างระบบจัดการโครงสร้างรายวิชา (Course, Unit, Lesson)
    *   ระบบติดตามความก้าวหน้า (Progress) เบื้องต้น
*   **PHASE 3: Question Bank (Item Bank)**
    *   ระบบเก็บข้อสอบและ Metadata (Domain, Sub-domain)
    *   กำหนดโครงสร้าง Test Blueprint

## 🟧 Core IRT & CAT Engine Phases
*   **PHASE 4: IRT Engine (Mathematical Core)**
    *   เขียนฟังก์ชันคำนวณ 3PL Probability
    *   ฟังก์ชัน Item Information
    *   ฟังก์ชัน Ability Estimation (MLE) และ Standard Error
    *   *(ต้องผ่าน Unit Test ตาม TEST_PLAN)*
*   **PHASE 5: CAT Engine**
    *   สร้างระบบควบคุม Item Selection (MFI)
    *   ระบบ Content Balancing & Exposure Control
    *   ระบบ Stopping Rule (Min/Max Items, Target SE)
*   **PHASE 6: Adaptive Assessment UI**
    *   สร้างหน้าจอสอบปรับเหมาะสำหรับนักเรียนเชื่อมต่อกับ CAT Engine

## 🟨 Analytics & Personalized Learning Phases
*   **PHASE 7: Diagnostic Analytics & Profile**
    *   ระบบประมวลผล Diagnostic Analytics
    *   สร้างหน้า Learning Profile แสดงกราฟและ Skill Gap
*   **PHASE 8: Personalized Recommendation**
    *   ระบบแนะนำบทเรียน (Personalized Learning Path) อิงจาก Skill Gap
*   **PHASE 9: Code Lab**
    *   สร้าง Online Code Lab Environment (Sandbox)

## 🟩 AI & Finalization Phases
*   **PHASE 10: AI Integration**
    *   AI Tutor (ช่วยอธิบาย)
    *   AI Code Review (วิเคราะห์ Syntax จาก Code Lab)
    *   AI Learning Advisor (ชี้แนะจาก IRT Profile)
*   **PHASE 11: Teacher Dashboard**
    *   หน้าจอสรุปผล Class Overview
    *   Item Analysis Data สำหรับครู
*   **PHASE 12: Finalization & Reports**
    *   ระบบ Export Reports
    *   Security Hardening
    *   Deployment สู่ Vercel / Cloud
