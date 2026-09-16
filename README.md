# ระบบการเรียนรู้แบบปรับเหมาะเฉพาะบุคคล เรื่อง โครงสร้างภาษา HTML
### (Adaptive Learning System for HTML Structure with Integrated Code Lab)

> **ชื่องานวิจัย/นวัตกรรมฉบับเต็ม:**  
> **"การพัฒนานวัตกรรมการเรียนรู้แบบปรับเหมาะเฉพาะบุคคลโดยบูรณาการพื้นที่จำลองการเขียนโค้ด เรื่อง โครงสร้างภาษา HTML เพื่อส่งเสริมทักษะทางวิชาชีพด้านการพัฒนาเว็บไซต์ สำหรับนักเรียนระดับชั้นประกาศนียบัตรวิชาชีพ (ปวช.)"**

---

## 🌟 จุดเด่นของนวัตกรรม (Key Innovations)

1. **ขอบเขตเนื้อหา 8 Sub-domain ของโครงสร้างภาษา HTML (H1 – H8)**:
   - **H1**: โครงสร้างเอกสาร HTML พื้นฐาน (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`, `<title>`, `<meta>`)
   - **H2**: การจัดการข้อความและ Heading/Paragraph (`<h1>`-`<h6>`, `<p>`, `<br>`, `<hr>`, `<strong>`, `<em>`)
   - **H3**: Hyperlink และการเชื่อมโยง (`<a>`, `href`, `target="_blank"`, anchor link `#`)
   - **H4**: รูปภาพและสื่อประสม (`<img>`, `alt`, `<figure>`, `<figcaption>`, `<video>`, `<audio>`)
   - **H5**: รายการข้อมูล (`<ul>`, `<ol>`, `<li>`, `<dl>`, `<dt>`, `<dd>`)
   - **H6**: ตารางและการผสานเซลล์ (`<table>`, `<tr>`, `<td>`, `<th>`, `<thead>`, `<tbody>`, `colspan`, `rowspan`)
   - **H7**: ฟอร์มและการรับข้อมูล (`<form>`, `<input>`, `<label>`, `<select>`, `<textarea>`, `<button>`)
   - **H8**: Semantic HTML5 และโครงสร้างหน้าเว็บทั้งหน้า (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)

2. **Adaptive Assessment Engine (Rule-based 5 กฎ)**:
   - เริ่มต้นที่ระดับความยากปานกลาง (`medium`) คละทั้ง 8 Sub-domain
   - ตอบถูก -> ปรับระดับยากขึ้น (`hard`), ตอบผิด -> ปรับระดับลง (`easy`)
   - บังคับครอบคลุมครบทุก Sub-domain อย่างน้อย 1 ข้อ และมีนาฬิกาจับเวลาถอยหลังแบบนุ่มนวล (Soft Timer)

3. **Code Lab Simulation (พื้นที่จำลองการเขียนโค้ด)**:
   - รัน Live Preview อย่างปลอดภัยผ่าน `<iframe sandbox="allow-scripts">` (ไม่เปิด `allow-same-origin`)
   - ตรวจสอบความถูกต้องของโครงสร้าง HTML ผ่าน **Requirement Checklist** แบบ Real-time
   - ส่งโค้ดตรวจผ่าน **AI Code Review** (Server-side) วิเคราะห์ไวยากรณ์และโครงสร้าง Semantic

4. **Diagnostic Analytics & Learning Profile**:
   - แผนภูมิเรดาร์ 8 มิติ (**8-axis SVG Radar Chart**) วิเคราะห์ความเชี่ยวชาญรายบุคคล
   - **AI Advisor** สังเคราะห์จุดเด่น จุดที่ควรเสริม และแนะนำการ **"ทดสอบซ้ำ (Re-test)"**

5. **Teacher Dashboard & Sub-domain Heatmap**:
   - ตาราง Matrix **Heatmap 8 คอลัมน์ (H1–H8)** แสดงภาพรวมความเข้าใจของทั้งห้องเรียน
   - วิเคราะห์ข้อสอบ (Question Analytics) และส่งออกรายงานผลการเรียนเป็นไฟล์ **CSV**

6. **ดีไซน์ระดับพรีเมียม (Liquid Glassmorphism 2.0)**:
   - พื้นผิวแก้วกึ่งโปร่งใส แสงเรืองรอง Ambient Glowing Orbs โทนสี Indigo/Violet Gradient
   - บังคับใช้ฟอนต์ **Noto Sans Thai** 100% สระ/วรรณยุกต์สวยงาม รองรับทั้ง Light และ Dark Mode

---

## 🛠️ สถาปัตยกรรมและเทคโนโลยี (Tech Stack)

- **Frontend**: Next.js 15+ (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Authentication**: Supabase Auth (Google OAuth) พร้อมระบบ **Demo Role Switcher**
- **Database**: Supabase (PostgreSQL) พร้อม Row Level Security (RLS) 15 ตาราง
- **AI Integration**: Google Gemini API (`@google/genai`) ผ่าน Next.js Route Handlers ฝั่ง Server
- **Deployment**: Vercel Ready

---

## 🚀 การติดตั้งและเริ่มใช้งานในเครื่อง (Local Setup)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env.local`:
```bash
cp .env.example .env.local
```
*(หากยังไม่ได้กรอก Supabase URL หรือ Gemini API Key ระบบจะเปิดใช้งานโหมดจำลองสถานการณ์ Development/Demo Mode ให้โดยอัตโนมัติ)*

### 3. รัน Development Server
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 🗄️ โครงสร้างฐานข้อมูล Supabase (SQL Migrations)

ไฟล์ Schema และ Seed Data บรรจุอยู่ในโฟลเดอร์ `supabase/`:
- `supabase/migrations/20260916_init_schema.sql`: โครงสร้าง 15 ตาราง พร้อม RLS Policies และ Triggers
- `supabase/seed.sql`: ข้อมูลคลังข้อสอบ 40 ข้อ (H1-H8), บทเรียน 8 หน่วย, สื่อการสอน และโจทย์ Code Lab

สามารถนำไฟล์ข้างต้นไปรันใน **SQL Editor** ของโปรเจกต์ Supabase ได้ทันที
