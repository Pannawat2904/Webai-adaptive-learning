'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useAuth } from '@/lib/auth-context';
import { MOCK_ASSIGNMENTS } from '@/lib/mock-data';
import { Assignment } from '@/types/database';
import {
  Terminal,
  Play,
  RotateCcw,
  Save,
  Send,
  Code2,
  Layout,
  Globe,
  Bot,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export interface CodeValidationError {
  id: string;
  title: string;       // ขาดอะไร
  location: string;    // ตรงไหน
  hint: string;        // ตัวอย่างโค้ด / วิธีแก้ไข
  snippet?: string;    // โค้ดตัวอย่างสำหรับกด Copy
}

/**
 * ฟังก์ชันตรวจสอบความถูกต้องของโค้ด HTML ทั้งโครงสร้างหลักและ Checklist ประจำภารกิจ
 * หากขาดหรือเขียนไม่ครบ จะระบุอย่างละเอียดว่าขาดอะไร และต้องวางไว้ตรงไหน
 */
function validateHtmlAssignment(code: string, assignment: Assignment): CodeValidationError[] {
  const errors: CodeValidationError[] = [];
  const trimmed = code.trim();

  if (!trimmed) {
    errors.push({
      id: 'empty_code',
      title: 'ยังไม่มีการเขียนโค้ด HTML ใดๆ',
      location: 'พื้นที่เขียนโค้ดว่างเปล่า',
      hint: 'กรุณาเขียนโค้ดโครงสร้าง HTML ตามที่โจทย์กำหนด',
      snippet: '<!DOCTYPE html>\n<html lang="th">\n<head>\n  <meta charset="UTF-8">\n  <title>ชื่อหน้าเว็บ</title>\n</head>\n<body>\n  <h1>สวัสดีชาวโลก</h1>\n</body>\n</html>'
    });
    return errors;
  }

  // 1. ตรวจสอบโครงสร้างพื้นฐาน HTML5
  const hasDoctype = /<!doctype\s+html>/i.test(code);
  const hasHtmlOpen = /<html[^>]*>/i.test(code);
  const hasHtmlClose = /<\/html>/i.test(code);
  const hasHeadOpen = /<head[^>]*>/i.test(code);
  const hasHeadClose = /<\/head>/i.test(code);
  const hasBodyOpen = /<body[^>]*>/i.test(code);
  const hasBodyClose = /<\/body>/i.test(code);

  if (!hasDoctype) {
    errors.push({
      id: 'err_doctype',
      title: 'ขาดคำประกาศ <!DOCTYPE html>',
      location: 'บรรทัดแรกสุดของเอกสาร (บรรทัดที่ 1 บนสุด อยู่นอกแท็ก <html>)',
      hint: 'พิมพ์ <!DOCTYPE html> ไว้ที่บรรทัดบนสุด เพื่อประกาศว่าเป็นเอกสาร HTML5 มาตรฐานสากล',
      snippet: '<!DOCTYPE html>'
    });
  }

  if (!hasHtmlOpen) {
    errors.push({
      id: 'err_html_open',
      title: 'ขาดแท็กเปิด <html>',
      location: 'บรรทัดถัดจาก <!DOCTYPE html>',
      hint: 'ใส่แท็ก <html lang="th"> เพื่อเป็นแท็กราก (Root element) ของเอกสาร',
      snippet: '<html lang="th">'
    });
  } else if (!hasHtmlClose) {
    errors.push({
      id: 'err_html_close',
      title: 'ลืมพิมพ์แท็กปิด </html>',
      location: 'บรรทัดสุดท้ายของเอกสาร',
      hint: 'พิมพ์ </html> ไว้ที่บรรทัดสุดท้ายของเอกสารเพื่อปิดแท็กรากให้สมบูรณ์',
      snippet: '</html>'
    });
  }

  if (!hasHeadOpen) {
    errors.push({
      id: 'err_head_open',
      title: 'ขาดแท็กเปิด <head>',
      location: 'อยู่ภายในแท็ก <html> ก่อนเริ่มส่วน <body>',
      hint: 'ใส่แท็ก <head> สำหรับเก็บข้อมูลส่วนหัว เช่น meta charset และ title',
      snippet: '<head>\n  <meta charset="UTF-8">\n  <title>ชื่อหน้าเว็บ</title>\n</head>'
    });
  } else if (!hasHeadClose) {
    errors.push({
      id: 'err_head_close',
      title: 'ลืมพิมพ์แท็กปิด </head>',
      location: 'ก่อนเริ่มต้นแท็ก <body>',
      hint: 'พิมพ์ </head> เพื่อปิดส่วนหัวของหน้าเว็บก่อนเริ่มส่วนเนื้อหา',
      snippet: '</head>'
    });
  }

  if (!hasBodyOpen) {
    errors.push({
      id: 'err_body_open',
      title: 'ขาดแท็กเปิด <body>',
      location: 'อยู่ถัดจากแท็กปิด </head> และอยู่ก่อนปิด </html>',
      hint: 'ใส่แท็ก <body> เพื่อเริ่มต้นพื้นที่สำหรับใส่เนื้อหาของหน้าเว็บ',
      snippet: '<body>\n  <!-- เนื้อหาหน้าเว็บที่นี่ -->\n</body>'
    });
  } else if (!hasBodyClose) {
    errors.push({
      id: 'err_body_close',
      title: 'ลืมพิมพ์แท็กปิด </body>',
      location: 'ก่อนปิดแท็ก </html>',
      hint: 'พิมพ์ </body> เพื่อปิดส่วนเนื้อหาของหน้าเว็บให้เรียบร้อย',
      snippet: '</body>'
    });
  }

  // 2. ตรวจสอบการลืมปิดแท็กคู่ (Unclosed paired tags)
  const codeWithoutComments = code.replace(/<!--[\s\S]*?-->/g, '');
  const pairedTags = [
    { tag: 'title', label: 'แท็กหัวข้อ <title>', loc: 'ภายในส่วน <head> ... </head>' },
    { tag: 'h1', label: 'แท็กหัวเรื่อง <h1>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'h2', label: 'แท็กหัวเรื่องย่อย <h2>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'h3', label: 'แท็กหัวเรื่องย่อย <h3>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'p', label: 'แท็กย่อหน้า <p>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'table', label: 'แท็กตาราง <table>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'tr', label: 'แท็กแถวตาราง <tr>', loc: 'ภายในแท็ก <table>' },
    { tag: 'td', label: 'แท็กเซลล์ข้อมูล <td>', loc: 'ภายในแท็ก <tr>' },
    { tag: 'th', label: 'แท็กหัวตาราง <th>', loc: 'ภายในแท็ก <tr>' },
    { tag: 'form', label: 'แท็กแบบฟอร์ม <form>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'label', label: 'แท็กป้ายกำกับ <label>', loc: 'ภายในแท็ก <form>' },
    { tag: 'button', label: 'แท็กปุ่ม <button>', loc: 'ภายในส่วน <body>' },
    { tag: 'header', label: 'แท็กส่วนหัว <header>', loc: 'ภายในส่วน <body>' },
    { tag: 'nav', label: 'แท็กเมนูนำทาง <nav>', loc: 'ภายในส่วน <body>' },
    { tag: 'main', label: 'แท็กเนื้อหาหลัก <main>', loc: 'ภายในส่วน <body>' },
    { tag: 'section', label: 'แท็กหมวดหมู่ <section>', loc: 'ภายในส่วน <main>' },
    { tag: 'article', label: 'แท็กบทความ <article>', loc: 'ภายในส่วน <main>' },
    { tag: 'footer', label: 'แท็กส่วนท้าย <footer>', loc: 'ภายในส่วน <body> ด้านล่าง' },
    { tag: 'ul', label: 'แท็กรายการลำดับจุด <ul>', loc: 'ภายในส่วน <body>' },
    { tag: 'ol', label: 'แท็กรายการลำดับเลข <ol>', loc: 'ภายในส่วน <body>' },
    { tag: 'li', label: 'แท็กไอเทม <li>', loc: 'ภายในแท็ก <ul> หรือ <ol>' },
    { tag: 'a', label: 'แท็กลิงก์ <a>', loc: 'ภายในส่วน <body>' }
  ];

  for (const item of pairedTags) {
    const openMatches = codeWithoutComments.match(new RegExp(`<${item.tag}(\\s+[^>]*)?>`, 'gi')) || [];
    const closeMatches = codeWithoutComments.match(new RegExp(`</${item.tag}>`, 'gi')) || [];
    if (openMatches.length > closeMatches.length) {
      errors.push({
        id: `unclosed_${item.tag}`,
        title: `ลืมพิมพ์แท็กปิด </${item.tag}> (พบแท็กเปิด ${openMatches.length} จุด แต่มีแท็กปิดเพียง ${closeMatches.length} จุด)`,
        location: `ตำแหน่ง: ${item.loc} (ตรวจบริเวณแท็ก <${item.tag}>)`,
        hint: `แท็ก <${item.tag}> เป็นแท็กคู่ ต้องปิดด้วย </${item.tag}> เสมอ`,
        snippet: `</${item.tag}>`
      });
    }
  }

  // 3. ตรวจสอบ DOM และเงื่อนไข Checklist ประจำ Quest
  let doc: Document | null = null;
  try {
    const parser = new DOMParser();
    doc = parser.parseFromString(code, 'text/html');
  } catch (e) {
    console.error('DOM Parser error:', e);
  }

  if (doc) {
    // ตรวจสอบตำแหน่งผิด เช่น title หรือ meta อยู่ใน body
    const titleInBody = doc.querySelector('body title');
    if (titleInBody) {
      errors.push({
        id: 'err_title_in_body',
        title: 'แท็ก <title> อยู่ผิดตำแหน่ง',
        location: 'พบแท็ก <title> อยู่ในส่วน <body> ซึ่งผิดมาตรฐาน',
        hint: 'ต้องย้ายแท็ก <title> ไปไว้ภายในส่วน <head> ... </head> เท่านั้น',
        snippet: '<head>\n  <title>ชื่อหน้าเว็บของคุณ</title>\n</head>'
      });
    }

    const metaInBody = doc.querySelector('body meta');
    if (metaInBody) {
      errors.push({
        id: 'err_meta_in_body',
        title: 'แท็ก <meta> อยู่ผิดตำแหน่ง',
        location: 'พบแท็ก <meta> อยู่ในส่วน <body> ซึ่งผิดมาตรฐาน',
        hint: 'ต้องย้ายแท็ก <meta charset="UTF-8"> ไปไว้ภายในส่วน <head> ... </head> เท่านั้น',
        snippet: '<head>\n  <meta charset="UTF-8">\n</head>'
      });
    }

    // ตรวจสอบ Checklist ประจำภารกิจแต่ละข้อ
    assignment.checklist.forEach((item) => {
      let passed = false;
      let errorDetail: { title: string; location: string; hint: string; snippet?: string } | null = null;

      if (item.selector === '!doctype') {
        passed = hasDoctype;
        // หากขาด ได้แจ้งไปแล้วที่ขั้นตอนที่ 1
      } else if (item.selector === 'html[lang=th]') {
        passed = /<html[^>]*lang=["']th["']/i.test(code);
        if (!passed) {
          errorDetail = {
            title: 'แท็ก <html> ขาดแอตทริบิวต์ lang="th"',
            location: 'ที่แท็กเปิด <html> ด้านบนของไฟล์',
            hint: 'แก้ไขแท็กเปิดให้มี lang="th" เพื่อระบุว่าเอกสารนี้เป็นภาษาไทย',
            snippet: '<html lang="th">'
          };
        }
      } else if (item.selector === 'head meta[charset]') {
        passed = /<meta[^>]*charset=["']?utf-8/i.test(code);
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็ก <meta charset="UTF-8">',
            location: 'ต้องเขียนอยู่ภายในส่วน <head> ... </head>',
            hint: 'เพิ่มแท็ก <meta charset="UTF-8"> ไว้ใต้แท็ก <head> เพื่อให้หน้าเว็บรองรับภาษาไทย ไม่เป็นภาษาต่างดาว',
            snippet: '<meta charset="UTF-8">'
          };
        }
      } else if (item.selector === 'head title') {
        const titleEl = doc!.querySelector('head title') || doc!.querySelector('title');
        passed = !!titleEl && (titleEl.textContent || '').trim().length > 0;
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็ก <title> หรือยังไม่ได้ระบุชื่อเรื่องหน้าเว็บ',
            location: 'ต้องเขียนอยู่ภายในส่วน <head> ... </head>',
            hint: 'เพิ่มแท็ก <title>ชื่อเรื่องหน้าเว็บของคุณ</title> ไว้ในบล็อก <head>',
            snippet: '<title>หน้าแรกของฉัน</title>'
          };
        }
      } else if (item.selector === 'body') {
        passed = hasBodyOpen && hasBodyClose;
      } else if (item.selector === 'h1') {
        const h1s = doc!.querySelectorAll('body h1');
        passed = h1s.length >= (item.minCount || 1);
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็กหัวเรื่องหลัก <h1>',
            location: 'ต้องเขียนอยู่ภายในส่วน <body> ... </body>',
            hint: 'เพิ่มแท็ก <h1>ชื่อหัวเรื่องหลักของคุณ</h1> ในส่วน body',
            snippet: '<h1>สวัสดีชาวโลก!</h1>'
          };
        }
      } else if (item.selector === 'h2') {
        const h2s = doc!.querySelectorAll('body h2');
        const minCount = item.minCount || 2;
        passed = h2s.length >= minCount;
        if (!passed) {
          errorDetail = {
            title: `หัวเรื่องย่อย <h2> ยังไม่ครบตามกำหนด (ต้องการอย่างน้อย ${minCount} จุด, ปัจจุบันมี ${h2s.length} จุด)`,
            location: 'ต้องเขียนอยู่ภายในส่วน <body> ... </body>',
            hint: `เพิ่มแท็ก <h2>หัวเรื่องย่อย</h2> อีก ${minCount - h2s.length} จุด เพื่อแบ่งสัดส่วนเนื้อหา`,
            snippet: '<h2>ประวัติส่วนตัว</h2>\n<h2>ทักษะความสามารถ</h2>'
          };
        }
      } else if (item.selector === 'p') {
        const ps = doc!.querySelectorAll('body p');
        const minCount = item.minCount || 2;
        passed = ps.length >= minCount;
        if (!passed) {
          errorDetail = {
            title: `ย่อหน้าข้อความ <p> ยังไม่ครบตามกำหนด (ต้องการอย่างน้อย ${minCount} ย่อหน้า, ปัจจุบันมี ${ps.length} ย่อหน้า)`,
            location: 'ต้องเขียนอยู่ภายในส่วน <body> ... </body>',
            hint: `เพิ่มแท็ก <p>ข้อความบรรยายเนื้อหา...</p> อีก ${minCount - ps.length} ย่อหน้า`,
            snippet: '<p>ยินดีต้อนรับเข้าสู่เว็บไซต์ของฉัน</p>\n<p>ฉันกำลังศึกษาการพัฒนาเว็บด้วย HTML5</p>'
          };
        }
      } else if (item.selector === 'hr') {
        const hrs = doc!.querySelectorAll('body hr');
        passed = hrs.length >= (item.minCount || 1);
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็กเส้นคั่นแนวนอน <hr>',
            location: 'ภายในส่วน <body> ... </body> ระหว่างย่อหน้าหรือหัวข้อ',
            hint: 'ใส่แท็ก <hr> เพื่อสร้างเส้นคั่นแบ่งสัดส่วนเนื้อหา',
            snippet: '<hr>'
          };
        }
      } else if (item.selector === 'img[alt]') {
        const imgs = doc!.querySelectorAll('body img');
        const imgsWithAlt = doc!.querySelectorAll('body img[alt]');
        if (imgs.length === 0) {
          errorDetail = {
            title: 'ขาดแท็กรูปภาพ <img>',
            location: 'ต้องเขียนอยู่ภายในส่วน <body> ... </body>',
            hint: 'เพิ่มแท็ก <img src="URL_รูปภาพ" alt="คำอธิบายภาพ">',
            snippet: '<img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400" alt="ภาพตัวอย่าง">'
          };
        } else if (imgsWithAlt.length === 0) {
          errorDetail = {
            title: 'แท็ก <img> ขาดแอตทริบิวต์ alt (คำอธิบายรูปภาพ)',
            location: 'ที่แท็ก <img> ในส่วน <body>',
            hint: 'เพิ่ม alt="คำอธิบายภาพ" ในแท็ก <img> เพื่อรองรับมาตรฐาน Accessibility',
            snippet: '<img src="..." alt="คำอธิบายภาพ">'
          };
        } else {
          passed = true;
        }
      } else if (item.selector === 'table') {
        const tables = doc!.querySelectorAll('body table');
        passed = tables.length >= (item.minCount || 1);
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็กตาราง <table> ... </table>',
            location: 'ต้องเขียนอยู่ภายในส่วน <body> ... </body>',
            hint: 'สร้างตารางโดยใช้แท็ก <table> และปิดด้วย </table>',
            snippet: '<table>\n  <tr><th>หัวข้อ</th><th>รายละเอียด</th></tr>\n  <tr><td>ข้อมูล 1</td><td>ข้อมูล 2</td></tr>\n</table>'
          };
        }
      } else if (item.selector === 'table tr td, table tr th') {
        const rows = doc!.querySelectorAll('table tr');
        const cells = doc!.querySelectorAll('table tr td, table tr th');
        passed = rows.length >= 1 && cells.length >= 1;
        if (!passed) {
          errorDetail = {
            title: 'ตารางยังไม่สมบูรณ์ (ขาดแถว <tr> หรือเซลล์ <td>/<th>)',
            location: 'ภายในแท็ก <table> ... </table>',
            hint: 'ใส่โครงสร้างแถว <tr> และเซลล์ข้อมูล <td> หรือหัวตาราง <th> ให้ครบถ้วน',
            snippet: '<tr>\n  <td>ข้อมูลช่องที่ 1</td>\n  <td>ข้อมูลช่องที่ 2</td>\n</tr>'
          };
        }
      } else if (item.selector === 'header') {
        const headers = doc!.querySelectorAll('body header');
        passed = headers.length >= (item.minCount || 1);
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็กส่วนหัว <header> ... </header>',
            location: 'ภายในส่วน <body> ... </body> ด้านบนสุด',
            hint: 'ใส่แท็ก <header><h1>หัวข้อเว็บไซต์</h1></header> เพื่อระบุส่วนหัวของหน้าเว็บ',
            snippet: '<header>\n  <h1>ยินดีต้อนรับสู่เว็บของฉัน</h1>\n</header>'
          };
        }
      } else if (item.selector === 'nav a') {
        const navs = doc!.querySelectorAll('nav');
        const navLinks = doc!.querySelectorAll('nav a');
        if (navs.length === 0) {
          errorDetail = {
            title: 'ขาดแท็กเมนูนำทาง <nav> ... </nav>',
            location: 'ภายในส่วน <header> หรือส่วนบนของ <body>',
            hint: 'สร้างแถบเมนูด้วยแท็ก <nav><a href="#home">หน้าแรก</a></nav>',
            snippet: '<nav>\n  <a href="#home">หน้าแรก</a>\n  <a href="#about">เกี่ยวกับเรา</a>\n</nav>'
          };
        } else if (navLinks.length === 0) {
          errorDetail = {
            title: 'แท็ก <nav> ยังไม่มีลิงก์ <a> นำทาง',
            location: 'ภายในแท็ก <nav> ... </nav>',
            hint: 'เพิ่มแท็กลิงก์ เช่น <a href="#home">หน้าแรก</a> ไว้ในแท็ก <nav>',
            snippet: '<a href="#home">หน้าแรก</a>'
          };
        } else {
          passed = true;
        }
      } else if (item.selector === 'main') {
        const mains = doc!.querySelectorAll('body main');
        passed = mains.length >= (item.minCount || 1);
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็กเนื้อหาหลัก <main> ... </main>',
            location: 'ภายในส่วน <body> ... </body> ถัดจาก header',
            hint: 'ใส่แท็ก <main> ... </main> ครอบเนื้อหาหลักที่สำคัญที่สุดของหน้าเว็บ',
            snippet: '<main>\n  <!-- เนื้อหาหลักของหน้าเว็บ -->\n</main>'
          };
        }
      } else if (item.selector === 'section, article') {
        const sections = doc!.querySelectorAll('section, article');
        passed = sections.length >= (item.minCount || 1);
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็กจัดกลุ่มเนื้อหา <section> หรือ <article>',
            location: 'ควรอยู่ภายในส่วน <main> ... </main>',
            hint: 'ใส่แท็ก <section><h2>หมวดหมู่</h2><p>เนื้อหา...</p></section>',
            snippet: '<section>\n  <h2>หมวดหมู่เรื่อง</h2>\n  <p>เนื้อหารายละเอียด...</p>\n</section>'
          };
        }
      } else if (item.selector === 'footer') {
        const footers = doc!.querySelectorAll('body footer');
        passed = footers.length >= (item.minCount || 1);
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็กส่วนท้ายเว็บ <footer> ... </footer>',
            location: 'ภายในส่วน <body> ... </body> ด้านล่างสุด',
            hint: 'ใส่ <footer><p>&copy; 2026 สงวนลิขสิทธิ์</p></footer> เพื่อระบุส่วนท้ายของเว็บ',
            snippet: '<footer>\n  <p>&copy; 2026 สงวนลิขสิทธิ์</p>\n</footer>'
          };
        }
      } else if (item.selector === 'form') {
        const forms = doc!.querySelectorAll('body form');
        passed = forms.length >= (item.minCount || 1);
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็กแบบฟอร์ม <form> ... </form>',
            location: 'ภายในส่วน <body> ... </body>',
            hint: 'ใส่แท็ก <form action="#"> ... </form> เพื่อสร้างพื้นที่แบบฟอร์มรับข้อมูล',
            snippet: '<form action="#">\n  <!-- ฟิลด์รับข้อมูลที่นี่ -->\n</form>'
          };
        }
      } else if (item.selector === 'form input[type=text], form input[type=email]') {
        const textInputs = doc!.querySelectorAll('form input[type=text], form input[type=email], form input:not([type])');
        passed = textInputs.length >= 1;
        if (!passed) {
          errorDetail = {
            title: 'ขาดช่องกรอกข้อความหรืออีเมล (<input type="text"> หรือ <input type="email">)',
            location: 'ภายในแท็ก <form> ... </form>',
            hint: 'ใส่ <input type="text" id="fullname" placeholder="กรอกชื่อ-นามสกุล"> ในแบบฟอร์ม',
            snippet: '<input type="text" id="username" placeholder="กรอกชื่อผู้ใช้">'
          };
        }
      } else if (item.selector === 'form input[type=password]') {
        const passInputs = doc!.querySelectorAll('form input[type=password]');
        passed = passInputs.length >= 1;
        if (!passed) {
          errorDetail = {
            title: 'ขาดช่องกรอกรหัสผ่าน (<input type="password">)',
            location: 'ภายในแท็ก <form> ... </form>',
            hint: 'ใส่ <input type="password" id="password" placeholder="รหัสผ่าน"> ในแบบฟอร์ม',
            snippet: '<input type="password" id="password" placeholder="รหัสผ่าน">'
          };
        }
      } else if (item.selector === 'form label') {
        const labels = doc!.querySelectorAll('form label');
        passed = labels.length >= 1;
        if (!passed) {
          errorDetail = {
            title: 'ขาดแท็กป้ายชื่อกำกับ <label>',
            location: 'ภายในแท็ก <form> ... </form>',
            hint: 'ใส่ <label for="username">ชื่อผู้ใช้:</label> เพื่อกำกับช่องกรอกข้อมูล',
            snippet: '<label for="username">ชื่อผู้ใช้:</label>'
          };
        }
      } else if (item.selector === 'button[type=submit], input[type=submit], form button') {
        const submitBtns = doc!.querySelectorAll('form button, form input[type=submit], button[type=submit]');
        passed = submitBtns.length >= 1;
        if (!passed) {
          errorDetail = {
            title: 'ขาดปุ่มส่งข้อมูลแบบฟอร์ม (Submit Button)',
            location: 'ภายในแท็ก <form> ... </form>',
            hint: 'ใส่ <button type="submit">ส่งข้อมูล</button> ในแบบฟอร์ม',
            snippet: '<button type="submit">ส่งข้อมูลแบบฟอร์ม</button>'
          };
        }
      } else {
        const els = doc!.querySelectorAll(item.selector);
        passed = els.length >= (item.minCount || 1);
        if (!passed) {
          errorDetail = {
            title: `ยังไม่ผ่านเงื่อนไข: ${item.label}`,
            location: 'ภายในเอกสาร HTML',
            hint: `กรุณาเขียนโค้ดให้สอดคล้องกับข้อกำหนด: ${item.label}`
          };
        }
      }

      if (!passed && errorDetail) {
        if (!errors.some(e => e.title === errorDetail!.title)) {
          errors.push({
            id: `checklist_${item.id}`,
            title: errorDetail.title,
            location: errorDetail.location,
            hint: errorDetail.hint,
            snippet: errorDetail.snippet
          });
        }
      }
    });
  }

  return errors;
}

function CodeLabContent() {
  const { auditLog } = useAuth();
  const searchParams = useSearchParams();
  const assignmentParam = searchParams.get('assignment');
  const subdomainParam = searchParams.get('subdomain');

  const selectedAssignment =
    MOCK_ASSIGNMENTS.find(
      (a) =>
        a.id === assignmentParam ||
        (subdomainParam && a.sub_domain_code === subdomainParam)
    ) || MOCK_ASSIGNMENTS[0];

  const [currentAssignment, setCurrentAssignment] = useState<Assignment>(selectedAssignment);
  const [code, setCode] = useState<string>(selectedAssignment.starter_code);
  const [previewCode, setPreviewCode] = useState<string>('');
  const [iframeKey, setIframeKey] = useState<number>(0);

  // Preview & Validation States
  const [isLivePreviewing, setIsLivePreviewing] = useState<boolean>(false);
  const [runAttempted, setRunAttempted] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<{
    text: string;
    type: 'error' | 'success' | 'info';
  } | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const [reviewResult, setReviewResult] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Dynamic Validation Engine
  const validationErrors = useMemo(() => {
    return validateHtmlAssignment(code, currentAssignment);
  }, [code, currentAssignment]);

  const isCodeValid = validationErrors.length === 0;

  // Realtime checklist status map
  const checklistStatus = useMemo(() => {
    const status: Record<string, boolean> = {};
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'text/html');

      currentAssignment.checklist.forEach((item) => {
        if (item.selector === '!doctype') {
          status[item.id] = /<!doctype\s+html>/i.test(code);
        } else if (item.selector === 'html[lang=th]') {
          status[item.id] = /<html[^>]*lang=["']th["']/i.test(code);
        } else if (item.selector === 'head meta[charset]') {
          status[item.id] = /<meta[^>]*charset=["']?utf-8/i.test(code);
        } else if (item.selector === 'head title') {
          const title = doc.querySelector('title');
          status[item.id] = !!title && (title.textContent || '').trim().length > 0;
        } else {
          const elements = doc.querySelectorAll(item.selector);
          const minCount = item.minCount || 1;
          status[item.id] = elements.length >= minCount;
        }
      });
    } catch {
      // fallback
    }
    return status;
  }, [code, currentAssignment]);

  // When switching quest, reset state
  useEffect(() => {
    // Check if there is saved draft in localStorage
    let initialCode = currentAssignment.starter_code;
    try {
      const saved = localStorage.getItem(`codelab_draft_${currentAssignment.id}`);
      if (saved && saved.trim().length > 0) {
        initialCode = saved;
      }
    } catch {
      // ignore
    }

    setCode(initialCode);
    setPreviewCode('');
    setIsLivePreviewing(false);
    setRunAttempted(false);
    setReviewResult(null);
    setIframeKey((prev) => prev + 1);
  }, [currentAssignment]);

  // If user modifies code while in live preview and breaks requirements, suspend live preview
  useEffect(() => {
    if (isLivePreviewing && validationErrors.length > 0) {
      setIsLivePreviewing(false);
    }
  }, [validationErrors.length, isLivePreviewing]);

  const showToast = (text: string, type: 'error' | 'success' | 'info') => {
    setToastNotification({ text, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  /**
   * Action: รันโค้ดและแสดงผล
   * เงื่อนไขเข้มงวด: หากขาดอะไรหรือโค้ดยังไม่สมบูรณ์ จะบล็อกการแสดงผล และขึ้น Error สีแดงบอกอย่างละเอียด
   */
  const handleRun = () => {
    setRunAttempted(true);

    if (validationErrors.length > 0) {
      setIsLivePreviewing(false);
      showToast(
        `⚠️ ไม่สามารถแสดงผลได้! พบข้อผิดพลาด ${validationErrors.length} จุด กรุณาแก้ไขตามรายการสีแดงด้านขวาให้ถูกต้อง`,
        'error'
      );
      return;
    }

    // ผ่านการตรวจสอบ 100% ครบถ้วนทุกข้อ
    setPreviewCode(code);
    setIsLivePreviewing(true);
    setIframeKey((prev) => prev + 1);
    showToast('🎉 โค้ดถูกต้องสมบูรณ์ 100%! รันและแสดงผลลัพธ์สำเร็จ', 'success');
  };

  const handleReset = () => {
    if (confirm('ต้องการรีเซ็ตโค้ดกลับเป็นค่าเริ่มต้นของโจทย์นี้ใช่หรือไม่?')) {
      setCode(currentAssignment.starter_code);
      setPreviewCode('');
      setIsLivePreviewing(false);
      setRunAttempted(false);
      setReviewResult(null);
      setIframeKey((prev) => prev + 1);
      showToast('รีเซ็ตโค้ดเป็นค่าเริ่มต้นแล้ว', 'info');
    }
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(`codelab_draft_${currentAssignment.id}`, code);
      showToast('บันทึกร่างโค้ดภารกิจนี้สำเร็จ ✓', 'success');
      auditLog('save_draft', 'codelab', { assignmentId: currentAssignment.id });
    } catch {
      showToast('ไม่สามารถบันทึกร่างได้', 'error');
    }
  };

  const handleCopySnippet = (snippet: string, id: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleSubmitAssignment = async () => {
    if (typeof window !== 'undefined' && localStorage.getItem('webai_active_exam') === 'true') {
      alert('ไม่อนุญาตให้ใช้งาน AI ตรวจสอบโค้ดในระหว่างที่กำลังทำแบบทดสอบ');
      return;
    }

    // หากโค้ดยังมีข้อผิดพลาด ไม่อนุญาตให้ส่ง
    if (validationErrors.length > 0) {
      setRunAttempted(true);
      showToast(
        `🚫 ยังไม่สามารถส่งมอบภารกิจได้ เนื่องจากพบข้อผิดพลาด ${validationErrors.length} จุด กรุณาแก้ไขให้ครบถ้วนและกดรันให้ผ่านก่อน`,
        'error'
      );
      return;
    }

    if (!isLivePreviewing) {
      handleRun();
    }

    setIsSubmitting(true);
    setReviewResult(null);

    const allChecklistPassed = currentAssignment.checklist.every(
      (item) => checklistStatus[item.id]
    );

    try {
      const res = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          assignmentTitle: currentAssignment.title,
          checklist: currentAssignment.checklist,
        }),
      });

      const data = await res.json();
      setReviewResult(data);

      if (data.passed && allChecklistPassed) {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
        });
      }

      auditLog('submit_assignment', 'codelab', {
        assignmentId: currentAssignment.id,
        score: data.score,
        passed: data.passed,
      });
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการส่งตรวจโค้ด');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passedChecklistCount = Object.values(checklistStatus).filter(Boolean).length;
  const totalChecklistCount = currentAssignment.checklist.length;

  return (
    <div className="main-inner enter flex flex-col min-h-[820px] md:min-h-[640px] h-auto md:h-[calc(100vh-40px)] mb-20 md:mb-0 max-w-[1440px] mx-auto pt-6 px-3 sm:px-4">
      
      {/* Top Header & Mission Selector */}
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-sm font-bold text-muted bg-surface px-4 py-2 rounded-full border border-line shadow-sm">
            <Terminal className="w-4 h-4 text-primary" /> ~/mission/lab
          </span>
          {validationErrors.length > 0 ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> พบ {validationErrors.length} ข้อผิดพลาด (ยังไม่พร้อมรัน)
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> โค้ดถูกต้องสมบูรณ์ (พร้อมแสดงผล)
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          <select 
            className="chip bg-surface border border-line py-2 px-3 text-[13px] text-ink cursor-pointer font-bold rounded-lg shadow-sm" 
            value={currentAssignment.id}
            onChange={(e) => {
              const found = MOCK_ASSIGNMENTS.find((a) => a.id === e.target.value);
              if (found) setCurrentAssignment(found);
            }}
          >
            {MOCK_ASSIGNMENTS.map((a) => (
              <option key={a.id} value={a.id}>QUEST: {a.title}</option>
            ))}
          </select>
          <button 
            className={`btn btn-sm w-full sm:w-auto justify-center font-bold transition-all shadow-sm ${
              isCodeValid 
                ? 'btn-primary' 
                : 'bg-muted/20 text-muted border border-line cursor-not-allowed hover:bg-muted/25'
            }`} 
            onClick={handleSubmitAssignment} 
            disabled={isSubmitting}
            title={!isCodeValid ? `ต้องแก้ไขข้อผิดพลาดให้ครบทั้ง ${validationErrors.length} จุดก่อนส่ง` : 'ส่งมอบภารกิจให้ AI ตรวจ'}
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            {isSubmitting ? 'กำลังตรวจ...' : 'ส่งมอบภารกิจ'}
          </button>
        </div>
      </div>

      {/* Main IDE Workspace */}
      <section className="win flex flex-col flex-1 min-h-0 shadow-xl border border-line rounded-2xl overflow-hidden bg-bg-base">
        {/* Window Chrome Header */}
        <div className="win-bar shrink-0 flex items-center justify-between px-4 py-2.5 bg-surface border-b border-line">
          <div className="flex items-center gap-3">
            <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
            <div className="win-title font-mono text-xs text-muted flex items-center gap-1.5">
              <span className="text-primary font-bold">&lt;/&gt;</span> lab_environment.html — <span className="text-ink font-semibold">{currentAssignment.title}</span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-muted hidden md:block">
            UTF-8 | HTML5 Strict Validation
          </div>
        </div>

        {/* 2-Column Split: Left Editor, Right Live Diagnostics / Preview */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-0 overflow-y-auto lg:overflow-hidden bg-bg-base">
          
          {/* LEFT: Code Editor Pane */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-line min-h-[460px] lg:min-h-0 relative bg-surface shadow-sm">
            <div className="bg-bg-base p-2.5 px-3.5 flex items-center justify-between border-b border-line shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="chip chip-mono bg-primary/10 text-primary border border-primary/20 text-xs font-bold flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> index.html
                </span>
                {validationErrors.length > 0 ? (
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> ขาด {validationErrors.length} จุด
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ครบถ้วน พร้อมรัน
                  </span>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1.5">
                <button 
                  className={`btn btn-sm px-3 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                    isCodeValid 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse' 
                      : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}
                  title={isCodeValid ? 'กดปุ่มเพื่อรันและแสดงผลลัพธ์หน้าเว็บ' : 'ตรวจพบข้อผิดพลาด กรุณาแก้ไขให้ถูกต้องก่อนรัน'} 
                  onClick={handleRun}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>รันโค้ด</span>
                </button>
                <button 
                  className="icon-btn border-0 bg-transparent text-muted hover:bg-white/10 hover:text-ink rounded-lg transition-colors p-2" 
                  title="บันทึกร่างโค้ด" 
                  onClick={handleSaveDraft}
                >
                  <Save className="w-4 h-4" />
                </button>
                <button 
                  className="icon-btn border-0 bg-transparent text-muted hover:bg-white/10 hover:text-ink rounded-lg transition-colors p-2" 
                  title="รีเซ็ตโค้ดกลับเป็นค่าเริ่มต้น" 
                  onClick={handleReset}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="flex-1 relative flex flex-col bg-[#1e1e1e]">
              <textarea 
                spellCheck="false" 
                className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] border-0 p-4 font-mono text-[13px] leading-[1.8] resize-none focus:outline-none selection:bg-primary/30"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="เขียนโค้ด HTML ที่นี่..."
              />

              {/* Editor bottom status alert bar */}
              {validationErrors.length > 0 ? (
                <div className="shrink-0 bg-rose-950/80 border-t border-rose-500/30 p-2.5 px-3.5 text-[12px] flex items-center justify-between text-rose-300">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-ping"></span>
                    <span className="font-bold text-rose-400">ข้อผิดพลาด:</span>
                    <span className="truncate">{validationErrors[0].title}</span>
                  </div>
                  <span className="text-[11px] text-rose-400/80 font-sans shrink-0 ml-2">
                    (ดูวิธีแก้ทั้งหมด {validationErrors.length} จุดทางด้านขวา ➔)
                  </span>
                </div>
              ) : (
                <div className="shrink-0 bg-emerald-950/70 border-t border-emerald-500/30 p-2 px-3.5 text-[11.5px] flex items-center justify-between text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>โครงสร้างโค้ดถูกต้องครบถ้วนตามเกณฑ์แล้ว กดปุ่ม <b>▶ รันโค้ด</b> เพื่อดูผลลัพธ์</span>
                  </div>
                </div>
              )}
            </div>

            {/* Toast Notification */}
            {toastNotification && (
              <div 
                className={`absolute right-4 bottom-14 z-20 text-[12px] font-bold py-2.5 px-4 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border ${
                  toastNotification.type === 'error'
                    ? 'bg-rose-600 text-white border-rose-400'
                    : toastNotification.type === 'success'
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-primary text-white border-primary'
                }`}
              >
                {toastNotification.type === 'error' && <XCircle className="w-4 h-4 shrink-0" />}
                {toastNotification.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{toastNotification.text}</span>
              </div>
            )}
          </div>

          {/* RIGHT: Preview Window + Checklist + Error Diagnostic Console */}
          <div className="flex flex-col gap-3 min-h-[460px] lg:min-h-0">
            
            {/* Top Sub-Window: Live Web Preview OR Red Error Diagnostic Screen */}
            <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-line min-h-[300px] shadow-sm bg-surface">
              
              {/* Browser Address Bar Header */}
              <div className="bg-surface p-2.5 px-3.5 flex items-center gap-2.5 border-b border-line shrink-0">
                <div className="win-dots">
                  <i className={isLivePreviewing && isCodeValid ? 'g' : 'r'}></i>
                  <i className="bg-line"></i>
                  <i className="bg-line"></i>
                </div>
                <div className="flex-1 bg-bg-base border border-line rounded-lg px-3 py-1 flex items-center justify-between text-[11.5px] text-muted font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">localhost:3000/preview</span>
                  </div>
                  {isLivePreviewing && isCodeValid ? (
                    <span className="text-[10.5px] font-bold font-sans text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> แสดงผลสำเร็จ
                    </span>
                  ) : validationErrors.length > 0 ? (
                    <span className="text-[10.5px] font-bold font-sans text-rose-600 dark:text-rose-400 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> ระงับการแสดงผล
                    </span>
                  ) : (
                    <span className="text-[10.5px] font-bold font-sans text-amber-500 flex items-center gap-1 shrink-0">
                      พร้อมรัน
                    </span>
                  )}
                </div>
              </div>

              {/* Preview Body Condition:
                  1. If there are validation errors -> Show Red Error Diagnostics Panel (Blocked preview)
                  2. If code is 100% valid but user has not clicked Run yet -> Show Ready to Run Banner
                  3. If code is 100% valid AND user clicked Run -> Render live iframe
              */}
              <div className="flex-1 relative flex flex-col min-h-0 bg-white dark:bg-bg-base overflow-hidden">
                
                {validationErrors.length > 0 ? (
                  /* 🚨 RED ERROR DIAGNOSTIC PANEL */
                  <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-y-auto bg-rose-500/[0.04] dark:bg-rose-950/20">
                    
                    {/* Big Red Error Header */}
                    <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 dark:bg-rose-950/40 p-4 mb-4 flex items-start gap-3 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 m-0">
                            ยังไม่สามารถแสดงผลได้ — ตรวจพบข้อผิดพลาด {validationErrors.length} จุด
                          </h4>
                          <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">
                            ต้องแก้ไขให้ถูกต้อง
                          </span>
                        </div>
                        <p className="text-[12px] text-ink/80 mt-1 leading-relaxed m-0 font-medium">
                          หน้านี้ต้องเขียนโค้ดให้ถูกต้องครบถ้วนทุกส่วนตามโจทย์กำหนด กรุณาตรวจสอบและแก้ไขข้อผิดพลาดตามรายการสีแดงด้านล่าง จากนั้นกดปุ่ม <b>▶ รันโค้ด</b> เพื่อแสดงผลลัพธ์
                        </p>
                      </div>
                    </div>

                    {/* List of Detailed Red Error Cards */}
                    <div className="flex flex-col gap-3 flex-1">
                      {validationErrors.map((err, idx) => (
                        <div 
                          key={err.id || idx}
                          className="rounded-xl border-2 border-rose-500/40 bg-surface dark:bg-slate-900/80 p-3.5 shadow-sm flex flex-col gap-2 transition-all hover:border-rose-500"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-[13px] text-rose-600 dark:text-rose-400 flex items-center gap-1.5 flex-wrap">
                                <span>❌ ขาด / ผิดพลาด:</span>
                                <span className="underline decoration-rose-500/50 underline-offset-2">{err.title}</span>
                              </div>
                              
                              <div className="text-[12px] text-ink/80 mt-1 flex items-start sm:items-center gap-1.5 font-medium flex-col sm:flex-row">
                                <span className="text-muted font-bold shrink-0">📍 ตำแหน่งที่ต้องแก้ไข:</span>
                                <span className="font-semibold text-ink bg-line/20 px-2 py-0.5 rounded text-[11.5px]">{err.location}</span>
                              </div>

                              <div className="mt-2.5 bg-bg-base border border-line rounded-lg p-2.5 text-[12px]">
                                <div className="text-muted font-bold text-[11px] flex items-center justify-between mb-1">
                                  <span>💡 คำแนะนำและวิธีแก้:</span>
                                  {err.snippet && (
                                    <button 
                                      className="text-primary hover:text-primary/80 font-sans font-bold flex items-center gap-1 text-[11px] transition-colors"
                                      onClick={() => handleCopySnippet(err.snippet!, err.id)}
                                      title="คัดลอกโค้ดตัวอย่าง"
                                    >
                                      {copiedSnippetId === err.id ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-500" />
                                          <span className="text-emerald-500">คัดลอกแล้ว</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          <span>คัดลอกแท็กตัวอย่าง</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                                <div className="text-ink/90 font-medium leading-relaxed">
                                  {err.hint}
                                </div>
                                {err.snippet && (
                                  <pre className="mt-1.5 p-2 bg-[#1e1e1e] text-[#4ec9b0] font-mono text-[11.5px] rounded overflow-x-auto selection:bg-primary/40">
                                    <code>{err.snippet}</code>
                                  </pre>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Action inside Error Panel */}
                    <div className="mt-4 pt-3 border-t border-rose-500/20 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11.5px] text-muted">
                        เมื่อแก้ไขโค้ดครบแล้ว ระบบจะปลดล็อกให้กดรันทันที
                      </span>
                      <button 
                        className="btn btn-sm btn-primary font-bold text-xs"
                        onClick={handleRun}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> ลองรันและตรวจอีกครั้ง
                      </button>
                    </div>

                  </div>
                ) : !isLivePreviewing ? (
                  /* ✨ CODE COMPLETE - READY TO RUN SCREEN */
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-bg-base">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/30 animate-bounce">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-ink mb-1">
                      ยอดเยี่ยม! โค้ดผ่านการตรวจสอบครบทุกข้อแล้ว
                    </h3>
                    <p className="text-xs text-muted max-w-md mb-5 leading-relaxed">
                      ไม่มีข้อผิดพลาด โครงสร้าง HTML5 และเงื่อนไข Checklist ถูกต้องสมบูรณ์ 100% กดปุ่มด้านล่างเพื่อรันและแสดงผลลัพธ์หน้าเว็บจริง
                    </p>
                    <button 
                      className="btn btn-primary px-6 py-2.5 font-bold text-sm shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2"
                      onClick={handleRun}
                    >
                      <Play className="w-4 h-4 fill-current" /> รันแสดงผลลัพธ์หน้าเว็บ (Run Preview)
                    </button>
                  </div>
                ) : (
                  /* ✅ LIVE PREVIEW IFRAME */
                  <div className="flex-1 relative w-full h-full flex flex-col">
                    <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-3 py-1.5 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> โค้ดถูกต้องสมบูรณ์ แสดงผลลัพธ์หน้าเว็บสำเร็จ
                      </span>
                      <button 
                        className="text-muted hover:text-ink font-normal flex items-center gap-1 text-[10.5px]"
                        onClick={() => {
                          const w = window.open('');
                          if (w) w.document.write(previewCode);
                        }}
                      >
                        <ExternalLink className="w-3 h-3" /> เปิดหน้าต่างใหม่
                      </button>
                    </div>
                    <iframe 
                      key={iframeKey}
                      sandbox="allow-scripts" 
                      className="flex-1 border-0 bg-white w-full h-full"
                      srcDoc={previewCode}
                      title="HTML Preview"
                    />
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Sub-Card: Mission Checklist */}
            <div className="card shrink-0 shadow-sm border border-line rounded-xl overflow-hidden bg-surface">
              <div className="flex items-center justify-between p-3 px-4 border-b border-line bg-surface">
                <div className="flex items-center gap-2 text-[12.5px] font-bold text-ink">
                  <Layout className="w-3.5 h-3.5 text-primary" /> Mission Checklist
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-primary bg-primary-dim px-2 py-0.5 rounded border border-primary-dim">+150 XP</span>
                  <span className={`chip chip-mono border-line font-bold ${passedChecklistCount === totalChecklistCount ? 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10' : ''}`}>
                    {passedChecklistCount}/{totalChecklistCount}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 px-4 bg-bg-base">
                {currentAssignment.checklist.map((item) => {
                  const passed = checklistStatus[item.id];
                  return (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-[12px] transition-all ${
                        passed 
                          ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold' 
                          : 'border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
                          passed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        }`}>
                          {passed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <XCircle className="w-3 h-3" />}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        passed ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}>
                        {passed ? 'ครบแล้ว ✓' : 'ยังขาด ✗'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Advisor Review Result (If submitted) */}
            {reviewResult && (
              <div className={`card p-4 shrink-0 border-l-4 rounded-xl shadow-sm ${reviewResult.passed ? 'border-l-success bg-success-dim' : 'border-l-warning bg-warning-dim'}`}>
                <div className={`flex items-center justify-between font-bold text-[13px] mb-2 ${reviewResult.passed ? 'text-success' : 'text-warning'}`}>
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" /> AI Advisor Review
                  </div>
                  {reviewResult.passed && (
                    <span className="chip chip-success chip-mono text-[10px]">MISSION CLEARED</span>
                  )}
                </div>
                <p className="m-0 text-sm leading-relaxed text-ink font-medium">
                  {reviewResult.summary}
                </p>
                {reviewResult.improvements && reviewResult.improvements.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-line/30 text-xs">
                    <span className="font-bold text-ink">ข้อแนะนำเพิ่มเติม:</span>
                    <ul className="list-disc list-inside mt-1 text-muted space-y-0.5">
                      {reviewResult.improvements.map((imp: string, i: number) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </section>
    </div>
  );
}

export default function CodeLabPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
        </div>
      }
    >
      <CodeLabContent />
    </Suspense>
  );
}
