'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Monitor, RotateCcw, ExternalLink, Globe } from 'lucide-react';
import { GameStage } from '@/lib/game/game-data';

interface LivePreviewProps {
  stage: GameStage;
  renderedHtml: string;
  onRefresh: () => void;
  onFormSubmitted?: () => void;
  onLinkClicked?: (href: string) => void;
  validationFeedback?: { isValid: boolean; feedback: string; errors: string[] } | null;
}

export function LivePreview({
  stage,
  renderedHtml,
  onRefresh,
  onFormSubmitted,
  onLinkClicked,
  validationFeedback,
}: LivePreviewProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [isLaserScanning, setIsLaserScanning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Trigger laser scan when renderedHtml updates
  useEffect(() => {
    setIsLaserScanning(true);
    const timer = setTimeout(() => setIsLaserScanning(false), 1200);
    return () => clearTimeout(timer);
  }, [renderedHtml]);

  // Prepare full HTML document with friendly default styling and interactive hooks
  const generatePreviewDocument = (userCode: string) => {
    // Cute SVG Cat for cat.png simulation
    const catSvgBase64 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="120" height="120"><rect width="100" height="100" rx="20" fill="%23EEF2FF"/><circle cx="50" cy="54" r="30" fill="%236366F1"/><polygon points="26,34 38,18 44,36" fill="%236366F1"/><polygon points="74,34 62,18 56,36" fill="%236366F1"/><polygon points="30,32 37,22 41,34" fill="%23F43F5E"/><polygon points="70,32 63,22 59,34" fill="%23F43F5E"/><circle cx="40" cy="50" r="4.5" fill="%23FFFFFF"/><circle cx="60" cy="50" r="4.5" fill="%23FFFFFF"/><circle cx="41.5" cy="50" r="2.5" fill="%231E1B4B"/><circle cx="61.5" cy="50" r="2.5" fill="%231E1B4B"/><ellipse cx="50" cy="58" rx="3.5" ry="2.5" fill="%23F43F5E"/><path d="M44,63 Q50,68 56,63" stroke="%231E1B4B" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="22" y1="52" x2="35" y2="55" stroke="%231E1B4B" stroke-width="1.5"/><line x1="20" y1="60" x2="34" y2="60" stroke="%231E1B4B" stroke-width="1.5"/><line x1="78" y1="52" x2="65" y2="55" stroke="%231E1B4B" stroke-width="1.5"/><line x1="80" y1="60" x2="66" y2="60" stroke="%231E1B4B" stroke-width="1.5"/></svg>`;

    // Replace cat.png reference with friendly data SVG so it renders instantly
    let processedCode = userCode.replace(/src=["']cat\.png["']/gi, `src="${catSvgBase64}"`);
    processedCode = processedCode.replace(/src=["']avatar\.png["']/gi, `src="${catSvgBase64}"`);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Sarabun", "Prompt", sans-serif;
      margin: 0;
      padding: 24px;
      color: #1e293b;
      background: #f8fafc;
      line-height: 1.6;
    }
    h1, h2, h3, h4 { color: #0f172a; margin-top: 0; font-weight: 800; }
    h1 { font-size: 1.75rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; }
    h2 { font-size: 1.35rem; margin-bottom: 12px; }
    h3 { font-size: 1.15rem; margin-bottom: 10px; }
    p { margin-bottom: 14px; font-size: 0.95rem; color: #334155; }
    ul, ol { padding-left: 24px; margin-bottom: 16px; }
    li { margin-bottom: 6px; font-size: 0.92rem; }
    a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    a:hover { text-decoration: underline; color: #4338ca; }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      display: inline-block;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }
    /* Level 3 Profile Card Styles */
    .profile-card {
      background: #ffffff;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      text-align: center;
      box-shadow: 0 4px 20px -2px rgba(99, 102, 241, 0.1);
      max-width: 320px;
      margin: 0 auto;
    }
    .profile-card img {
      margin-bottom: 14px;
    }
    .profile-card a {
      display: inline-block;
      margin-top: 8px;
      padding: 8px 18px;
      background: #4f46e5;
      color: #ffffff;
      border-radius: 10px;
      text-decoration: none;
      font-size: 0.9rem;
    }
    .profile-card a:hover {
      background: #4338ca;
    }
    /* Form Styles */
    form {
      background: #ffffff;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.04);
      max-width: 440px;
      margin: 0 auto;
    }
    label {
      display: block;
      font-weight: 700;
      font-size: 0.85rem;
      margin-top: 14px;
      margin-bottom: 6px;
      color: #334155;
    }
    input[type="text"], input[type="email"], input[type="password"], input[type="number"], select, textarea {
      width: 100%;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1.5px solid #cbd5e1;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
    input[type="radio"], input[type="checkbox"] {
      margin-right: 6px;
      accent-color: #6366f1;
      cursor: pointer;
    }
    button, input[type="submit"] {
      display: block;
      width: 100%;
      margin-top: 20px;
      padding: 12px;
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
      transition: transform 0.1s, opacity 0.2s;
    }
    button:active {
      transform: scale(0.98);
    }
    /* Portfolio Header & Nav */
    header {
      background: #ffffff;
      padding: 16px 20px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    header h2 { margin: 0; font-size: 1.2rem; }
    nav a { margin-left: 14px; }
    footer {
      margin-top: 30px;
      padding-top: 14px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 0.82rem;
      color: #64748b;
    }
    /* Toast inside iframe */
    #statusToast {
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: white;
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 700;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      display: none;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
  </style>
</head>
<body>
  ${processedCode}
  <div id="statusToast"></div>

  <script>
    function showToast(msg) {
      const toast = document.getElementById('statusToast');
      if (toast) {
        toast.innerText = msg;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
      }
    }

    // Intercept form submission
    document.addEventListener('submit', function(e) {
      e.preventDefault();
      showToast('🎉 ส่งข้อมูลสำเร็จ! ฟอร์มทำงานถูกต้อง 100%');
      window.parent.postMessage({ type: 'FORM_SUBMITTED' }, '*');
    });

    // Intercept links
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link) {
        const href = link.getAttribute('href');
        if (href === 'home.html' || href === '#projects' || href === '#about') {
          e.preventDefault();
          showToast('🚀 ลิงก์เชื่อมโยงไปยัง ' + href + ' สำเร็จ!');
          window.parent.postMessage({ type: 'LINK_CLICKED', href: href }, '*');
        } else if (href === '#') {
          e.preventDefault();
          showToast('⚠️ ลิงก์นี้ยังเป็น href="#" (ยังไม่ได้ตั้งปลายทาง)');
        }
      }
    });
  </script>
</body>
</html>`;
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'FORM_SUBMITTED') {
        onFormSubmitted?.();
      } else if (e.data && e.data.type === 'LINK_CLICKED') {
        onLinkClicked?.(e.data.href);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onFormSubmitted, onLinkClicked]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Browser Mockup Topbar */}
      <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        {/* Window dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
        </div>

        {/* Browser Address Bar */}
        <div className="flex-1 max-w-md mx-auto px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 shadow-inner">
          <Globe className="w-3 h-3 text-indigo-500 shrink-0" />
          <span className="truncate mono text-[11px]">
            https://webai-rescue.local/level-{stage.id}.html
          </span>
        </div>

        {/* Viewport & Refresh buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewport === 'desktop'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="มุมมองเดสก์ท็อป"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewport === 'mobile'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="มุมมองมือถือ"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="รีเฟรชหน้าเว็บ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Website Integrity Alert Banner */}
      <div className={`px-4 py-1.5 text-xs font-bold flex items-center justify-between transition-colors border-b ${
        validationFeedback?.isValid 
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse'
      }`}>
        <div className="flex items-center gap-2">
          <span>{validationFeedback?.isValid ? '🛡️' : '🚨'}</span>
          <span>
            {validationFeedback?.isValid 
              ? 'สถานะ: เว็บไซต์กู้คืนสมบูรณ์ 100% (HEALTHY)' 
              : 'สถานะ: พบจุดเสียหาย! โดนบั๊กก่อกวน (INTEGRITY: 30%)'}
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px]">
          {validationFeedback?.isValid ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black">ONLINE</span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black">GLITCH</span>
          )}
        </div>
      </div>

      {/* Preview Viewport Frame */}
      <div className="flex-1 bg-slate-100/70 dark:bg-slate-950/70 p-3 sm:p-5 overflow-auto flex items-center justify-center relative">
        <div
          className={`h-full transition-all duration-300 relative ${
            viewport === 'mobile'
              ? 'w-[320px] max-h-[580px] rounded-3xl border-4 border-slate-700 bg-white shadow-2xl overflow-hidden'
              : 'w-full rounded-2xl bg-white border border-slate-200/80 shadow-md overflow-hidden'
          }`}
        >
          {/* Laser Repair Beam Sweep */}
          {isLaserScanning && (
            <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-cyan-400/30 to-emerald-400/50 pointer-events-none z-20 animate-laser-sweep border-b-2 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
          )}

          {/* Glitch Scanline Overlay when broken */}
          {!validationFeedback?.isValid && (
            <div className="absolute inset-0 scanline-overlay pointer-events-none z-10 opacity-40" />
          )}

          <iframe
            ref={iframeRef}
            srcDoc={generatePreviewDocument(renderedHtml)}
            sandbox="allow-scripts allow-modals"
            className="w-full h-full border-0 bg-white"
            title="HTML5 Live Preview"
          />
        </div>
      </div>

      {/* Preview Footer Status */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
          <span><strong>LIVE PREVIEW:</strong> โค้ดที่แก้จะแสดงผลสดตรงนี้ทันที</span>
        </span>
        <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
          Sandboxed Safe Renderer
        </span>
      </div>
    </div>
  );
}
