'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  getUnits,
  getLesson,
  getQuestions,
  saveTestSession,
  getYoutubeEmbedUrl,
  subscribeToDatabase,
} from '@/lib/database-service';
import { getCanvaEmbedUrl, getCanvaShareUrl } from '@/lib/mock-data';
import { getFixedUnitQuizQuestions } from '@/lib/pretest';
import {
  getUnitProgress,
  isStepUnlocked,
  isCourseStepUnlocked,
  setUnitStepCompleted,
  getStepUrl,
  subscribeToProgress,
  normalizeUnit,
} from '@/lib/progress-service';
import { UnitPathStepper } from '@/components/UnitPathStepper';
import { Unit, Lesson, Question, TestSession, Attempt } from '@/types/database';
import {
  Presentation,
  Tv,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  CheckSquare,
  Lock,
  ArrowRight,
  Play,
  RotateCcw,
  Info,
  Gamepad2,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const resolvedParams = use(params);
  const { unitId } = resolvedParams;
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'quiz' ? 'quiz' : 'slide';

  const [units, setUnits] = useState<Unit[]>([]);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);

  // Tabs: Slides, Video, or Unit Quiz
  const [activeTab, setActiveTab] = useState<'slide' | 'video' | 'quiz'>(initialTab);

  // Media states
  const [canvaUrl, setCanvaUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [canvaShareLink, setCanvaShareLink] = useState('');
  const [slideTopics, setSlideTopics] = useState<string[]>([]);

  // Unit Progress state
  const [progress, setProgress] = useState(() => getUnitProgress(unitId));

  // Unit Quiz States
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const loadData = () => {
    const loadedUnits = getUnits();
    setUnits(loadedUnits);

    const idx = loadedUnits.findIndex((u) => u.id === unitId);
    const activeUnit = idx !== -1 ? loadedUnits[idx] : loadedUnits[0];
    setCurrentUnitIndex(idx !== -1 ? idx : 0);
    setUnit(activeUnit);

    if (activeUnit) {
      const activeLesson = getLesson(activeUnit.id);
      setLesson(activeLesson);

      const slideMedia = activeLesson.media?.find((m) => m.media_type === 'slide');
      const videoMedia = activeLesson.media?.find((m) => m.media_type === 'video');

      const slideEmbed = getCanvaEmbedUrl(slideMedia?.external_url, activeUnit.id);
      const shareUrl = getCanvaShareUrl((slideMedia?.meta?.share_url as string), activeUnit.id);
      const videoEmbed = getYoutubeEmbedUrl(videoMedia?.external_url);

      setCanvaUrl(slideEmbed);
      setCanvaShareLink(shareUrl);
      setVideoUrl(videoEmbed);
      setSlideTopics((slideMedia?.meta?.slides as string[]) || []);

      // Load Unit Quiz questions
      const fixedQuiz = getFixedUnitQuizQuestions(activeUnit.id, getQuestions(), 4);
      setQuizQuestions(fixedQuiz);
    }

    setProgress(getUnitProgress(unitId));
  };

  useEffect(() => {
    loadData();

    const unsubDb = subscribeToDatabase((event) => {
      if (event.type === 'unit' || event.type === 'lesson' || event.type === 'reset') {
        loadData();
      }
    });
    const unsubProgress = subscribeToProgress(() => {
      setProgress(getUnitProgress(unitId));
    });

    return () => {
      unsubDb();
      unsubProgress();
    };
  }, [unitId]);

  if (!unit || !lesson) {
    return (
      <div className="main-inner enter p-12 text-center text-muted">
        กำลังโหลดข้อมูลบทเรียน...
      </div>
    );
  }

  // --- GATING CHECK: Must pass Step 1 (Pre-test) before viewing lesson ---
  if (!isCourseStepUnlocked('lessons')) {
    return (
      <div className="main-inner enter max-w-[850px] mx-auto pt-6">
        <UnitPathStepper unitId={unit.id} currentStep="lessons" />

        <div className="card p-8 sm:p-10 text-center border-amber-500/30 bg-amber-500/5 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink mb-2">
            ขั้นตอนที่ 2: บทเรียนยังไม่ปลดล็อก
          </h2>
          <p className="text-sm text-muted mb-6 max-w-lg mx-auto leading-relaxed">
            ตามลำดับขั้นตอนการเรียนรู้ของระบบ คุณต้องทำแบบทดสอบก่อนเรียน (Step 1: Pre-test) ภาพรวมของหลักสูตรภาษา HTML ก่อน เพื่อวัดความรู้พื้นฐาน จึงจะสามารถเข้าสู่เนื้อหาบทเรียนได้
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/student/assessment?type=pre_test"
              className="btn btn-primary px-6 py-3 font-bold text-sm shadow-md"
            >
              <Play className="w-4 h-4 mr-1.5" />
              <span>เริ่มทำแบบทดสอบก่อนเรียน (Step 1: Pre-test) &rarr;</span>
            </Link>
            <Link href="/student/lessons" className="btn btn-ghost">
              <span>กลับสู่หน้ารวมบทเรียน</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Stage number for game mapping
  const stageNum = currentUnitIndex + 1;

  // Complete lesson & proceed to quiz
  const handleCompleteLesson = () => {
    setUnitStepCompleted(unit.id, 'lesson');
    setActiveTab('quiz');
  };

  // Submit Unit Quiz
  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizQuestions.length === 0) return;

    // Check answers
    let correctCount = 0;
    const attempts: Attempt[] = quizQuestions.map((q, idx) => {
      const ans = userAnswers[q.id] || '';
      const isCorrect = ans === q.correct_option;
      if (isCorrect) correctCount++;
      return {
        id: `att-quiz-${unit.id}-${idx}`,
        session_id: `sess-quiz-${unit.id}`,
        question_id: q.id,
        answer: ans,
        correct: isCorrect,
        response_time: 15,
        sequence: idx + 1,
        sub_domain_code: q.sub_domain_code,
        difficulty: q.difficulty,
        created_at: new Date().toISOString(),
      };
    });

    const scorePercentage = Math.round((correctCount / quizQuestions.length) * 100);
    setQuizScore(scorePercentage);
    setIsQuizSubmitted(true);

    // Save session in database
    const completedSession: TestSession = {
      id: `sess-quiz-${unit.id}-${Date.now()}`,
      student_id: 'std-1',
      student_name: 'สมชาย รักการเรียน (นักเรียน ปวช.1)',
      test_type: 'unit_quiz',
      target_sub_domain: unit.sub_domain_code,
      status: 'completed',
      total_questions: quizQuestions.length,
      correct_count: correctCount,
      score_percentage: scorePercentage,
      start_at: new Date().toISOString(),
      end_at: new Date().toISOString(),
      stop_reason: 'ทำแบบฝึกหัดท้ายหน่วย (Unit Quiz) เสร็จสิ้น',
      attempts,
    };

    saveTestSession(completedSession);

    // Mark Step 3: unit_quiz completed & unlock game
    setUnitStepCompleted(unit.id, 'unit_quiz', scorePercentage);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const prevUnit = currentUnitIndex > 0 ? units[currentUnitIndex - 1] : null;
  const nextUnit = currentUnitIndex < units.length - 1 ? units[currentUnitIndex + 1] : null;

  return (
    <div className="main-inner enter">
      {/* Top Stepper for 6 sequential steps */}
      <UnitPathStepper
        unitId={unit.id}
        currentStep={activeTab === 'quiz' ? 'unit_quiz' : 'lesson'}
      />

      {/* Unit Header Card */}
      <section className="win mb-4">
        <div className="win-bar">
          <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
          <div className="win-title"><em>&lt;/&gt;</em> {unit.sub_domain_code.toLowerCase()}-lesson.html</div>
        </div>
        <div className="win-body p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="chip chip-blue mono">{unit.sub_domain_code}</span>
            <span className="muted text-[12px] font-bold">{unit.title}</span>
          </div>
          <h1 className="m-0 mb-2 text-xl sm:text-[26px] font-bold">{lesson.title}</h1>
          <p className="muted m-0 mb-4 sm:mb-[18px] text-[13.5px] max-w-[640px] leading-[1.7]">
            {unit.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('slide')}
              className={`btn btn-sm ${activeTab === 'slide' ? 'btn-primary' : 'btn-ghost'}`}
            >
              <Presentation className="w-4 h-4" />
              <span>ดูสไลด์การสอน (Slide)</span>
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`btn btn-sm ${activeTab === 'video' ? 'btn-secondary' : 'btn-ghost'}`}
            >
              <Tv className="w-4 h-4 text-rose-500" />
              <span>ดูวิดีโอบทเรียน (Video)</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`btn btn-sm ${
                activeTab === 'quiz'
                  ? 'btn-primary'
                  : progress.unit_quiz_done
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                  : 'btn-ghost'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-amber-500" />
              <span>แบบฝึกหัดท้ายหน่วย (Quiz)</span>
              {progress.unit_quiz_done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1" />}
            </button>
            {canvaShareLink && (
              <a
                href={canvaShareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-navy btn-sm ml-auto"
              >
                <Presentation className="w-4 h-4 text-sky-300" />
                <span>เปิดใน Canva</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Window: Slides, Video, or Quiz */}
      <section className="win">
        <div className="win-tabs overflow-x-auto whitespace-nowrap">
          <button
            className={`win-tab ${activeTab === 'slide' ? 'active' : ''}`}
            onClick={() => setActiveTab('slide')}
          >
            <Presentation className="w-4 h-4 text-primary" />
            <span>สไลด์การสอน (Canva Slide)</span>
            {activeTab === 'slide' && <span className="dot"></span>}
          </button>
          <button
            className={`win-tab ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Tv className="w-4 h-4 text-rose-500" />
            <span>วิดีโอบทเรียน (Video Tutorial)</span>
            {activeTab === 'video' && <span className="dot"></span>}
          </button>
          <button
            className={`win-tab ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <CheckSquare className="w-4 h-4 text-amber-500" />
            <span>แบบฝึกหัดท้ายหน่วย (Step 3: Unit Quiz)</span>
            {activeTab === 'quiz' && <span className="dot"></span>}
          </button>
        </div>

        {/* 1. Canva Slides Player View */}
        {activeTab === 'slide' && (
          <div className="win-body tight">
            <div className="text-white p-4 sm:p-6 flex flex-col gap-4" style={{ background: 'linear-gradient(160deg,#090d18,#11172a)' }}>
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="chip mono bg-indigo-500/20 text-indigo-300 font-bold">{unit.sub_domain_code} CANVA PLAYER</span>
                  <span className="text-xs text-slate-300 hidden sm:inline">{unit.title}</span>
                </div>
                {canvaShareLink && (
                  <a
                    href={canvaShareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm bg-white/10 text-white hover:bg-white/20 py-1 px-3 text-xs"
                  >
                    เปิดใน Canva (เต็มหน้าจอ) <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                )}
              </div>

              {/* Interactive Canva Iframe */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                {canvaUrl ? (
                  <iframe
                    loading="lazy"
                    className="w-full h-full border-0"
                    src={canvaUrl}
                    allowFullScreen
                    allow="fullscreen"
                    title={`สไลด์การสอน Canva: ${lesson.title}`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <Presentation className="w-12 h-12 text-indigo-400 mb-3" />
                    <h3 className="text-base font-bold text-white mb-2">{lesson.title}</h3>
                    <p className="text-xs text-slate-400 max-w-sm mb-4">ยังไม่ได้ระบุ Canva Embed URL สำหรับบทเรียนนี้</p>
                  </div>
                )}
              </div>

              {/* Slide Outline Overview */}
              {slideTopics.length > 0 && (
                <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                  <h4 className="text-xs font-bold text-indigo-300 mb-2.5 uppercase tracking-wide">
                    หัวข้อสำคัญในชุดสไลด์นี้:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {slideTopics.map((topic, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-300 flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Action: Proceed to Quiz */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleCompleteLesson}
                  className="btn btn-primary px-5 py-2.5 text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>ศึกษาบทเรียนเสร็จแล้ว & ทำแบบฝึกหัดท้ายหน่วย (Step 3: Quiz) &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Video Player View */}
        {activeTab === 'video' && (
          <div className="win-body tight">
            <div className="text-white p-4 sm:p-6 flex flex-col gap-4" style={{ background: 'linear-gradient(160deg,#090d18,#11172a)' }}>
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="chip mono bg-rose-500/20 text-rose-300 font-bold">{unit.sub_domain_code} VIDEO TUTORIAL</span>
                  <span className="text-xs text-slate-300 hidden sm:inline">{lesson.title}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  ความละเอียด HD 1080p
                </span>
              </div>

              {/* Responsive Video Iframe */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                <iframe
                  className="w-full h-full border-0"
                  src={videoUrl}
                  title={`วิดีโอสอน: ${lesson.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                  <span>กดปุ่ม Play เพื่อรับชมวิดีโออธิบายเนื้อหาและตัวอย่างการเขียนโค้ด</span>
                </div>
                <button
                  onClick={handleCompleteLesson}
                  className="btn btn-primary px-4 py-2 text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>ไปทำแบบฝึกหัดท้ายหน่วย (Step 3) &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. NEW FEATURE: Unit Quiz View (Step 3) */}
        {activeTab === 'quiz' && (
          <div className="win-body p-6 sm:p-8 bg-surface">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-line">
                <div>
                  <span className="chip chip-amber mono text-xs font-bold uppercase mb-1">
                    Step 3: แบบฝึกหัดท้ายหน่วย
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-ink">
                    แบบฝึกหัดวัดความเข้าใจ: {unit.title}
                  </h2>
                  <p className="text-xs text-muted">
                    ตอบคำถามสั้น 4 ข้อเพื่อประเมินความเข้าใจและปลดล็อกมินิเกมประจำหน่วย
                  </p>
                </div>

                {isQuizSubmitted && quizScore !== null && (
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center gap-2 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>คะแนน: {quizScore}%</span>
                  </div>
                )}
              </div>

              {/* Quiz Form */}
              <form onSubmit={handleSubmitQuiz} className="space-y-6">
                {quizQuestions.map((q, idx) => {
                  const selectedAnswer = userAnswers[q.id];
                  const isCorrect = selectedAnswer === q.correct_option;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isQuizSubmitted
                          ? isCorrect
                            ? 'border-emerald-500/40 bg-emerald-500/5'
                            : 'border-rose-500/40 bg-rose-500/5'
                          : 'border-line bg-surface'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="font-bold text-sm text-ink leading-relaxed">
                          ข้อที่ {idx + 1}. {q.question_text}
                        </div>
                        {isQuizSubmitted && (
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-500/15 text-emerald-600'
                                : 'bg-rose-500/15 text-rose-600'
                            }`}
                          >
                            {isCorrect ? 'ถูกต้อง ✓' : 'ผิด ✕'}
                          </span>
                        )}
                      </div>

                      {q.code_snippet && (
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-line mb-4 overflow-x-auto">
                          <pre className="font-mono text-xs text-indigo-300 leading-relaxed m-0">
                            {q.code_snippet}
                          </pre>
                        </div>
                      )}

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(['A', 'B', 'C', 'D'] as const).map((key) => {
                          const choice = q.choices[key];
                          if (!choice) return null;

                          const isSelected = selectedAnswer === key;
                          const isRightChoice = key === q.correct_option;

                          let optionClass = 'border-line hover:border-primary/40 bg-bg-base';
                          let radioClass = 'border-line text-transparent';

                          if (isQuizSubmitted) {
                            if (isRightChoice) {
                              optionClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-bold';
                              radioClass = 'border-emerald-500 bg-emerald-500 text-white';
                            } else if (isSelected) {
                              optionClass = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200';
                              radioClass = 'border-rose-500 bg-rose-500 text-white';
                            }
                          } else if (isSelected) {
                            optionClass = 'border-primary bg-primary/10';
                            radioClass = 'border-primary bg-primary text-white';
                          }

                          return (
                            <label
                              key={key}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${optionClass} ${
                                isQuizSubmitted ? 'cursor-default' : 'cursor-pointer'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`quiz-${q.id}`}
                                value={key}
                                disabled={isQuizSubmitted}
                                checked={isSelected}
                                onChange={() =>
                                  setUserAnswers({
                                    ...userAnswers,
                                    [q.id]: key,
                                  })
                                }
                                className="hidden"
                              />
                              <span
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 ${radioClass}`}
                              >
                                {key}
                              </span>
                              <span className="text-xs leading-normal">{choice}</span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {isQuizSubmitted && q.explanation && (
                        <div className="mt-3.5 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                          <span className="font-bold text-primary block mb-0.5">เฉลย:</span>
                          <p className="m-0 text-muted leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Submit button or Post-Quiz Action */}
                {!isQuizSubmitted ? (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={Object.keys(userAnswers).length < quizQuestions.length}
                      className="btn btn-primary px-8 py-3 text-sm font-bold shadow-md disabled:opacity-40 cursor-pointer"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      <span>ส่งคำตอบแบบฝึกหัดท้ายหน่วย</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                    <div>
                      <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ผ่านแบบฝึกหัดท้ายหน่วยเรียบร้อย! ปลดล็อกขั้นตอนถัดไปแล้ว</span>
                      </div>
                      <p className="text-xs text-muted m-0">
                        ขั้นตอนถัดไปในลำดับคือการทดสอบทักษะผ่านมินิเกมกู้โค้ดประจำหน่วย
                      </p>
                    </div>

                    <Link
                      href={`/student/game?unit=${unit.id}&stage=${stageNum}`}
                      className="btn btn-primary px-6 py-2.5 text-xs font-bold shadow-md shrink-0 flex items-center gap-2"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>ไปเล่นเกมกู้เว็บพัง (Step 3: Game) &rarr;</span>
                    </Link>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Dynamic Previous / Next Navigation */}
      <div className="flex justify-between items-center mt-6 gap-2">
        {prevUnit ? (
          <Link href={`/student/lessons/${prevUnit.id}`} className="btn btn-ghost btn-sm max-w-[48%] truncate">
            <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{prevUnit.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextUnit ? (
          <Link href={`/student/lessons/${nextUnit.id}`} className="btn btn-navy btn-sm max-w-[48%] truncate">
            <span className="truncate">{nextUnit.title}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        ) : (
          <Link href="/student/lessons" className="btn btn-blue btn-sm">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>เรียนครบทุกบทแล้ว กลับสู่หน้ารวม</span>
          </Link>
        )}
      </div>
    </div>
  );
}
