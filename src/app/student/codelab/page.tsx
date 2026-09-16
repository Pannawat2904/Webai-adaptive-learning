'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  CheckCircle2,
  XCircle,
  Sparkles,
  Bot,
  Loader2,
  Code2,
} from 'lucide-react';

function CodeLabContent() {
  const { profile, auditLog } = useAuth();
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
  const [activeTab, setActiveTab] = useState<'editor' | 'css'>('editor');
  const [cssCode, setCssCode] = useState<string>('/* CSS พื้นฐานเพื่อความสวยงาม (อุปกรณ์เสริม) */\nbody { font-family: sans-serif; padding: 16px; }');
  const [iframeKey, setIframeKey] = useState<number>(0);

  const [checklistStatus, setChecklistStatus] = useState<Record<string, boolean>>({});
  const [reviewResult, setReviewResult] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savedDraftToast, setSavedDraftToast] = useState<boolean>(false);

  useEffect(() => {
    setCode(currentAssignment.starter_code);
    setReviewResult(null);
    setIframeKey((prev) => prev + 1);
  }, [currentAssignment]);

  useEffect(() => {
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
          status[item.id] = !!title && title.textContent!.trim().length > 0;
        } else {
          const elements = doc.querySelectorAll(item.selector);
          const minCount = item.minCount || 1;
          status[item.id] = elements.length >= minCount;
        }
      });
    } catch (e) {
      console.error(e);
    }

    setChecklistStatus(status);
  }, [code, currentAssignment]);

  const fullHtmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          ${cssCode}
        </style>
      </head>
      <body>
        ${code}
      </body>
    </html>
  `;

  const handleRun = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleReset = () => {
    if (confirm('ต้องการรีเซ็ตโค้ดกลับเป็นค่าเริ่มต้นของโจทย์นี้ใช่หรือไม่?')) {
      setCode(currentAssignment.starter_code);
      setReviewResult(null);
      setIframeKey((prev) => prev + 1);
    }
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(`codelab_draft_${currentAssignment.id}`, code);
      setSavedDraftToast(true);
      setTimeout(() => setSavedDraftToast(false), 2500);
      auditLog('save_draft', 'codelab', { assignmentId: currentAssignment.id });
    } catch {
      // ignore
    }
  };

  const handleSubmitAssignment = async () => {
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
          particleCount: 100,
          spread: 80,
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
  const isAllChecklistPassed = passedChecklistCount === totalChecklistCount;

  return (
    <div className="space-y-6 pb-16">
      {/* Code Lab Top Header */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Terminal className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                Code Lab: พื้นที่จำลองการเขียนโค้ด HTML
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Sandbox ปลอดภัย
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              เขียนโค้ดโครงสร้างภาษา HTML ตรวจเงื่อนไขแบบ Real-time พร้อมรับการรีวิวโดย AI
            </p>
          </div>
        </div>

        {/* Assignment Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">เลือกภารกิจ:</span>
          <select
            value={currentAssignment.id}
            onChange={(e) => {
              const found = MOCK_ASSIGNMENTS.find((a) => a.id === e.target.value);
              if (found) setCurrentAssignment(found);
            }}
            className="text-xs font-bold px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          >
            {MOCK_ASSIGNMENTS.map((a) => (
              <option key={a.id} value={a.id}>
                [{a.sub_domain_code}] {a.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Columns: Code Editor + Controls */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Editor Header with Liquid Tabs */}
          <div className="p-3 rounded-t-3xl bg-slate-900/90 text-slate-200 border border-slate-800 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === 'editor'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                index.html
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === 'css'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                style.css (เสริม)
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all"
                title="รันแสดงผล"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>รันโค้ด</span>
              </button>

              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                title="บันทึกฉบับร่าง"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">บันทึกร่าง</span>
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                title="รีเซ็ตโค้ด"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="relative rounded-b-3xl border border-slate-800 bg-[#07090e] overflow-hidden shadow-2xl">
            {activeTab === 'editor' ? (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-[410px] p-5 bg-transparent text-emerald-400 font-mono text-xs sm:text-sm resize-none focus:outline-none leading-relaxed selection:bg-indigo-900"
                placeholder="เขียนโค้ด HTML ที่นี่..."
              />
            ) : (
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                spellCheck={false}
                className="w-full h-[410px] p-5 bg-transparent text-sky-400 font-mono text-xs sm:text-sm resize-none focus:outline-none leading-relaxed selection:bg-indigo-900"
                placeholder="เขียนโค้ด CSS เสริมเพื่อการจัดวาง..."
              />
            )}

            {savedDraftToast && (
              <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg animate-in fade-in">
                บันทึกฉบับร่างเรียบร้อยแล้ว ✓
              </div>
            )}
          </div>

          {/* Submit Action Bar */}
          <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                สถานะ Checklist:
              </span>
              <span
                className={`font-black ${
                  isAllChecklistPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {passedChecklistCount} / {totalChecklistCount} เงื่อนไข
              </span>
            </div>

            <button
              onClick={handleSubmitAssignment}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI กำลังตรวจโค้ด...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งงาน & ให้ AI ตรวจทาน</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Live Preview (Iframe Sandbox) + Requirement Checklist */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Preview Box in Liquid Glass */}
          <div className="liquid-glass rounded-3xl overflow-hidden shadow-xs">
            <div className="p-3.5 bg-white/50 dark:bg-slate-800/50 border-b border-white/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Preview (พื้นที่แสดงผล)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">sandbox="allow-scripts"</span>
            </div>

            {/* Sandboxed Iframe (Safe Sandbox) */}
            <div className="w-full h-[270px] bg-white">
              <iframe
                key={iframeKey}
                srcDoc={fullHtmlContent}
                title="HTML Sandbox Preview"
                sandbox="allow-scripts"
                className="w-full h-full border-0"
              />
            </div>
          </div>

          {/* Requirement Checklist Panel */}
          <div className="liquid-glass rounded-3xl p-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Requirement Checklist ของโจทย์</span>
              </h3>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                {passedChecklistCount}/{totalChecklistCount}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {currentAssignment.description}
            </p>

            {/* Checklist Items */}
            <div className="space-y-2 pt-1">
              {currentAssignment.checklist.map((item) => {
                const passed = checklistStatus[item.id] || false;
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                      passed
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-semibold'
                        : 'border-slate-200/80 dark:border-white/10 bg-white/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{item.label}</span>
                    {passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Code Review Modal / Card */}
      {reviewResult && (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  ผลการตรวจประเมินโดย AI Code Review
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  วิเคราะห์ไวยากรณ์ โครงสร้าง Semantic และมาตรฐาน W3C
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {reviewResult.score} / 100
              </div>
              <div className="text-xs font-bold text-emerald-600">
                {reviewResult.passed ? 'ผ่านเกณฑ์มาตรฐาน ✓' : 'ควรปรับปรุงแก้ไข'}
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
            {reviewResult.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
              <div className="font-bold text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>จุดเด่นของโค้ด:</span>
              </div>
              <ul className="text-xs text-emerald-800/90 dark:text-emerald-200/90 space-y-1">
                {reviewResult.strengths?.map((str: string, i: number) => (
                  <li key={i} className="flex items-start gap-1">
                    <span>•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="font-bold text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>จุดที่ควรปรับปรุง:</span>
              </div>
              <ul className="text-xs text-amber-800/90 dark:text-amber-200/90 space-y-1">
                {reviewResult.improvements?.map((imp: string, i: number) => (
                  <li key={i} className="flex items-start gap-1">
                    <span>•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {reviewResult.correctedSnippet && (
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-500">
                ตัวอย่างโค้ดที่ถูกต้องสมบูรณ์ตามหลักมาตรฐาน HTML5:
              </span>
              <pre className="p-4 rounded-2xl bg-[#07090e] text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                {reviewResult.correctedSnippet}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CodeLabPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20">
          <Terminal className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
        </div>
      }
    >
      <CodeLabContent />
    </Suspense>
  );
}
