'use client';

import React from 'react';
import { Bot, Lightbulb, CheckSquare, Square, Sparkles, AlertTriangle } from 'lucide-react';
import { GameStage } from '@/lib/game/game-data';

interface TagBotGuideProps {
  stage: GameStage;
  botMessage: string;
  isHintActive: boolean;
  onAskHint: () => void;
  hasHintUsed: boolean;
  isReviving: boolean;
  validationFeedback: { isValid: boolean; feedback: string; errors: string[] } | null;
  hasRanOnce: boolean;
}

export function TagBotGuide({
  stage,
  botMessage,
  isHintActive,
  onAskHint,
  hasHintUsed,
  isReviving,
  validationFeedback,
  hasRanOnce,
}: TagBotGuideProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Robot Mascot & Speech Bubble */}
      <div className="flex items-start gap-3">
        {/* Animated Robot Avatar */}
        <div 
          onClick={() => {
            import('@/lib/game/sound-effects').then(({ soundManager }) => soundManager.playCodePartSelect());
          }}
          className="relative shrink-0 cursor-pointer group"
          title="คลิกคุยกับ TagBot"
        >
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-400 dark:border-cyan-500 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-all duration-300 relative bg-slate-900">
            <img 
              src="/images/game/tagbot.jpg" 
              alt="TagBot Companion" 
              className="w-full h-full object-cover animate-pulse"
            />
            <div className="absolute inset-0 bg-cyan-400/10 pointer-events-none group-hover:opacity-0 transition-opacity" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
            ⚡
          </span>
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 p-3 sm:p-3.5 rounded-2xl rounded-tl-sm text-xs sm:text-[13px] leading-relaxed relative">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
              🤖 TagBot ผู้ช่วยส่วนตัว
            </span>
            {isReviving && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                ฟื้นคืนชีพ!
              </span>
            )}
          </div>

          <p className="text-slate-700 dark:text-slate-200 m-0">
            {botMessage}
          </p>
        </div>
      </div>

      {/* Mission Target Objectives */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 m-0">
            <span>🎯</span>
            <span>เป้าหมายภารกิจ: {stage.title}</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            {stage.subtitle}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {stage.mission}
        </p>

        {/* Objectives Checkboxes */}
        <div className="space-y-1.5 pt-1">
          {stage.objectives.map((obj, i) => {
            const isRunObj = obj.id.includes('run');
            const isDone = isRunObj ? hasRanOnce : validationFeedback?.isValid;

            return (
              <div
                key={i}
                className={`flex items-center gap-2 text-xs py-1 px-2 rounded-lg transition-colors ${
                  isDone
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>{obj.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation Feedback (if checked) */}
      {validationFeedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
            validationFeedback.isValid
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 mb-1">
            {validationFeedback.isValid ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>ตรวจสอบสำเร็จ! ผ่านภารกิจ</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>ยังไม่ถูกต้อง ลองตรวจสอบอีกครั้ง:</span>
              </>
            )}
          </div>
          <p className="m-0">{validationFeedback.feedback}</p>
        </div>
      )}

      {/* Hint Card (When unlocked) */}
      {isHintActive && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
            <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>คำใบ้จาก TagBot:</span>
          </div>
          <p className="m-0 leading-relaxed">{stage.hint}</p>
        </div>
      )}
    </div>
  );
}
