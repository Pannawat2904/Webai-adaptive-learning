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
import { Award, Sparkles, CheckCircle2 } from 'lucide-react';

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

  // UI / Mascot State
  const [botMessage, setBotMessage] = useState<string>('สวัสดีครับ! ผมชื่อ TagBot พร้อมช่วยคุณกู้เว็บไซต์แล้ว เริ่มจากการหาแท็กที่ขาดหายกันเถอะ');
  const [isReviving, setIsReviving] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [levelUpText, setLevelUpText] = useState<string | null>(null);

  const prevScoreRef = useRef(0);

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

  // Save Player Name
  const handleSaveName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('webai_code_rescue_name', name);
    setBotMessage(`ยินดีต้อนรับ ${name} 👋 เริ่มต้นภารกิจกู้เว็บพังกันเลย!`);
    soundManager.playSuccess();
  };

  // Code Part Select Sound
  const handleCodePartSound = () => {
    soundManager.playCodePartSelect();
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
      setCombo(1); // Reset combo
      addScore(-5); // Minor penalty

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
    setBotMessage(`💡 นี่คือคำใบ้จาก TagBot: ${currentStage.hint}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Game Header Bar */}
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
      />

      {/* Main Workspace (Split Code Editor & Live Preview) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: TagBot Guide & Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* TagBot Guide Panel */}
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
          <div className="flex-1 min-h-[460px] sm:min-h-[520px]">
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
          <div className="h-[480px] lg:h-full min-h-[420px]">
            <LivePreview
              stage={currentStage}
              renderedHtml={renderedHtml}
              onRefresh={handleRunPreview}
              onFormSubmitted={() => {
                soundManager.playSuccess();
                setBotMessage('🎉 ฟอร์มถูกส่งสำเร็จใน Live Preview! แบบฟอร์มทำงานสมบูรณ์แล้ว');
              }}
              onLinkClicked={(href) => {
                soundManager.playClick();
                setBotMessage(`🚀 คลิกลิงก์ไปยัง ${href} ใน Live Preview สำเร็จ!`);
              }}
            />
          </div>

          {/* Certificate Quick Access if Boss Cleared */}
          {completedStages.includes(5) && (
            <button
              onClick={() => setIsCertificateOpen(true)}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>📜 ดูประกาศนียบัตร HTML5 MASTER</span>
            </button>
          )}
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

      {/* Certificate Modal */}
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
