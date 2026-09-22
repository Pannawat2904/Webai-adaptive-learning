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
  Bot,
  Loader2,
  Code2,
  Layout,
  Globe,
  Sparkles
} from 'lucide-react';

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
  const [previewCode, setPreviewCode] = useState<string>(selectedAssignment.starter_code);
  const [iframeKey, setIframeKey] = useState<number>(0);

  const [checklistStatus, setChecklistStatus] = useState<Record<string, boolean>>({});
  const [reviewResult, setReviewResult] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savedDraftToast, setSavedDraftToast] = useState<boolean>(false);

  useEffect(() => {
    setCode(currentAssignment.starter_code);
    setPreviewCode(currentAssignment.starter_code);
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

  const handleRun = () => {
    setPreviewCode(code);
    setIframeKey((prev) => prev + 1);
  };

  const handleReset = () => {
    if (confirm('ต้องการรีเซ็ตโค้ดกลับเป็นค่าเริ่มต้นของโจทย์นี้ใช่หรือไม่?')) {
      setCode(currentAssignment.starter_code);
      setPreviewCode(currentAssignment.starter_code);
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
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-6rem)] w-full max-w-[1500px] mx-auto pb-6 px-4 sm:px-6 font-sans">
      
      {/* Top Header */}
      <header className="flex items-center justify-between mb-6 mt-2 shrink-0">
        <div className="inline-flex items-center gap-2 bg-[#cdf9e7] dark:bg-[#0ba57d]/20 text-[#06966f] dark:text-[#39d6ad] px-4 py-2.5 rounded-lg font-mono font-bold text-sm">
          &gt;_ · /ฝึกเขียนโค้ด_CodeLab
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={currentAssignment.id}
            onChange={(e) => {
              const found = MOCK_ASSIGNMENTS.find((a) => a.id === e.target.value);
              if (found) setCurrentAssignment(found);
            }}
            className="text-xs font-mono font-bold px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-line text-ink focus:outline-none shadow-sm cursor-pointer"
          >
            {MOCK_ASSIGNMENTS.map((a) => (
              <option key={a.id} value={a.id}>
                ภารกิจ: {a.title}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleSubmitAssignment}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-theme-navy hover:bg-[#1d2b48] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังตรวจ...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ส่งตรวจโค้ด</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Window */}
      <section className="mac-window flex-1 flex flex-col min-h-0">
        {/* Window Bar */}
        <div className="mac-window-bar shrink-0">
          <div className="mac-dots">
            <i className="mac-dot r"></i>
            <i className="mac-dot y"></i>
            <i className="mac-dot g"></i>
          </div>
          <div className="mac-file-title">
            <em>&lt;/&gt;</em> editor.html
          </div>
        </div>

        {/* Window Body */}
        <div className="mac-window-body p-0 flex-1 flex flex-col overflow-hidden">
          {/* Side-by-side IDE Workspace */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0">
        
        {/* Left Side: IDE Editor */}
        <div className="flex flex-col bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
          {/* Editor Header (Mac Style) */}
          <div className="bg-[#0d1117] px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              
              <div className="flex bg-slate-800/50 rounded-lg p-1">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-md text-emerald-400 text-xs font-mono">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>index.html</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleRun} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="รันโค้ด">
                <Play className="w-4 h-4" />
              </button>
              <button onClick={handleSaveDraft} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" title="บันทึกร่าง">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={handleReset} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" title="รีเซ็ต">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 relative bg-[#0d1117] flex flex-col overflow-hidden p-2">
             <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full p-4 bg-transparent text-slate-300 font-mono text-[13px] leading-relaxed resize-none focus:outline-none selection:bg-purple-500/30"
                placeholder="<!-- พิมพ์โค้ด HTML ที่นี่ -->"
              />
              
              {savedDraftToast && (
                <div className="absolute bottom-6 right-6 px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 animate-in slide-in-from-bottom-5">
                  บันทึกร่างอัตโนมัติแล้ว ✓
                </div>
              )}
          </div>
        </div>

        {/* Right Side: Live Preview & AI Review */}
        <div className="flex flex-col gap-4 min-h-0">
          
          {/* Live Preview Window */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-0">
            {/* Browser Header (Mac Style) */}
            <div className="bg-slate-100 dark:bg-slate-950 px-4 py-3 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
              </div>
              
              <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-slate-500 border border-slate-200 dark:border-slate-700">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>Preview Code</span>
              </div>
            </div>

            {/* Iframe Box */}
            <div className="flex-1 bg-white relative">
              <iframe
                key={iframeKey}
                srcDoc={previewCode}
                title="Preview"
                sandbox="allow-scripts"
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>
          </div>

          {/* Quick Checklist (Floating style) / AI Review */}
          <div className="shrink-0 max-h-[40%] overflow-y-auto scrollbar-hide">
             {reviewResult ? (
               <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-5 space-y-3">
                 <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-sm">
                   <Bot className="w-5 h-5" />
                   <span>AI Code Review ({reviewResult.score}/100)</span>
                 </div>
                 <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                   {reviewResult.summary}
                 </p>
               </div>
             ) : (
               <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm">
                     <Layout className="w-4 h-4 text-blue-500" />
                     <span>เงื่อนไขภารกิจ</span>
                   </div>
                   <span className={`text-xs font-bold px-2 py-1 rounded-md ${isAllChecklistPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                     {passedChecklistCount}/{totalChecklistCount}
                   </span>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                   {currentAssignment.checklist.map((item) => {
                     const passed = checklistStatus[item.id] || false;
                     return (
                       <div key={item.id} className="flex items-center gap-2 text-xs">
                         {passed ? (
                           <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                         ) : (
                           <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                         )}
                         <span className={passed ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-500'}>
                           {item.label}
                         </span>
                       </div>
                     );
                   })}
                 </div>
               </div>
             )}
          </div>
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
