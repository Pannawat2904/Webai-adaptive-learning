'use client';

import React from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Flame, Heart, Award, Sparkles, ArrowLeft, RotateCcw, HelpCircle } from 'lucide-react';
import { GAME_STAGES, getRankByScore, getLevelByScore } from '@/lib/game/game-data';

interface GameHeaderProps {
  playerName: string;
  score: number;
  lives: number;
  combo: number;
  currentStageId: number;
  unlockedStageId: number;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onSelectStage: (stageId: number) => void;
  onOpenNameModal: () => void;
  onAskHint: () => void;
  hasHintUsed: boolean;
  scoreAnimation: boolean;
}

export function GameHeader({
  playerName,
  score,
  lives,
  combo,
  currentStageId,
  unlockedStageId,
  isSoundOn,
  onToggleSound,
  onSelectStage,
  onOpenNameModal,
  onAskHint,
  hasHintUsed,
  scoreAnimation,
}: GameHeaderProps) {
  const rank = getRankByScore(score);
  const level = getLevelByScore(score);

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-30 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-3">
        {/* Top Bar: Title & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Game Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="กลับสู่แดชบอร์ดนักเรียน"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>HTML5 CODE RESCUE</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20 hidden sm:inline">
                    กู้เว็บพัง!
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                ภารกิจนักพัฒนาเว็บมือใหม่ · เรียนรู้ HTML5 ผ่านการซ่อมโค้ดจริง
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {/* Player Name */}
            <button
              onClick={onOpenNameModal}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all"
              title="คลิกเพื่อเปลี่ยนชื่อผู้เล่น"
            >
              <span>👤</span>
              <span className="max-w-[90px] truncate">{playerName || 'นักพัฒนา'}</span>
            </button>

            {/* Lives (Hearts) */}
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 ${
                lives <= 1 ? 'animate-pulse' : ''
              }`}
              title={`พลังชีวิตเหลือ ${lives} หัวใจ`}
            >
              {[1, 2, 3].map((heartIndex) => (
                <Heart
                  key={heartIndex}
                  className={`w-3.5 h-3.5 ${
                    heartIndex <= lives
                      ? 'text-rose-500 fill-rose-500'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Score */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 transition-transform ${
                scoreAnimation ? 'scale-110 shadow-lg shadow-amber-500/20' : ''
              }`}
            >
              <span className="text-amber-500 text-xs">⭐</span>
              <span className="text-xs font-black text-amber-700 dark:text-amber-300 tabular-nums">
                {score}
              </span>
            </div>

            {/* Combo */}
            {combo > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-black shadow-md shadow-orange-500/30 animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>x{combo}</span>
              </div>
            )}

            {/* Rank & Level Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <span>{rank.icon}</span>
              <span>{level.title}</span>
            </div>

            {/* Hint Button */}
            <button
              onClick={onAskHint}
              disabled={hasHintUsed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                hasHintUsed
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100'
              }`}
              title="ขอคำใบ้จาก TagBot (-5 คะแนน)"
            >
              <span>🤖</span>
              <span className="hidden sm:inline">คำใบ้</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={isSoundOn ? 'ปิดเสียง' : 'เปิดเสียง'}
            >
              {isSoundOn ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Stage Progress Stepper */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {GAME_STAGES.map((stage) => {
            const isCurrent = stage.id === currentStageId;
            const isUnlocked = stage.id <= unlockedStageId;
            const isBoss = stage.id === 5;

            return (
              <button
                key={stage.id}
                onClick={() => isUnlocked && onSelectStage(stage.id)}
                disabled={!isUnlocked}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.02]'
                    : isUnlocked
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{isBoss ? '👾' : isUnlocked ? (stage.id < currentStageId ? '✓' : stage.id) : '🔒'}</span>
                <span>{isBoss ? 'BOSS ด่านสุดท้าย' : `ด่าน ${stage.id}`}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
