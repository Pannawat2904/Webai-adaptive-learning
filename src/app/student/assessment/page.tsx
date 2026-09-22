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
  LayoutGrid,
  Play,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { SystemPrinciplesModal } from '@/components/modals/SystemPrinciplesModal';
import { TestSession } from '@/types/database';

function AssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetSubDomain = searchParams.get('subdomain') as SubDomainCode | null;
  const isRetest = searchParams.get('type') === 're_test';

  const { profile, auditLog } = useAuth();

  const [hasStarted, setHasStarted] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState<'pre_test' | 'post_test' | 're_test'>(isRetest ? 're_test' : 'pre_test');

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
    if (!hasStarted || isTestFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
      setTotalTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted, isTestFinished, currentQuestion]);

  const startAssessment = () => {
    setHasStarted(true);
    const q = getNextAdaptiveQuestion(engineState);
    setCurrentQuestion(q);
    auditLog('start_assessment', 'test_session', {
      testType: selectedTestType,
      targetSubDomain,
    });
  };

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
      test_type: selectedTestType,
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
      <div className="w-full max-w-[1200px] mx-auto pb-12 px-4 sm:px-6 font-sans">
        <header className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center gap-2 bg-[#cdf9e7] dark:bg-[#0ba57d]/20 text-[#06966f] dark:text-[#39d6ad] px-4 py-2.5 rounded-lg font-mono font-bold text-sm">
            &gt;_ · /ส่งกระดาษคำตอบ
          </div>
        </header>

        <section className="mac-window">
          <div className="mac-window-bar">
            <div className="mac-dots">
              <i className="mac-dot r"></i>
              <i className="mac-dot y"></i>
              <i className="mac-dot g"></i>
            </div>
            <div className="mac-file-title">
              <em>&lt;/&gt;</em> result.html
            </div>
          </div>
          <div className="mac-window-body">
            <div className="max-w-2xl mx-auto w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-line overflow-hidden text-center">
              <div className="bg-theme-navy py-8 px-6 text-white space-y-4">
                <MonitorCheck className="w-16 h-16 text-theme-green mx-auto" />
                <h1 className="text-2xl font-bold">ส่งกระดาษคำตอบเรียบร้อย</h1>
                <p className="text-slate-400 text-sm font-medium">ระบบได้ประมวลผลความเชี่ยวชาญของคุณเสร็จสิ้น</p>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div className="p-4 rounded-xl border border-line bg-slate-50 dark:bg-slate-800">
                    <div className="text-xs font-bold text-muted mb-1">คะแนนรวม</div>
                    <div className="text-3xl font-black text-ink">{percentage}%</div>
                  </div>
                  <div className="p-4 rounded-xl border border-line bg-slate-50 dark:bg-slate-800">
                    <div className="text-xs font-bold text-muted mb-1">เวลาที่ใช้</div>
                    <div className="text-3xl font-black text-ink">{formatTime(totalTimerSeconds)}</div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 pt-4 border-t border-line">
                  <button
                    onClick={() => router.push('/student/profile')}
                    className="px-6 py-3 bg-theme-blue hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
                  >
                    <BarChart2 className="w-4 h-4" /> ดูรายงานผลเชิงลึก
                  </button>
                  <button
                    onClick={() => router.push('/student')}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-ink text-sm font-bold rounded-xl transition-colors"
                  >
                    กลับสู่หน้าหลัก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // LOBBY (Pre-start Screen)
  if (!hasStarted) {
    return (
      <div className="w-full max-w-[1200px] mx-auto pb-6 px-4 sm:px-6 font-sans flex flex-col h-[calc(100vh-2rem)]">
        <header className="flex items-center justify-between mb-4 mt-2 shrink-0">
          <div className="inline-flex items-center gap-2 bg-[#cdf9e7] dark:bg-[#0ba57d]/20 text-[#06966f] dark:text-[#39d6ad] px-4 py-2.5 rounded-lg font-mono font-bold text-sm">
            &gt;_ · /เตรียมความพร้อม_AdaptiveTest
          </div>
        </header>

        <section className="mac-window flex-1 flex flex-col min-h-0">
          <div className="mac-window-bar shrink-0">
            <div className="mac-dots">
              <i className="mac-dot r"></i>
              <i className="mac-dot y"></i>
              <i className="mac-dot g"></i>
            </div>
            <div className="mac-file-title">
              <em>&lt;/&gt;</em> lobby.html
            </div>
          </div>
          
          <div className="mac-window-body p-0 flex-1 flex flex-col overflow-y-auto">
            <div className="max-w-3xl mx-auto py-6 px-4 flex flex-col h-full justify-center">
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-theme-blue flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-ink mb-2">แบบทดสอบ Adaptive</h1>
                <p className="text-muted text-sm max-w-lg mx-auto">
                  ระบบจะปรับระดับความยากของคำถามให้เหมาะสมกับความสามารถของคุณแบบเรียลไทม์
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-line rounded-2xl p-5 mb-6 shadow-sm">
                <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  คำชี้แจงก่อนเริ่มทำแบบทดสอบ
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <li className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-theme-blue flex items-center justify-center shrink-0 text-xs">1</div>
                    <p><strong>ระบบปรับระดับอัตโนมัติ:</strong> ข้อสอบจะยากขึ้นเมื่อตอบถูก และจะง่ายลงเมื่อตอบผิด เพื่อประเมินความสามารถที่แท้จริง</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-theme-blue flex items-center justify-center shrink-0 text-xs">2</div>
                    <p><strong>ห้ามย้อนกลับ:</strong> เมื่อคุณยืนยันคำตอบแล้ว จะไม่สามารถย้อนกลับมาแก้ไขข้อก่อนหน้าได้ โปรดตรวจสอบให้แน่ใจก่อนกดส่ง</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-theme-blue flex items-center justify-center shrink-0 text-xs">3</div>
                    <p><strong>ความยาวของข้อสอบ:</strong> แบบทดสอบทั่วไปจะจบลงเมื่อครบ 20 ข้อ (แบบทดสอบซ่อมจะใช้ 10 ข้อ)</p>
                  </li>
                </ul>
              </div>

              {!isRetest ? (
                <div className="mb-6">
                  <h3 className="font-bold text-ink mb-3 text-center">โปรดเลือกประเภทแบบทดสอบ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSelectedTestType('pre_test')}
                      className={`flex flex-col items-center p-5 rounded-2xl border-2 transition-all ${
                        selectedTestType === 'pre_test' 
                          ? 'border-theme-blue bg-blue-50/50 dark:bg-blue-900/20' 
                          : 'border-line bg-white dark:bg-slate-900 hover:border-blue-300'
                      }`}
                    >
                      <BookOpen className={`w-6 h-6 mb-2 ${selectedTestType === 'pre_test' ? 'text-theme-blue' : 'text-slate-400'}`} />
                      <span className={`font-bold text-sm ${selectedTestType === 'pre_test' ? 'text-theme-blue' : 'text-ink'}`}>แบบทดสอบก่อนเรียน</span>
                      <span className="text-xs text-muted mt-1">(Pre-test)</span>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedTestType('post_test')}
                      className={`flex flex-col items-center p-5 rounded-2xl border-2 transition-all ${
                        selectedTestType === 'post_test' 
                          ? 'border-theme-green bg-emerald-50/50 dark:bg-emerald-900/20' 
                          : 'border-line bg-white dark:bg-slate-900 hover:border-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className={`w-6 h-6 mb-2 ${selectedTestType === 'post_test' ? 'text-theme-green' : 'text-slate-400'}`} />
                      <span className={`font-bold text-sm ${selectedTestType === 'post_test' ? 'text-theme-green' : 'text-ink'}`}>แบบทดสอบหลังเรียน</span>
                      <span className="text-xs text-muted mt-1">(Post-test)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-5 text-center mb-6">
                  <h3 className="font-bold text-amber-800 dark:text-amber-400">โหมดสอบแก้ตัว (Re-test)</h3>
                  <p className="text-sm text-amber-700/80 mt-1">หัวข้อ: {targetSubDomain}</p>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={startAssessment}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-theme-navy text-white font-bold text-sm hover:bg-[#1d2b48] transition-colors shadow-lg shadow-slate-200 dark:shadow-none"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>เริ่มทำแบบทดสอบ</span>
                </button>
              </div>

            </div>
          </div>
        </section>
      </div>
    );
  }

  // TEST IN PROGRESS
  if (!currentQuestion) {
    return (
      <div className="w-full max-w-[1200px] mx-auto pb-12 px-4 sm:px-6 h-[calc(100vh-2rem)] flex flex-col">
         <section className="mac-window flex-1 flex flex-col min-h-0">
          <div className="mac-window-body flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-slate-500">
              <div className="w-8 h-8 border-4 border-theme-blue border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold">กำลังประมวลผลข้อสอบ...</p>
            </div>
          </div>
         </section>
      </div>
    );
  }

  const maxQuestions = isRetest ? 10 : 20;

  return (
    <div className="w-full max-w-[1500px] mx-auto pb-6 px-4 sm:px-6 font-sans flex flex-col h-[calc(100vh-2rem)]">
      
      {/* Top Header */}
      <header className="flex items-center justify-between mb-4 mt-2 shrink-0">
        <div className="inline-flex items-center gap-2 bg-[#cdf9e7] dark:bg-[#0ba57d]/20 text-[#06966f] dark:text-[#39d6ad] px-4 py-2.5 rounded-lg font-mono font-bold text-sm">
          &gt;_ · /ทำแบบทดสอบ_{selectedTestType}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">เวลาทำข้อสอบรวม</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-base text-theme-green">
              <Clock className="w-4 h-4" />
              {formatTime(totalTimerSeconds)}
            </div>
          </div>
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
            <em>&lt;/&gt;</em> assessment.html
          </div>
        </div>

        {/* Window Body */}
        <div className="mac-window-body p-0 flex-1 flex flex-row overflow-hidden bg-slate-50 dark:bg-slate-900/50">
          
          {/* Left Sidebar: Navigation Grid */}
          <aside className="w-64 shrink-0 hidden md:flex flex-col gap-4 p-6 border-r border-line bg-white dark:bg-slate-900 overflow-y-auto">
            <div className="flex items-center gap-2 text-ink font-bold text-sm mb-4">
              <LayoutGrid className="w-4 h-4 text-theme-blue" />
              <span>สถานะข้อสอบ</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: maxQuestions }).map((_, idx) => {
                const isCurrent = idx === engineState.questionIndex;
                const isAnswered = idx < engineState.questionIndex;
                
                let boxClass = "aspect-square rounded border flex items-center justify-center text-xs font-bold transition-colors ";
                
                if (isCurrent) {
                  boxClass += "bg-theme-blue border-theme-blue text-white ring-2 ring-theme-blue/20 ring-offset-1";
                } else if (isAnswered) {
                  boxClass += "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500";
                } else {
                  boxClass += "bg-white dark:bg-slate-900 border-line text-slate-400";
                }

                return (
                  <div key={idx} className={boxClass}>
                    {idx + 1}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-line flex flex-col gap-2 text-[11px] text-muted font-medium">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-theme-blue"></div> ข้อปัจจุบัน</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-800"></div> ตอบแล้ว (ไม่สามารถย้อนกลับได้)</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border border-line bg-white dark:bg-slate-900"></div> ยังไม่ถึง</div>
            </div>
            
            <div className="mt-auto pt-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-800 dark:text-blue-400 mb-1">Adaptive Mode Active</h4>
                <p className="text-[10px] text-blue-600 dark:text-blue-300/80 leading-relaxed">
                  ระบบปรับระดับความยากของคำถามถัดไปตามความสามารถของคุณโดยอัตโนมัติ
                </p>
              </div>
            </div>
          </aside>

          {/* Right Content: Question Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#fafafa] dark:bg-slate-900 relative">
            
            {/* Question Header */}
            <div className="px-8 py-5 border-b border-line flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
              <h2 className="font-bold text-ink">
                ข้อที่ {engineState.questionIndex + 1}
              </h2>
              <span className="px-3 py-1 bg-[#f0f4f8] dark:bg-slate-800 text-muted text-[10px] font-mono font-bold rounded-md tracking-wide">
                รหัสคำถาม: {currentQuestion.id}
              </span>
            </div>

            {/* Question Body */}
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-6">
                
                <h3 className="text-lg text-ink font-medium leading-relaxed">
                  {currentQuestion.question_text}
                </h3>

                {currentQuestion.code_snippet && (
                  <div className="bg-[#111b31] rounded-xl p-5 overflow-x-auto border border-[#2a3752]">
                    <pre className="text-slate-300 font-mono text-sm leading-relaxed">
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
                    
                    let wrapperClass = "flex items-start gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer ";
                    let radioClass = "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ";
                    
                    if (hasSubmittedAnswer) {
                      wrapperClass += "cursor-default ";
                      if (isCorrect) {
                        wrapperClass += "border-theme-green bg-[#eafbf6] dark:bg-emerald-900/20";
                        radioClass += "border-theme-green bg-theme-green";
                      } else if (isSelected && !isCorrect) {
                        wrapperClass += "border-red-400 bg-red-50 dark:bg-red-900/20";
                        radioClass += "border-red-400 bg-red-400";
                      } else {
                        wrapperClass += "border-line bg-white dark:bg-slate-900 opacity-50";
                        radioClass += "border-line";
                      }
                    } else {
                      if (isSelected) {
                        wrapperClass += "border-theme-blue bg-[#f0f7ff] dark:bg-blue-900/20";
                        radioClass += "border-theme-blue";
                      } else {
                        wrapperClass += "border-line bg-white dark:bg-slate-900 hover:border-blue-300";
                        radioClass += "border-line";
                      }
                    }

                    return (
                      <div 
                        key={key}
                        onClick={() => handleSelectOption(key)}
                        className={wrapperClass}
                      >
                        <div className={radioClass}>
                          {isSelected && !hasSubmittedAnswer && <div className="w-2.5 h-2.5 rounded-full bg-theme-blue"></div>}
                          {hasSubmittedAnswer && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          {hasSubmittedAnswer && isSelected && !isCorrect && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                        </div>
                        <div className="flex-1 pt-0.5">
                          <span className={`text-sm font-medium ${hasSubmittedAnswer && isCorrect ? 'text-theme-green' : 'text-ink'}`}>
                            {choiceText}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hasSubmittedAnswer && currentQuestion.explanation && (
                  <div className="mt-8 p-6 rounded-xl bg-[#f0f7ff] dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 flex items-start gap-4 animate-in fade-in">
                    <Info className="w-6 h-6 text-theme-blue shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-ink mb-2">คำอธิบาย</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bottom Action Bar */}
            <div className="px-8 py-5 border-t border-line bg-white dark:bg-slate-900 flex items-center justify-end shrink-0">
               <button
                onClick={handleSubmitQuestion}
                disabled={!selectedOption || hasSubmittedAnswer}
                className="flex items-center gap-2 px-8 py-3.5 bg-theme-navy hover:bg-[#1d2b48] disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
              >
                <span>{engineState.questionIndex === maxQuestions - 1 ? 'ส่งคำตอบและจบการสอบ' : 'ยืนยันคำตอบ'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
          </main>
        </div>
      </section>

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
          <div className="w-8 h-8 border-4 border-theme-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
