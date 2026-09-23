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
      <div className="topline">
        <Link href="/student/lessons" className="btn btn-ghost btn-sm">
          <ChevronLeft className="w-3.5 h-3.5" />กลับไปยังรายการหน่วยการเรียนรู้
        </Link>
        <div className="bar" style={{ width: '160px' }}><span style={{ width: '64%' }}></span></div>
      </div>

      <section className="win" style={{ marginBottom: '16px' }}>
        <div className="win-bar">
          <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
          <div className="win-title"><em>&lt;/&gt;</em> {unit.sub_domain_code.toLowerCase()}-lesson.html</div>
        </div>
        <div className="win-body" style={{ padding: '26px 28px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
            <span className="chip chip-blue mono">{unit.sub_domain_code}</span>
            <span className="muted" style={{ fontSize: '12px', fontWeight: 600 }}>{unit.title}</span>
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: 700 }}>{lesson.title}</h1>
          <p className="muted" style={{ margin: '0 0 18px', fontSize: '13.5px', maxWidth: '640px', lineHeight: 1.7 }}>
            {unit.description}
          </p>
          <div className="flex gap-2 wrap">
            <Link href={`/student/codelab?subdomain=${unit.sub_domain_code}`} className="btn btn-green btn-sm">
              <Terminal className="w-4 h-4" />ฝึกใน Code Lab
            </Link>
            <Link href={`/student/tutor?unit=${unit.sub_domain_code}`} className="btn btn-soft btn-sm">
              <MessageSquare className="w-4 h-4" />ถาม AI Tutor เกี่ยวกับบทนี้
            </Link>
          </div>
        </div>
      </section>

      <section className="win">
        <div className="win-tabs">
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
            <div style={{ maxWidth: '720px' }}>
              <article className="prose dark:prose-invert max-w-none text-ink text-[14px] leading-[1.9] whitespace-pre-line">
                {lesson.content || `แท็ก <a className="mono" style="background:var(--soft); padding:2px 6px; border-radius:6px;">&lt;a&gt;</a> คือหัวใจของการเชื่อมโยงหน้าเว็บ (Hyperlink) ใช้แอตทริบิวต์ <code className="mono" style="background:var(--soft); padding:2px 6px; border-radius:6px;">href</code> เพื่อระบุปลายทาง และสามารถกำหนด <code className="mono" style="background:var(--soft); padding:2px 6px; border-radius:6px;">target="_blank"</code> เพื่อเปิดลิงก์ในแท็บใหม่\n\nข้อควรระวัง: การเปิดลิงก์ในแท็บใหม่ควรใช้คู่กับ <code className="mono" style="background:var(--soft); padding:2px 6px; border-radius:6px;">rel="noopener"</code> เพื่อความปลอดภัย และควรเขียนข้อความลิงก์ให้สื่อความหมาย ไม่ใช้คำว่า "คลิกที่นี่" ลอย ๆ เพื่อการเข้าถึงที่ดี (Accessibility)`}
              </article>

              <div style={{ background: 'var(--code-bg)', borderRadius: '14px', padding: '18px 20px', margin: '18px 0', overflowX: 'auto' }}>
                <pre className="mono" style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.8, color: '#c9d4e8' }}>
                  <span style={{ color: '#71809a' }}>&lt;!-- ลิงก์ไปหน้าอื่น เปิดแท็บใหม่ --&gt;</span>{'\n'}
                  <span style={{ color: '#ff8fa3' }}>&lt;a</span> <span style={{ color: '#7ee0b7' }}>href</span>=<span style={{ color: '#f5c977' }}>"about.html"</span> <span style={{ color: '#7ee0b7' }}>target</span>=<span style={{ color: '#f5c977' }}>"_blank"</span><span style={{ color: '#ff8fa3' }}>&gt;</span>เกี่ยวกับเรา<span style={{ color: '#ff8fa3' }}>&lt;/a&gt;</span>{'\n\n'}
                  <span style={{ color: '#71809a' }}>&lt;!-- Anchor link ภายในหน้าเดียวกัน --&gt;</span>{'\n'}
                  <span style={{ color: '#ff8fa3' }}>&lt;a</span> <span style={{ color: '#7ee0b7' }}>href</span>=<span style={{ color: '#f5c977' }}>"#contact"</span><span style={{ color: '#ff8fa3' }}>&gt;</span>ไปที่ส่วนติดต่อเรา<span style={{ color: '#ff8fa3' }}>&lt;/a&gt;</span>{'\n'}
                  <span style={{ color: '#ff8fa3' }}>&lt;h2</span> <span style={{ color: '#7ee0b7' }}>id</span>=<span style={{ color: '#f5c977' }}>"contact"</span><span style={{ color: '#ff8fa3' }}>&gt;</span>ติดต่อเรา<span style={{ color: '#ff8fa3' }}>&lt;/h2&gt;</span>
                </pre>
              </div>

              <div className="flex items-center justify-between" style={{ marginTop: '22px', padding: '16px 18px', background: 'var(--blue-dim)', borderRadius: '14px' }}>
                <div className="flex items-center gap-3">
                  <Sparkles style={{ width: '18px', height: '18px', color: 'var(--blue)', flexShrink: 0 }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)' }}>ดูภาพประกอบโครงสร้างเพิ่มเติมได้ที่แท็บ <strong>สไลด์การสอน</strong></span>
                </div>
                <button className="btn btn-blue btn-sm" onClick={() => setActiveTab('slide')}>ดูสไลด์</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'slide' && (
          <div className="win-body tight">
            <div style={{ background: 'linear-gradient(160deg,#0c1428,#141d3a)', color: '#fff', padding: '40px', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,.12)', paddingBottom: '16px' }}>
                <span className="chip mono" style={{ background: 'rgba(47,123,246,.22)', color: '#8fbcff' }}>{unit.sub_domain_code} SLIDE VIEWER</span>
                <span style={{ fontSize: '12px', color: '#aebbd0' }}>หน้าที่ {currentSlideIndex + 1} / {totalSlides}</span>
              </div>
              
              <div className="text-center" style={{ padding: '30px 0', maxWidth: '520px', margin: '0 auto' }}>
                <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'rgba(47,123,246,.18)', marginBottom: '16px' }}>
                  <Presentation style={{ width: '34px', height: '34px', color: '#8fbcff' }} />
                </div>
                <h2 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 10px' }}>{slides[currentSlideIndex].t}</h2>
                <p style={{ fontSize: '13px', color: '#c7d2e3', lineHeight: 1.7 }}>{slides[currentSlideIndex].d}</p>
              </div>
              
              <div className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: '16px' }}>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }} onClick={handlePrevSlide} disabled={currentSlideIndex === 0}>
                  <ChevronLeft className="w-4 h-4" />ก่อนหน้า
                </button>
                <div className="flex gap-2">
                  {slides.map((_, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: idx === currentSlideIndex ? '#8fbcff' : 'rgba(255,255,255,.25)' 
                      }} 
                    />
                  ))}
                </div>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }} onClick={handleNextSlide} disabled={currentSlideIndex === totalSlides - 1}>
                  ถัดไป<ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="win-body">
            <div style={{ background: 'var(--code-bg)', borderRadius: '16px', aspectRatio: '16/9', maxWidth: '760px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <button className="icon-btn" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff' }}>
                <Play style={{ width: '26px', height: '26px' }} />
              </button>
              <span style={{ position: 'absolute', bottom: '14px', left: '16px', color: '#c7d2e3', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                04:12 · วีดีโอสอน: การใช้งาน Hyperlink
              </span>
            </div>
          </div>
        )}

        {activeTab === 'doc' && (
          <div className="win-body">
            <div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: '26px', textAlign: 'center' }}>
              <FileText style={{ width: '34px', height: '34px', color: 'var(--red)', margin: '0 auto 10px' }} />
              <h3 style={{ margin: '0 0 6px', fontSize: '15px' }}>เอกสารประกอบหน่วย {unit.sub_domain_code}.pdf</h3>
              <p className="muted" style={{ fontSize: '12px', margin: '0 0 16px' }}>สรุปเนื้อหา ตัวอย่างโค้ด และแบบฝึกหัดท้ายบท · 6 หน้า</p>
              <button className="btn btn-ghost btn-sm">ดาวน์โหลดเอกสาร <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
      </section>

      <div className="flex justify-between items-center" style={{ marginTop: '18px' }}>
        <Link href="#" className="btn btn-ghost btn-sm"><ChevronLeft className="w-3.5 h-3.5" /> H2 · Heading &amp; Paragraph</Link>
        <Link href="#" className="btn btn-navy btn-sm">H4 · รูปภาพและสื่อประสม <ChevronRight className="w-3.5 h-3.5" /></Link>
      </div>
    </div>
  );
}
