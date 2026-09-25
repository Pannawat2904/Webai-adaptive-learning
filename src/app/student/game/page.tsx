'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GameHeader } from '@/components/game/GameHeader';
import { CodeEditor } from '@/components/game/CodeEditor';
import { LivePreview } from '@/components/game/LivePreview';
import { TagBotGuide } from '@/components/game/TagBotGuide';
import { CertificateModal } from '@/components/game/CertificateModal';
import { PlayerNameModal } from '@/components/game/PlayerNameModal';
import { AchievementToast } from '@/components/game/AchievementToast';
import {
  GAME_STAGES,
  ACHIEVEMENTS,
  getLevelByScore,
  getRankByScore,
  Achievement,
} from '@/lib/game/game-data';
import { soundManager } from '@/lib/game/sound-effects';
import { useAuth } from '@/lib/auth-context';
import { Award, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Zap, Swords, ShieldCheck, Flame } from 'lucide-react';

export default function HTML5CodeRescuePage() {
  const { profile } = useAuth();

  // Player State
  const [playerName, setPlayerName] = useState<string>('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(1);
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [unlockedStageId, setUnlockedStageId] = useState<number>(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isBgmOn, setIsBgmOn] = useState<boolean>(false);

  // Stage Runtime State
  const currentStage = GAME_STAGES.find((s) => s.id === currentStageId) || GAME_STAGES[0];
  const [code, setCode] = useState<string>(currentStage.initialCode);
  const [renderedHtml, setRenderedHtml] = useState<string>(currentStage.initialCode);
  const [hasRanOnce, setHasRanOnce] = useState<boolean>(false);
  const [hasHintUsed, setHasHintUsed] = useState<boolean>(false);
  const [isHintActive, setIsHintActive] = useState<boolean>(false);
  const [validationFeedback, setValidationFeedback] = useState<{
    isValid: boolean;
    feedback: string;
    errors: string[];
  } | null>(null);

  // UI / Mascot / Arcade FX State
  const [botMessage, setBotMessage] = useState<string>('สวัสดีครับ! ผมชื่อ TagBot พร้อมช่วยคุณกู้เว็บไซต์แล้ว เริ่มจากการหาแท็กที่ขาดหายกันเถอะ');
  const [isReviving, setIsReviving] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [levelUpText, setLevelUpText] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [floatingScores, setFloatingScores] = useState<{ id: number; text: string; color: string }[]>([]);

  const prevScoreRef = useRef(0);

  // Floating Score Effect Generator
  const triggerFloatingScore = (text: string, color: string = 'text-amber-400') => {
    const id = Date.now() + Math.random();
    setFloatingScores((prev) => [...prev, { id, text, color }]);
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Screen Shake Trigger
  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  };

  // Clean up BGM on unmount
  useEffect(() => {
    return () => {
      soundManager.stopBgm();
    };
  }, []);

  // Load saved state from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('webai_code_rescue_name') || profile?.full_name?.split(' ')[0] || '';
    if (!savedName) {
      setIsNameModalOpen(true);
    } else {
      setPlayerName(savedName);
      setBotMessage(`ยินดีต้อนรับ ${savedName} 👋 กำลังเข้าสู่ ${currentStage.title}`);
    }

    const savedScore = parseInt(localStorage.getItem('webai_code_rescue_score') || '0', 10);
    setScore(savedScore);
    prevScoreRef.current = savedScore;

    const savedUnlocked = parseInt(localStorage.getItem('webai_code_rescue_unlocked') || '1', 10);
    setUnlockedStageId(savedUnlocked);

    try {
      const savedCompleted = JSON.parse(localStorage.getItem('webai_code_rescue_completed') || '[]');
      setCompletedStages(savedCompleted);
      const savedAch = JSON.parse(localStorage.getItem('webai_code_rescue_achievements') || '[]');
      setUnlockedAchievements(savedAch);
    } catch {}

    const savedSound = localStorage.getItem('webai_code_rescue_sound');
    if (savedSound !== null) {
      const soundVal = savedSound === 'true';
      setIsSoundOn(soundVal);
      soundManager.enabled = soundVal;
    }
  }, [profile?.full_name]);

  // Handle stage change
  const handleSelectStage = (stageId: number) => {
    soundManager.playClick();
    setCurrentStageId(stageId);
    const targetStage = GAME_STAGES.find((s) => s.id === stageId) || GAME_STAGES[0];
    setCode(targetStage.initialCode);
    setRenderedHtml(targetStage.initialCode);
    setHasRanOnce(false);
    setHasHintUsed(false);
    setIsHintActive(false);
    setValidationFeedback(null);
    setBotMessage(`${playerName || 'นักพัฒนา'} กำลังเข้าสู่ ${targetStage.title}! ตรวจสอบโจทย์ใน Mission Card ได้เลยครับ`);
    
    if (stageId === 5) {
      soundManager.playBossAlert();
    }
  };

  // Add Score with Animation and Level Up Check
  const addScore = (points: number) => {
    setScore((prev) => {
      const newScore = Math.max(0, prev + points);
      localStorage.setItem('webai_code_rescue_score', String(newScore));

      // Check level up
      const oldLevel = getLevelByScore(prev);
      const newLevel = getLevelByScore(newScore);
      if (newLevel.level > oldLevel.level) {
        soundManager.playLevelUp();
        setLevelUpText(`${newLevel.title} (${newLevel.minScore}+ แต้ม)`);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      }

      setScoreAnimation(true);
      setTimeout(() => setScoreAnimation(false), 800);
      return newScore;
    });
  };

  // Unlock Achievement Helper
  const unlockAchievement = (achId: string) => {
    if (!unlockedAchievements.includes(achId)) {
      const target = ACHIEVEMENTS.find((a) => a.id === achId);
      if (target) {
        const updated = [...unlockedAchievements, achId];
        setUnlockedAchievements(updated);
        localStorage.setItem('webai_code_rescue_achievements', JSON.stringify(updated));
        setRecentAchievement(target);
        soundManager.playSuccess();
      }
    }
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const nextVal = !isSoundOn;
    setIsSoundOn(nextVal);
    soundManager.enabled = nextVal;
    localStorage.setItem('webai_code_rescue_sound', String(nextVal));
    if (nextVal) soundManager.playClick();
  };

  // BGM Toggle
  const handleToggleBgm = () => {
    const next = soundManager.toggleBgm();
    setIsBgmOn(next);
  };

  // Save Player Name
  const handleSaveName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('webai_code_rescue_name', name);
    setBotMessage(`ยินดีต้อนรับ ${name} 👋 เริ่มต้นภารกิจกู้เว็บพังกันเลย!`);
    soundManager.playSuccess();
  };

  // Code Part Select Sound
  const handleCodePartSound = () => {
    soundManager.playLaserFix();
    triggerFloatingScore('INSERT TAG', 'text-cyan-400');
  };

  // Reset Code
  const handleResetCode = () => {
    soundManager.playClick();
    setCode(currentStage.initialCode);
    setRenderedHtml(currentStage.initialCode);
    setValidationFeedback(null);
    setBotMessage('รีเซ็ตโค้ดกลับเป็นค่าเริ่มต้นของด่านนี้เรียบร้อยแล้วครับ');
  };

  // Run Preview
  const handleRunPreview = () => {
    soundManager.playRun();
    setRenderedHtml(code);
    if (!hasRanOnce) {
      setHasRanOnce(true);
      addScore(5);
      triggerFloatingScore('+5 XP (FIRST RUN)', 'text-emerald-400');
      unlockAchievement('first_run');
    }
    setBotMessage('พรีวิวหน้าเว็บอัปเดตแล้ว! ตรวจดูผลลัพธ์ใน Live Preview ได้เลยครับ');
  };

  // Validate Mission
  const handleValidateMission = () => {
    soundManager.playClick();
    const result = currentStage.validate(code);
    setValidationFeedback(result);

    if (result.isValid) {
      // SUCCESS!
      soundManager.playSuccess();
      const isBoss = currentStage.id === 5;
      const basePoints = isBoss ? 100 : 50;

      // Combo bonus
      let comboBonus = 0;
      if (combo === 2) comboBonus = 5;
      else if (combo === 3) comboBonus = 10;
      else if (combo === 4) comboBonus = 15;
      else if (combo >= 5) comboBonus = 25;

      // No mistake bonus
      const perfectBonus = lives === 3 ? 10 : 0;
      const totalEarned = basePoints + comboBonus + perfectBonus;
      addScore(totalEarned);

      // Trigger floating score animation
      triggerFloatingScore(`+${totalEarned} XP (BUG REPAIRED!)`, 'text-emerald-400');
      if (combo > 1) {
        triggerFloatingScore(`COMBO x${combo}!`, 'text-yellow-400');
      }

      // Increase Combo
      const nextCombo = Math.min(5, combo + 1);
      setCombo(nextCombo);
      soundManager.playCombo(nextCombo);

      // Achievements
      if (lives === 3) unlockAchievement('no_mistake');
      if (currentStage.id === 4) unlockAchievement('form_builder');

      // Mark stage complete
      if (!completedStages.includes(currentStage.id)) {
        const nextCompleted = [...completedStages, currentStage.id];
        setCompletedStages(nextCompleted);
        localStorage.setItem('webai_code_rescue_completed', JSON.stringify(nextCompleted));
      }

      // Check Boss Defeated
      if (isBoss) {
        soundManager.playBossDefeated();
        unlockAchievement('html_master');
        unlockAchievement('bug_hunter');
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
        });
        setBotMessage(`🏆 ปราบ BOSS สำเร็จแล้ว! ยินดีด้วยครับ ${playerName} คุณคือสุดยอด HTML5 Master!`);
        setTimeout(() => {
          setIsCertificateOpen(true);
        }, 1500);
      } else {
        // Unlock next stage
        const nextUnlocked = Math.max(unlockedStageId, currentStage.id + 1);
        setUnlockedStageId(nextUnlocked);
        localStorage.setItem('webai_code_rescue_unlocked', String(nextUnlocked));

        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
        setBotMessage(`🎉 ผ่านด่าน ${currentStage.id} สำเร็จ! +${totalEarned} คะแนน ปลดล็อกด่านถัดไปแล้วครับ`);
      }
    } else {
      // MISTAKE!
      soundManager.playError();
      soundManager.playGlitchStatic();
      triggerShake();
      setCombo(1); // Reset combo
      addScore(-5); // Minor penalty
      triggerFloatingScore('-5 XP (SYNTAX ERROR)', 'text-rose-400');

      const newLives = lives - 1;
      if (newLives <= 0) {
        // Revival Mechanism
        soundManager.playRevive();
        setLives(3);
        setIsReviving(true);
        setBotMessage('นักพัฒนาเว็บทุกคนก็ Debug พลาดได้ ลองใหม่อีกครั้ง! ❤️❤️❤️');
        setTimeout(() => setIsReviving(false), 3000);
      } else {
        setLives(newLives);
        setBotMessage(`❌ ${result.feedback}`);
      }
    }
  };

  // Ask Hint
  const handleAskHint = () => {
    if (hasHintUsed) return;
    soundManager.playClick();
    setHasHintUsed(true);
    setIsHintActive(true);
    addScore(-5);
    triggerFloatingScore('-5 XP (HINT)', 'text-amber-400');
    setBotMessage(`💡 นี่คือคำใบ้จาก TagBot: ${currentStage.hint}`);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors relative ${isShaking ? 'animate-arcade-shake' : ''}`}>
      {/* Floating Scores Container */}
      <div className="fixed top-24 right-10 pointer-events-none z-50 flex flex-col gap-2 items-end">
        {floatingScores.map((fs) => (
          <div
            key={fs.id}
            className={`font-black font-mono text-sm sm:text-base px-3 py-1 rounded-xl bg-slate-900/90 shadow-2xl border border-white/20 animate-float-score ${fs.color}`}
          >
            {fs.text}
          </div>
        ))}
      </div>

      {/* Game Header Bar with Retro BGM Toggle */}
      <GameHeader
        playerName={playerName}
        score={score}
        lives={lives}
        combo={combo}
        currentStageId={currentStageId}
        unlockedStageId={unlockedStageId}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        onSelectStage={handleSelectStage}
        onOpenNameModal={() => setIsNameModalOpen(true)}
        onAskHint={handleAskHint}
        hasHintUsed={hasHintUsed}
        scoreAnimation={scoreAnimation}
        isBgmOn={isBgmOn}
        onToggleBgm={handleToggleBgm}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-5">
        
        {/* Collapsible Cyberpunk Hero Banner Artwork */}
        {showBanner && (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-500/40 bg-slate-950 text-white animate-in fade-in duration-500">
            {/* Background Graphic Illustration */}
            <div className="absolute inset-0">
              <img
                src="/images/game/hero-banner.jpg"
                alt="HTML5 Code Rescue Hero"
                className="w-full h-full object-cover object-right opacity-40 md:opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
              <div className="absolute inset-0 scanline-overlay opacity-30" />
            </div>

            {/* Banner Content */}
            <div className="relative z-10 p-5 sm:p-7 max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-black tracking-wider uppercase border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  ARCADE CODING MISSION
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-mono font-bold border border-purple-500/30">
                  ปวช.1 INTERACTIVE
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                HTML5 CODE RESCUE: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">กู้เว็บพัง!</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                สวมบทบาทเป็น Web Developer ร่วมมือกับ <strong>TagBot</strong> เพื่อซ่อมแซมโครงสร้าง HTML5 ที่ถูกไวรัส <strong>BugBot 404</strong> ก่อกวน! คลิกเลือกแท็กที่ถูกต้องเพื่อซ่อมเว็บให้กลับมาใช้งานได้จริง
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleToggleBgm}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isBgmOn
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  <span>🎵</span>
                  <span>{isBgmOn ? 'ปิดเพลง BGM' : 'เปิดเพลง 8-Bit BGM'}</span>
                  {isBgmOn && (
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 bg-white rounded-full eq-bar-1" />
                      <span className="w-0.5 bg-white rounded-full eq-bar-2" />
                      <span className="w-0.5 bg-white rounded-full eq-bar-3" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowBanner(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white transition-colors text-xs font-semibold"
                >
                  ย่อแบนเนอร์ &uarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Arcade VS Battle Bar: TagBot (Player) vs BugBot 404 (Glitch Boss) */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-indigo-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Cyber Scanline Background */}
          <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />

          {/* Player / TagBot Side */}
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-slate-950 shrink-0">
              <img src="/images/game/tagbot.jpg" alt="TagBot Companion" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  DEVELOPER ALLY
                </span>
                <span className="text-white font-black text-sm">{playerName || 'นักพัฒนา'} & TagBot</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-28 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-500" 
                    style={{ width: `${(lives / 3) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono font-bold text-cyan-400">{lives}/3 HP</span>
              </div>
            </div>
          </div>

          {/* Center VS & Mission Badge */}
          <div className="flex flex-col items-center justify-center text-center relative z-10 px-4">
            <div className="text-[10px] font-black tracking-widest text-indigo-400 uppercase mb-1 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-indigo-400" />
              <span>ด่านที่ {currentStage.id} / 5</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-xs font-black text-white shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
              <span>{currentStage.title}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">
              {validationFeedback?.isValid ? (
                <span className="text-emerald-400 font-bold">✨ บั๊กถูกกำจัดแล้ว! เว็บไซต์ปลอดภัย 100%</span>
              ) : (
                <span className="text-rose-400 font-semibold animate-pulse">⚠️ ไวรัสบั๊กกำลังกัดกินแท็กในหน้านี้!</span>
              )}
            </div>
          </div>

          {/* Enemy / BugBot 404 Side */}
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-white font-black text-sm">
                  {currentStage.id === 5 ? '👾 ULTRA BUGBOT 404' : '👾 Glitch BugBot'}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  CORRUPTION
                </span>
              </div>
              <div className="flex items-center justify-end gap-2 mt-1">
                <span className="text-[11px] font-mono font-bold text-rose-400">
                  {validationFeedback?.isValid ? '0% (DEFEATED)' : '100% (ACTIVE)'}
                </span>
                <div className="h-2 w-28 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className={`h-full transition-all duration-500 ${validationFeedback?.isValid ? 'w-0 bg-slate-600' : 'w-full bg-rose-500 animate-pulse'}`}
                  />
                </div>
              </div>
            </div>
            <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
              validationFeedback?.isValid 
                ? 'border-slate-700 opacity-40 grayscale' 
                : 'border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-bounce'
            }`}>
              <img src="/images/game/bugbot.jpg" alt="BugBot Glitch Boss" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Split Workspace: Left Side Code Editor & TagBot, Right Side Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Side: TagBot Guide & Code Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* TagBot Guide Panel with 3D Avatar */}
            <TagBotGuide
              stage={currentStage}
              botMessage={botMessage}
              isHintActive={isHintActive}
              onAskHint={handleAskHint}
              hasHintUsed={hasHintUsed}
              isReviving={isReviving}
              validationFeedback={validationFeedback}
              hasRanOnce={hasRanOnce}
            />

            {/* Interactive Code Editor with Code Parts */}
            <div className="min-h-[460px] sm:min-h-[520px]">
              <CodeEditor
                stage={currentStage}
                code={code}
                onChangeCode={(newCode) => {
                  setCode(newCode);
                  unlockAchievement('first_repair');
                }}
                onRunPreview={handleRunPreview}
                onValidateMission={handleValidateMission}
                onResetCode={handleResetCode}
                isValidating={false}
                onSelectPartSound={handleCodePartSound}
              />
            </div>
          </div>

          {/* Right Side: Live Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="h-[520px] lg:h-[680px]">
              <LivePreview
                stage={currentStage}
                renderedHtml={renderedHtml}
                onRefresh={handleRunPreview}
                validationFeedback={validationFeedback}
                onFormSubmitted={() => {
                  soundManager.playSuccess();
                  triggerFloatingScore('FORM SUBMITTED! 🚀', 'text-cyan-400');
                  setBotMessage('🎉 ฟอร์มถูกส่งสำเร็จใน Live Preview! แบบฟอร์มทำงานสมบูรณ์แล้ว');
                }}
                onLinkClicked={(href) => {
                  soundManager.playClick();
                  triggerFloatingScore(`NAVIGATED: ${href}`, 'text-indigo-400');
                  setBotMessage(`🚀 คลิกลิงก์ไปยัง ${href} ใน Live Preview สำเร็จ!`);
                }}
              />
            </div>

            {/* Certificate Quick Access if Boss Cleared */}
            {completedStages.includes(5) && (
              <button
                onClick={() => setIsCertificateOpen(true)}
                className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-95 transition-all border-2 border-amber-300"
              >
                <Award className="w-5 h-5 text-slate-900" />
                <span>📜 รับถ้วยรางวัล & ประกาศนียบัตร HTML5 MASTER</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Player Name Modal */}
      <PlayerNameModal
        isOpen={isNameModalOpen}
        currentName={playerName}
        onSaveName={handleSaveName}
        onClose={() => setIsNameModalOpen(false)}
        isInitial={!playerName}
      />

      {/* Certificate Modal with 3D Golden Trophy */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        playerName={playerName}
        score={score}
      />

      {/* Achievement / Level Up Toast */}
      <AchievementToast
        achievement={recentAchievement}
        levelUpText={levelUpText}
        onClose={() => {
          setRecentAchievement(null);
          setLevelUpText(null);
        }}
      />
    </div>
  );
}
