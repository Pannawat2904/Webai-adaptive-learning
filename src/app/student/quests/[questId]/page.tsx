'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { MOCK_ASSIGNMENTS } from '@/lib/mock-data';
import {
  Gamepad2,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Code2,
  Terminal,
  Map,
  ChevronLeft,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { normalizeUnit, isStepUnlocked, setUnitStepCompleted } from '@/lib/progress-service';
import { UnitPathStepper } from '@/components/UnitPathStepper';

export default function ActiveQuestPage() {
  const params = useParams();
  const router = useRouter();
  const questId = params.questId as string;

  const currentQuest = MOCK_ASSIGNMENTS.find(a => a.id === questId);
  const currentIndex = MOCK_ASSIGNMENTS.findIndex(a => a.id === questId);
  const nextQuest = currentIndex !== -1 && currentIndex < MOCK_ASSIGNMENTS.length - 1 
    ? MOCK_ASSIGNMENTS[currentIndex + 1] 
    : null;

  const [code, setCode] = useState<string>(currentQuest?.starter_code || '');
  const [previewCode, setPreviewCode] = useState<string>(currentQuest?.starter_code || '');
  const [iframeKey, setIframeKey] = useState<number>(0);
  
  const [checklistStatus, setChecklistStatus] = useState<Record<string, boolean>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);

  const unitId = currentQuest ? normalizeUnit(currentQuest.sub_domain_code).unitId : 'u-h1';
  const [isQuestUnlocked, setIsQuestUnlocked] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (currentQuest) {
      setCode(currentQuest.starter_code);
      setPreviewCode(currentQuest.starter_code);
      setLevelCleared(false);
      setChecklistStatus({});
      setIsQuestUnlocked(isStepUnlocked(unitId, 'quest'));
    }
  }, [currentQuest, unitId]);

  if (!currentQuest) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">ไม่พบภารกิจนี้</h1>
        <Link href="/student/quests" className="mt-4 text-blue-600 hover:underline">
          กลับไปหน้าแผนที่
        </Link>
      </div>
    );
  }

  if (!isQuestUnlocked) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full mb-6">
          <UnitPathStepper unitId={unitId} currentStep="quest" />
        </div>
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border-2 border-amber-400 mb-6 text-amber-600 dark:text-amber-400 animate-pulse">
            <Lock className="w-10 h-10" />
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold mb-3">
            ขั้นตอนที่ 5: ภารกิจเขียนโค้ด (Gated)
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
            ภารกิจนี้ถูกล็อกอยู่ (QUEST LOCKED)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            คุณต้องเล่นเกม <strong>HTML5 Code Rescue</strong> ด่านของหน่วย {currentQuest.sub_domain_code} ให้ผ่านก่อน จึงจะปลดล็อกเข้ามาเขียนโค้ดภารกิจนี้ได้
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link
              href={`/student/game?unit=${unitId}&stage=${currentQuest.sub_domain_code.replace('H', '')}`}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all text-center"
            >
              ไปเล่นเกมด่าน {currentQuest.sub_domain_code}
            </Link>
            <Link
              href="/student/quests"
              className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all text-center"
            >
              กลับหน้าแผนที่ด่าน
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleRunAndCheck = () => {
    setIsChecking(true);
    setPreviewCode(code);
    setIframeKey(prev => prev + 1);

    setTimeout(() => {
      // Evaluate checklist
      const newStatus: Record<string, boolean> = {};
      const iframeDoc = iframeRef.current?.contentDocument;
      let allPassed = true;

      if (iframeDoc) {
        currentQuest.checklist.forEach((item) => {
          let passed = false;
          
          if (item.selector === '!doctype') {
            passed = code.toLowerCase().includes('<!doctype html>');
          } else {
            const elements = iframeDoc.querySelectorAll(item.selector);
            if (item.minCount) {
              passed = elements.length >= item.minCount;
            } else {
              passed = elements.length > 0;
            }
          }
          
          newStatus[item.id] = passed;
          if (!passed) allPassed = false;
        });
      }

      setChecklistStatus(newStatus);
      setIsChecking(false);

      if (allPassed) {
        setLevelCleared(true);
        setUnitStepCompleted(unitId, 'quest');
        triggerConfetti();
      }
    }, 500);
  };

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const progressPercentage = currentQuest.checklist.length === 0 ? 0 :
    Math.round((Object.values(checklistStatus).filter(Boolean).length / currentQuest.checklist.length) * 100);

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col font-sans relative">
      {/* Unit Stepper */}
      <div className="mb-3 px-2 shrink-0">
        <UnitPathStepper unitId={unitId} currentStep="quest" />
      </div>

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4 px-2 shrink-0">
        <Link href="/student/quests" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-bold text-sm bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <ChevronLeft className="w-4 h-4" />
          <span>แผนที่ด่าน</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 text-sm font-bold">
            <span className="text-slate-500">World {currentQuest.sub_domain_code.replace('H', '')}:</span>
            <span className="text-blue-600 dark:text-blue-400">{currentQuest.sub_domain_code}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* Left Column: Mission Prompt & Checklist */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          {/* Mission Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 shrink-0">
            <div className="flex items-center gap-2 text-xs font-black text-amber-500 tracking-wider uppercase mb-2">
              <Gamepad2 className="w-4 h-4" />
              ภารกิจ
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
              {currentQuest.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {currentQuest.description}
            </p>
          </div>

          {/* Checklist Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                เงื่อนไขผ่านด่าน
              </h3>
              <div className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {progressPercentage}%
              </div>
            </div>

            <div className="space-y-3">
              {currentQuest.checklist.map((item) => {
                const passed = checklistStatus[item.id];
                const checked = passed !== undefined;
                return (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-xl border transition-all \${
                      !checked ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' :
                      passed ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50' : 
                      'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {!checked ? (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                        ) : passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500" />
                        )}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium \${
                        !checked ? 'text-slate-600 dark:text-slate-400' :
                        passed ? 'text-emerald-700 dark:text-emerald-400' : 
                        'text-rose-700 dark:text-rose-400'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Preview */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 rounded-2xl shadow-xl overflow-hidden border border-slate-800 min-h-[500px] lg:min-h-0">
          
          {/* Header */}
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-md text-slate-400 text-xs font-mono">
                <Code2 className="w-3.5 h-3.5" />
                <span>index.html</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCode(currentQuest.starter_code)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="เริ่มใหม่"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleRunAndCheck}
                disabled={isChecking}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-colors shadow-sm"
              >
                {isChecking ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>รัน & ตรวจโค้ด</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row min-h-0">
            {/* Editor Area */}
            <div className="flex-1 relative flex flex-col border-b sm:border-b-0 sm:border-r border-slate-800">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 w-full bg-slate-950 text-emerald-400 font-mono p-4 sm:p-5 text-sm sm:text-base resize-none focus:outline-none"
                spellCheck={false}
              />
            </div>
            
            {/* Preview Area */}
            <div className="flex-1 bg-white relative">
              <div className="absolute top-2 left-2 bg-slate-100/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-500 uppercase z-10 border border-slate-200">
                Live Preview
              </div>
              <iframe
                key={iframeKey}
                ref={iframeRef}
                srcDoc={previewCode}
                title="preview"
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-0 p-4 pt-10"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Level Cleared Overlay */}
      {levelCleared && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm rounded-3xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6 transform animate-in zoom-in-95 duration-500 spring">
            
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border-4 border-emerald-500 shadow-inner">
              <Trophy className="w-12 h-12 text-emerald-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">ผ่านด่านแล้ว!</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">คุณเขียนโค้ดถูกต้องตามเงื่อนไขครบทุกข้อ ยอดเยี่ยมมากครับ</p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              {/* Step 6 Post-test Primary CTA */}
              <Link
                href={`/student/assessment?unit=${unitId}&type=post_test`}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-purple-600/25 hover:-translate-y-0.5 text-sm"
              >
                <span>ขั้นตอนถัดไป: ทำแบบทดสอบหลังเรียน (Post-test)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {nextQuest ? (
                <Link
                  href={`/student/quests/${nextQuest.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all text-xs"
                >
                  <span>ด่านต่อไป</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  ยินดีด้วย! คุณเคลียร์ด่านทั้งหมดแล้ว
                </div>
              )}
              
              <Link
                href="/student/quests"
                className="flex items-center justify-center w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium text-xs transition-colors"
              >
                กลับไปหน้าแผนที่
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
