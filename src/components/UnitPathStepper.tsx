'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UnitStepKey,
  UNIT_STEPS_CONFIG,
  getUnitProgress,
  isStepUnlocked,
  getStepUrl,
  subscribeToProgress,
  normalizeUnit,
} from '@/lib/progress-service';
import { SUB_DOMAINS } from '@/types/database';
import {
  FileQuestion,
  BookOpen,
  CheckSquare,
  Gamepad2,
  Terminal,
  Trophy,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const STEP_ICONS: Record<UnitStepKey, React.ElementType> = {
  pretest: FileQuestion,
  lesson: BookOpen,
  unit_quiz: CheckSquare,
  game: Gamepad2,
  quest: Terminal,
  posttest: Trophy,
};

interface UnitPathStepperProps {
  unitId?: string;
  currentStep?: UnitStepKey;
  className?: string;
}

export function UnitPathStepper({ unitId = 'u-h1', currentStep, className = '' }: UnitPathStepperProps) {
  const { unitId: normalizedId, subDomain } = normalizeUnit(unitId);
  const domainInfo = SUB_DOMAINS[subDomain] || SUB_DOMAINS.H1;

  const [progress, setProgress] = useState(() => getUnitProgress(normalizedId));

  useEffect(() => {
    const update = () => setProgress(getUnitProgress(normalizedId));
    update();
    const unsub = subscribeToProgress(update);
    return () => unsub();
  }, [normalizedId]);

  const stepStatusMap: Record<UnitStepKey, 'completed' | 'current' | 'unlocked' | 'locked'> = {
    pretest: progress.pretest_done
      ? 'completed'
      : currentStep === 'pretest'
      ? 'current'
      : 'unlocked',
    lesson: progress.lesson_done
      ? 'completed'
      : currentStep === 'lesson'
      ? 'current'
      : isStepUnlocked(normalizedId, 'lesson')
      ? 'unlocked'
      : 'locked',
    unit_quiz: progress.unit_quiz_done
      ? 'completed'
      : currentStep === 'unit_quiz'
      ? 'current'
      : isStepUnlocked(normalizedId, 'unit_quiz')
      ? 'unlocked'
      : 'locked',
    game: progress.game_done
      ? 'completed'
      : currentStep === 'game'
      ? 'current'
      : isStepUnlocked(normalizedId, 'game')
      ? 'unlocked'
      : 'locked',
    quest: progress.quest_done
      ? 'completed'
      : currentStep === 'quest'
      ? 'current'
      : isStepUnlocked(normalizedId, 'quest')
      ? 'unlocked'
      : 'locked',
    posttest: progress.posttest_done
      ? 'completed'
      : currentStep === 'posttest'
      ? 'current'
      : isStepUnlocked(normalizedId, 'posttest')
      ? 'unlocked'
      : 'locked',
  };

  // Count completed steps
  const completedCount = Object.values(stepStatusMap).filter((s) => s === 'completed').length;
  const progressPercent = Math.round((completedCount / 6) * 100);

  return (
    <div className={`mb-6 rounded-2xl border border-line bg-surface/90 shadow-sm p-4 sm:p-5 backdrop-blur-md ${className}`}>
      {/* Unit Header & Overall Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-line">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs">
            {subDomain}
          </span>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-ink flex items-center gap-1.5">
              <span>ลำดับการเรียนรู้: {domainInfo.name}</span>
            </h2>
            <p className="text-[11px] text-muted hidden sm:block">
              ต้องทำตามลำดับขั้นตอน (Sequential Flow) ให้ครบ 6 ขั้นเพื่อผ่านหน่วยนี้
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono text-muted uppercase">ความคืบหน้าของหน่วย</div>
            <div className="text-xs font-bold font-mono text-ink">
              {completedCount}/6 ขั้น ({progressPercent}%)
            </div>
          </div>
          <div className="w-16 sm:w-24 h-2 rounded-full bg-line overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6 Steps Horizontal Bar */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center min-w-[620px] justify-between relative">
          {UNIT_STEPS_CONFIG.map((step, idx) => {
            const status = stepStatusMap[step.key];
            const Icon = STEP_ICONS[step.key];
            const isClickable = status !== 'locked';
            const url = isClickable ? getStepUrl(normalizedId, step.key) : '#';

            let circleClass = 'bg-bg-base border-line text-muted';
            let badgeClass = 'bg-line/40 text-muted';
            let badgeText = 'ยังไม่ปลดล็อก';

            if (status === 'completed') {
              circleClass = 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/25';
              badgeClass = 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
              badgeText = 'ผ่านแล้ว';
            } else if (status === 'current') {
              circleClass = 'bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-500/20 shadow-md shadow-indigo-500/30';
              badgeClass = 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 font-bold';
              badgeText = 'กำลังทำ';
            } else if (status === 'unlocked') {
              circleClass = 'bg-surface border-indigo-500 text-indigo-600 hover:bg-indigo-50';
              badgeClass = 'bg-indigo-500/5 text-indigo-500 border border-indigo-500/10';
              badgeText = 'พร้อมเริ่ม';
            }

            return (
              <React.Fragment key={step.key}>
                {/* Step Item */}
                <div className="flex flex-col items-center text-center flex-1 max-w-[110px] group relative">
                  <Link
                    href={url}
                    className={`flex flex-col items-center ${
                      !isClickable ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                    }`}
                    onClick={(e) => {
                      if (!isClickable) e.preventDefault();
                    }}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all duration-200 mb-1.5 ${circleClass}`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : status === 'locked' ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>

                    <div className="text-[11px] font-bold text-ink leading-tight mb-1 truncate w-full px-1">
                      {idx + 1}. {step.title}
                    </div>

                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${badgeClass}`}>
                      {badgeText}
                    </span>
                  </Link>
                </div>

                {/* Connector Line between Steps */}
                {idx < UNIT_STEPS_CONFIG.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 bg-line relative -top-3">
                    <div
                      className={`h-full transition-all duration-300 ${
                        status === 'completed' ? 'bg-emerald-500' : 'bg-transparent'
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
