'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { MOCK_UNITS, MOCK_LESSONS, getCanvaEmbedUrl, getCanvaShareUrl } from '@/lib/mock-data';
import { SUB_DOMAINS, SubDomainCode } from '@/types/database';
import {
  markLessonCompleted,
  isLessonCompleted,
  getCourseProgress,
  ALL_UNIT_IDS,
  subscribeToProgress,
} from '@/lib/progress-service';
import {
  Presentation,
  Tv,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  Check,
  CheckCheck,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const resolvedParams = use(params);
  const { unitId } = resolvedParams;

  const currentUnitIndex = MOCK_UNITS.findIndex((u) => u.id === unitId);
  const unit = currentUnitIndex !== -1 ? MOCK_UNITS[currentUnitIndex] : MOCK_UNITS[0];
  const lesson = MOCK_LESSONS[unit.id] || MOCK_LESSONS[MOCK_UNITS[0].id];

  const prevUnit = currentUnitIndex > 0 ? MOCK_UNITS[currentUnitIndex - 1] : null;
  const nextUnit =
    currentUnitIndex >= 0 && currentUnitIndex < MOCK_UNITS.length - 1
      ? MOCK_UNITS[currentUnitIndex + 1]
      : null;

  // Tabs: Slides or Video
  const [activeTab, setActiveTab] = useState<'slide' | 'video'>('slide');

  const slideMedia = lesson.media?.find((m) => m.media_type === 'slide');
  const videoMedia = lesson.media?.find((m) => m.media_type === 'video');
  const defaultEmbed = getCanvaEmbedUrl(slideMedia?.external_url, unit.id);
  const canvaShareLink = getCanvaShareUrl((slideMedia?.meta?.share_url as string), unit.id);
  const videoUrl = videoMedia?.external_url || 'https://www.youtube.com/embed/kUMe1FH4CHE';

  // Real-time Content State
  const [canvaUrl, setCanvaUrl] = useState(defaultEmbed);

  // Slide Tracking & Completion States
  const slideTopics = (slideMedia?.meta?.slides as string[]) || [];
  const totalSlides = Math.max(slideTopics.length, Number(slideMedia?.meta?.pages) || 6);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewedSlideIndices, setViewedSlideIndices] = useState<number[]>([0]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [allLessonsDone, setAllLessonsDone] = useState<boolean>(false);
  const [completedCount, setCompletedCount] = useState<number>(0);

  // Load lesson status & progress
  useEffect(() => {
    const syncStatus = () => {
      const done = isLessonCompleted(unit.id);
      setIsCompleted(done);
      const cp = getCourseProgress();
      const compList = cp.completed_lessons || [];
      setCompletedCount(compList.length);
      const allDone = ALL_UNIT_IDS.every((id) => compList.includes(id));
      setAllLessonsDone(allDone);
      if (done) {
        // If already completed, mark all slides as viewed
        setViewedSlideIndices(Array.from({ length: totalSlides }, (_, i) => i));
      }
    };

    syncStatus();
    const unsub = subscribeToProgress(syncStatus);
    return () => unsub();
  }, [unit.id, totalSlides]);

  useEffect(() => {
    const loadLessonData = () => {
      const saved = localStorage.getItem(`webai_lesson_data_${unit.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.canvaUrl !== undefined && parsed.canvaUrl.trim() !== '') {
            setCanvaUrl(getCanvaEmbedUrl(parsed.canvaUrl, unit.id));
          } else {
            setCanvaUrl(defaultEmbed);
          }
        } catch {
          setCanvaUrl(defaultEmbed);
        }
      } else {
        setCanvaUrl(defaultEmbed);
      }
    };

    loadLessonData();
    window.addEventListener('storage', loadLessonData);
    const intervalId = setInterval(loadLessonData, 2000);

    return () => {
      window.removeEventListener('storage', loadLessonData);
      clearInterval(intervalId);
    };
  }, [unit.id, defaultEmbed]);

  const triggerComplete = () => {
    const { allDone, updated } = markLessonCompleted(unit.id);
    setIsCompleted(true);
    setAllLessonsDone(allDone);
    setCompletedCount(updated.completed_lessons?.length || 1);
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const handleSlideChange = (newIdx: number) => {
    if (newIdx >= 0 && newIdx < totalSlides) {
      setCurrentSlideIndex(newIdx);
      setViewedSlideIndices((prev) => {
        const next = Array.from(new Set([...prev, newIdx]));
        // If all slides have been viewed
        if (next.length >= totalSlides && !isCompleted) {
          triggerComplete();
        }
        return next;
      });
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      handleSlideChange(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      handleSlideChange(currentSlideIndex + 1);
    } else {
      // Reached the end: complete the lesson
      triggerComplete();
    }
  };

  const slideProgressPct = Math.min(
    100,
    Math.round((viewedSlideIndices.length / totalSlides) * 100)
  );

  return (
    <div className="main-inner enter space-y-5 pb-16">
      {/* Top Breadcrumb & Progress */}
      <div className="topline flex flex-wrap gap-2 items-center justify-between">
        <Link href="/student/lessons" className="btn btn-ghost btn-sm flex items-center gap-1 text-xs">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>กลับไปยังเส้นทางการเรียนรู้</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted">
            บทที่ {currentUnitIndex + 1} / {MOCK_UNITS.length}
          </span>
          <div className="bar w-24 sm:w-36">
            <span
              style={{
                width: `${Math.round(((currentUnitIndex + 1) / MOCK_UNITS.length) * 100)}%`,
              }}
            ></span>
          </div>
        </div>
      </div>

      {/* Unit Header Card */}
      <section className="win">
        <div className="win-bar">
          <div className="win-dots">
            <i className="r"></i>
            <i className="y"></i>
            <i className="g"></i>
          </div>
          <div className="win-title">
            <em>&lt;/&gt;</em> {unit.sub_domain_code.toLowerCase()}-lesson.html
          </div>
          <div className="win-actions">
            {isCompleted ? (
              <span className="chip chip-success mono text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>สำเร็จบทนี้แล้ว ✓</span>
              </span>
            ) : (
              <span className="chip chip-line mono text-xs text-amber-500 border-amber-500/30 font-bold">
                ดูสไลด์ {viewedSlideIndices.length}/{totalSlides} หน้า
              </span>
            )}
          </div>
        </div>
        <div className="win-body p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="chip chip-blue mono">{unit.sub_domain_code}</span>
            <span className="muted text-[12px] font-bold">{unit.title}</span>
          </div>
          <h1 className="m-0 mb-2 text-xl sm:text-[26px] font-bold text-ink">{lesson.title}</h1>
          <p className="muted m-0 mb-4 sm:mb-[18px] text-[13.5px] max-w-[640px] leading-[1.7]">
            {unit.description}
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('slide')}
              className={`btn btn-sm ${activeTab === 'slide' ? 'btn-primary' : 'btn-ghost'}`}
            >
              <Presentation className="w-4 h-4" />
              <span>ดูสไลด์การสอน ({totalSlides} หน้า)</span>
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`btn btn-sm ${activeTab === 'video' ? 'btn-secondary' : 'btn-ghost'}`}
            >
              <Tv className="w-4 h-4 text-rose-500" />
              <span>ดูวิดีโอบทเรียน</span>
            </button>
            {canvaShareLink && (
              <a
                href={canvaShareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-navy btn-sm"
              >
                <Presentation className="w-4 h-4 text-sky-300" />
                <span>เปิดใน Canva</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}

            {/* Quick Completion Button */}
            <div className="sm:ml-auto">
              {isCompleted ? (
                <span className="btn btn-sm bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-bold cursor-default">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>เรียนสำเร็จบทนี้แล้ว ✓</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={triggerComplete}
                  className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 font-bold shadow-xs cursor-pointer hover:scale-[1.02] transition-all"
                  title="เมื่อดูสไลด์ครบแล้ว ให้กดปุ่มนี้เพื่อบันทึกว่าสำเร็จ"
                >
                  <Check className="w-4 h-4" />
                  <span>ทำเครื่องหมายว่าดูครบแล้ว ✓</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Media Window: Slides and Video */}
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
        </div>

        {/* 1. Canva Slides Player View */}
        {activeTab === 'slide' && (
          <div className="win-body tight">
            <div
              className="text-white p-4 sm:p-6 flex flex-col gap-4"
              style={{ background: 'linear-gradient(160deg,#090d18,#11172a)' }}
            >
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="chip mono bg-indigo-500/20 text-indigo-300 font-bold">
                    {unit.sub_domain_code} CANVA PLAYER
                  </span>
                  <span className="text-xs text-slate-300 hidden sm:inline">{unit.title}</span>
                  {isCompleted ? (
                    <span className="chip bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> สำเร็จบทนี้แล้ว
                    </span>
                  ) : (
                    <span className="chip bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[11px]">
                      ดูแล้ว {viewedSlideIndices.length}/{totalSlides} หน้า
                    </span>
                  )}
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
                    <p className="text-xs text-slate-400 max-w-sm mb-4">
                      ยังไม่ได้ระบุ Canva Embed URL สำหรับบทเรียนนี้
                    </p>
                    {canvaShareLink && (
                      <a
                        href={canvaShareLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-blue btn-sm"
                      >
                        เปิดดูสไลด์ใน Canva <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Interactive Slide Stepper / Controller */}
              <div className="card p-4 sm:p-5 border border-white/10 bg-slate-900/90 rounded-2xl shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="chip mono text-[11px] bg-indigo-500/20 text-indigo-300 font-bold">
                        สไลด์หน้า {currentSlideIndex + 1} / {totalSlides}
                      </span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>สำเร็จบทนี้แล้ว</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                          <span>กำลังศึกษา (ดูแล้ว {viewedSlideIndices.length}/{totalSlides} หน้า)</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {slideTopics[currentSlideIndex] ||
                        `สไลด์เนื้อหาตอนที่ ${currentSlideIndex + 1}`}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentSlideIndex <= 0}
                      onClick={handlePrevSlide}
                      className="btn btn-sm bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>ก่อนหน้า</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextSlide}
                      className={`btn btn-sm cursor-pointer flex items-center gap-1.5 font-bold shadow-sm transition-all ${
                        currentSlideIndex < totalSlides - 1
                          ? 'btn-primary'
                          : isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse'
                      }`}
                    >
                      {currentSlideIndex < totalSlides - 1 ? (
                        <>
                          <span>สไลด์ถัดไป</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isCompleted ? 'ดูสไลด์ครบแล้ว ✓' : 'กดเพื่อเรียนสำเร็จ ✓'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress Bar of Slides */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>ความคืบหน้าการดูสไลด์</span>
                    <span className="text-indigo-300 font-bold">{slideProgressPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${slideProgressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Slide Outline Overview */}
              {slideTopics.length > 0 && (
                <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                      หัวข้อสำคัญในชุดสไลด์นี้ ({slideTopics.length} หัวข้อ):
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      คลิกเพื่อกระโดดไปยังสไลด์ที่ต้องการ
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {slideTopics.map((topic, idx) => {
                      const isCurrent = currentSlideIndex === idx;
                      const isViewed = viewedSlideIndices.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSlideChange(idx)}
                          className={`text-xs text-left flex items-center justify-between gap-2 p-2.5 rounded-lg border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold shadow-xs'
                              : isViewed
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-200 hover:bg-emerald-500/20'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={`w-5 h-5 rounded-md font-mono text-[10px] flex items-center justify-center shrink-0 ${
                                isCurrent
                                  ? 'bg-indigo-500 text-white font-bold'
                                  : isViewed
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-white/10 text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="truncate">{topic}</span>
                          </div>
                          {isViewed && (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Lesson Completion Card & Next Action */}
              {isCompleted && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-primary/10 to-indigo-500/20 border border-emerald-500/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
                        <span>🎉 ยินดีด้วย! คุณเรียนรู้สไลด์บทนี้สำเร็จแล้ว</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {allLessonsDone
                          ? 'คุณเรียนครบทั้ง 5 บทเรียนแล้ว! ขั้นตอนที่ 3 "เกมกู้เว็บพัง" ปลดล็อกแล้ว เข้าไปเล่นเกมได้เลย'
                          : `เรียนสำเร็จแล้ว ${completedCount}/5 บท (ศึกษาให้ครบทุกบทเพื่อปลดล็อกเกมกู้เว็บพัง)`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {allLessonsDone ? (
                      <Link
                        href="/student/game"
                        className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto flex items-center justify-center gap-2 font-bold shadow-md ring-2 ring-emerald-500/40 py-2.5 px-4"
                      >
                        <Gamepad2 className="w-4 h-4" />
                        <span>เข้าสู่เกมกู้เว็บพัง (Step 3) ➔</span>
                      </Link>
                    ) : nextUnit ? (
                      <Link
                        href={`/student/lessons/${nextUnit.id}`}
                        className="btn btn-primary btn-sm w-full sm:w-auto flex items-center justify-center gap-1.5 font-bold shadow-md py-2 px-3"
                      >
                        <span>ไปบทถัดไป: {nextUnit.title}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Video Player View */}
        {activeTab === 'video' && (
          <div className="win-body tight">
            <div
              className="text-white p-4 sm:p-6 flex flex-col gap-4"
              style={{ background: 'linear-gradient(160deg,#090d18,#11172a)' }}
            >
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="chip mono bg-rose-500/20 text-rose-300 font-bold">
                    {unit.sub_domain_code} VIDEO TUTORIAL
                  </span>
                  <span className="text-xs text-slate-300 hidden sm:inline">{lesson.title}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">ความละเอียด HD 1080p</span>
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

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>สามารถกดปุ่ม Play เพื่อรับชมวิดีโอประกอบการเรียนรู้ได้ทันที</span>
                </div>
                <button
                  onClick={() => setActiveTab('slide')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold"
                >
                  สลับไปดูสไลด์ ➔
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Dynamic Previous / Next Navigation */}
      <div className="flex justify-between items-center mt-4 gap-2">
        {prevUnit ? (
          <Link
            href={`/student/lessons/${prevUnit.id}`}
            className="btn btn-ghost btn-sm max-w-[48%] truncate flex items-center gap-1.5"
          >
            <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{prevUnit.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextUnit ? (
          <Link
            href={`/student/lessons/${nextUnit.id}`}
            className="btn btn-navy btn-sm max-w-[48%] truncate flex items-center gap-1.5 font-bold"
          >
            <span className="truncate">{nextUnit.title}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        ) : allLessonsDone ? (
          <Link
            href="/student/game"
            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md px-4 py-2"
          >
            <Gamepad2 className="w-4 h-4 shrink-0" />
            <span>เข้าสู่เกมกู้เว็บพัง (ปลดล็อกแล้ว) ➔</span>
          </Link>
        ) : (
          <Link href="/student/lessons" className="btn btn-blue btn-sm flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>เรียนครบแล้ว กลับสู่หน้ารวมบทเรียน</span>
          </Link>
        )}
      </div>
    </div>
  );
}
