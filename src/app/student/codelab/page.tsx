'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/lib/auth-context';
import {
  Terminal,
  Play,
  RotateCcw,
  Save,
  Code2,
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  FileCode,
  Trash2
} from 'lucide-react';

export interface CodeValidationError {
  id: string;
  title: string;       // ขาดอะไร
  location: string;    // ตรงไหน
  hint: string;        // คำแนะนำและวิธีแก้ไข
  snippet?: string;    // โค้ดตัวอย่างสำหรับคัดลอก
}

const DEFAULT_STARTER_CODE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>หน้าเว็บของฉัน</title>
</head>
<body>
  <h1>สวัสดีชาวโลก!</h1>
  <p>ยินดีต้อนรับสู่พื้นที่ฝึกเขียนโค้ด HTML5 ของฉัน</p>
</body>
</html>`;

/**
 * ตรวจสอบความถูกต้องของโค้ด HTML5 ตามมาตรฐานสากลอย่างเคร่งครัด
 * หากขาดโครงสร้างพื้นฐานหรือมีแท็กไม่สมบูรณ์ จะแจ้งข้อผิดพลาดสีแดงพร้อมตำแหน่งและคำแนะนำ
 */
function validateHtmlDocument(code: string): CodeValidationError[] {
  const errors: CodeValidationError[] = [];
  const trimmed = code.trim();

  if (!trimmed) {
    errors.push({
      id: 'empty_code',
      title: 'ยังไม่มีการเขียนโค้ด HTML ใดๆ',
      location: 'พื้นที่เขียนโค้ดว่างเปล่า',
      hint: 'กรุณาเขียนโค้ดโครงสร้างมาตรฐาน HTML5 หรือกดปุ่ม "แม่แบบ HTML5" เพื่อใส่โครงสร้างเริ่มต้น',
      snippet: DEFAULT_STARTER_CODE
    });
    return errors;
  }

  // 1. ตรวจสอบคำประกาศ <!DOCTYPE html>
  const hasDoctype = /<!doctype\s+html>/i.test(code);
  if (!hasDoctype) {
    errors.push({
      id: 'err_doctype',
      title: 'ขาดคำประกาศ <!DOCTYPE html>',
      location: 'บรรทัดแรกสุดของเอกสาร (บรรทัดที่ 1 บนสุด อยู่นอกแท็ก <html>)',
      hint: 'พิมพ์ <!DOCTYPE html> ไว้ที่บรรทัดบนสุด เพื่อประกาศว่าเป็นเอกสาร HTML5 มาตรฐานสากล',
      snippet: '<!DOCTYPE html>'
    });
  }

  // 2. ตรวจสอบแท็ก <html> และ </html>
  const hasHtmlOpen = /<html[^>]*>/i.test(code);
  const hasHtmlClose = /<\/html>/i.test(code);
  const hasHtmlLang = /<html[^>]*lang=["'][a-zA-Z-]+["']/i.test(code);

  if (!hasHtmlOpen) {
    errors.push({
      id: 'err_html_open',
      title: 'ขาดแท็กเปิด <html>',
      location: 'บรรทัดถัดจาก <!DOCTYPE html>',
      hint: 'ใส่แท็ก <html lang="th"> เพื่อเป็นแท็กราก (Root element) ของเอกสาร',
      snippet: '<html lang="th">'
    });
  } else {
    if (!hasHtmlClose) {
      errors.push({
        id: 'err_html_close',
        title: 'ลืมพิมพ์แท็กปิด </html>',
        location: 'บรรทัดสุดท้ายของเอกสาร',
        hint: 'พิมพ์ </html> ไว้ที่บรรทัดสุดท้ายของเอกสารเพื่อปิดแท็กรากให้สมบูรณ์',
        snippet: '</html>'
      });
    }
    if (!hasHtmlLang) {
      errors.push({
        id: 'err_html_lang',
        title: 'แท็ก <html> ขาดแอตทริบิวต์ lang (เช่น lang="th")',
        location: 'ที่แท็กเปิด <html> ด้านบนของเอกสาร',
        hint: 'เพิ่ม lang="th" ในแท็กเปิด <html> เช่น <html lang="th"> เพื่อระบุภาษาของหน้าเว็บ',
        snippet: '<html lang="th">'
      });
    }
  }

  // 3. ตรวจสอบแท็ก <head> และ </head>
  const hasHeadOpen = /<head[^>]*>/i.test(code);
  const hasHeadClose = /<\/head>/i.test(code);

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

  // 4. ตรวจสอบแท็ก <body> และ </body>
  const hasBodyOpen = /<body[^>]*>/i.test(code);
  const hasBodyClose = /<\/body>/i.test(code);

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

  // 5. ตรวจสอบการลืมปิดแท็กคู่ (Unclosed paired tags)
  const codeWithoutComments = code.replace(/<!--[\s\S]*?-->/g, '');
  const pairedTags = [
    { tag: 'title', label: 'แท็กหัวข้อ <title>', loc: 'ภายในส่วน <head> ... </head>' },
    { tag: 'h1', label: 'แท็กหัวเรื่อง <h1>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'h2', label: 'แท็กหัวเรื่องย่อย <h2>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'h3', label: 'แท็กหัวเรื่องย่อย <h3>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'p', label: 'แท็กย่อหน้า <p>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'table', label: 'แท็กตาราง <table>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'tr', label: 'แท็กแถวตาราง <tr>', loc: 'ในแท็ก <table>' },
    { tag: 'td', label: 'แท็กเซลล์ข้อมูล <td>', loc: 'ในแท็ก <tr>' },
    { tag: 'th', label: 'แท็กหัวตาราง <th>', loc: 'ในแท็ก <tr>' },
    { tag: 'form', label: 'แท็กแบบฟอร์ม <form>', loc: 'ภายในส่วน <body> ... </body>' },
    { tag: 'label', label: 'แท็กป้ายกำกับ <label>', loc: 'ในแท็ก <form>' },
    { tag: 'button', label: 'แท็กปุ่ม <button>', loc: 'ภายในส่วน <body>' },
    { tag: 'header', label: 'แท็กส่วนหัว <header>', loc: 'ภายในส่วน <body>' },
    { tag: 'nav', label: 'แท็กเมนูนำทาง <nav>', loc: 'ภายในส่วน <body>' },
    { tag: 'main', label: 'แท็กเนื้อหาหลัก <main>', loc: 'ภายในส่วน <body>' },
    { tag: 'section', label: 'แท็กหมวดหมู่ <section>', loc: 'ภายในส่วน <main>' },
    { tag: 'article', label: 'แท็กบทความ <article>', loc: 'ภายในส่วน <main>' },
    { tag: 'footer', label: 'แท็กส่วนท้าย <footer>', loc: 'ภายในส่วน <body> ด้านล่าง' },
    { tag: 'ul', label: 'แท็กรายการ <ul>', loc: 'ภายในส่วน <body>' },
    { tag: 'ol', label: 'แท็กรายการลำดับ <ol>', loc: 'ภายในส่วน <body>' },
    { tag: 'li', label: 'แท็กไอเทม <li>', loc: 'ในแท็ก <ul> หรือ <ol>' },
    { tag: 'a', label: 'แท็กลิงก์ <a>', loc: 'ภายในส่วน <body>' },
    { tag: 'div', label: 'แท็กกล่อง <div>', loc: 'ภายในส่วน <body>' },
    { tag: 'span', label: 'แท็ก <span>', loc: 'ภายในส่วน <body>' }
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

  // 6. ตรวจสอบ DOM โครงสร้างภายใน
  let doc: Document | null = null;
  try {
    const parser = new DOMParser();
    doc = parser.parseFromString(code, 'text/html');
  } catch (e) {
    console.error('DOM Parser error:', e);
  }

  if (doc) {
    // 6.1 ตรวจสอบ meta charset
    const hasMetaCharset = /<meta[^>]*charset=["']?utf-8/i.test(code);
    if (!hasMetaCharset) {
      errors.push({
        id: 'err_meta_charset',
        title: 'ขาดแท็ก <meta charset="UTF-8">',
        location: 'ต้องเขียนอยู่ภายในส่วน <head> ... </head>',
        hint: 'เพิ่มแท็ก <meta charset="UTF-8"> ไว้ใต้แท็ก <head> เพื่อให้หน้าเว็บรองรับภาษาไทย ไม่เป็นภาษาต่างดาว',
        snippet: '<meta charset="UTF-8">'
      });
    }

    // 6.2 ตรวจสอบ title
    const titleEl = doc.querySelector('head title') || doc.querySelector('title');
    const hasTitle = !!titleEl && (titleEl.textContent || '').trim().length > 0;
    if (!hasTitle) {
      errors.push({
        id: 'err_title',
        title: 'ขาดแท็ก <title> หรือยังไม่ได้ระบุชื่อเรื่องหน้าเว็บ',
        location: 'ต้องเขียนอยู่ภายในส่วน <head> ... </head>',
        hint: 'เพิ่มแท็ก <title>ชื่อเรื่องหน้าเว็บของคุณ</title> ไว้ในบล็อก <head>',
        snippet: '<title>หน้าแรกของฉัน</title>'
      });
    }

    // 6.3 ตรวจสอบตำแหน่งผิด เช่น title หรือ meta อยู่ใน body
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

    // 6.4 ตรวจสอบว่าใน body มีเนื้อหาหรือแท็กแสดงผลหรือไม่
    const bodyEl = doc.querySelector('body');
    const hasBodyContent = bodyEl && (bodyEl.textContent || '').trim().length > 0 || (bodyEl && bodyEl.children.length > 0);
    if (hasBodyOpen && !hasBodyContent) {
      errors.push({
        id: 'err_empty_body',
        title: 'ส่วน <body> ยังไม่มีเนื้อหาหรือแท็กแสดงผล',
        location: 'ภายในส่วน <body> ... </body>',
        hint: 'ลองใส่แท็กเนื้อหา เช่น <h1>สวัสดีชาวโลก</h1> หรือ <p>ยินดีต้อนรับ</p> ไว้ใน <body>',
        snippet: '<h1>สวัสดีชาวโลก</h1>\n<p>นี่คือหน้าเว็บของฉัน</p>'
      });
    }
  }

  return errors;
}

function CodeLabContent() {
  const { auditLog } = useAuth();

  const [code, setCode] = useState<string>(DEFAULT_STARTER_CODE);
  const [previewCode, setPreviewCode] = useState<string>(DEFAULT_STARTER_CODE);
  const [iframeKey, setIframeKey] = useState<number>(0);

  // Preview & Validation States
  const [isLivePreviewing, setIsLivePreviewing] = useState<boolean>(true);
  const [toastNotification, setToastNotification] = useState<{
    text: string;
    type: 'error' | 'success' | 'info';
  } | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // VS Code Editor State & Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [cursorInfo, setCursorInfo] = useState({ line: 1, col: 1 });

  // Load saved playground code from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('webai_playground_code');
      if (saved && saved.trim().length > 0) {
        setCode(saved);
        setPreviewCode(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const lines = useMemo(() => {
    return code.split('\n');
  }, [code]);

  const validationErrors = useMemo(() => {
    return validateHtmlDocument(code);
  }, [code]);

  const isCodeValid = validationErrors.length === 0;

  // Auto-suspend live preview if errors are introduced
  useEffect(() => {
    if (isLivePreviewing && validationErrors.length > 0) {
      setIsLivePreviewing(false);
    }
  }, [validationErrors.length, isLivePreviewing]);

  const handleEditorScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const updateCursorInfo = () => {
    if (textareaRef.current) {
      const selStart = textareaRef.current.selectionStart;
      const textBefore = code.substring(0, selStart);
      const lineArr = textBefore.split('\n');
      const line = lineArr.length;
      const col = lineArr[lineArr.length - 1].length + 1;
      setCursorInfo({ line, col });
    }
  };

  const showToast = (text: string, type: 'error' | 'success' | 'info') => {
    setToastNotification({ text, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  /**
   * Action: รันโค้ดและแสดงผล
   * หากขาดอะไรหรือโค้ดยังไม่สมบูรณ์ จะบล็อกการแสดงผล และขึ้น Error สีแดงบอกอย่างละเอียด
   */
  const handleRun = () => {
    if (validationErrors.length > 0) {
      setIsLivePreviewing(false);
      showToast(
        `⚠️ ไม่สามารถแสดงผลได้! พบข้อผิดพลาด ${validationErrors.length} จุด กรุณาแก้ไขตามรายการสีแดงด้านขวาให้ถูกต้อง`,
        'error'
      );
      return;
    }

    setPreviewCode(code);
    setIsLivePreviewing(true);
    setIframeKey((prev) => prev + 1);
    showToast('🎉 โค้ดถูกต้องสมบูรณ์! แสดงผลลัพธ์หน้าเว็บสำเร็จ', 'success');

    try {
      localStorage.setItem('webai_playground_code', code);
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    if (confirm('ต้องการรีเซ็ตโค้ดกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      setCode(DEFAULT_STARTER_CODE);
      setPreviewCode(DEFAULT_STARTER_CODE);
      setIsLivePreviewing(true);
      setIframeKey((prev) => prev + 1);
      showToast('รีเซ็ตโค้ดเป็นค่าเริ่มต้นแล้ว', 'info');
      try {
        localStorage.setItem('webai_playground_code', DEFAULT_STARTER_CODE);
      } catch {
        // ignore
      }
    }
  };

  const handleClearCode = () => {
    if (confirm('ต้องการล้างโค้ดทั้งหมดเพื่อเริ่มพิมพ์เองใช่หรือไม่?')) {
      setCode('');
      setIsLivePreviewing(false);
      showToast('ล้างพื้นที่เขียนโค้ดแล้ว', 'info');
    }
  };

  const handleInsertTemplate = () => {
    setCode(DEFAULT_STARTER_CODE);
    setPreviewCode(DEFAULT_STARTER_CODE);
    setIsLivePreviewing(true);
    setIframeKey((prev) => prev + 1);
    showToast('แทรกแม่แบบโครงสร้าง HTML5 เรียบร้อยแล้ว', 'success');
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem('webai_playground_code', code);
      showToast('บันทึกโค้ดของคุณเรียบร้อยแล้ว ✓', 'success');
      auditLog('save_draft', 'playground', { length: code.length });
    } catch {
      showToast('ไม่สามารถบันทึกได้', 'error');
    }
  };

  const handleCopySnippet = (snippet: string, id: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="main-inner enter flex flex-col min-h-[820px] md:min-h-[660px] h-auto md:h-[calc(100vh-40px)] mb-20 md:mb-0 max-w-[1500px] mx-auto pt-6 px-3 sm:px-4">
      
      {/* Top Header & Playground Actions */}
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-sm font-bold text-muted bg-surface px-4 py-2 rounded-full border border-line shadow-sm">
            <Terminal className="w-4 h-4 text-primary" /> ~/playground/html
          </span>
          {validationErrors.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> พบ {validationErrors.length} ข้อผิดพลาด (ยังไม่สามารถแสดงผลได้)
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> โค้ดถูกต้องตามมาตรฐาน HTML5
            </span>
          )}
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          <button 
            className="btn btn-sm btn-ghost border border-line bg-surface font-semibold text-xs flex items-center gap-1.5 shadow-sm"
            onClick={handleInsertTemplate}
            title="ใส่โครงสร้างมาตรฐาน HTML5 เริ่มต้น"
          >
            <FileCode className="w-3.5 h-3.5 text-primary" />
            <span>แม่แบบ HTML5</span>
          </button>
          <button 
            className="btn btn-sm btn-ghost border border-line bg-surface font-semibold text-xs flex items-center gap-1.5 text-muted hover:text-rose-500 shadow-sm"
            onClick={handleClearCode}
            title="ล้างโค้ดทั้งหมดเพื่อเริ่มเขียนเอง"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ล้างโค้ด</span>
          </button>
        </div>
      </div>

      {/* Main IDE Workspace */}
      <section className="win flex flex-col flex-1 min-h-0 shadow-xl border border-line rounded-2xl overflow-hidden bg-bg-base">
        
        {/* Window Chrome Header - The ONLY 3-dot window bar */}
        <div className="win-bar shrink-0 flex items-center justify-between px-4 py-2.5 bg-surface border-b border-line">
          <div className="flex items-center gap-3">
            <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
            <div className="win-title font-mono text-xs text-muted flex items-center gap-2">
              <span className="text-primary font-bold">&lt;/&gt;</span>
              <span className="text-ink font-semibold">WebAI Code Studio</span>
              <span className="text-line">|</span>
              <span className="text-muted">พื้นที่ฝึกเขียนโค้ด HTML5 (Playground)</span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-muted hidden md:flex items-center gap-3">
            <span>UTF-8</span>
            <span className="text-line">|</span>
            <span>HTML5 Strict Validation</span>
          </div>
        </div>

        {/* 2-Column Split: Left Editor, Right Full-Height Live Diagnostics / Preview */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-0 overflow-y-auto lg:overflow-hidden bg-bg-base">
          
          {/* LEFT: Code Editor Pane (VS Code Style) */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-line min-h-[500px] lg:min-h-0 relative bg-[#1e1e1e] shadow-sm">
            {/* VS Code Style Tab & Action Header */}
            <div className="bg-[#181818] px-3 py-1.5 flex items-center justify-between border-b border-[#2d2d2d] shrink-0">
              <div className="flex items-center gap-2">
                {/* Active Tab */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e1e] text-[#e0e0e0] border-t-2 border-primary text-xs font-mono rounded-t shadow-sm">
                  <Code2 className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-semibold">index.html</span>
                </div>

                {/* Validation Status Pill */}
                {validationErrors.length > 0 ? (
                  <span className="text-[11px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" /> ขาด {validationErrors.length} จุด
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> โค้ดถูกต้อง พร้อมรัน
                  </span>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1.5">
                <button 
                  className={`btn btn-sm px-3 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                    isCodeValid 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20' 
                      : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                  }`}
                  title={isCodeValid ? 'กดปุ่มเพื่อรันและแสดงผลลัพธ์หน้าเว็บ' : 'ตรวจพบข้อผิดพลาด กรุณาแก้ไขให้ถูกต้องก่อนรัน'} 
                  onClick={handleRun}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>รันโค้ด</span>
                </button>
                <button 
                  className="icon-btn border-0 bg-transparent text-[#9e9e9e] hover:bg-white/10 hover:text-white rounded-lg transition-colors p-2" 
                  title="บันทึกโค้ด" 
                  onClick={handleSaveDraft}
                >
                  <Save className="w-4 h-4" />
                </button>
                <button 
                  className="icon-btn border-0 bg-transparent text-[#9e9e9e] hover:bg-white/10 hover:text-white rounded-lg transition-colors p-2" 
                  title="รีเซ็ตโค้ดกลับเป็นค่าเริ่มต้น" 
                  onClick={handleReset}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Editor Body with VS Code Line Numbers */}
            <div className="flex-1 relative flex bg-[#1e1e1e] overflow-hidden min-h-0">
              {/* VS Code Line Numbers Gutter */}
              <div
                ref={lineNumbersRef}
                aria-hidden="true"
                className="select-none overflow-hidden text-right pr-3 pl-2 py-3.5 bg-[#181818] border-r border-[#2d2d2d] font-mono text-[13px] text-[#6e7681] shrink-0"
                style={{
                  minWidth: '44px',
                  lineHeight: '24px',
                }}
              >
                {lines.map((_, i) => {
                  const lineNum = i + 1;
                  const isCurrent = lineNum === cursorInfo.line;
                  return (
                    <div
                      key={i}
                      className={`h-[24px] leading-[24px] transition-colors ${
                        isCurrent ? 'text-white font-bold' : 'text-[#6e7681]'
                      }`}
                    >
                      {lineNum}
                    </div>
                  );
                })}
              </div>

              {/* Textarea */}
              <textarea 
                ref={textareaRef}
                spellCheck="false" 
                wrap="off"
                className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] border-0 py-3.5 px-3.5 font-mono text-[13px] resize-none focus:outline-none selection:bg-primary/30 overflow-auto"
                style={{
                  lineHeight: '24px',
                  tabSize: 2,
                }}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  updateCursorInfo();
                }}
                onScroll={handleEditorScroll}
                onKeyUp={updateCursorInfo}
                onClick={updateCursorInfo}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const target = e.currentTarget;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const newCode = code.substring(0, start) + '  ' + code.substring(end);
                    setCode(newCode);
                    setTimeout(() => {
                      target.selectionStart = target.selectionEnd = start + 2;
                      updateCursorInfo();
                    }, 0);
                  }
                }}
                placeholder="เขียนโค้ด HTML ที่นี่..."
              />
            </div>

            {/* VS Code Bottom Status Bar */}
            <div className="shrink-0 bg-[#007acc] text-white px-3 py-1 text-[11px] font-mono flex items-center justify-between select-none">
              <div className="flex items-center gap-2 truncate">
                {validationErrors.length > 0 ? (
                  <span className="flex items-center gap-1 font-bold text-yellow-200">
                    <AlertTriangle className="w-3 h-3" /> ขาด {validationErrors.length} รายการ (แก้ไขเพื่อรัน)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold text-white">
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" /> โครงสร้าง HTML5 ถูกต้อง
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span>Ln {cursorInfo.line}, Col {cursorInfo.col}</span>
                <span className="hidden sm:inline">Spaces: 2</span>
                <span className="hidden sm:inline">UTF-8</span>
                <span>HTML</span>
              </div>
            </div>

            {/* Toast Notification */}
            {toastNotification && (
              <div 
                className={`absolute right-4 bottom-10 z-20 text-[12px] font-bold py-2.5 px-4 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border ${
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

          {/* RIGHT: Full-Height Live Web Preview OR Red Error Diagnostic Screen */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-line min-h-[500px] lg:min-h-0 shadow-sm bg-surface">
            
            {/* Browser Address Bar Header (Clean - NO duplicate dots) */}
            <div className="bg-surface p-2 px-3 flex items-center gap-2 border-b border-line shrink-0">
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
              {isLivePreviewing && isCodeValid && (
                <button 
                  className="icon-btn border-0 bg-transparent text-muted hover:text-ink p-1.5 rounded"
                  title="เปิดดูในแท็บใหม่"
                  onClick={() => {
                    const w = window.open('');
                    if (w) w.document.write(previewCode);
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
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
                        หน้านี้ต้องเขียนโค้ด HTML ให้ถูกต้องตามมาตรฐาน ไม่ให้ขาดองค์ประกอบสำคัญ กรุณาตรวจสอบและแก้ไขข้อผิดพลาดตามรายการสีแดงด้านล่าง แล้วกดปุ่ม <b>▶ รันโค้ด</b> เพื่อแสดงผล
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
                      เมื่อแก้ไขโค้ดครบแล้ว ระบบจะปลดล็อกให้กดรันได้ทันที
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
                    ยอดเยี่ยม! โค้ดถูกต้องตามมาตรฐานแล้ว
                  </h3>
                  <p className="text-xs text-muted max-w-md mb-5 leading-relaxed">
                    โครงสร้าง HTML5 ถูกต้องสมบูรณ์ ไม่มีข้อผิดพลาด กดปุ่มด้านล่างเพื่อรันและดูผลลัพธ์หน้าเว็บจริง
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
