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
  Code2,
  Layout,
  Globe,
  Bot,
  Loader2,
  CheckCircle2
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

  return (
    <div className="main-inner enter flex flex-col min-h-[800px] md:min-h-[600px] h-auto md:h-[calc(100vh-40px)] mb-20 md:mb-0 max-w-[1400px] mx-auto pt-6">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <span className="flex items-center gap-2 text-sm font-bold text-muted bg-surface px-4 py-2 rounded-full border border-line">
          <Terminal className="w-4 h-4 text-primary" /> ~/mission/lab
        </span>
        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          <select 
            className="chip bg-surface border border-line py-2 px-3 text-[13px] text-ink cursor-pointer font-bold" 
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
          <button className="btn btn-primary btn-sm w-full sm:w-auto justify-center" onClick={handleSubmitAssignment} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            {isSubmitting ? 'กำลังตรวจ...' : 'ส่งมอบภารกิจ'}
          </button>
        </div>
      </div>

      <section className="win flex flex-col flex-1 min-h-0">
        <div className="win-bar shrink-0">
          <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
          <div className="win-title"><em>&lt;/&gt;</em> lab_environment.html</div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-0 overflow-y-auto lg:overflow-hidden bg-bg-base">
          
          {/* Editor */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-line min-h-[400px] lg:min-h-0 relative bg-[#0d1424]">
            <div className="bg-[#172033] p-2.5 px-3.5 flex items-center justify-between border-b border-line shrink-0">
              <div className="flex items-center gap-3">
                <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
                <span className="chip chip-mono bg-primary/20 text-primary border border-primary/20"><Code2 className="w-3.5 h-3.5" />index.html</span>
              </div>
              <div className="flex gap-1">
                <button className="icon-btn border-0 bg-transparent text-success hover:bg-success/10" title="รันโค้ด" onClick={handleRun}><Play className="w-4 h-4" /></button>
                <button className="icon-btn border-0 bg-transparent text-muted hover:bg-white/5" title="บันทึกร่าง" onClick={handleSaveDraft}><Save className="w-4 h-4" /></button>
                <button className="icon-btn border-0 bg-transparent text-muted hover:bg-white/5" title="รีเซ็ต" onClick={handleReset}><RotateCcw className="w-4 h-4" /></button>
              </div>
            </div>
            <textarea 
              spellCheck="false" 
              className="flex-1 bg-transparent text-[#e2e8f0] border-0 p-[18px] font-mono text-[13px] leading-[1.8] resize-none focus:outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {savedDraftToast && (
              <div className="absolute right-3.5 bottom-5 bg-success text-white text-[11.5px] font-bold py-2 px-3.5 rounded-xl shadow-lg z-10 animate-in fade-in slide-in-from-bottom-2">ร่างภารกิจถูกบันทึกแล้ว ✓</div>
            )}
          </div>

          {/* Preview + Checklist */}
          <div className="flex flex-col gap-3 min-h-[400px] lg:min-h-0">
            <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-line min-h-[250px]">
              <div className="bg-surface p-2.5 px-3.5 flex items-center gap-2.5 border-b border-line shrink-0">
                <div className="win-dots"><i className="bg-line"></i><i className="bg-line"></i><i className="bg-line"></i></div>
                <div className="flex-1 bg-bg-base border border-line rounded-lg px-3 py-1.5 flex items-center gap-2 text-[11px] text-muted">
                  <Globe className="w-3 h-3 text-primary" />localhost:3000/preview
                </div>
              </div>
              <iframe 
                key={iframeKey}
                sandbox="allow-scripts" 
                className="flex-1 border-0 bg-white w-full h-full"
                srcDoc={previewCode}
              />
            </div>

            <div className="card shrink-0">
              <div className="flex items-center justify-between p-3 px-4 border-b border-line bg-surface">
                <div className="flex items-center gap-2 text-[12.5px] font-bold text-ink">
                  <Layout className="w-3.5 h-3.5 text-primary" />Mission Checklist
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-highlight bg-highlight-dim px-2 py-0.5 rounded border border-highlight-dim">+150 XP</span>
                  <span className="chip chip-line chip-mono">{passedChecklistCount}/{totalChecklistCount}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 px-4 bg-bg-base">
                {currentAssignment.checklist.map(item => {
                  const passed = checklistStatus[item.id];
                  return (
                    <div key={item.id} className={`flex items-center gap-2 text-[12px] ${passed ? 'text-success font-bold' : 'text-muted font-medium'}`}>
                      <span className={`w-4 h-4 rounded-sm border-[1.5px] shrink-0 flex items-center justify-center ${passed ? 'border-success bg-success' : 'border-muted bg-transparent'}`}>
                        {passed && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </span>
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {reviewResult && (
              <div className={`card p-4 shrink-0 border-l-4 ${reviewResult.passed ? 'border-l-success bg-success-dim' : 'border-l-warning bg-warning-dim'}`}>
                <div className={`flex items-center justify-between font-bold text-[13px] mb-2 ${reviewResult.passed ? 'text-success' : 'text-warning'}`}>
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" /> AI Advisor Review
                  </div>
                  {reviewResult.passed && (
                    <span className="chip chip-success chip-mono text-[10px]">MISSION CLEARED</span>
                  )}
                </div>
                <p className="m-0 text-sm leading-relaxed text-ink">
                  {reviewResult.summary}
                </p>
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
