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
import {
  Clock,
  ArrowRight,
  ArrowLeft,
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
  X,
  Lock,
  Terminal,
  Trophy,
  Sparkles,
  HelpCircle,
  RotateCcw,
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

  // Fixed Pre-test States (Strictly fixed 20 questions, not adaptive)
  const [pretestQuestions, setPretestQuestions] = useState<Question[]>([]);
  const [pretestIndex, setPretestIndex] = useState(0);
  const [pretestAttempts, setPretestAttempts] = useState<Attempt[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Question[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  // Runtime Question & UI States
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
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

  // Exam Anti-Cheat Guard: Track active exam in storage to lock AI
  useEffect(() => {
    if (!hasStarted || isTestFinished) {
      localStorage.removeItem('webai_active_exam');
      window.dispatchEvent(new Event('webai_exam_status'));
    }
  }, [hasStarted, isTestFinished]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasStarted && !isTestFinished) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasStarted, isTestFinished]);

  // Gating Check: Post-test is locked until Quest is completed
  const isPosttestGated = selectedTestType === 'post_test' && !isCourseStepUnlocked('posttest');

  const startAssessment = () => {
    setHasStarted(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('webai_active_exam', 'true');
      window.dispatchEvent(new Event('webai_exam_status'));
    }
    const pool = questionsPool.length > 0 ? questionsPool : getQuestions();

    if (selectedTestType === 'pre_test') {
      // 1) FIXED PRE-TEST: 20 fixed questions from official curriculum covering all topics
      const fixedQ = getFixedPretestQuestions(null, pool);
      setPretestQuestions(fixedQ);
      setPretestIndex(0);
      setPretestAttempts([]);
      setUserAnswers({});
      setCompletedQuestions([]);
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
      setCompletedQuestions(q ? [q] : []);
    }

    auditLog('start_assessment', 'test_session', {
      testType: selectedTestType,
      engine: selectedEngine,
      targetSubDomain: subDomain,
      unitId,
    });
  };

  const handleSelectOption = (optionKey: string) => {
    if (selectedTestType === 'pre_test') {
      setUserAnswers((prev) => ({
        ...prev,
        [pretestIndex]: optionKey,
      }));
    } else {
      setSelectedOption(optionKey);
    }
  };

  const handleJumpToQuestion = (targetIdx: number) => {
    if (selectedTestType === 'pre_test') {
      if (targetIdx >= 0 && targetIdx < pretestQuestions.length) {
        setPretestIndex(targetIdx);
        setCurrentQuestion(pretestQuestions[targetIdx]);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (selectedTestType === 'pre_test') {
      const prevIdx = pretestIndex - 1;
      if (prevIdx >= 0) {
        setPretestIndex(prevIdx);
        setCurrentQuestion(pretestQuestions[prevIdx]);
      }
    }
  };

  const handleNextQuestion = () => {
    if (selectedTestType === 'pre_test') {
      const nextIdx = pretestIndex + 1;
      if (nextIdx < pretestQuestions.length) {
        setPretestIndex(nextIdx);
        setCurrentQuestion(pretestQuestions[nextIdx]);
      } else {
        setShowConfirmModal(true);
      }
    } else {
      handleSubmitAdaptiveQuestion();
    }
  };

  // Submit fixed Pre-test (All answers recorded, now evaluate)
  const executeSubmitPretest = () => {
    setShowConfirmModal(false);
    const finalAttempts: Attempt[] = pretestQuestions.map((q, idx) => {
      const chosen = userAnswers[idx] || '';
      const isCorrect = chosen === q.correct_option;
      return {
        id: `att-pre-${idx}-${Date.now()}`,
        session_id: `sess-pre-${unitId}`,
        question_id: q.id,
        answer: chosen,
        correct: isCorrect,
        response_time: 15,
        sequence: idx + 1,
        sub_domain_code: q.sub_domain_code,
        difficulty: q.difficulty,
        created_at: new Date().toISOString(),
      };
    });

    setPretestAttempts(finalAttempts);
    setCompletedQuestions(pretestQuestions);
    finishPretest(finalAttempts);
  };

  // Submit Adaptive Post-test / Re-test
  const handleSubmitAdaptiveQuestion = () => {
    if (!selectedOption || !currentQuestion) return;

    const pool = questionsPool.length > 0 ? questionsPool : getQuestions();

    if (selectedEngine === 'rule-based') {
      const { newState } = recordAnswerAndUpdateState(
        engineState,
        currentQuestion,
        selectedOption,
        timerSeconds
      );
      setEngineState(newState);

      const nextQ = getNextAdaptiveQuestion(newState, pool);
      if (!nextQ || newState.questionIndex >= (isRetest ? 10 : 20)) {
        finishAdaptiveTest(newState.attempts);
      } else {
        setCompletedQuestions((prev) => [...prev, nextQ]);
        setCurrentQuestion(nextQ);
        setSelectedOption(null);
        setTimerSeconds(0);
      }
    } else {
      // IRT 3PL Engine
      const { newState } = recordIRTAnswerAndUpdateState(
        irtEngineState,
        currentQuestion,
        selectedOption,
        timerSeconds
      );
      setIrtEngineState(newState);

      const nextQ = getNextIRTQuestion(newState, pool);
      if (!nextQ) {
        finishAdaptiveTest(newState.attempts);
      } else {
        setCompletedQuestions((prev) => [...prev, nextQ]);
        setCurrentQuestion(nextQ);
        setSelectedOption(null);
        setTimerSeconds(0);
      }
    }
  };

  // Keyboard shortcut: Left/Right arrows or Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted || isTestFinished || showConfirmModal) return;

      if (e.key === 'ArrowRight') {
        handleNextQuestion();
      } else if (e.key === 'ArrowLeft') {
        handlePrevQuestion();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    hasStarted,
    isTestFinished,
    showConfirmModal,
    pretestIndex,
    pretestQuestions,
    selectedOption,
    currentQuestion,
    selectedTestType,
  ]);

  // Completion: Fixed Pre-test
  const finishPretest = (finalAttempts: Attempt[]) => {
    setIsTestFinished(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('webai_active_exam');
      window.dispatchEvent(new Event('webai_exam_status'));
    }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('webai_active_exam');
      window.dispatchEvent(new Event('webai_exam_status'));
    }
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
      <div className="main-inner enter w-full max-w-4xl mx-auto pt-6">
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
              <span>ไปทำภารกิจเขียนโค้ด (Step 4: Quests) ➔</span>
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

    const theta =
      selectedEngine === 'irt-3pl'
        ? irtEngineState.currentTheta.toFixed(2)
        : (percentage / 100).toFixed(2);
    const se = selectedEngine === 'irt-3pl' ? irtEngineState.standardError.toFixed(2) : 'N/A';

    const questionsToReview =
      completedQuestions.length > 0
        ? completedQuestions
        : isPretest
        ? pretestQuestions
        : [];

    const filteredQuestions = questionsToReview
      .map((q, idx) => {
        const attempt = finalAttempts.find((a) => a.question_id === q.id) || finalAttempts[idx];
        const isCorrect = attempt?.correct ?? false;
        const isAnswered = !!attempt?.answer && attempt.answer.trim().length > 0;
        return {
          question: q,
          attempt,
          index: idx,
          isCorrect,
          isAnswered,
        };
      })
      .filter((item) => {
        if (reviewFilter === 'correct') return item.isCorrect;
        if (reviewFilter === 'incorrect') return !item.isCorrect;
        return true;
      });

    return (
      <div className="main-inner enter w-full max-w-5xl mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success-dim text-success mb-3 shadow-md shadow-success/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink mb-1">
            {isPretest ? 'สรุปคะแนนแบบทดสอบก่อนเรียน (Pre-test)' : 'ประเมินผลเสร็จสิ้น (Post-test)'}
          </h1>
          <p className="text-sm text-muted">
            {isPretest
              ? 'ระบบได้บันทึกคะแนนก่อนเรียนและปลดล็อกเนื้อหาบทเรียนให้เรียบร้อยแล้ว ตรวจสอบเฉลยละเอียดได้ด้านล่าง'
              : 'ยินดีด้วย! คุณเรียนรู้และผ่านการประเมินหน่วยนี้ครบทั้ง 6 ขั้นตอนแล้ว'}
          </p>
        </div>

        {/* Score Summary Card */}
        <div className="card p-6 border-line bg-surface shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-muted uppercase">สรุปคะแนนที่ได้</div>
              <div className="text-3xl sm:text-4xl font-black text-ink mt-0.5">
                {correctCount} / {totalCount} ข้อ{' '}
                <span className="text-base sm:text-lg font-bold text-primary">({percentage}%)</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-muted" />
                  เวลาที่ใช้: {formatTime(totalTimerSeconds)}
                </span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ตอบถูก {correctCount} ข้อ
                </span>
                <span>•</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">
                  ตอบผิด {totalCount - correctCount} ข้อ
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              {isPretest ? (
                <div className="px-4 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>✓ ปลดล็อกขั้นตอนที่ 2: บทเรียน HTML แล้ว</span>
                </div>
              ) : (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>👑 ผ่านหน่วยการเรียนรู้นี้ครบ 6/6 ขั้นตอนแล้ว</span>
                </div>
              )}

              <Link
                href={isPretest ? '/student/lessons' : '/student'}
                className="btn btn-primary text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <span>{isPretest ? 'เข้าสู่บทเรียน HTML (Step 2)' : 'กลับสู่แดชบอร์ด'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Post-test specific: IRT Diagnosis */}
        {!isPretest && (
          <section className="win">
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

        {/* Detailed Question Review & Explanations Section */}
        <div className="card p-5 sm:p-6 border-line bg-surface rounded-2xl shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
            <div>
              <h3 className="text-base sm:text-lg font-black text-ink flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>เฉลยคำตอบและคำอธิบายละเอียดรายข้อ</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                เปรียบเทียบคำตอบที่คุณบันทึกไว้กับคำตอบที่ถูกต้อง พร้อมคำอธิบายเฉลยเชิงวิชาการ
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-bg-base border border-line text-xs font-bold">
              <button
                type="button"
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  reviewFilter === 'all'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                ทั้งหมด ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('correct')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  reviewFilter === 'correct'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>ตอบถูก ({correctCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('incorrect')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  reviewFilter === 'incorrect'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>ตอบผิด ({totalCount - correctCount})</span>
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-10 text-muted">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-50" />
                <p className="font-bold text-sm">ไม่มีข้อสอบในหมวดที่เลือก</p>
              </div>
            ) : (
              filteredQuestions.map(({ question: q, attempt: att, index: idx, isCorrect, isAnswered }) => {
                const studentAns = att?.answer || '';
                const subDomainInfo = SUB_DOMAINS[q.sub_domain_code];

                return (
                  <div
                    key={q.id || idx}
                    className={`card p-4 sm:p-5 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                        : !isAnswered
                        ? 'border-amber-500/30 bg-amber-500/[0.02]'
                        : 'border-rose-500/30 bg-rose-500/[0.02]'
                    }`}
                  >
                    {/* Item Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-surface border border-line text-xs font-black text-ink">
                          ข้อที่ {idx + 1}
                        </span>
                        <span className="chip chip-line mono text-xs">
                          {q.sub_domain_code}: {subDomainInfo?.title || ''}
                        </span>
                      </div>

                      {/* Result Badge */}
                      {isCorrect ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>ตอบถูกต้อง (+1 คะแนน)</span>
                        </span>
                      ) : !isAnswered ? (
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>ไม่ได้ตอบ (0 คะแนน)</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5" />
                          <span>ตอบไม่ถูกต้อง (0 คะแนน)</span>
                        </span>
                      )}
                    </div>

                    {/* Question Text */}
                    <h4 className="text-sm sm:text-base font-bold text-ink mb-2 leading-relaxed">
                      {q.question_text}
                    </h4>

                    {/* Code Snippet */}
                    {q.code_snippet && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-line overflow-x-auto mb-3">
                        <pre className="font-mono text-xs text-indigo-300 leading-relaxed m-0">
                          {q.code_snippet}
                        </pre>
                      </div>
                    )}

                    {/* Choices Review */}
                    <div className="space-y-2 mt-3">
                      {(['A', 'B', 'C', 'D'] as const).map((key) => {
                        const choiceText = q.choices[key];
                        if (!choiceText) return null;

                        const isUserChoice = studentAns === key;
                        const isCorrectOption = q.correct_option === key;
                        const thaiLabel = key === 'A' ? 'ก' : key === 'B' ? 'ข' : key === 'C' ? 'ค' : 'ง';

                        let choiceBorder = 'border-line/60 bg-surface/60 opacity-80';
                        let badge = null;

                        if (isUserChoice && isCorrectOption) {
                          choiceBorder =
                            'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 font-bold opacity-100 shadow-xs';
                          badge = (
                            <span className="chip chip-green text-[10px] font-bold shrink-0">
                              ✓ คุณเลือกข้อนี้ (ถูกต้อง)
                            </span>
                          );
                        } else if (isUserChoice && !isCorrectOption) {
                          choiceBorder =
                            'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-100 font-bold opacity-100 shadow-xs';
                          badge = (
                            <span className="chip chip-red text-[10px] font-bold shrink-0">
                              ✗ คุณเลือกข้อนี้ (ผิด)
                            </span>
                          );
                        } else if (!isUserChoice && isCorrectOption) {
                          choiceBorder =
                            'border-emerald-500/80 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200 border-dashed font-semibold opacity-100';
                          badge = (
                            <span className="chip chip-green text-[10px] font-bold shrink-0">
                              ✓ คำตอบที่ถูกต้อง
                            </span>
                          );
                        }

                        return (
                          <div
                            key={key}
                            className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-xs sm:text-sm ${choiceBorder}`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-surface border border-line flex items-center justify-center font-bold text-[11px] shrink-0">
                                {thaiLabel}
                              </span>
                              <span className="truncate sm:whitespace-normal">{choiceText}</span>
                            </div>
                            {badge}
                          </div>
                        );
                      })}
                    </div>

                    {/* Detailed Explanation */}
                    {q.explanation && (
                      <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1 mt-3">
                        <div className="font-bold text-primary flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" />
                          <span>คำอธิบายเฉลย</span>
                        </div>
                        <p className="text-muted leading-relaxed m-0 text-xs sm:text-[13px]">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sequential Next Step CTA Banner */}
        <div className="card p-6 border-l-4 border-l-primary bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4">
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
            <span>{isPretest ? 'เข้าสู่บทเรียน HTML (Step 2) ➔' : 'กลับหน้าแดชบอร์ด ➔'}</span>
          </Link>
        </div>
      </div>
    );
  }

  // --- LOBBY SCREEN ---
  if (!hasStarted) {
    const isPretest = selectedTestType === 'pre_test';

    return (
      <div className="main-inner enter w-full h-[calc(100dvh-100px)] md:h-full max-h-full flex flex-col min-h-0 overflow-hidden">
        <section className="win w-full flex-1 flex flex-col min-h-0 rounded-[24px] shadow-xl border border-line bg-surface/90 overflow-hidden" id="screen-lobby">
          <div className="win-bar shrink-0 py-2.5 px-6 flex items-center justify-between border-b border-line bg-surface/80">
            <div className="win-dots flex items-center gap-2">
              <i className="r"></i><i className="y"></i><i className="g"></i>
            </div>
            <div className="win-title mono text-xs font-semibold">
              <em>&lt;/&gt;</em> {isPretest ? 'pretest-curriculum.html' : 'adaptive-cat-assessment.html'}
            </div>
            <div className="win-actions flex items-center gap-2">
              <span className="chip chip-line mono text-xs text-amber-500 border-amber-500/30 flex items-center gap-1.5 font-bold">
                <Lock className="w-3 h-3" />
                <span>AI Assistance: Locked</span>
              </span>
              <span className="chip chip-blue mono text-xs font-bold">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>{isPretest ? '20 ข้อ • บันทึกคำตอบและเฉลยหลังส่ง' : 'Adaptive CAT • หลังเรียน'}</span>
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 flex-1 overflow-y-auto w-full flex flex-col justify-center">
            <div className="max-w-3xl mx-auto w-full space-y-6">
              {/* Header Title Section */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  {isPretest ? <BookOpen className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  <span>การประเมินผลสัมฤทธิ์ • หน่วยที่ 3 งานสร้างหน้าเว็บด้วย HTML</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight">
                  {isPretest
                    ? 'แบบทดสอบก่อนเรียน (Pre-test)'
                    : 'แบบทดสอบหลังเรียน (Adaptive Post-test)'}
                </h1>

                <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-2xl mx-auto">
                  {isPretest
                    ? 'ชุดคำถามมาตรฐาน 20 ข้อ ครอบคลุมเนื้อหาภาพรวมทั้ง 5 เรื่องย่อย ระบบจะบันทึกคำตอบไว้ก่อน และเฉลยพร้อมสรุปผลคะแนนละเอียดเมื่อส่งข้อสอบเสร็จสิ้น'
                    : 'ระบบจะปรับระดับความยากของคำถามให้เหมาะสมกับความสามารถของคุณแบบเรียลไทม์ (Adaptive CAT ด้วยโมเดล IRT 3PL) เพื่อวัดระดับทักษะจริง'}
                </p>
              </div>

              {/* Instruction Card */}
              <div className="card p-5 sm:p-6 border-line bg-surface/80 rounded-2xl shadow-xs space-y-3.5">
                <div className="font-bold text-ink flex items-center gap-2 text-sm border-b border-line pb-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>คำชี้แจงและข้อกำหนดในการทำแบบทดสอบ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-line/60">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <b className="text-xs text-ink block mb-0.5">จำนวนข้อสอบ</b>
                      <p className="m-0 text-xs text-muted leading-relaxed">
                        {isPretest
                          ? 'ข้อสอบมีจำนวน 20 ข้อ ครอบคลุมเนื้อหาทั้ง 5 หน่วยการเรียนรู้'
                          : 'ข้อสอบแบบปรับเหมาะ ปรับตามคำตอบของผู้เรียน'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-line/60">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <b className="text-xs text-ink block mb-0.5">ย้อนกลับแก้ไขคำตอบได้</b>
                      <p className="m-0 text-xs text-muted leading-relaxed">
                        {isPretest
                          ? 'ระบบบันทึกคำตอบไว้ สามารถกดย้อนกลับหรือเลือกข้อเพื่อแก้ไขคำตอบได้ตลอดเวลาก่อนส่ง'
                          : 'ตอบคำถามตามลำดับการปรับเหมาะของระบบ'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-line/60">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      <b className="text-xs text-ink block mb-0.5">เฉลยและสรุปผลคะแนน</b>
                      <p className="m-0 text-xs text-muted leading-relaxed">
                        เมื่อกดส่งข้อสอบ ระบบจะสรุปคะแนน พร้อมแสดงเฉลยและคำอธิบายละเอียดครบทุกข้อ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center shrink-0 text-xs">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <b className="text-xs font-bold block mb-0.5 text-amber-800 dark:text-amber-200">
                        ล็อกระบบ AI ช่วยเหลือ
                      </b>
                      <p className="m-0 text-xs text-amber-700 dark:text-amber-400 leading-snug">
                        ระบบล็อกการใช้งาน AI ผู้ช่วยสอนทั้งหมดตลอดระยะเวลาทำข้อสอบ
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post-test engine selector (only shown for post_test/re_test) */}
              {!isPretest && (
                <div className="p-4 rounded-xl border border-line bg-bg-base">
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

              {/* Start Button CTA */}
              <div className="text-center pt-2">
                <button
                  onClick={startAssessment}
                  className="btn btn-primary px-10 py-3.5 text-sm sm:text-base font-bold shadow-lg shadow-primary/25 rounded-xl cursor-pointer inline-flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>เริ่มทำแบบทดสอบทันที (Start Test)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
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
  const maxQuestions = isPretest ? 20 : isRetest ? 10 : 20;
  const currentIndex = isPretest
    ? pretestIndex
    : (selectedEngine === 'rule-based' ? engineState : irtEngineState).questionIndex;

  const currentSelectedOption = isPretest
    ? (userAnswers[pretestIndex] || null)
    : selectedOption;

  const answeredCount = isPretest
    ? Object.keys(userAnswers).filter((k) => !!userAnswers[Number(k)]).length
    : currentIndex;

  return (
    <div className="main-inner enter flex flex-col h-[calc(100dvh-100px)] md:h-full max-h-full min-h-0 mb-0 overflow-hidden relative">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="card max-w-md w-full p-6 bg-surface border border-line rounded-2xl shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">ยืนยันการส่งแบบทดสอบ</h3>
                  <p className="text-xs text-muted">ตรวจสอบความเรียบร้อยก่อนส่งตรวจคำตอบ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-muted hover:text-ink p-1 rounded-lg hover:bg-surface/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Answered / Unanswered stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block mb-0.5">
                  ตอบแล้ว
                </span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {answeredCount} / {maxQuestions}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-line text-center">
                <span className="text-[10px] font-bold text-muted block mb-0.5">
                  ยังไม่ได้ทำ
                </span>
                <span className="text-xl font-black text-ink">
                  {maxQuestions - answeredCount} ข้อ
                </span>
              </div>
            </div>

            {maxQuestions - answeredCount > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  คุณยังมีข้อสอบที่ยังไม่ได้ตอบอีก <b>{maxQuestions - answeredCount} ข้อ</b> ข้อที่ไม่ได้ตอบจะคิดเป็น 0 คะแนน ยืนยันที่จะส่งข้อสอบและดูผลคะแนนทันทีหรือไม่?
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  คุณตอบคำถามครบทั้ง <b>{maxQuestions} ข้อ</b> เรียบร้อยแล้ว ระบบจะประมวลผลคะแนนและแสดงเฉลยละเอียดทันที
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-ghost px-4 py-2 text-xs font-bold text-muted hover:text-ink cursor-pointer"
              >
                กลับไปทำต่อ / แก้ไขคำตอบ
              </button>
              <button
                type="button"
                onClick={executeSubmitPretest}
                className="btn btn-primary px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md"
              >
                ยืนยันส่งข้อสอบ ➔
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="win flex-1 flex flex-col min-h-0 overflow-hidden" id="screen-quiz">
        <div className="win-bar shrink-0 py-2 px-4">
          <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
          <div className="win-title">
            <em>&lt;/&gt;</em> {isPretest ? `pretest-${subDomain.toLowerCase()}.html` : 'assessment.html'}
          </div>
          <div className="win-actions flex items-center gap-2">
            <span className="chip chip-line mono text-xs text-amber-500 border-amber-500/30 flex items-center gap-1.5 font-bold">
              <Lock className="w-3 h-3" />
              <span>AI Locked</span>
            </span>
            <span className="chip chip-green mono">
              <Clock className="w-3 h-3" />
              <span>{formatTime(totalTimerSeconds)}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar Grid */}
          <aside className="hidden md:flex flex-col w-[200px] shrink-0 border-r border-line p-3.5 bg-surface/50 overflow-y-auto">
            {/* Header with Counter */}
            <div className="flex items-center justify-between mb-2 text-xs font-bold text-ink shrink-0">
              <div className="flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-primary" />
                <span>รายการข้อสอบ</span>
              </div>
              <span className="text-[11px] font-mono text-primary font-black bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                {answeredCount} / {maxQuestions}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-line/60 rounded-full h-1.5 mb-3 overflow-hidden shrink-0">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / maxQuestions) * 100}%` }}
              />
            </div>

            {/* Question Grid 1 to 20 */}
            <div className="grid grid-cols-4 gap-1.5 shrink-0">
              {Array.from({ length: maxQuestions }).map((_, idx) => {
                const isCur = idx === currentIndex;
                const hasAnswer = isPretest ? !!userAnswers[idx] : idx < currentIndex;

                let itemClass =
                  'bg-surface text-ink/70 border border-line font-semibold hover:border-primary/40 hover:bg-surface/80';
                if (isCur) {
                  itemClass =
                    'bg-primary text-white font-black ring-2 ring-primary ring-offset-2 ring-offset-surface shadow-md scale-105 z-10';
                } else if (hasAnswer) {
                  itemClass = 'bg-emerald-500 text-white font-bold shadow-xs hover:bg-emerald-600';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all select-none cursor-pointer ${itemClass}`}
                    title={`ข้อที่ ${idx + 1}${hasAnswer ? ' (ทำแล้ว)' : ' (ยังไม่ทำ)'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Status Legend (ข้อปัจจุบัน / ตอบแล้ว / ยังไม่ทำ) */}
            <div className="mt-3.5 pt-3 border-t border-line text-xs space-y-2 shrink-0">
              <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                สถานะการทำข้อสอบ
              </div>

              {/* ข้อปัจจุบัน */}
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-primary/30 inline-block shrink-0"></span>
                  <span className="font-semibold text-ink">ข้อปัจจุบัน</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  ข้อ {currentIndex + 1}
                </span>
              </div>

              {/* ตอบแล้ว */}
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                  <span className="font-semibold text-ink">ตอบแล้ว</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {answeredCount} ข้อ
                </span>
              </div>

              {/* ยังไม่ทำ */}
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface border-2 border-line inline-block shrink-0"></span>
                  <span className="font-medium text-muted">ยังไม่ทำ</span>
                </div>
                <span className="text-[10px] font-mono font-medium text-muted bg-surface border border-line px-1.5 py-0.5 rounded">
                  {Math.max(0, maxQuestions - answeredCount)} ข้อ
                </span>
              </div>
            </div>

            {/* Quick Submit CTA in Sidebar */}
            {isPretest && answeredCount > 0 && (
              <div className="mt-3 pt-3 border-t border-line shrink-0">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ส่งข้อสอบ ({answeredCount}/{maxQuestions})</span>
                </button>
              </div>
            )}

            <div className="mt-auto pt-3 shrink-0">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                <b className="text-primary block mb-1 text-[11px]">
                  {isPretest ? 'บันทึกคำตอบอัตโนมัติ' : 'ระบบปรับเหมาะกำลังทำงาน'}
                </b>
                <p className="text-[10px] text-muted m-0 leading-relaxed">
                  {isPretest
                    ? 'สามารถคลิกเลขข้อเพื่อย้อนกลับมาแก้ไขคำตอบได้ตลอดเวลาก่อนกดส่งข้อสอบ'
                    : 'ระบบปรับระดับความยากของคำถามถัดไปตามความสามารถของคุณ'}
                </p>
              </div>
            </div>
          </aside>

          {/* Question Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-line shrink-0 bg-surface/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted uppercase">ข้อที่</span>
                <span className="text-sm sm:text-base font-black text-ink">
                  {currentIndex + 1} / {maxQuestions}
                </span>
              </div>
              <span className="chip chip-line mono text-xs">{currentQuestion.sub_domain_code}</span>
            </div>

            <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-ink leading-snug">
                  {currentQuestion.question_text}
                </h3>

                {currentQuestion.code_snippet && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-line overflow-x-auto">
                    <pre className="font-mono text-xs text-indigo-300 leading-relaxed m-0">
                      {currentQuestion.code_snippet}
                    </pre>
                  </div>
                )}

                {/* Choices */}
                <div className="space-y-2.5 pt-1">
                  {(['A', 'B', 'C', 'D'] as const).map((key) => {
                    const choiceText = currentQuestion.choices[key];
                    if (!choiceText) return null;

                    const isSelected = currentSelectedOption === key;
                    const thaiLabel = key === 'A' ? 'ก' : key === 'B' ? 'ข' : key === 'C' ? 'ค' : 'ง';

                    let borderClass = 'border-line hover:border-primary/50';
                    let bgClass = 'bg-surface hover:bg-surface/80';
                    let radioClass = 'border-line text-muted';

                    if (isSelected) {
                      borderClass = 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30';
                      radioClass = 'border-primary bg-primary text-white';
                    }

                    return (
                      <div
                        key={key}
                        onClick={() => handleSelectOption(key)}
                        className={`flex items-center gap-3 p-3 sm:py-3.5 sm:px-4 rounded-xl border-2 transition-all cursor-pointer select-none ${borderClass} ${bgClass}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${radioClass}`}
                        >
                          {thaiLabel}
                        </span>
                        <span className="text-sm font-medium leading-relaxed">{choiceText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar - Always visible in viewport */}
            <div className="px-5 py-3 border-t border-line flex items-center justify-between shrink-0 bg-surface/90 backdrop-blur-md">
              {/* Left: Previous Question Button */}
              <div className="flex items-center gap-2">
                {isPretest && (
                  <button
                    type="button"
                    onClick={handlePrevQuestion}
                    disabled={currentIndex === 0}
                    className={`btn btn-ghost border border-line text-xs font-bold px-3.5 py-2 flex items-center gap-1.5 transition-all ${
                      currentIndex === 0
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-surface/80 cursor-pointer text-ink'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>ย้อนกลับ</span>
                  </button>
                )}

                {/* Current selection status */}
                {currentSelectedOption ? (
                  <span className="text-xs text-primary font-bold hidden sm:flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      เลือกข้อ {currentSelectedOption === 'A' ? 'ก' : currentSelectedOption === 'B' ? 'ข' : currentSelectedOption === 'C' ? 'ค' : 'ง'} แล้ว
                      {isPretest ? ' (คลิกเปลี่ยนคำตอบได้)' : ''}
                    </span>
                  </span>
                ) : (
                  <span className="text-xs text-muted hidden sm:inline">
                    โปรดคลิกเลือกคำตอบ 1 ตัวเลือก
                  </span>
                )}
              </div>

              {/* Right: Next or Submit */}
              <div className="flex items-center gap-2">
                {isPretest ? (
                  currentIndex < maxQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="btn btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] transition-transform"
                    >
                      <span>ข้อถัดไป</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowConfirmModal(true)}
                      className="btn btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md cursor-pointer flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 border-none text-white ring-2 ring-emerald-500/40 hover:scale-[1.02] transition-all"
                    >
                      <span>ส่งคำตอบ &amp; ดูผลคะแนน</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={!selectedOption}
                    className={`btn btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md cursor-pointer flex items-center gap-1.5 ${
                      selectedOption ? 'hover:scale-[1.02] transition-transform' : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {currentIndex + 1 >= maxQuestions ? 'ส่งคำตอบข้อสอบ' : 'ข้อถัดไป'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
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
