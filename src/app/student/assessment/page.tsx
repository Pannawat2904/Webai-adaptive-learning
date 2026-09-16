'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Question, SubDomainCode, Attempt } from '@/types/database';
import { SUB_DOMAINS } from '@/types/database';
import { useAuth } from '@/lib/auth-context';
import {
  createInitialAdaptiveState,
  getNextAdaptiveQuestion,
  recordAnswerAndUpdateState,
  computeSkillProfiles,
  AdaptiveEngineState,
} from '@/lib/adaptive-engine';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  BarChart2,
  User,
  Info,
  MonitorCheck,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { SystemPrinciplesModal } from '@/components/modals/SystemPrinciplesModal';
import { TestSession } from '@/types/database';

function AssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetSubDomain = searchParams.get('subdomain') as SubDomainCode | null;
  const isRetest = searchParams.get('type') === 're_test';

  const { profile, auditLog } = useAuth();

  const [engineState, setEngineState] = useState<AdaptiveEngineState>(() =>
    createInitialAdaptiveState(targetSubDomain)
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(0);
  const [principlesModalOpen, setPrinciplesModalOpen] = useState(false);

  // Timers
  useEffect(() => {
    if (isTestFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
      setTotalTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTestFinished, currentQuestion]);

  // Load first question
  useEffect(() => {
    const q = getNextAdaptiveQuestion(engineState);
    setCurrentQuestion(q);
    auditLog('start_assessment', 'test_session', {
      isRetest,
      targetSubDomain,
    });
  }, []);

  const handleSelectOption = (optionKey: string) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(optionKey);
  };

  const handleSubmitQuestion = () => {
    if (!selectedOption || !currentQuestion) return;

    const { newState, isCorrect } = recordAnswerAndUpdateState(
      engineState,
      currentQuestion,
      selectedOption,
      timerSeconds
    );

    setEngineState(newState);
    setHasSubmittedAnswer(true);

    setTimeout(() => {
      const nextQ = getNextAdaptiveQuestion(newState);
      if (!nextQ || newState.questionIndex >= (isRetest ? 10 : 20)) {
        finishTest(newState.attempts);
      } else {
        setCurrentQuestion(nextQ);
        setSelectedOption(null);
        setHasSubmittedAnswer(false);
        setTimerSeconds(0);
      }
    }, 1500);
  };

  const finishTest = (finalAttempts: Attempt[]) => {
    setIsTestFinished(true);
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
    });

    const newSkills = computeSkillProfiles(profile.id, finalAttempts);
    const correctCount = finalAttempts.filter((a) => a.correct).length;
    const totalCount = finalAttempts.length;
    const scorePct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const completedSession: TestSession = {
      id: `sess-${Date.now()}`,
      student_id: profile.id,
      student_name: profile.full_name,
      test_type: isRetest ? 're_test' : 'adaptive',
      target_sub_domain: targetSubDomain,
      status: 'completed',
      total_questions: totalCount,
      correct_count: correctCount,
      score_percentage: scorePct,
      start_at: new Date(Date.now() - totalCount * 20000).toISOString(),
      end_at: new Date().toISOString(),
      stop_reason: isRetest
        ? 'ครบจำนวนข้อประเมินเฉพาะจุดประสงค์ Re-test (10 ข้อ)'
        : 'ครบเกณฑ์จำนวนข้อสอบสูงสุดตามแบบแผนความยาวคงที่ (Fixed-length Stopping Rule: 20 ข้อ ตามแนวคิด Kingsbury & Weiss, 1983)',
      attempts: finalAttempts,
    };

    try {
      localStorage.setItem('webai_student_skills', JSON.stringify(newSkills));
      const existingSessions = JSON.parse(localStorage.getItem('webai_test_sessions') || '[]');
      existingSessions.unshift(completedSession);
      localStorage.setItem('webai_test_sessions', JSON.stringify(existingSessions));

      auditLog('complete_assessment', 'test_session', {
        totalAttempts: totalCount,
        correctCount,
        scorePercentage: scorePct,
      });
    } catch {
      // ignore
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (isTestFinished) {
    const correctCount = engineState.attempts.filter((a) => a.correct).length;
    const totalCount = engineState.attempts.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    return (
      <div className="h-[calc(100vh-8rem)] bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden text-center">
          <div className="bg-slate-900 py-8 px-6 text-white space-y-4">
            <MonitorCheck className="w-16 h-16 text-emerald-400 mx-auto" />
            <h1 className="text-2xl font-bold">ส่งกระดาษคำตอบเรียบร้อย</h1>
            <p className="text-slate-400 text-sm font-medium">ระบบได้ประมวลผลความเชี่ยวชาญของคุณเสร็จสิ้น</p>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 mb-1">คะแนนรวม</div>
                <div className="text-3xl font-black text-slate-800">{percentage}%</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 mb-1">เวลาที่ใช้</div>
                <div className="text-3xl font-black text-slate-800">{formatTime(totalTimerSeconds)}</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => router.push('/student/profile')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <BarChart2 className="w-4 h-4" /> ดูรายงานผลเชิงลึก
              </button>
              <button
                onClick={() => router.push('/student')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
              >
                กลับสู่หน้าหลัก
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="h-[calc(100vh-8rem)] bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold">กำลังโหลดข้อสอบรหัสต่อไป...</p>
        </div>
      </div>
    );
  }

  const maxQuestions = isRetest ? 10 : 20;

  return (
    <div className="h-[calc(100vh-8rem)] bg-[#f3f4f6] flex flex-col font-sans rounded-2xl overflow-hidden shadow-lg border border-slate-200">
      
      {/* Top Test Header (Professional Exam Style) */}
      <header className="bg-slate-900 text-slate-200 flex items-center justify-between px-6 py-4 shadow-md shrink-0">
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          <div>
            <h1 className="font-bold text-white leading-tight">
              แบบประเมินสมรรถนะการเขียนโปรแกรม
            </h1>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> ผู้สอบ: {profile.full_name || 'ไม่ระบุ'}</span>
              <span>|</span>
              <span>รหัสวิชา: CS101</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">เวลาทำข้อสอบรวม</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-lg text-emerald-400">
              <Clock className="w-4 h-4" />
              {formatTime(totalTimerSeconds)}
            </div>
          </div>
          
          <button 
            onClick={() => setPrinciplesModalOpen(true)}
            className="p-2 rounded-md hover:bg-slate-800 transition-colors text-slate-400"
            title="ข้อมูลระบบ"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6">
        
        {/* Left Sidebar: Navigation Grid */}
        <aside className="w-64 shrink-0 hidden md:flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-4">
              <LayoutGrid className="w-4 h-4 text-blue-600" />
              <span>สถานะข้อสอบ</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: maxQuestions }).map((_, idx) => {
                const isCurrent = idx === engineState.questionIndex;
                const isAnswered = idx < engineState.questionIndex;
                
                let boxClass = "aspect-square rounded border flex items-center justify-center text-xs font-bold transition-colors ";
                
                if (isCurrent) {
                  boxClass += "bg-blue-600 border-blue-700 text-white ring-2 ring-blue-600/20 ring-offset-1";
                } else if (isAnswered) {
                  boxClass += "bg-slate-200 border-slate-300 text-slate-500";
                } else {
                  boxClass += "bg-white border-slate-200 text-slate-400";
                }

                return (
                  <div key={idx} className={boxClass}>
                    {idx + 1}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2 text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-600"></div> ข้อปัจจุบัน</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-200"></div> ตอบแล้ว (ไม่สามารถย้อนกลับได้)</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border border-slate-200 bg-white"></div> ยังไม่ถึง</div>
            </div>
          </div>
          
          {/* Adaptive Indicator */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-blue-800 mb-1">Adaptive Mode Active</h4>
            <p className="text-[11px] text-blue-600 leading-relaxed">
              ระบบปรับระดับความยากของคำถามถัดไปตามความสามารถของคุณโดยอัตโนมัติ
            </p>
          </div>
        </aside>

        {/* Right Content: Question Area */}
        <main className="flex-1 flex flex-col min-w-0">
          
          <div className="bg-white flex-1 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            
            {/* Question Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-700">
                ข้อที่ {engineState.questionIndex + 1}
              </h2>
              <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-md uppercase tracking-wide">
                รหัสคำถาม: {currentQuestion.id.slice(0, 8)}
              </span>
            </div>

            {/* Question Body */}
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="max-w-3xl space-y-6">
                
                <h3 className="text-lg text-slate-900 font-medium leading-relaxed">
                  {currentQuestion.question_text}
                </h3>

                {currentQuestion.code_snippet && (
                  <div className="bg-slate-900 rounded-lg p-5 overflow-x-auto">
                    <pre className="text-slate-300 font-mono text-sm">
                      {currentQuestion.code_snippet}
                    </pre>
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  {(['A', 'B', 'C', 'D'] as const).map((key) => {
                    const choiceText = currentQuestion.choices[key];
                    if (!choiceText) return null;

                    const isSelected = selectedOption === key;
                    const isCorrect = key === currentQuestion.correct_option;
                    
                    let wrapperClass = "flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ";
                    let radioClass = "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ";
                    
                    if (hasSubmittedAnswer) {
                      wrapperClass += "cursor-default ";
                      if (isCorrect) {
                        wrapperClass += "border-emerald-500 bg-emerald-50";
                        radioClass += "border-emerald-500 bg-emerald-500";
                      } else if (isSelected && !isCorrect) {
                        wrapperClass += "border-red-400 bg-red-50";
                        radioClass += "border-red-400 bg-red-400";
                      } else {
                        wrapperClass += "border-slate-200 bg-white opacity-50";
                        radioClass += "border-slate-300";
                      }
                    } else {
                      if (isSelected) {
                        wrapperClass += "border-blue-600 bg-blue-50/50";
                        radioClass += "border-blue-600";
                      } else {
                        wrapperClass += "border-slate-200 bg-white hover:border-blue-300";
                        radioClass += "border-slate-300";
                      }
                    }

                    return (
                      <div 
                        key={key}
                        onClick={() => handleSelectOption(key)}
                        className={wrapperClass}
                      >
                        <div className={radioClass}>
                          {isSelected && !hasSubmittedAnswer && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                          {hasSubmittedAnswer && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          {hasSubmittedAnswer && isSelected && !isCorrect && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                        </div>
                        <div className="flex-1 pt-0.5">
                          <span className={`text-sm font-medium ${hasSubmittedAnswer && isCorrect ? 'text-emerald-900' : 'text-slate-700'}`}>
                            {choiceText}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hasSubmittedAnswer && currentQuestion.explanation && (
                  <div className="mt-8 p-5 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-3 animate-in fade-in">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 mb-1">คำอธิบาย</h4>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bottom Action Bar */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
               <button
                onClick={handleSubmitQuestion}
                disabled={!selectedOption || hasSubmittedAnswer}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
              >
                <span>{engineState.questionIndex === maxQuestions - 1 ? 'ส่งคำตอบและจบการสอบ' : 'ยืนยันคำตอบ'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
          </div>

        </main>
      </div>

      <SystemPrinciplesModal
        isOpen={principlesModalOpen}
        onClose={() => setPrinciplesModalOpen(false)}
      />
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
