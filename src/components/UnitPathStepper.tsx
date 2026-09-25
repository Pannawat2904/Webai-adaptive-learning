'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CourseStepKey,
  COURSE_STEPS_CONFIG,
  getCourseProgress,
  isCourseStepUnlocked,
  subscribeToProgress,
} from '@/lib/progress-service';
import {
  ClipboardList,
  BookOpen,
  Gamepad2,
  Terminal,
  Trophy,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const STEP_ICONS: Record<CourseStepKey, React.ElementType> = {
  pretest: ClipboardList,
  lessons: BookOpen,
  game: Gamepad2,
  quest: Terminal,
  posttest: Trophy,
};

interface UnitPathStepperProps {
  unitId?: string;
  currentStep?: CourseStepKey | 'lesson' | 'unit_quiz';
  className?: string;
}

export function UnitPathStepper({ currentStep, className = '' }: UnitPathStepperProps) {
  const [courseProgress, setCourseProgress] = useState(() => getCourseProgress());

  useEffect(() => {
    const update = () => setCourseProgress(getCourseProgress());
    update();
    const unsub = subscribeToProgress(update);
    return () => unsub();
  }, []);

  const normalizedCurrentStep: CourseStepKey =
    currentStep === 'lesson' || currentStep === 'unit_quiz'
      ? 'lessons'
      : (currentStep as CourseStepKey) || 'pretest';

  const stepStatusMap: Record<CourseStepKey, 'completed' | 'current' | 'unlocked' | 'locked'> = {
    pretest: courseProgress.pretest_done
      ? 'completed'
      : normalizedCurrentStep === 'pretest'
      ? 'current'
      : 'unlocked',
    lessons: courseProgress.lessons_done
      ? 'completed'
      : normalizedCurrentStep === 'lessons'
      ? 'current'
      : isCourseStepUnlocked('lessons')
      ? 'unlocked'
      : 'locked',
    game: courseProgress.game_done
      ? 'completed'
      : normalizedCurrentStep === 'game'
      ? 'current'
      : isCourseStepUnlocked('game')
      ? 'unlocked'
      : 'locked',
    quest: courseProgress.quest_done
      ? 'completed'
      : normalizedCurrentStep === 'quest'
      ? 'current'
      : isCourseStepUnlocked('quest')
      ? 'unlocked'
      : 'locked',
    posttest: courseProgress.posttest_done
      ? 'completed'
      : normalizedCurrentStep === 'posttest'
      ? 'current'
      : isCourseStepUnlocked('posttest')
      ? 'unlocked'
      : 'locked',
  };

  // Count completed steps (out of 5)
  const completedCount = Object.values(stepStatusMap).filter((s) => s === 'completed').length;
  const progressPercent = Math.round((completedCount / COURSE_STEPS_CONFIG.length) * 100);

  return (
    <div
      className={`w-full card p-4 sm:p-5 border-2 border-line bg-surface/90 shadow-sm rounded-2xl mb-6 ${className}`}
    >
      {/* Header & Overall Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-line">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-lg bg-primary-dim text-primary font-mono font-bold text-xs">
            HTML5
          </span>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-ink flex items-center gap-1.5">
              <span>ลำดับขั้นตอนการเรียนรู้: เรื่อง โครงสร้างภาษา HTML</span>
            </h2>
            <p className="text-[11px] text-muted hidden sm:block">
              ต้องทำตามลำดับขั้นตอน (Sequential Flow) ให้ครบ 5 ขั้นเพื่อผ่านเกณฑ์การเรียนรู้
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono text-muted uppercase">ความคืบหน้ารวม</div>
            <div className="text-xs font-bold font-mono text-ink">
              {completedCount}/5 ขั้น ({progressPercent}%)
            </div>
          </div>
          <div className="w-16 sm:w-24 h-2 rounded-full bg-line overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5 Steps Horizontal Bar */}
      <div className="overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex items-center min-w-[580px] justify-between relative">
          {COURSE_STEPS_CONFIG.map((step, idx) => {
            const status = stepStatusMap[step.key];
            const Icon = STEP_ICONS[step.key];
            const isClickable = status !== 'locked';
            const url = isClickable ? step.href : '#';

            return (
              <React.Fragment key={step.key}>
                {/* Step Item */}
                <div className="flex flex-col items-center text-center relative z-10 group">
                  <Link
                    href={url}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative border-2 ${
                      status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10 hover:scale-105'
                        : status === 'current'
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 ring-4 ring-primary/20 scale-105'
                        : status === 'unlocked'
                        ? 'bg-surface text-ink border-primary/40 hover:border-primary hover:scale-105 hover:bg-primary-dim/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-60'
                    }`}
                    title={
                      status === 'locked'
                        ? `ล็อกอยู่: ต้องผ่าน ${step.requiredStepName} ก่อน`
                        : `${step.stepNumber}. ${step.title}`
                    }
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                    ) : status === 'locked' ? (
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    ) : (
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={status === 'current' ? 2.5 : 2} />
                    )}

                    {/* Step Number Badge */}
                    <span
                      className={`absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center border ${
                        status === 'current'
                          ? 'bg-white text-primary border-primary'
                          : status === 'completed'
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : status === 'locked'
                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-400'
                          : 'bg-primary text-white border-primary'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                  </Link>

                  {/* Title & Status */}
                  <div className="mt-2 flex flex-col items-center max-w-[100px] sm:max-w-[120px]">
                    <span
                      className={`text-xs font-bold leading-tight truncate w-full ${
                        status === 'current'
                          ? 'text-primary'
                          : status === 'completed'
                          ? 'text-slate-900 dark:text-slate-100'
                          : status === 'locked'
                          ? 'text-slate-400 dark:text-slate-600'
                          : 'text-ink'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span
                      className={`text-[10px] mt-0.5 px-1.5 py-0.5 rounded-full font-medium ${
                        status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : status === 'current'
                          ? 'bg-primary-dim text-primary font-bold'
                          : status === 'locked'
                          ? 'text-slate-400'
                          : 'text-muted'
                      }`}
                    >
                      {status === 'completed'
                        ? 'ผ่านแล้ว'
                        : status === 'current'
                        ? 'กำลังทำ'
                        : status === 'locked'
                        ? 'ล็อก'
                        : 'พร้อมทำ'}
                    </span>
                  </div>
                </div>

                {/* Connecting Line between steps */}
                {idx < COURSE_STEPS_CONFIG.length - 1 && (
                  <div className="flex-1 h-1 mx-2 sm:mx-3 relative -top-4 rounded-full overflow-hidden bg-line">
                    <div
                      className={`h-full transition-all duration-500 ${
                        stepStatusMap[COURSE_STEPS_CONFIG[idx + 1].key] === 'completed' ||
                        stepStatusMap[COURSE_STEPS_CONFIG[idx].key] === 'completed'
                          ? 'bg-emerald-500'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
