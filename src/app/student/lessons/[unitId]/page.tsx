'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_UNITS, MOCK_LESSONS, getCanvaEmbedUrl, getCanvaShareUrl } from '@/lib/mock-data';
import { SUB_DOMAINS, SubDomainCode } from '@/types/database';
import {
  Presentation,
  Tv,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Play,
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
  const domain = SUB_DOMAINS[unit.sub_domain_code as SubDomainCode];

  const prevUnit = currentUnitIndex > 0 ? MOCK_UNITS[currentUnitIndex - 1] : null;
  const nextUnit = currentUnitIndex >= 0 && currentUnitIndex < MOCK_UNITS.length - 1 ? MOCK_UNITS[currentUnitIndex + 1] : null;

  // Only two content views: Slides and Video
  const [activeTab, setActiveTab] = useState<'slide' | 'video'>('slide');

  const slideMedia = lesson.media?.find((m) => m.media_type === 'slide');
  const videoMedia = lesson.media?.find((m) => m.media_type === 'video');
  const defaultEmbed = getCanvaEmbedUrl(slideMedia?.external_url, unit.id);
  const canvaShareLink = getCanvaShareUrl((slideMedia?.meta?.share_url as string), unit.id);
  const videoUrl = videoMedia?.external_url || 'https://www.youtube.com/embed/kUMe1FH4CHE';

  // Real-time Content State
  const [canvaUrl, setCanvaUrl] = useState(defaultEmbed);

  React.useEffect(() => {
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

  const slideTopics = (slideMedia?.meta?.slides as string[]) || [];

  return (
    <div className="main-inner enter">
      {/* Top Breadcrumb & Progress */}
      <div className="topline flex flex-wrap gap-2 items-center justify-between">
        <Link href="/student/lessons" className="btn btn-ghost btn-sm">
          <ChevronLeft className="w-3.5 h-3.5" />กลับไปยังรายการหน่วยการเรียนรู้
        </Link>
        <div className="bar w-24 sm:w-40">
          <span style={{ width: `${Math.round(((currentUnitIndex + 1) / MOCK_UNITS.length) * 100)}%` }}></span>
        </div>
      </div>

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
              <span>ดูสไลด์การสอน</span>
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
          </div>
        </div>
      </section>

      {/* Media Window: Only Slides and Video */}
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
                    {canvaShareLink && (
                      <a href={canvaShareLink} target="_blank" rel="noopener noreferrer" className="btn btn-blue btn-sm">
                        เปิดดูสไลด์ใน Canva <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
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

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>สามารถกดปุ่ม Play เพื่อรับชมวิดีโอประกอบการเรียนรู้ได้ทันที</span>
                </div>
                <button 
                  onClick={() => setActiveTab('slide')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold"
                >
                  สลับไปดูสไลด์ &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Dynamic Previous / Next Navigation */}
      <div className="flex justify-between items-center mt-4 gap-2">
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
