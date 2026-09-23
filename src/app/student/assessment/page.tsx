'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Question, SubDomainCode, Attempt, TestSession } from '@/types/database';
import { useAuth } from '@/lib/auth-context';
import {
  createInitialAdaptiveState,
  getNextAdaptiveQuestion,
  recordAnswerAndUpdateState,
  computeSkillProfiles,
  AdaptiveEngineState,
} from '@/lib/adaptive-engine';
import {
  createInitialIRTState,
  getNextIRTQuestion,
  recordIRTAnswerAndUpdateState,
  IRTEngineState
} from '@/lib/irt/engine-adapter';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  BarChart2,
  Info,
  Shield,
  Grid,
  Play,
  BookOpen,
  AlertTriangle,
  BrainCircuit,
  Check
} from 'lucide-react';
import { SystemPrinciplesModal } from '@/components/modals/SystemPrinciplesModal';

function AssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetSubDomain = searchParams.get('subdomain') as SubDomainCode | null;
  const isRetest = searchParams.get('type') === 're_test';

  const { profile, auditLog } = useAuth();

  const [hasStarted, setHasStarted] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState<'pre_test' | 'post_test' | 're_test'>(isRetest ? 're_test' : 'pre_test');
  const [selectedEngine, setSelectedEngine] = useState<'rule-based' | 'irt-3pl'>('irt-3pl');

  const [engineState, setEngineState] = useState<AdaptiveEngineState>(() =>
    createInitialAdaptiveState(targetSubDomain)
  );
  const [irtEngineState, setIrtEngineState] = useState<IRTEngineState>(() => 
    createInitialIRTState(targetSubDomain)
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
    let q: Question | null = null;
    
    if (selectedEngine === 'rule-based') {
      q = getNextAdaptiveQuestion(engineState);
    } else {
      q = getNextIRTQuestion(irtEngineState);
    }
    
    setCurrentQuestion(q);
    auditLog('start_assessment', 'test_session', {
      testType: selectedTestType,
      engine: selectedEngine,
      targetSubDomain,
    });
  };

  const handleSelectOption = (optionKey: string) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(optionKey);
  };

  const handleSubmitQuestion = () => {
    if (!selectedOption || !currentQuestion) return;

    setHasSubmittedAnswer(true);

    if (selectedEngine === 'rule-based') {
      const { newState } = recordAnswerAndUpdateState(
        engineState,
        currentQuestion,
        selectedOption,
        timerSeconds
      );
      setEngineState(newState);

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
      }, 2500);
    } else {
      // IRT 3PL Engine
      const { newState } = recordIRTAnswerAndUpdateState(
        irtEngineState,
        currentQuestion,
        selectedOption,
        timerSeconds
      );
      setIrtEngineState(newState);

      setTimeout(() => {
        const nextQ = getNextIRTQuestion(newState);
        if (!nextQ) {
          finishTest(newState.attempts);
        } else {
          setCurrentQuestion(nextQ);
          setSelectedOption(null);
          setHasSubmittedAnswer(false);
          setTimerSeconds(0);
        }
      }, 2500);
    }
  };

  const finishTest = (finalAttempts: Attempt[]) => {
    setIsTestFinished(true);
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
    });

    const newSkills = computeSkillProfiles(profile?.id || 'guest', finalAttempts);
    const correctCount = finalAttempts.filter((a) => a.correct).length;
    const totalCount = finalAttempts.length;
    const scorePct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const completedSession: TestSession = {
      id: `sess-${Date.now()}`,
      student_id: profile?.id || 'guest',
      student_name: profile?.full_name || 'Guest',
      test_type: selectedTestType,
      target_sub_domain: targetSubDomain,
      status: 'completed',
      total_questions: totalCount,
      correct_count: correctCount,
      score_percentage: scorePct,
      start_at: new Date(Date.now() - totalCount * 20000).toISOString(),
      end_at: new Date().toISOString(),
      stop_reason: selectedEngine === 'irt-3pl' 
        ? 'ยุติการทดสอบด้วยกฎของโมเดล IRT CAT'
        : (isRetest
          ? 'ครบจำนวนข้อประเมินเฉพาะจุดประสงค์ Re-test (10 ข้อ)'
          : 'ครบเกณฑ์จำนวนข้อสอบสูงสุดตามแบบแผนความยาวคงที่'),
      attempts: finalAttempts,
    };

    try {
      localStorage.setItem('webai_student_skills', JSON.stringify(newSkills));
      const existingSessions = JSON.parse(localStorage.getItem('webai_test_sessions') || '[]');
      existingSessions.unshift(completedSession);
      localStorage.setItem('webai_test_sessions', JSON.stringify(existingSessions));
      
      if (selectedEngine === 'irt-3pl') {
        localStorage.setItem('webai_irt_theta', irtEngineState.currentTheta.toString());
        localStorage.setItem('webai_irt_se', irtEngineState.standardError.toString());
      }

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

  // RESULT SCREEN
  if (isTestFinished) {
    const activeState = selectedEngine === 'rule-based' ? engineState : irtEngineState;
    const correctCount = activeState.attempts.filter((a) => a.correct).length;
    const totalCount = activeState.attempts.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    return (
      <div className="main-inner enter">
        <div className="topline">
          <span className="path-pill"><BrainCircuit className="w-3.5 h-3.5" />~/แบบทดสอบ_Adaptive/ผลลัพธ์</span>
        </div>
        <section className="win" id="screen-result">
          <div className="win-bar">
            <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
            <div className="win-title"><em>&lt;/&gt;</em> result.html</div>
          </div>
          <div className="win-body">
            <div className="card" style={{ maxWidth: '520px', margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(160deg,var(--navy),var(--navy-2))', padding: '34px 24px', textAlign: 'center', color: '#fff' }}>
                <CheckCircle2 style={{ width: '52px', height: '52px', color: '#4fd8ac', margin: '0 auto 12px' }} />
                <h2 style={{ margin: '0 0 6px', fontSize: '19px' }}>ส่งกระดาษคำตอบเรียบร้อย</h2>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#c7d2e3' }}>ระบบประมวลผลความเชี่ยวชาญของคุณเสร็จสิ้น</p>
              </div>
              <div style={{ padding: '26px' }}>
                <div className="grid grid-cols-2 gap-3 max-w-[320px] mx-auto mb-5">
                  <div className="card" style={{ padding: '14px', textAlign: 'center', background: 'var(--soft)' }}>
                    <div className="muted" style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>คะแนนรวม</div>
                    <div style={{ fontSize: '26px', fontWeight: 700 }}>{percentage}%</div>
                  </div>
                  <div className="card" style={{ padding: '14px', textAlign: 'center', background: 'var(--soft)' }}>
                    <div className="muted" style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>เวลาที่ใช้</div>
                    <div style={{ fontSize: '26px', fontWeight: 700 }}>{formatTime(totalTimerSeconds)}</div>
                  </div>
                </div>
                <div className="flex gap-3 justify-between" style={{ borderTop: '1px solid var(--line)', paddingTop: '18px' }}>
                  <button className="btn btn-blue" style={{ flex: 1 }} onClick={() => router.push('/student/profile')}>
                    <BarChart2 className="w-3.5 h-3.5" />ดูรายงานผลเชิงลึก
                  </button>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => router.push('/student')}>
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

  // LOBBY SCREEN
  if (!hasStarted) {
    return (
      <div className="main-inner enter">
        <div className="topline">
          <span className="path-pill"><BrainCircuit className="w-3.5 h-3.5" />~/แบบทดสอบ_Adaptive</span>
        </div>

        <section className="win" id="screen-lobby">
          <div className="win-bar">
            <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
            <div className="win-title"><em>&lt;/&gt;</em> lobby.html</div>
          </div>
          <div className="win-body">
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '10px 0 4px' }}>
              <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '16px', background: 'var(--blue-dim)', marginBottom: '14px' }}>
                <Shield style={{ width: '26px', height: '26px', color: 'var(--blue)' }} />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>แบบทดสอบ Adaptive</h1>
              <p className="muted" style={{ fontSize: '13.5px', margin: '0 0 24px' }}>ระบบจะปรับระดับความยากของคำถามให้เหมาะสมกับความสามารถของคุณแบบเรียลไทม์</p>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto 22px', padding: '20px' }}>
              <h3 className="flex items-center gap-2" style={{ fontSize: '13.5px', margin: '0 0 14px' }}>
                <AlertTriangle style={{ width: '15px', height: '15px', color: 'var(--amber)' }} />คำชี้แจงก่อนเริ่มทำแบบทดสอบ
              </h3>
              <div className="flex gap-3" style={{ marginBottom: '14px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>1</div>
                <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.7 }}><strong>ระบบปรับระดับอัตโนมัติ:</strong> ข้อสอบจะยากขึ้นเมื่อตอบถูก และง่ายลงเมื่อตอบผิด</p>
              </div>
              <div className="flex gap-3" style={{ marginBottom: '14px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>2</div>
                <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.7 }}><strong>ห้ามย้อนกลับ:</strong> เมื่อยืนยันคำตอบแล้วจะไม่สามารถแก้ไขข้อก่อนหน้าได้</p>
              </div>
              <div className="flex gap-3">
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>3</div>
                <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.7 }}><strong>ความยาวข้อสอบ:</strong> แบบทดสอบทั่วไป 20 ข้อ (แบบสอบซ่อม 10 ข้อ)</p>
              </div>
            </div>

            {!isRetest ? (
              <div style={{ maxWidth: '600px', margin: '0 auto 22px' }}>
                <h3 style={{ textAlign: 'center', fontSize: '13px', margin: '0 0 12px' }}>โปรดเลือกประเภทแบบทดสอบ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    className="card" 
                    onClick={() => setSelectedTestType('pre_test')}
                    style={{ padding: '18px', border: `2px solid ${selectedTestType === 'pre_test' ? 'var(--blue)' : 'var(--line)'}`, background: selectedTestType === 'pre_test' ? 'var(--blue-dim)' : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                  >
                    <BookOpen style={{ width: '22px', height: '22px', color: selectedTestType === 'pre_test' ? 'var(--blue)' : 'var(--faint)' }} />
                    <b style={{ fontSize: '12.5px', color: selectedTestType === 'pre_test' ? 'var(--blue)' : 'inherit' }}>แบบทดสอบก่อนเรียน</b>
                    <small className="muted" style={{ fontSize: '10.5px' }}>Pre-test</small>
                  </button>
                  <button 
                    className="card" 
                    onClick={() => setSelectedTestType('post_test')}
                    style={{ padding: '18px', border: `2px solid ${selectedTestType === 'post_test' ? 'var(--green)' : 'var(--line)'}`, background: selectedTestType === 'post_test' ? 'var(--green-dim)' : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                  >
                    <Check style={{ width: '22px', height: '22px', color: selectedTestType === 'post_test' ? 'var(--green)' : 'var(--faint)' }} />
                    <b style={{ fontSize: '12.5px', color: selectedTestType === 'post_test' ? 'var(--green)' : 'inherit' }}>แบบทดสอบหลังเรียน</b>
                    <small className="muted" style={{ fontSize: '10.5px' }}>Post-test</small>
                  </button>
                </div>
              </div>
            ) : (
              <div className="card" style={{ maxWidth: '600px', margin: '0 auto 22px', padding: '20px', background: 'var(--amber-dim)', borderColor: 'var(--amber)', textAlign: 'center' }}>
                 <h3 style={{ fontSize: '14px', color: 'var(--amber)', margin: '0 0 4px' }}>โหมดสอบแก้ตัว (Re-test)</h3>
                 <p style={{ margin: 0, fontSize: '12px' }}>หัวข้อ: {targetSubDomain}</p>
              </div>
            )}

            <div className="text-center" style={{ paddingBottom: '6px' }}>
              <button className="btn btn-navy" onClick={startAssessment}>
                <Play className="w-4 h-4" /> เริ่มทำแบบทดสอบ
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // QUIZ IN PROGRESS SCREEN
  if (!currentQuestion) {
    return (
      <div className="main-inner enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p className="font-bold muted">กำลังประมวลผลข้อสอบ...</p>
      </div>
    );
  }

  const maxQuestions = isRetest ? 10 : 20;
  const activeState = selectedEngine === 'rule-based' ? engineState : irtEngineState;
  const currentIndex = activeState.questionIndex;

  return (
    <div className="main-inner enter flex flex-col h-auto md:h-[calc(100vh-40px)] min-h-[600px] mb-20 md:mb-0">
      <section className="win" id="screen-quiz" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div className="win-bar shrink-0">
          <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
          <div className="win-title"><em>&lt;/&gt;</em> assessment.html</div>
          <div className="win-actions">
            <span className="chip chip-green mono"><Clock className="w-3 h-3" /><span id="timerLabel">{formatTime(totalTimerSeconds)}</span></span>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Sidebar Grid */}
          <aside className="hidden md:block w-[220px] shrink-0 border-r border-line p-5 bg-soft overflow-y-auto">
            <div className="flex items-center gap-2 text-[12.5px] font-bold mb-3.5">
              <Grid className="w-3.5 h-3.5 text-theme-blue" />สถานะข้อสอบ
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: maxQuestions }).map((_, idx) => {
                const isCur = idx === currentIndex;
                const isDone = idx < currentIndex;
                const bg = isCur ? 'var(--blue)' : isDone ? 'var(--line)' : 'var(--white)';
                const color = isCur ? '#fff' : isDone ? 'var(--muted)' : 'var(--faint)';
                const border = !isCur && !isDone ? '1px solid var(--line)' : 'none';
                
                return (
                  <div key={idx} style={{ aspectRatio: '1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, background: bg, color: color, border: border }}>
                    {idx + 1}
                  </div>
                );
              })}
            </div>
            <div className="flex-col gap-2" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--line)', fontSize: '10.5px' }}>
              <div className="flex items-center gap-2"><span style={{ width: '11px', height: '11px', borderRadius: '3px', background: 'var(--blue)', display: 'inline-block' }}></span>ข้อปัจจุบัน</div>
              <div className="flex items-center gap-2"><span style={{ width: '11px', height: '11px', borderRadius: '3px', background: 'var(--line)', display: 'inline-block' }}></span>ตอบแล้ว</div>
              <div className="flex items-center gap-2"><span style={{ width: '11px', height: '11px', borderRadius: '3px', border: '1px solid var(--line)', display: 'inline-block' }}></span>ยังไม่ถึง</div>
            </div>
            <div style={{ marginTop: '18px', padding: '12px', background: 'var(--blue-dim)', borderRadius: '12px' }}>
              <b style={{ fontSize: '11px', color: 'var(--blue)', display: 'block', marginBottom: '4px' }}>Adaptive Mode Active</b>
              <p style={{ margin: 0, fontSize: '10px', color: 'var(--blue)', lineHeight: 1.6, opacity: .85 }}>ระบบปรับระดับความยากของคำถามถัดไปตามความสามารถของคุณโดยอัตโนมัติ</p>
            </div>
          </aside>

          {/* Question Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div className="flex items-center justify-between" style={{ padding: '16px 26px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
              <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>ข้อที่ {currentIndex + 1}</h2>
              <span className="chip chip-line mono">รหัส: {currentQuestion.id}</span>
            </div>

            <div style={{ padding: '26px', flex: 1, overflowY: 'auto' }}>
              <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '15.5px', fontWeight: 500, lineHeight: 1.7, margin: '0 0 18px' }}>
                  {currentQuestion.question_text}
                </h3>

                {currentQuestion.code_snippet && (
                  <div style={{ background: 'var(--code-bg)', borderRadius: '12px', padding: '16px 18px', marginBottom: '20px' }}>
                    <pre className="mono" style={{ margin: 0, fontSize: '12px', color: '#c9d4e8', lineHeight: 1.7 }}>
                      {currentQuestion.code_snippet}
                    </pre>
                  </div>
                )}

                <div className="flex-col gap-3" style={{ display: 'flex' }}>
                  {(['A', 'B', 'C', 'D'] as const).map((key) => {
                    const choiceText = currentQuestion.choices[key];
                    if (!choiceText) return null;

                    const isSelected = selectedOption === key;
                    const isCorrect = key === currentQuestion.correct_option;
                    
                    let bg = 'transparent';
                    let borderColor = 'var(--line)';
                    let radioBg = 'transparent';
                    
                    if (hasSubmittedAnswer) {
                      if (isCorrect) {
                        bg = 'var(--green-dim)';
                        borderColor = 'var(--green)';
                        radioBg = 'var(--green)';
                      } else if (isSelected) {
                        bg = 'var(--red-dim)';
                        borderColor = 'var(--red)';
                        radioBg = 'var(--red)';
                      }
                    } else if (isSelected) {
                      bg = 'var(--blue-dim)';
                      borderColor = 'var(--blue)';
                    }

                    return (
                      <div 
                        key={key} 
                        onClick={() => handleSelectOption(key)}
                        style={{ 
                          display: 'flex', gap: '14px', padding: '15px 16px', borderRadius: '14px', 
                          border: `2px solid ${borderColor}`, background: bg, cursor: hasSubmittedAnswer ? 'default' : 'pointer',
                          opacity: (hasSubmittedAnswer && !isCorrect && !isSelected) ? 0.5 : 1
                        }}
                      >
                        <span style={{ 
                          width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${borderColor}`, 
                          background: radioBg, flexShrink: 0, marginTop: '1px' 
                        }}></span>
                        <span style={{ fontSize: '13px', fontWeight: (hasSubmittedAnswer && isCorrect) ? 700 : 400, color: (hasSubmittedAnswer && isCorrect) ? 'var(--green)' : 'inherit' }}>
                          {choiceText}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {hasSubmittedAnswer && currentQuestion.explanation && (
                  <div style={{ marginTop: '20px', padding: '16px 18px', background: 'var(--blue-dim)', borderRadius: '14px' }}>
                    <div className="flex gap-3">
                      <Info style={{ width: '18px', height: '18px', color: 'var(--blue)', flexShrink: 0, marginTop: '1px' }} />
                      <div>
                        <b style={{ fontSize: '12.5px', display: 'block', marginBottom: '4px' }}>คำอธิบาย</b>
                        <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.7 }}>
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-[16px_26px] border-t border-line shrink-0 gap-3 sm:gap-0">
              <span className="muted text-[11.5px]">
                {hasSubmittedAnswer ? 'บันทึกคำตอบแล้ว — กำลังเตรียมข้อถัดไป...' : 'เลือกคำตอบที่ถูกต้องที่สุด'}
              </span>
              <button 
                className="btn btn-navy w-full sm:w-auto justify-center" 
                onClick={handleSubmitQuestion} 
                disabled={!selectedOption || hasSubmittedAnswer}
              >
                {!hasSubmittedAnswer && (
                  <>ยืนยันคำตอบ <ArrowRight style={{ width: '14px', height: '14px' }} /></>
                )}
              </button>
            </div>
          </div>
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
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-bold muted">Loading...</p>
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
