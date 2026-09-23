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
  Loader2
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
    <div className="main-inner enter" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)', minHeight: '600px' }}>
      <div className="topline shrink-0">
        <span className="path-pill"><Terminal className="w-3.5 h-3.5" />~/ฝึกเขียนโค้ด_CodeLab</span>
        <div className="flex gap-2 items-center">
          <select 
            className="chip chip-line mono" 
            style={{ border: '1px solid var(--line)', background: 'var(--white)', padding: '9px 14px', cursor: 'pointer', fontSize: '13px' }}
            value={currentAssignment.id}
            onChange={(e) => {
              const found = MOCK_ASSIGNMENTS.find((a) => a.id === e.target.value);
              if (found) setCurrentAssignment(found);
            }}
          >
            {MOCK_ASSIGNMENTS.map((a) => (
              <option key={a.id} value={a.id}>ภารกิจ: {a.title}</option>
            ))}
          </select>
          <button className="btn btn-navy btn-sm" onClick={handleSubmitAssignment} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            {isSubmitting ? 'กำลังตรวจ...' : 'ส่งตรวจโค้ด'}
          </button>
        </div>
      </div>

      <section className="win" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div className="win-bar" style={{ flexShrink: 0 }}>
          <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
          <div className="win-title"><em>&lt;/&gt;</em> editor.html</div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '14px', minHeight: 0 }}>
          
          {/* Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--code-line)' }}>
            <div style={{ background: 'var(--code-bg-2)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--code-line)', flexShrink: 0 }}>
              <div className="flex items-center gap-3">
                <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
                <span className="chip mono" style={{ background: 'rgba(15,179,137,.16)', color: '#4fd8ac' }}><Code2 className="w-3.5 h-3.5" />index.html</span>
              </div>
              <div className="flex gap-1">
                <button className="icon-btn" style={{ background: 'transparent', border: 0, color: '#4fd8ac' }} title="รันโค้ด" onClick={handleRun}><Play className="w-4 h-4" /></button>
                <button className="icon-btn" style={{ background: 'transparent', border: 0, color: '#9aa7bd' }} title="บันทึกร่าง" onClick={handleSaveDraft}><Save className="w-4 h-4" /></button>
                <button className="icon-btn" style={{ background: 'transparent', border: 0, color: '#9aa7bd' }} title="รีเซ็ต" onClick={handleReset}><RotateCcw className="w-4 h-4" /></button>
              </div>
            </div>
            <textarea 
              spellCheck="false" 
              style={{ flex: 1, background: 'var(--code-bg)', color: '#c9d4e8', border: 0, padding: '18px', fontFamily: 'var(--font-mono)', fontSize: '12.5px', lineHeight: 1.8, resize: 'none', outline: 'none' }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {savedDraftToast && (
              <div style={{ position: 'absolute', margin: '14px', alignSelf: 'flex-end', bottom: '20px', background: 'var(--green)', color: '#fff', fontSize: '11.5px', fontWeight: 700, padding: '8px 14px', borderRadius: '10px' }}>บันทึกร่างแล้ว ✓</div>
            )}
          </div>

          {/* Preview + Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
            <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', minHeight: 0 }}>
              <div style={{ background: 'var(--soft)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
                <div className="win-dots"><i style={{ background: 'var(--line)' }}></i><i style={{ background: 'var(--line)' }}></i><i style={{ background: 'var(--line)' }}></i></div>
                <div style={{ flex: 1, background: 'var(--white)', border: '1px solid var(--line)', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted)' }}>
                  <Globe style={{ width: '12px', height: '12px', color: 'var(--blue)' }} />preview://index.html
                </div>
              </div>
              <iframe 
                key={iframeKey}
                sandbox="allow-scripts" 
                style={{ flex: 1, border: 0, background: '#fff', width: '100%', height: '100%' }}
                srcDoc={previewCode}
              />
            </div>

            <div className="card" style={{ flexShrink: 0 }}>
              <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
                <div className="flex items-center gap-2" style={{ fontSize: '12.5px', fontWeight: 700 }}>
                  <Layout style={{ width: '14px', height: '14px', color: 'var(--blue)' }} />เงื่อนไขภารกิจ
                </div>
                <span className="chip chip-line mono">{passedChecklistCount}/{totalChecklistCount}</span>
              </div>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '12px 16px' }}>
                {currentAssignment.checklist.map(item => {
                  const passed = checklistStatus[item.id];
                  return (
                    <div key={item.id} className="flex items-center gap-2" style={{ fontSize: '11.5px', color: passed ? 'var(--green)' : 'var(--muted)', fontWeight: passed ? 700 : 400 }}>
                      <span className="dot" style={{ width: '14px', height: '14px', borderRadius: '50%', border: passed ? '1.5px solid var(--green)' : '1.5px solid var(--line)', background: passed ? 'var(--green)' : 'transparent', flexShrink: 0 }}></span>
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {reviewResult && (
              <div className="card" style={{ padding: '16px', background: 'var(--purple-dim)', borderColor: 'rgba(138,92,246,.3)', flexShrink: 0 }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--purple)', marginBottom: '6px' }}>
                  <Bot style={{ width: '16px', height: '16px' }} />AI Code Review ({reviewResult.score}/100)
                </div>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.7, color: 'var(--ink)' }}>
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
