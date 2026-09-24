'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_UNITS, MOCK_LESSONS, CANVA_SLIDES, getCanvaEmbedUrl, getCanvaShareUrl } from '@/lib/mock-data';
import { SUB_DOMAINS, SubDomainCode } from '@/types/database';
import {
  Presentation,
  Tv,
  FileText,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Terminal,
  MessageSquare,
  ArrowRight,
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

  const [activeTab, setActiveTab] = useState<'content' | 'slide' | 'video' | 'doc'>('content');

  const slideMedia = lesson.media?.find((m) => m.media_type === 'slide');
  const defaultEmbed = getCanvaEmbedUrl(slideMedia?.external_url, unit.id);
  const canvaShareLink = getCanvaShareUrl((slideMedia?.meta?.share_url as string), unit.id);

  // Real-time Content State
  const [canvaUrl, setCanvaUrl] = useState(defaultEmbed);
  const [lessonContent, setLessonContent] = useState(lesson.content || '');

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
          if (parsed.content !== undefined && parsed.content.trim() !== '') {
            setLessonContent(parsed.content);
          } else {
            setLessonContent(lesson.content || '');
          }
        } catch {
          setCanvaUrl(defaultEmbed);
          setLessonContent(lesson.content || '');
        }
      } else {
        setCanvaUrl(defaultEmbed);
        setLessonContent(lesson.content || '');
      }
    };

    loadLessonData();
    window.addEventListener('storage', loadLessonData);
    const intervalId = setInterval(loadLessonData, 2000);

    return () => {
      window.removeEventListener('storage', loadLessonData);
      clearInterval(intervalId);
    };
  }, [unit.id, defaultEmbed, lesson.content]);

  const slideTopics = (slideMedia?.meta?.slides as string[]) || [];

  return (
    <div className="main-inner enter">
      <div className="topline flex flex-wrap gap-2 items-center justify-between">
        <Link href="/student/lessons" className="btn btn-ghost btn-sm">
          <ChevronLeft className="w-3.5 h-3.5" />กลับไปยังรายการหน่วยการเรียนรู้
        </Link>
        <div className="bar w-24 sm:w-40"><span style={{ width: `${Math.round(((currentUnitIndex + 1) / MOCK_UNITS.length) * 100)}%` }}></span></div>
      </div>

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
            <Link href={`/student/codelab?subdomain=${unit.sub_domain_code}`} className="btn btn-green btn-sm w-full sm:w-auto justify-center">
              <Terminal className="w-4 h-4" />ฝึกใน Code Lab
            </Link>
            <Link href={`/student/tutor?unit=${unit.sub_domain_code}`} className="btn btn-soft btn-sm w-full sm:w-auto justify-center">
              <MessageSquare className="w-4 h-4" />ถาม AI Tutor เกี่ยวกับบทนี้
            </Link>
            {canvaShareLink && (
              <a
                href={canvaShareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-navy btn-sm w-full sm:w-auto justify-center"
              >
                <Presentation className="w-4 h-4 text-sky-300" />
                <span>เปิดดูสไลด์ใน Canva</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="win">
        <div className="win-tabs overflow-x-auto whitespace-nowrap">
          <button className={`win-tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
            <FileText className="w-3.5 h-3.5" />content.md{activeTab === 'content' && <span className="dot"></span>}
          </button>
          <button className={`win-tab ${activeTab === 'slide' ? 'active' : ''}`} onClick={() => setActiveTab('slide')}>
            <Presentation className="w-3.5 h-3.5" />slide.canva{activeTab === 'slide' && <span className="dot"></span>}
          </button>
          <button className={`win-tab ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}>
            <Tv className="w-3.5 h-3.5" />video.mp4{activeTab === 'video' && <span className="dot"></span>}
          </button>
          <button className={`win-tab ${activeTab === 'doc' ? 'active' : ''}`} onClick={() => setActiveTab('doc')}>
            <FileText className="w-3.5 h-3.5" />doc.pdf{activeTab === 'doc' && <span className="dot"></span>}
          </button>
        </div>

        {activeTab === 'content' && (
          <div className="win-body">
            <div className="max-w-[840px] mx-auto w-full">
              
              {/* Canva Presentation Preview Card */}
              <div className="mb-8 rounded-2xl overflow-hidden border border-line bg-surface shadow-sm">
                <div className="p-3 sm:p-3.5 bg-muted/40 border-b border-line flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="chip mono bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] py-0.5 px-2 rounded-md">
                      CANVA SLIDES
                    </span>
                    <span className="text-xs font-bold text-ink">
                      สไลด์ประกอบบทเรียน: {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('slide')}
                      className="btn btn-ghost btn-sm text-xs py-1 px-2.5 h-auto text-muted hover:text-ink"
                    >
                      ดูแบบเต็มแท็บ
                    </button>
                    {canvaShareLink && (
                      <a
                        href={canvaShareLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-soft btn-sm text-xs py-1 px-2.5 h-auto text-indigo-600 hover:text-indigo-700"
                      >
                        เปิดใน Canva <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="relative aspect-video w-full bg-slate-950">
                  {canvaUrl ? (
                    <iframe
                      loading="lazy"
                      className="absolute inset-0 w-full h-full border-0 z-10"
                      src={canvaUrl}
                      allowFullScreen
                      allow="fullscreen"
                      title={`Canva Presentation for ${lesson.title}`}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                      <Presentation className="w-10 h-10 text-indigo-400 mb-3" />
                      <p className="text-sm font-semibold mb-2">ยังไม่มี URL สไลด์ Canva</p>
                      {canvaShareLink && (
                        <a
                          href={canvaShareLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-blue btn-sm"
                        >
                          เปิดดูสไลด์ <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Lesson Text Content */}
              <article
                className="prose max-w-none text-ink text-[15px] leading-relaxed whitespace-pre-line bg-surface p-6 sm:p-8 rounded-2xl border border-line shadow-sm mb-6"
                dangerouslySetInnerHTML={{ __html: lessonContent }}
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5 p-4 bg-blue-dim rounded-xl">
                <div className="flex items-start sm:items-center gap-3">
                  <Sparkles className="w-[18px] h-[18px] text-theme-blue shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-[12.5px] font-bold text-ink">
                    สามารถเปิดดูสไลด์แบบโต้ตอบได้ที่แท็บ <strong>slide.canva</strong>
                  </span>
                </div>
                <button className="btn btn-blue btn-sm w-full sm:w-auto shrink-0 justify-center" onClick={() => setActiveTab('slide')}>
                  ดูสไลด์ Canva
                </button>
              </div>
            </div>
          </div>
        )}

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

        {activeTab === 'video' && (
          <div className="win-body p-4 sm:p-7">
            <div className="bg-code-bg rounded-2xl aspect-video max-w-[760px] mx-auto flex items-center justify-center relative overflow-hidden group">
              <button className="icon-btn w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border border-white/20 text-white group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 sm:w-[26px] sm:h-[26px]" />
              </button>
              <span className="absolute bottom-2.5 sm:bottom-3.5 left-3 sm:left-4 text-slate-300 text-[10px] sm:text-[11px] font-mono">
                วิดีโอประกอบการเรียนรู้: {lesson.title}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'doc' && (
          <div className="win-body">
            <div className="card max-w-[520px] mx-auto p-6 text-center">
              <FileText className="w-[34px] h-[34px] text-theme-red mx-auto mb-2.5" />
              <h3 className="m-0 mb-1.5 text-[15px] font-bold truncate">เอกสารประกอบ {unit.title}.pdf</h3>
              <p className="muted text-xs m-0 mb-4 truncate">สรุปเนื้อหา ตัวอย่างโค้ด และแบบฝึกหัดท้ายบท</p>
              <button className="btn btn-ghost btn-sm w-full sm:w-auto justify-center">
                ดาวน์โหลดเอกสาร <ArrowRight className="w-3.5 h-3.5" />
              </button>
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

