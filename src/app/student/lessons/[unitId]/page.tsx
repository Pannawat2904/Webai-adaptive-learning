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
  ArrowRight,
  Play
} from 'lucide-react';

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const resolvedParams = use(params);
  const { unitId } = resolvedParams;

  const unit = MOCK_UNITS.find((u) => u.id === unitId) || MOCK_UNITS[0];
  const lesson = MOCK_LESSONS[unitId] || MOCK_LESSONS['u-h3']; // Fallback to H3 for demo
  const domain = SUB_DOMAINS[unit.sub_domain_code as SubDomainCode];

  const [activeTab, setActiveTab] = useState<'content' | 'slide' | 'video' | 'doc'>('content');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewedSlides, setViewedSlides] = useState<Set<number>>(new Set([0]));
  const [videoWatched, setVideoWatched] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slideMedia = lesson.media?.find((m) => m.media_type === 'slide');
  const videoMedia = lesson.media?.find((m) => m.media_type === 'video');
  const docMedia = lesson.media?.find((m) => m.media_type === 'document');

  // Real-time Content State
  const [canvaUrl, setCanvaUrl] = useState('');
  const [lessonContent, setLessonContent] = useState(lesson.content || `แท็ก <a class="mono font-bold text-primary bg-primary-dim px-2 py-0.5 rounded-md border border-primary-dim">&lt;a&gt;</a> คือหัวใจของการเชื่อมโยงหน้าเว็บ (Hyperlink) ใช้แอตทริบิวต์ <code class="mono font-bold text-ink bg-bg-base px-2 py-0.5 rounded-md border border-line">href</code> เพื่อระบุปลายทาง และสามารถกำหนด <code class="mono font-bold text-ink bg-bg-base px-2 py-0.5 rounded-md border border-line">target="_blank"</code> เพื่อเปิดลิงก์ในแท็บใหม่\n\nข้อควรระวัง: การเปิดลิงก์ในแท็บใหม่ควรใช้คู่กับ <code class="mono font-bold text-ink bg-bg-base px-2 py-0.5 rounded-md border border-line">rel="noopener"</code> เพื่อความปลอดภัย และควรเขียนข้อความลิงก์ให้สื่อความหมาย ไม่ใช้คำว่า "คลิกที่นี่" ลอย ๆ เพื่อการเข้าถึงที่ดี (Accessibility)`);

  React.useEffect(() => {
    const loadLessonData = () => {
      // The unit.id is 'u-h1', 'u-h2' etc. which matches what we save in the teacher portal
      const saved = localStorage.getItem(`webai_lesson_data_${unit.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.canvaUrl !== undefined) setCanvaUrl(parsed.canvaUrl);
          if (parsed.content !== undefined && parsed.content.trim() !== '') setLessonContent(parsed.content);
        } catch {
          // keep defaults
        }
      }
    };

    loadLessonData();
    window.addEventListener('storage', loadLessonData);
    const intervalId = setInterval(loadLessonData, 2000); // Polling fallback

    return () => {
      window.removeEventListener('storage', loadLessonData);
      clearInterval(intervalId);
    };
  }, [unit.id]);

  // Hardcode H3 slides for the prototype showcase
  const slides = [
    {t:"โครงสร้างพื้นฐานของแท็ก a", d:"การใช้ href เพื่อระบุปลายทางของลิงก์"},
    {t:"แอตทริบิวต์ href และ target", d:"การกำหนดปลายทางของลิงก์และพฤติกรรมการเปิดหน้าต่างใหม่ ตามมาตรฐาน W3C"},
    {t:"Anchor link ภายในหน้าเดียวกัน", d:"การเชื่อมโยงไปยัง id ภายในหน้าเว็บเดียวกัน"},
    {t:'rel="noopener" เพื่อความปลอดภัย', d:"ป้องกันหน้าต้นทางถูกควบคุมจากหน้าที่เปิดใหม่"},
    {t:"การเขียนข้อความลิงก์ที่เข้าถึงได้", d:"หลีกเลี่ยงคำว่า 'คลิกที่นี่' เพื่อ Accessibility ที่ดี"},
    {t:"แบบฝึกหัดท้ายหน่วย", d:"ทบทวนความเข้าใจก่อนเข้าห้องปฏิบัติการ Code Lab"}
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

  return (
    <div className="main-inner enter">
      <div className="topline flex flex-wrap gap-2 items-center justify-between">
        <Link href="/student/lessons" className="btn btn-ghost btn-sm">
          <ChevronLeft className="w-3.5 h-3.5" />กลับไปยังรายการหน่วยการเรียนรู้
        </Link>
        <div className="bar w-24 sm:w-40"><span style={{ width: '64%' }}></span></div>
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
          </div>
        </div>
      </section>

      <section className="win">
        <div className="win-tabs overflow-x-auto whitespace-nowrap">
          <button className={`win-tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
            <FileText className="w-3.5 h-3.5" />content.md{activeTab === 'content' && <span className="dot"></span>}
          </button>
          <button className={`win-tab ${activeTab === 'slide' ? 'active' : ''}`} onClick={() => setActiveTab('slide')}>
            <Presentation className="w-3.5 h-3.5" />slide.pptx{activeTab === 'slide' && <span className="dot"></span>}
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
            <div className="max-w-[800px] mx-auto w-full">
              
              {/* Canva Presentation Preview */}
              <div className="mb-8 rounded-2xl overflow-hidden border border-line bg-surface shadow-sm relative aspect-video group">
                {canvaUrl ? (
                  <iframe
                    loading="lazy"
                    className="absolute inset-0 w-full h-full border-0 z-10 bg-white"
                    src={canvaUrl}
                    allowFullScreen
                    allow="fullscreen"
                    title={`Canva Presentation for ${lesson.title}`}
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 bg-surface flex flex-col items-center justify-center" style={{ background: 'linear-gradient(160deg,#F8FAFC,#E2E8F0)' }}>
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform cursor-pointer">
                       <Presentation className="w-8 h-8 text-primary" />
                     </div>
                     <h3 className="text-xl font-bold text-ink mb-2 text-center px-4">สไลด์ประกอบบทเรียน: {lesson.title}</h3>
                     <div className="flex items-center gap-2 text-muted text-sm font-medium">
                       <span className="w-2 h-2 rounded-full bg-accent"></span> No Canva Presentation URL provided
                     </div>
                  </div>
                )}
              </div>

              <article className="prose max-w-none text-ink text-[15px] leading-relaxed whitespace-pre-line bg-surface p-6 sm:p-8 rounded-2xl border border-line shadow-sm mb-6" dangerouslySetInnerHTML={{ __html: lessonContent }} />

              <div className="bg-code-bg rounded-xl p-4 sm:p-[18px_20px] my-4 sm:my-[18px] overflow-x-auto">
                <pre className="mono m-0 text-xs sm:text-[12.5px] leading-[1.8] text-[#c9d4e8]">
                  <span className="text-[#71809a]">&lt;!-- ลิงก์ไปหน้าอื่น เปิดแท็บใหม่ --&gt;</span>{'\n'}
                  <span className="text-[#ff8fa3]">&lt;a</span> <span className="text-[#7ee0b7]">href</span>=<span className="text-[#f5c977]">"about.html"</span> <span className="text-[#7ee0b7]">target</span>=<span className="text-[#f5c977]">"_blank"</span><span className="text-[#ff8fa3]">&gt;</span>เกี่ยวกับเรา<span className="text-[#ff8fa3]">&lt;/a&gt;</span>{'\n\n'}
                  <span className="text-[#71809a]">&lt;!-- Anchor link ภายในหน้าเดียวกัน --&gt;</span>{'\n'}
                  <span className="text-[#ff8fa3]">&lt;a</span> <span className="text-[#7ee0b7]">href</span>=<span className="text-[#f5c977]">"#contact"</span><span className="text-[#ff8fa3]">&gt;</span>ไปที่ส่วนติดต่อเรา<span className="text-[#ff8fa3]">&lt;/a&gt;</span>{'\n'}
                  <span className="text-[#ff8fa3]">&lt;h2</span> <span className="text-[#7ee0b7]">id</span>=<span className="text-[#f5c977]">"contact"</span><span className="text-[#ff8fa3]">&gt;</span>ติดต่อเรา<span className="text-[#ff8fa3]">&lt;/h2&gt;</span>
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5 p-4 bg-blue-dim rounded-xl">
                <div className="flex items-start sm:items-center gap-3">
                  <Sparkles className="w-[18px] h-[18px] text-theme-blue shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-[12.5px] font-bold text-ink">ดูภาพประกอบโครงสร้างเพิ่มเติมได้ที่แท็บ <strong>สไลด์การสอน</strong></span>
                </div>
                <button className="btn btn-blue btn-sm w-full sm:w-auto shrink-0 justify-center" onClick={() => setActiveTab('slide')}>ดูสไลด์</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'slide' && (
          <div className="win-body tight">
            <div className="text-white p-6 sm:p-10 min-h-[380px] flex flex-col justify-between" style={{ background: 'linear-gradient(160deg,#0c1428,#141d3a)' }}>
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-2">
                <span className="chip mono bg-blue-500/20 text-blue-300">{unit.sub_domain_code} SLIDE VIEWER</span>
                <span className="text-xs text-slate-300">หน้าที่ {currentSlideIndex + 1} / {totalSlides}</span>
              </div>
              
              <div className="text-center py-8 max-w-[520px] mx-auto">
                <div className="inline-flex p-4 rounded-2xl bg-blue-500/20 mb-4">
                  <Presentation className="w-[34px] h-[34px] text-blue-300" />
                </div>
                <h2 className="text-xl sm:text-[26px] font-bold m-0 mb-2.5 leading-tight">{slides[currentSlideIndex].t}</h2>
                <p className="text-[13px] text-slate-300 leading-[1.7]">{slides[currentSlideIndex].d}</p>
              </div>
              
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <button className="btn btn-sm bg-white/10 text-white hover:bg-white/20" onClick={handlePrevSlide} disabled={currentSlideIndex === 0}>
                  <ChevronLeft className="w-4 h-4" /><span className="hidden sm:inline">ก่อนหน้า</span>
                </button>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                  {slides.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${idx === currentSlideIndex ? 'bg-blue-300' : 'bg-white/25'}`}
                    />
                  ))}
                </div>
                <button className="btn btn-sm bg-white/10 text-white hover:bg-white/20" onClick={handleNextSlide} disabled={currentSlideIndex === totalSlides - 1}>
                  <span className="hidden sm:inline">ถัดไป</span><ChevronRight className="w-4 h-4" />
                </button>
              </div>
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
                04:12 · วีดีโอสอน: การใช้งาน Hyperlink
              </span>
            </div>
          </div>
        )}

        {activeTab === 'doc' && (
          <div className="win-body">
            <div className="card max-w-[520px] mx-auto p-6 text-center">
              <FileText className="w-[34px] h-[34px] text-theme-red mx-auto mb-2.5" />
              <h3 className="m-0 mb-1.5 text-[15px] font-bold truncate">เอกสารประกอบหน่วย {unit.sub_domain_code}.pdf</h3>
              <p className="muted text-xs m-0 mb-4 truncate">สรุปเนื้อหา ตัวอย่างโค้ด และแบบฝึกหัดท้ายบท · 6 หน้า</p>
              <button className="btn btn-ghost btn-sm w-full sm:w-auto justify-center">ดาวน์โหลดเอกสาร <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
      </section>

      <div className="flex justify-between items-center mt-4">
        <Link href="#" className="btn btn-ghost btn-sm max-w-[48%] truncate"><ChevronLeft className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">H2 · Heading &amp; Paragraph</span></Link>
        <Link href="#" className="btn btn-navy btn-sm max-w-[48%] truncate"><span className="truncate">H4 · รูปภาพและสื่อประสม</span> <ChevronRight className="w-3.5 h-3.5 shrink-0" /></Link>
      </div>
    </div>
  );
}
