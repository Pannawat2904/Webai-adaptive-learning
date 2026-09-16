'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Question, SubDomainCode, QuestionDifficulty, Attempt } from '@/types/database';
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
  BrainCircuit,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  BarChart2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
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
  const [principlesModalOpen, setPrinciplesModalOpen] = useState(false);

  // Soft question timer (gentle indicator, not flashing red)
  useEffect(() => {
    if (isTestFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
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
    }, 1200);
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

  if (isTestFinished) {
    const correctCount = engineState.attempts.filter((a) => a.correct).length;
    const totalCount = engineState.attempts.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6 animate-in fade-in">
        <div className="inline-flex p-4 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-lg">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ทำแบบทดสอบเสร็จสิ้นเรียบร้อย! 🎉
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            ระบบ Rule-based Adaptive Testing (การทดสอบแบบปรับเหมาะเชิงกฎเกณฑ์) ได้คำนวณระดับความเชี่ยวชาญราย Sub-domain ของคุณแล้ว
          </p>
        </div>

        {/* Liquid Score Card */}
        <div className="liquid-glass rounded-3xl p-8 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            ผลการประเมินความสามารถภาพรวม
          </div>
          <div className="text-6xl font-black gradient-text">
            {percentage}%
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            ตอบถูกต้อง {correctCount} จากทั้งหมด {totalCount} ข้อ
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            (ระบบได้ปรับระดับความยากตามคำตอบรายข้อ และวิเคราะห์จุดแข็ง-จุดที่ควรพัฒนาให้คุณโดยอัตโนมัติ)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => router.push('/student/profile')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
          >
            <BarChart2 className="w-4 h-4" />
            <span>ดูรายงาน Learning Profile 8 มิติ</span>
          </button>

          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl liquid-glass text-slate-700 dark:text-slate-200 font-bold text-xs hover:text-indigo-600 transition-colors"
          >
            <span>กลับสู่หน้าหลัก</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-20 space-y-4">
        <BrainCircuit className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
        <p className="text-sm font-medium text-slate-500">กำลังเตรียมข้อสอบที่เหมาะสมเฉพาะบุคคล...</p>
      </div>
    );
  }

  const domain = SUB_DOMAINS[currentQuestion.sub_domain_code];
  const maxQuestions = isRetest ? 10 : 20;
  const progressPercent = Math.round((engineState.questionIndex / maxQuestions) * 100);

  const difficultyLabels: Record<QuestionDifficulty, { label: string; color: string }> = {
    easy: { label: 'ระดับง่าย (Easy)', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
    medium: { label: 'ระดับปานกลาง (Medium)', color: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
    hard: { label: 'ระดับท้าทาย (Hard)', color: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30' },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Test Session Bar in Liquid Glass */}
      <div className="liquid-glass rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              ข้อที่ {engineState.questionIndex + 1} จาก {maxQuestions}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${difficultyLabels[currentQuestion.difficulty].color}`}>
              {difficultyLabels[currentQuestion.difficulty].label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-mono text-xs">
              {timerSeconds} วินาที
            </span>
          </div>
        </div>

        {/* Soft Smooth Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Sub-domain Tag */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            {currentQuestion.sub_domain_code}: {domain?.name}
          </span>
          <button
            onClick={() => setPrinciplesModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all"
            title="คลิกเพื่อดูหลักการทำงานของระบบ"
          >
            <HelpCircle className="w-3 h-3" />
            Rule-based Adaptive Testing
          </button>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question_text}
          </h2>

          {/* Optional Code Snippet */}
          {currentQuestion.code_snippet && (
            <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
              <pre>{currentQuestion.code_snippet}</pre>
            </div>
          )}
        </div>

        {/* Choices List with Liquid Hover */}
        <div className="space-y-3">
          {(['A', 'B', 'C', 'D'] as const).map((key) => {
            const choiceText = currentQuestion.choices[key];
            if (!choiceText) return null;

            const isSelected = selectedOption === key;
            const isCorrect = key === currentQuestion.correct_option;

            let cardStyle =
              'border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-500/50 shadow-2xs';

            if (isSelected && !hasSubmittedAnswer) {
              cardStyle =
                'border-2 border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-100 shadow-md ring-2 ring-indigo-500/20';
            } else if (hasSubmittedAnswer) {
              if (isCorrect) {
                cardStyle =
                  'border-2 border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100';
              } else if (isSelected && !isCorrect) {
                cardStyle =
                  'border-2 border-rose-500 bg-rose-50/80 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100';
              }
            }

            return (
              <button
                key={key}
                disabled={hasSubmittedAnswer}
                onClick={() => handleSelectOption(key)}
                className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3.5 ${cardStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {key}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                  {choiceText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Real-time Explanation on Submit */}
        {hasSubmittedAnswer && currentQuestion.explanation && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 space-y-1 animate-in fade-in">
            <div className="font-bold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>คำอธิบายเฉลยเพื่อการเรียนรู้:</span>
            </div>
            <p className="leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={handleSubmitQuestion}
            disabled={!selectedOption || hasSubmittedAnswer}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
          >
            <span>ยืนยันคำตอบ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* System Principles Academic Modal */}
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
        <div className="text-center py-20">
          <BrainCircuit className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
