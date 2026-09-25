'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Question, SubDomainCode, Attempt, TestSession, SUB_DOMAINS } from '@/types/database';
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
  IRTEngineState,
} from '@/lib/irt/engine-adapter';
import {
  getQuestions,
  saveTestSession,
  saveStudentProgress,
  subscribeToDatabase,
} from '@/lib/database-service';
import { getFixedPretestQuestions } from '@/lib/pretest';
import {
  normalizeUnit,
  isStepUnlocked,
  setUnitStepCompleted,
  getStepUrl,
  isCourseStepUnlocked,
  setCourseStepCompleted,
} from '@/lib/progress-service';
import { UnitPathStepper } from '@/components/UnitPathStepper';
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
  Check,
  Lock,
  Terminal,
  Trophy,
} from 'lucide-react';
import { SystemPrinciplesModal } from '@/components/modals/SystemPrinciplesModal';

function AssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Route & Unit parameters
  const rawType = searchParams.get('type');
  const unitParam = searchParams.get('unit') || searchParams.get('subdomain');
  const { unitId, subDomain } = normalizeUnit(unitParam);
  const isRetest = rawType === 're_test';

  const { profile, auditLog } = useAuth();

  // Test mode selection
  const [selectedTestType, setSelectedTestType] = useState<'pre_test' | 'post_test' | 're_test'>(
    rawType === 'post_test' ? 'post_test' : isRetest ? 're_test' : 'pre_test'
  );
  const [selectedEngine, setSelectedEngine] = useState<'rule-based' | 'irt-3pl'>('irt-3pl');

  // Dynamic question bank
  const [questionsPool, setQuestionsPool] = useState<Question[]>([]);

  useEffect(() => {
    setQuestionsPool(getQuestions());
    const unsubscribe = subscribeToDatabase((event) => {
      if (event.type === 'question' || event.type === 'reset') {
        setQuestionsPool(getQuestions());
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (rawType === 'pre_test') {
      setSelectedTestType('pre_test');
    } else if (rawType === 'post_test') {
      setSelectedTestType('post_test');
    }
  }, [rawType]);

  // Adaptive Engine States (Used strictly for post_test and re_test)
  const [engineState, setEngineState] = useState<AdaptiveEngineState>(() =>
    createInitialAdaptiveState(subDomain)
  );
  const [irtEngineState, setIrtEngineState] = useState<IRTEngineState>(() =>
    createInitialIRTState(subDomain)
  );

  // Fixed Pre-test States (Strictly fixed 5 questions, not adaptive)
  const [pretestQuestions, setPretestQuestions] = useState<Question[]>([]);
  const [pretestIndex, setPretestIndex] = useState(0);
  const [pretestAttempts, setPretestAttempts] = useState<Attempt[]>([]);

  // Runtime Question & UI States
  const [hasStarted, setHasStarted] = useState(false);
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

  // Gating Check: Post-test is locked until Quest is completed
  const isPosttestGated = selectedTestType === 'post_test' && !isCourseStepUnlocked('posttest');

  const startAssessment = () => {
    setHasStarted(true);
    const pool = questionsPool.length > 0 ? questionsPool : getQuestions();

    if (selectedTestType === 'pre_test') {
      // 1) FIXED PRE-TEST: 20 fixed questions from official curriculum covering all topics
      const fixedQ = getFixedPretestQuestions(null, pool);
      setPretestQuestions(fixedQ);
      setPretestIndex(0);
      setPretestAttempts([]);
      setCurrentQuestion(fixedQ[0] || null);
    } else {
      // 2) ADAPTIVE POST-TEST / RE-TEST: Adaptive engine
      let q: Question | null = null;
      if (selectedEngine === 'rule-based') {
        q = getNextAdaptiveQuestion(engineState, pool);
      } else {
        q = getNextIRTQuestion(irtEngineState, pool);
      }
      setCurrentQuestion(q);
    }

    auditLog('start_assessment', 'test_session', {
      testType: selectedTestType,
      engine: selectedEngine,
      targetSubDomain: subDomain,
      unitId,
    });
  };

  const handleSelectOption = (optionKey: string) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(optionKey);
  };

  const handleSubmitQuestion = () => {
    if (!selectedOption || !currentQuestion) return;

    setHasSubmittedAnswer(true);
    const isCorrect = selectedOption === currentQuestion.correct_option;

    // --- 1) Handle Fixed Pre-test ---
    if (selectedTestType === 'pre_test') {
      const attempt: Attempt = {
        id: `att-pre-${Date.now()}`,
        session_id: `sess-pre-${unitId}`,
        question_id: currentQuestion.id,
        answer: selectedOption,
        correct: isCorrect,
        response_time: timerSeconds,
        sequence: pretestIndex + 1,
        sub_domain_code: currentQuestion.sub_domain_code,
        difficulty: currentQuestion.difficulty,
        created_at: new Date().toISOString(),
      };

      const updatedAttempts = [...pretestAttempts, attempt];
      setPretestAttempts(updatedAttempts);

      setTimeout(() => {
        const nextIdx = pretestIndex + 1;
        if (nextIdx >= pretestQuestions.length) {
          finishPretest(updatedAttempts);
        } else {
          setPretestIndex(nextIdx);
          setCurrentQuestion(pretestQuestions[nextIdx]);
          setSelectedOption(null);
          setHasSubmittedAnswer(false);
          setTimerSeconds(0);
        }
      }, 1800);
      return;
    }

    // --- 2) Handle Adaptive Post-test / Re-test ---
    const pool = questionsPool.length > 0 ? questionsPool : getQuestions();

    if (selectedEngine === 'rule-based') {
      const { newState } = recordAnswerAndUpdateState(
        engineState,
        currentQuestion,
        selectedOption,
        timerSeconds
      );
      setEngineState(newState);

      setTimeout(() => {
        const nextQ = getNextAdaptiveQuestion(newState, pool);
        if (!nextQ || newState.questionIndex >= (isRetest ? 10 : 20)) {
          finishAdaptiveTest(newState.attempts);
        } else {
          setCurrentQuestion(nextQ);
          setSelectedOption(null);
          setHasSubmittedAnswer(false);
          setTimerSeconds(0);
        }
      }, 2000);
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
        const nextQ = getNextIRTQuestion(newState, pool);
        if (!nextQ) {
          finishAdaptiveTest(newState.attempts);
        } else {
          setCurrentQuestion(nextQ);
          setSelectedOption(null);
          setHasSubmittedAnswer(false);
          setTimerSeconds(0);
        }
      }, 2000);
    }
  };

  // Completion: Fixed Pre-test
  const finishPretest = (finalAttempts: Attempt[]) => {
    setIsTestFinished(true);
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
    });

    const correctCount = finalAttempts.filter((a) => a.correct).length;
    const totalCount = finalAttempts.length;
    const scorePct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const completedSession: TestSession = {
      id: `sess-pre-${Date.now()}`,
      student_id: profile?.id || 'std-1',
      student_name: profile?.full_name || 'สมชาย รักการเรียน (นักเรียน ปวช.1)',
      test_type: 'pre_test',
      target_sub_domain: subDomain,
      status: 'completed',
      total_questions: totalCount,
      correct_count: correctCount,
      score_percentage: scorePct,
      start_at: new Date(Date.now() - totalCount * 15000).toISOString(),
      end_at: new Date().toISOString(),
      stop_reason: `ทำแบบทดสอบก่อนเรียน (Pre-test) ครบ ${totalCount} ข้อชุดคำถามคงที่`,
      attempts: finalAttempts,
    };

    try {
      saveTestSession(completedSession);
      // Unlock Step 2: Lessons
      setCourseStepCompleted('pretest', scorePct);
      setUnitStepCompleted('u-h1', 'pretest', scorePct);

      auditLog('complete_assessment', 'test_session', {
        testType: 'pre_test',
        totalAttempts: totalCount,
        correctCount,
        scorePercentage: scorePct,
      });
    } catch (e) {
      console.error('Error saving pre-test results:', e);
    }
  };

  // Completion: Adaptive Post-test / Re-test
  const finishAdaptiveTest = (finalAttempts: Attempt[]) => {
    setIsTestFinished(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    const newSkills = computeSkillProfiles(profile?.id || 'guest', finalAttempts);
    const correctCount = finalAttempts.filter((a) => a.correct).length;
    const totalCount = finalAttempts.length;
    const scorePct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const completedSession: TestSession = {
      id: `sess-post-${Date.now()}`,
      student_id: profile?.id || 'std-1',
      student_name: profile?.full_name || 'สมชาย รักการเรียน (นักเรียน ปวช.1)',
      test_type: selectedTestType,
      target_sub_domain: subDomain,
      status: 'completed',
      total_questions: totalCount,
      correct_count: correctCount,
      score_percentage: scorePct,
      start_at: new Date(Date.now() - totalCount * 20000).toISOString(),
      end_at: new Date().toISOString(),
      stop_reason:
        selectedEngine === 'irt-3pl'
          ? 'ยุติการทดสอบด้วยกฎของโมเดล IRT CAT'
          : isRetest
          ? 'ครบจำนวนข้อประเมินเฉพาะจุดประสงค์ Re-test (10 ข้อ)'
          : 'ครบเกณฑ์จำนวนข้อสอบสูงสุดตามแบบแผนความยาวคงที่',
      attempts: finalAttempts,
    };

    // Calculate sub-domain scores
    const subScores: Record<string, number> = { H1: 0, H2: 0, H3: 0, H4: 0, H5: 0 };
    const subTotals: Record<string, number> = { H1: 0, H2: 0, H3: 0, H4: 0, H5: 0 };

    finalAttempts.forEach((att) => {
      const code = att.sub_domain_code || 'H1';
      subTotals[code] = (subTotals[code] || 0) + 1;
      if (att.correct) {
        subScores[code] = (subScores[code] || 0) + 1;
      }
    });

    const finalDomainScores: Record<string, number> = {};
    (['H1', 'H2', 'H3', 'H4', 'H5'] as SubDomainCode[]).forEach((k) => {
      if (subTotals[k] && subTotals[k] > 0) {
        finalDomainScores[k] = Math.round((subScores[k] / subTotals[k]) * 100);
      } else {
        finalDomainScores[k] = scorePct;
      }
    });

    try {
      localStorage.setItem('webai_student_skills', JSON.stringify(newSkills));
      saveTestSession(completedSession);

      // Save student progress in teacher database
      saveStudentProgress({
        studentId: profile?.id || 'std-1',
        name: profile?.full_name || 'สมชาย รักการเรียน',
        scores: finalDomainScores,
        avgScore: scorePct,
        completion: 100,
        theta: selectedEngine === 'irt-3pl' ? irtEngineState.currentTheta : scorePct * 0.06 - 3,
        se: selectedEngine === 'irt-3pl' ? irtEngineState.standardError : 0.28,
      });

      if (selectedTestType === 'post_test') {
        // Unlock Step 5 Post-test completion
        setCourseStepCompleted('posttest', scorePct);
        setUnitStepCompleted('u-h1', 'posttest', scorePct);
      }

      if (selectedEngine === 'irt-3pl') {
        localStorage.setItem('webai_irt_theta', irtEngineState.currentTheta.toString());
        localStorage.setItem('webai_irt_se', irtEngineState.standardError.toString());
      }

      auditLog('complete_assessment', 'test_session', {
        totalAttempts: totalCount,
        correctCount,
        scorePercentage: scorePct,
      });
    } catch (e) {
      console.error('Error saving assessment results:', e);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- GATING INTERCEPT SCREEN ---
  if (isPosttestGated && !hasStarted && !isTestFinished) {
    return (
      <div className="main-inner enter max-w-[850px] mx-auto pt-6">
        <UnitPathStepper unitId={unitId} currentStep="posttest" />
        <div className="card p-8 sm:p-10 text-center border-amber-500/30 bg-amber-500/5 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink mb-2">
            ขั้นตอนที่ 5: แบบทดสอบหลังเรียนยังไม่ปลดล็อก
          </h2>
          <p className="text-sm text-muted mb-6 max-w-lg mx-auto leading-relaxed">
            ตามลำดับการเรียนรู้แบบต่อเนื่อง (Sequential Gating) คุณต้องทำภารกิจเขียนโค้ด (Code Lab) ในขั้นตอนที่ 4 ให้สำเร็จก่อน จึงจะสามารถทำแบบทดสอบหลังเรียนแบบปรับเหมาะ (Adaptive Post-test) ได้
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/student/quests" className="btn btn-primary">
              <Terminal className="w-4 h-4 mr-1.5" />
              <span>ไปทำภารกิจเขียนโค้ด (Step 4: Quests) &rarr;</span>
            </Link>
            <Link href="/student/lessons" className="btn btn-ghost">
              <span>กลับไปหน้าบทเรียน</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULT SCREEN ---
  if (isTestFinished) {
    const isPretest = selectedTestType === 'pre_test';
    const finalAttempts = isPretest
      ? pretestAttempts
      : (selectedEngine === 'rule-based' ? engineState : irtEngineState).attempts;
    const correctCount = finalAttempts.filter((a) => a.correct).length;
    const totalCount = finalAttempts.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const theta = selectedEngine === 'irt-3pl' ? irtEngineState.currentTheta.toFixed(2) : (percentage / 100).toFixed(2);
    const se = selectedEngine === 'irt-3pl' ? irtEngineState.standardError.toFixed(2) : 'N/A';

    return (
      <div className="main-inner enter max-w-[850px] mx-auto pt-4">
        {/* Unit Stepper */}
        <UnitPathStepper unitId={unitId} currentStep={isPretest ? 'pretest' : 'posttest'} />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success-dim text-success mb-3 shadow-md shadow-success/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink mb-1">
            {isPretest ? 'ทำแบบทดสอบก่อนเรียนสำเร็จ!' : 'ประเมินผลเสร็จสิ้น (Post-test)'}
          </h1>
          <p className="text-sm text-muted">
            {isPretest
              ? 'ระบบได้บันทึกคะแนนก่อนเรียนและปลดล็อกเนื้อหาบทเรียนให้คุณเรียบร้อยแล้ว'
              : 'ยินดีด้วย! คุณเรียนรู้และผ่านการประเมินหน่วยนี้ครบทั้ง 6 ขั้นตอนแล้ว'}
          </p>
        </div>

        {/* Score Summary Card */}
        <div className="card p-6 mb-6 border-line bg-surface">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-muted uppercase">คะแนนที่ได้</div>
              <div className="text-3xl font-black text-ink">
                {correctCount} / {totalCount} ข้อ{' '}
                <span className="text-sm font-normal text-primary">({percentage}%)</span>
              </div>
            </div>

            {isPretest ? (
              <div className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-xs font-bold">
                ✓ ปลดล็อกขั้นตอนที่ 2: บทเรียน (Lesson) แล้ว
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                👑 ผ่านหน่วยการเรียนรู้นี้ครบ 6/6 ขั้นตอนแล้ว
              </div>
            )}
          </div>
        </div>

        {/* Post-test specific: IRT Diagnosis */}
        {!isPretest && (
          <section className="win mb-6">
            <div className="win-bar">
              <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
              <div className="win-title"><em>&lt;/&gt;</em> learning_profile.json</div>
            </div>
            <div className="win-body grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-bg-base">
              <div className="card p-4 border-primary">
                <div className="text-[10px] text-muted font-bold uppercase mb-1">ระดับความสามารถรวม (θ)</div>
                <div className="text-3xl font-black text-ink mb-1">{theta}</div>
                <div className="text-xs text-muted">SE: {se}</div>
              </div>
              <div className="card p-4 border-line">
                <div className="text-[10px] text-muted font-bold uppercase mb-2">การวิเคราะห์ทักษะ ({subDomain})</div>
                <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> มีความเข้าใจในระดับดี ({percentage}%)
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sequential Next Step CTA Banner */}
        <div className="card p-6 border-l-4 border-l-primary bg-primary/5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-0.5">
              {isPretest ? 'ขั้นตอนถัดไปในลำดับการเรียนรู้ (Step 2)' : 'เสร็จสิ้นการประเมิน'}
            </div>
            <h3 className="text-base font-bold text-ink mb-1">
              {isPretest ? 'เข้าสู่บทเรียน HTML' : 'กลับสู่เส้นทางการเรียนรู้'}
            </h3>
            <p className="text-xs text-muted">
              {isPretest
                ? 'เริ่มศึกษาเนื้อหาบทเรียน 5 เรื่องย่อยพร้อมทำแบบฝึกหัดท้ายหน่วยตามลำดับ'
                : 'ยินดีด้วย! คุณผ่านการประเมินทักษะของหลักสูตรโครงสร้างภาษา HTML เรียบร้อยแล้ว'}
            </p>
          </div>

          <Link
            href={isPretest ? '/student/lessons' : '/student'}
            className="btn btn-primary whitespace-nowrap text-xs font-bold"
          >
            <span>{isPretest ? 'เข้าสู่บทเรียน HTML (Step 2) &rarr;' : 'กลับหน้าแดชบอร์ด &rarr;'}</span>
          </Link>
        </div>
      </div>
    );
  }

  // --- LOBBY SCREEN ---
  if (!hasStarted) {
    const isPretest = selectedTestType === 'pre_test';

    return (
      <div className="main-inner enter max-w-[850px] mx-auto pt-4">
        {/* Unit Stepper */}
        <UnitPathStepper unitId={unitId} currentStep={isPretest ? 'pretest' : 'posttest'} />

        <section className="win" id="screen-lobby">
          <div className="win-bar">
            <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
            <div className="win-title"><em>&lt;/&gt;</em> {isPretest ? 'pretest.html' : 'posttest.html'}</div>
          </div>
          <div className="win-body p-6 sm:p-8">
            <div className="max-w-xl mx-auto text-center pb-2">
              <div className="inline-flex p-3.5 rounded-2xl bg-primary/10 text-primary mb-3">
                {isPretest ? <BookOpen className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-ink mb-1.5">
                {isPretest
                  ? 'แบบทดสอบก่อนเรียน (Pre-test) — เรื่อง โครงสร้างภาษา HTML'
                  : 'แบบทดสอบหลังเรียน (Post-test: Adaptive CAT) — เรื่อง โครงสร้างภาษา HTML'}
              </h1>
              <p className="text-xs sm:text-sm text-muted mb-6">
                {isPretest
                  ? 'ชุดคำถามคงที่ 20 ข้อ (ครอบคลุมเนื้อหาภาพรวมทุกหน่วย) เพื่อประเมินความรู้พื้นฐานก่อนเข้าสู่บทเรียน ไม่ปรับระดับความยาก'
                  : 'ระบบจะปรับระดับความยากของคำถามให้เหมาะสมกับความสามารถของคุณแบบเรียลไทม์ (Adaptive CAT) ครอบคลุมทุกหน่วยการเรียนรู้'}
              </p>
            </div>

            {/* Instruction Card */}
            <div className="card p-5 max-w-xl mx-auto mb-6 border-line bg-surface/70 space-y-3 text-xs leading-relaxed">
              <div className="font-bold text-ink flex items-center gap-2 text-sm border-b border-line pb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>คำชี้แจงในการทำแบบทดสอบ</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <p className="m-0">
                  {isPretest
                    ? 'แบบทดสอบชุดนี้มีจำนวน 20 ข้อ (ครอบคลุมภาพรวมเนื้อหาทุกเรื่อง) เป็นชุดคำถามคงที่'
                    : 'แบบทดสอบเป็นแบบปรับเหมาะ (Adaptive) ความยากจะปรับขึ้น/ลงตามคำตอบ'}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <p className="m-0">เมื่อเลือกคำตอบและกดยืนยันแล้ว จะไม่สามารถย้อนกลับมาแก้ไขได้</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <p className="m-0">
                  {isPretest
                    ? 'เมื่อทำเสร็จสิ้น ระบบจะปลดล็อกเนื้อหาบทเรียน HTML ทั้งหมดให้โดยอัตโนมัติ'
                    : 'เมื่อทำเสร็จสิ้น ระบบจะวิเคราะห์ระดับความสามารถ (Theta) รายบุคคล'}
                </p>
              </div>
            </div>

            {/* Post-test engine selector (only shown for post_test/re_test) */}
            {!isPretest && (
              <div className="max-w-xl mx-auto mb-6 p-4 rounded-xl border border-line bg-bg-base">
                <label className="block text-xs font-bold text-ink mb-1.5">
                  โมเดลประมวลผล Adaptive
                </label>
                <select
                  value={selectedEngine}
                  onChange={(e) => setSelectedEngine(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-xs font-semibold"
                >
                  <option value="irt-3pl">โมเดล Item Response Theory 3PL (CAT - แนะนำ)</option>
                  <option value="rule-based">โมเดล Rule-based Stepwise</option>
                </select>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                onClick={startAssessment}
                className="btn btn-primary px-8 py-3 text-sm font-bold shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 mr-1.5" />
                <span>เริ่มทำแบบทดสอบทันที</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // --- QUESTION IN PROGRESS SCREEN ---
  if (!currentQuestion) {
    return (
      <div className="main-inner enter flex items-center justify-center min-h-[60vh]">
        <p className="font-bold text-muted animate-pulse">กำลังประมวลผลข้อสอบ...</p>
      </div>
    );
  }

  const isPretest = selectedTestType === 'pre_test';
  const maxQuestions = isPretest ? 5 : isRetest ? 10 : 20;
  const currentIndex = isPretest
    ? pretestIndex
    : (selectedEngine === 'rule-based' ? engineState : irtEngineState).questionIndex;

  return (
    <div className="main-inner enter flex flex-col h-auto md:h-[calc(100vh-40px)] min-h-[600px] mb-20 md:mb-0">
      {/* Unit Stepper */}
      <UnitPathStepper unitId={unitId} currentStep={isPretest ? 'pretest' : 'posttest'} />

      <section className="win flex-1 flex flex-col min-h-0" id="screen-quiz">
        <div className="win-bar shrink-0">
          <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
          <div className="win-title">
            <em>&lt;/&gt;</em> {isPretest ? `pretest-${subDomain.toLowerCase()}.html` : 'assessment.html'}
          </div>
          <div className="win-actions">
            <span className="chip chip-green mono">
              <Clock className="w-3 h-3" />
              <span>{formatTime(totalTimerSeconds)}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar Grid */}
          <aside className="hidden md:block w-[220px] shrink-0 border-r border-line p-5 bg-surface/50 overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-bold mb-3.5 text-ink">
              <Grid className="w-3.5 h-3.5 text-primary" />
              <span>{isPretest ? 'ข้อสอบคงที่ (5 ข้อ)' : 'สถานะข้อสอบ CAT'}</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: maxQuestions }).map((_, idx) => {
                const isCur = idx === currentIndex;
                const isDone = idx < currentIndex;
                const bg = isCur ? 'var(--blue)' : isDone ? 'var(--line)' : 'transparent';
                const color = isCur ? '#fff' : isDone ? 'var(--muted)' : 'var(--muted)';
                const border = !isCur && !isDone ? '1px solid var(--line)' : 'none';

                return (
                  <div
                    key={idx}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: bg,
                      color,
                      border,
                    }}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-line text-[11px] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block"></span>
                <span>ข้อปัจจุบัน</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-line inline-block"></span>
                <span>ตอบแล้ว</span>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs">
              <b className="text-primary block mb-1">
                {isPretest ? 'แบบทดสอบก่อนเรียน' : 'ระบบปรับเหมาะกำลังทำงาน'}
              </b>
              <p className="text-[10px] text-muted m-0 leading-relaxed">
                {isPretest
                  ? 'ชุดข้อสอบคงที่ 5 ข้อ ไม่มีการปรับระดับความยากตามคำตอบ'
                  : 'ระบบปรับระดับความยากของคำถามถัดไปตามความสามารถของคุณโดยอัตโนมัติ'}
              </p>
            </div>
          </aside>

          {/* Question Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted uppercase">ข้อที่</span>
                <span className="text-base font-black text-ink">{currentIndex + 1} / {maxQuestions}</span>
              </div>
              <span className="chip chip-line mono text-xs">{currentQuestion.sub_domain_code}</span>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-5">
                <h3 className="text-base sm:text-lg font-semibold text-ink leading-relaxed">
                  {currentQuestion.question_text}
                </h3>

                {currentQuestion.code_snippet && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-line overflow-x-auto">
                    <pre className="font-mono text-xs text-indigo-300 leading-relaxed m-0">
                      {currentQuestion.code_snippet}
                    </pre>
                  </div>
                )}

                {/* Choices */}
                <div className="space-y-3 pt-2">
                  {(['A', 'B', 'C', 'D'] as const).map((key) => {
                    const choiceText = currentQuestion.choices[key];
                    if (!choiceText) return null;

                    const isSelected = selectedOption === key;
                    const isCorrect = key === currentQuestion.correct_option;

                    let borderClass = 'border-line hover:border-primary/50';
                    let bgClass = 'bg-surface';
                    let radioClass = 'border-line text-transparent';

                    if (hasSubmittedAnswer) {
                      if (isCorrect) {
                        borderClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200';
                        radioClass = 'border-emerald-500 bg-emerald-500 text-white';
                      } else if (isSelected) {
                        borderClass = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200';
                        radioClass = 'border-rose-500 bg-rose-500 text-white';
                      }
                    } else if (isSelected) {
                      borderClass = 'border-primary bg-primary/10';
                      radioClass = 'border-primary bg-primary text-white';
                    }

                    return (
                      <div
                        key={key}
                        onClick={() => handleSelectOption(key)}
                        className={`flex items-center gap-3.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${borderClass} ${bgClass}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold font-mono text-xs shrink-0 ${radioClass}`}
                        >
                          {key}
                        </span>
                        <span className="text-sm font-medium leading-relaxed">{choiceText}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Feedback Explanation after answer */}
                {hasSubmittedAnswer && currentQuestion.explanation && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs space-y-1 animate-in fade-in">
                    <div className="font-bold text-primary flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>คำอธิบายเฉลย</span>
                    </div>
                    <p className="m-0 text-muted leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="px-6 py-4 border-t border-line flex items-center justify-between shrink-0 bg-surface/50">
              <span className="text-xs text-muted">
                {selectedOption ? 'เลือกคำตอบแล้ว กดยืนยันคำตอบ' : 'โปรดเลือกคำตอบหนึ่งตัวเลือก'}
              </span>

              <button
                onClick={handleSubmitQuestion}
                disabled={!selectedOption || hasSubmittedAnswer}
                className="btn btn-primary px-6 py-2.5 text-xs font-bold shadow-xs disabled:opacity-40 cursor-pointer"
              >
                <span>{hasSubmittedAnswer ? 'กำลังตรวจคำตอบ...' : 'ยืนยันคำตอบ &rarr;'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] text-muted">
          กำลังโหลดแบบทดสอบ...
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
