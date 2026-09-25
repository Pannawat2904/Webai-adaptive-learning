'use client';

import React, { useState } from 'react';
import { User, Sparkles, ArrowRight, Bot } from 'lucide-react';

interface PlayerNameModalProps {
  isOpen: boolean;
  currentName: string;
  onSaveName: (name: string) => void;
  onClose: () => void;
  isInitial?: boolean;
}

export function PlayerNameModal({
  isOpen,
  currentName,
  onSaveName,
  onClose,
  isInitial = false,
}: PlayerNameModalProps) {
  const [nameInput, setNameInput] = useState(currentName || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onSaveName(nameInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
          <Bot className="w-8 h-8 animate-bounce" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {isInitial ? 'ยินดีต้อนรับสู่ HTML5 Code Rescue!' : 'เปลี่ยนชื่อนักพัฒนา'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            ระบุชื่อของคุณเพื่อให้ TagBot และประกาศนียบัตรบันทึกความสำเร็จได้อย่างถูกต้อง
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="กรอกชื่อของคุณ เช่น เมล, กานต์..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={30}
            />
          </div>

          <button
            type="submit"
            disabled={!nameInput.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <span>เริ่มต้นภารกิจ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
