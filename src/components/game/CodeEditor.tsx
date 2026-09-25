'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, CheckCircle2, RotateCcw, Wrench, Code2, Sparkles, AlertCircle } from 'lucide-react';
import { GameStage } from '@/lib/game/game-data';

interface CodeEditorProps {
  stage: GameStage;
  code: string;
  onChangeCode: (newCode: string) => void;
  onRunPreview: () => void;
  onValidateMission: () => void;
  onResetCode: () => void;
  isValidating: boolean;
  onSelectPartSound: () => void;
}

export function CodeEditor({
  stage,
  code,
  onChangeCode,
  onRunPreview,
  onValidateMission,
  onResetCode,
  isValidating,
  onSelectPartSound,
}: CodeEditorProps) {
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([code]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial code history when stage changes
  useEffect(() => {
    setHistory([code]);
    setHistoryIndex(0);
    setSelectedLineIndex(null);
  }, [stage.id]);

  const lines = code.split('\n');

  const updateCodeWithHistory = (newCode: string) => {
    onChangeCode(newCode);
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newCode);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChangeCode(prev);
    }
  };

  // Replace or insert Code Part into selected line or cursor position
  const handleApplyCodePart = (part: string) => {
    onSelectPartSound();

    if (selectedLineIndex !== null && selectedLineIndex < lines.length) {
      const currentLine = lines[selectedLineIndex];
      let newLine = currentLine;

      // Smart substitution based on part
      if (part === '</title>') {
        newLine = currentLine.includes('</title>') ? currentLine : `${currentLine}</title>`;
      } else if (part === '<h1>' || part === '</h1>' || part === '<h2>' || part === '</h2>') {
        if (part === '<h1>' && currentLine.includes('<h2>')) {
          newLine = currentLine.replace('<h2>', '<h1>');
        } else if (part === '</h1>' && currentLine.includes('</h2>')) {
          newLine = currentLine.replace('</h2>', '<h1>');
        } else {
          newLine = currentLine + part;
        }
      } else if (part === '<p>' || part === '</p>') {
        if (currentLine.includes('<div>')) {
          newLine = currentLine.replace('<div>', '<p>');
        } else if (currentLine.includes('</div>')) {
          newLine = currentLine.replace('</div>', '</p>');
        } else {
          newLine = `${part}${currentLine}`;
        }
      } else if (part === '<ul>' || part === '</ul>') {
        newLine = currentLine.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>');
      } else if (part.startsWith('href=')) {
        newLine = currentLine.replace(/href=["'][^"']*["']/g, part);
      } else if (part.startsWith('src=')) {
        newLine = currentLine.replace(/src=["'][^"']*["']/g, part);
      } else if (part.startsWith('alt=')) {
        newLine = currentLine.replace(/alt=["'][^"']*["']/g, part);
      } else if (part.startsWith('type=')) {
        newLine = currentLine.replace(/type=["'][^"']*["']/g, part);
      } else if (part === '</footer>') {
        newLine = `${currentLine}\n  </footer>`;
      } else {
        newLine = `${currentLine} ${part}`;
      }

      const updatedLines = [...lines];
      updatedLines[selectedLineIndex] = newLine;
      updateCodeWithHistory(updatedLines.join('\n'));
    } else {
      // If no line selected, append or replace matching pattern
      let newCode = code;
      if (part === '</title>' && code.includes('<title>') && !code.includes('</title>')) {
        newCode = code.replace(/(<title>[^\n<]*)/, '$1</title>');
      } else if (part.startsWith('type=')) {
        newCode = code.replace(/type=["'][^"']*["']/, part);
      } else if (part.startsWith('href=')) {
        newCode = code.replace(/href=["']#["']/, part);
      } else if (part.startsWith('src=')) {
        newCode = code.replace(/src=["'][^"']*["']/, part);
      } else {
        newCode = `${code}\n${part}`;
      }
      updateCodeWithHistory(newCode);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Editor Header Bar */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="font-mono text-xs font-bold tracking-wider text-slate-200">
            index.html
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> READY
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="ย้อนกลับ (Undo)"
          >
            Undo
          </button>
          <button
            onClick={onResetCode}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-all"
            title="รีเซ็ตโค้ดกลับเป็นโค้ดเริ่มต้น"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">รีเซ็ต</span>
          </button>
        </div>
      </div>

      {/* Code Editor Main Body */}
      <div className="relative flex-1 bg-slate-950 font-mono text-xs sm:text-[13px] overflow-hidden flex">
        {/* Line Numbers Gutter */}
        <div className="w-12 py-3 bg-slate-900/60 border-r border-slate-800/80 text-slate-500 select-none text-right pr-3 shrink-0 flex flex-col font-mono leading-[22px]">
          {lines.map((_, i) => (
            <span
              key={i}
              onClick={() => setSelectedLineIndex(i)}
              className={`cursor-pointer transition-colors ${
                selectedLineIndex === i ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'hover:text-slate-300'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
          ))}
        </div>

        {/* Textarea Code Input */}
        <div className="relative flex-1 p-3 overflow-auto">
          {/* Clickable Line Highlight layer */}
          <div className="absolute inset-0 pointer-events-none p-3 font-mono leading-[22px]">
            {lines.map((_, i) => (
              <div
                key={i}
                className={`h-[22px] rounded transition-colors ${
                  selectedLineIndex === i ? 'bg-indigo-500/15 border-l-2 border-indigo-400' : ''
                }`}
              />
            ))}
          </div>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => updateCodeWithHistory(e.target.value)}
            spellCheck={false}
            className="relative z-10 w-full h-full bg-transparent text-[#e2e8f0] resize-none outline-none font-mono leading-[22px] whitespace-pre"
            style={{ tabSize: 2 }}
            placeholder="พิมพ์หรือคลิกอะไหล่โค้ดเพื่อแก้ไข..."
          />
        </div>
      </div>

      {/* Code Parts Drawer (อะไหล่โค้ด 🔧) */}
      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Wrench className="w-3.5 h-3.5 text-indigo-500" />
            <span>🔧 Code Parts (อะไหล่โค้ดสำหรับด่านนี้)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {selectedLineIndex !== null ? `เลือกบรรทัดที่ ${selectedLineIndex + 1}` : 'คลิกบรรทัดหรือคลิกอะไหล่เพื่อใส่โค้ด'}
          </span>
        </div>

        {/* Parts Chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {stage.codeParts.map((part, index) => (
            <button
              key={index}
              onClick={() => handleApplyCodePart(part)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              + {part}
            </button>
          ))}
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>แก้โค้ดแล้วกด <strong>Run</strong> เพื่อดูผล และกด <strong>ตรวจสอบ</strong> เพื่อรับคะแนน</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onRunPreview}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            <span>▶ Run พรีวิว</span>
          </button>

          <button
            onClick={onValidateMission}
            disabled={isValidating}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>✓ ตรวจสอบภารกิจ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
