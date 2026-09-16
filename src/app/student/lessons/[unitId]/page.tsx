'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_UNITS, MOCK_LESSONS } from '@/lib/mock-data';
import { SUB_DOMAINS, SubDomainCode } from '@/types/database';
import {
  BookOpen,
  Presentation,
  Tv,
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Sparkles,
  Terminal,
  MessageSquare,
  ArrowLeft,
  Download,
} from 'lucide-react';

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const resolvedParams = use(params);
  const { unitId } = resolvedParams;

  const unit = MOCK_UNITS.find((u) => u.id === unitId) || MOCK_UNITS[0];
  const lesson = MOCK_LESSONS[unitId] || MOCK_LESSONS['u-h1'];
  const domain = SUB_DOMAINS[unit.sub_domain_code as SubDomainCode];

  const [activeTab, setActiveTab] = useState<'content' | 'slide' | 'video' | 'doc'>('content');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewedSlides, setViewedSlides] = useState<Set<number>>(new Set([0]));
  const [videoWatched, setVideoWatched] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slideMedia = lesson.media?.find((m) => m.media_type === 'slide');
  const videoMedia = lesson.media?.find((m) => m.media_type === 'video');
  const docMedia = lesson.media?.find((m) => m.media_type === 'document');

  const slides = slideMedia?.meta?.slides || [
    `สไลด์ 1: บทนำ ${unit.title}`,
    `สไลด์ 2: วัตถุประสงค์การเรียนรู้ของ ${unit.sub_domain_code}`,
    `สไลด์ 3: โครงสร้างหลักและหลักการทำงาน`,
    `สไลด์ 4: ตัวอย่างการนำไปใช้จริงในงานพัฒนาเว็บไซต์`,
    `สไลด์ 5: สรุปและแบบตรวจสอบตนเอง`,
  ];

  const totalSlides = slides.length;

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      const nextIdx = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIdx);
      setViewedSlides((prev) => new Set([...prev, nextIdx]));
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const slidesComplete = viewedSlides.size >= totalSlides;

  return (
    <div className="space-y-6 pb-16">
      {/* Back link & progress */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/lessons"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับไปยังรายการหน่วยการเรียนรู้</span>
        </Link>

        <div>
          {slidesComplete ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              เรียนจบแล้ว (100%)
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              สไลด์ที่เปิดดู: {viewedSlides.size}/{totalSlides} หน้า
            </span>
          )}
        </div>
      </div>

      {/* Unit Header in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            {unit.sub_domain_code}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {domain?.name}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {unit.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {lesson.title} — {unit.description}
        </p>

        {/* Quick Action Links */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          <Link
            href={`/student/codelab?subdomain=${unit.sub_domain_code}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>ฝึกใน Code Lab</span>
          </Link>
          <Link
            href={`/student/tutor?unit=${unit.sub_domain_code}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-bold transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ถาม AI Tutor เกี่ยวกับบทนี้</span>
          </Link>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-1">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all ${
            activeTab === 'content'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>เนื้อหาบทเรียน</span>
        </button>

        <button
          onClick={() => setActiveTab('slide')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all ${
            activeTab === 'slide'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>สไลด์การสอน ({totalSlides})</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all ${
            activeTab === 'video'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>วีดีโอการสอน</span>
        </button>

        <button
          onClick={() => setActiveTab('doc')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all ${
            activeTab === 'doc'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>เอกสารประกอบ</span>
        </button>
      </div>

      {/* Tab 1: Written Content */}
      {activeTab === 'content' && (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6">
          <article className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
            {lesson.content}
          </article>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>แนะนำให้เปิดดู **สไลด์การสอน** ในแท็บถัดไปเพื่อดูภาพประกอบโครงสร้าง</span>
            </div>
            <button
              onClick={() => setActiveTab('slide')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs shrink-0 ml-2 transition-all"
            >
              ดูสไลด์การสอน
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Slide Viewer */}
      {activeTab === 'slide' && (
        <div className="space-y-4">
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-2xl min-h-[400px] flex flex-col justify-between border border-slate-800 relative">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
                  {unit.sub_domain_code} SLIDE VIEWER
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  หน้าที่ {currentSlideIndex + 1} / {totalSlides}
                </span>
              </div>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="ขยายเต็มจอ"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="py-10 text-center space-y-4 max-w-xl mx-auto">
              <div className="inline-flex p-4 rounded-3xl bg-indigo-600/30 text-indigo-300 border border-indigo-400/20 shadow-lg">
                <Presentation className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {slides[currentSlideIndex]}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                สาระสำคัญของ {unit.title} — การทำความเข้าใจโครงสร้างและไวยากรณ์ตามมาตรฐานสากล W3C สำหรับหลักสูตร ปวช.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>สไลด์ก่อนหน้า</span>
              </button>

              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      setViewedSlides((prev) => new Set([...prev, idx]));
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === currentSlideIndex
                        ? 'w-7 bg-indigo-400'
                        : viewedSlides.has(idx)
                        ? 'w-2.5 bg-emerald-400/70'
                        : 'w-2.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextSlide}
                disabled={currentSlideIndex === totalSlides - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold shadow-md transition-all"
              >
                <span>สไลด์ถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between px-2">
            <span>* คลิกเลื่อนดูสไลด์ให้ครบทุกหน้าเพื่อบันทึกสถานะการเรียนจบของหน่วยนี้</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              เปิดดูแล้ว {viewedSlides.size} จาก {totalSlides} หน้า
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Video Player */}
      {activeTab === 'video' && (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center relative shadow-xl">
            {videoMedia?.external_url ? (
              <iframe
                src={videoMedia.external_url}
                title={videoMedia.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center text-slate-400 space-y-2 p-6">
                <Tv className="w-12 h-12 mx-auto text-slate-500" />
                <p className="text-sm font-bold">วิดีโอบรรยาย {unit.title}</p>
                <p className="text-xs text-slate-500">
                  ความยาวประมาณ 8 นาที — เน้นการวิเคราะห์โครงสร้างและสาธิตการเขียนจริง
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {videoMedia?.title || `วิดีโอสาธิต: ${unit.title}`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                เรียนรู้ขั้นตอนการเขียนโค้ดและโครงสร้าง HTML5 อย่างเป็นระบบ
              </p>
            </div>

            <button
              onClick={() => setVideoWatched(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                videoWatched
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{videoWatched ? 'รับชมจบแล้ว ✓' : 'ทำเครื่องหมายว่าดูจบแล้ว'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Downloadable Documents */}
      {activeTab === 'doc' && (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              เอกสารประกอบการเรียนและใบงาน
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ดาวน์โหลดใบความรู้ สรุปไวยากรณ์ และใบงานแบบฝึกหัดสำหรับชั้นเรียน ปวช.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-800/40 flex items-center justify-between hover:border-indigo-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    สรุปสูตรลัดและไวยากรณ์: {unit.title} (PDF)
                  </div>
                  <div className="text-[11px] text-slate-400">ขนาด 1.2 MB • ภาษาไทย</div>
                </div>
              </div>
              <button
                onClick={() => alert('กำลังดาวน์โหลดไฟล์สรุปความรู้ HTML')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
