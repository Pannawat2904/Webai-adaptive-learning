'use client';

import React from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { Achievement } from '@/lib/game/game-data';

interface AchievementToastProps {
  achievement: Achievement | null;
  levelUpText: string | null;
  onClose: () => void;
}

export function AchievementToast({
  achievement,
  levelUpText,
  onClose,
}: AchievementToastProps) {
  if (!achievement && !levelUpText) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Level Up Toast */}
      {levelUpText && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xl shadow-amber-500/25 border border-white/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-bounce">🎉</span>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-100">
                LEVEL UP!
              </div>
              <div className="text-sm font-black">{levelUpText}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Achievement Unlocked Toast */}
      {achievement && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-indigo-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xl shrink-0 border border-indigo-500/30">
              {achievement.icon}
            </div>
            <div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> ACHIEVEMENT UNLOCKED!
              </div>
              <div className="text-xs font-bold text-white">{achievement.title}</div>
              <div className="text-[11px] text-slate-400">{achievement.description}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-slate-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
