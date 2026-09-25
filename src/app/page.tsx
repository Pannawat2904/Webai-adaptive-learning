'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Terminal, 
  Map as MapIcon, 
  ShieldCheck, 
  Code2, 
  BrainCircuit,
  Compass,
  ArrowRight,
  Layers,
  Globe,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Dark mode is no longer forced for the landing page
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-ink overflow-hidden relative">
      {/* Top Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 bg-bg-base/80 backdrop-blur-xl border-b border-line">
        <div className="max-w-[1320px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_var(--primary-dim)] group-hover:shadow-[0_0_30px_var(--primary-dim)] transition-all">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <b className="text-[15px] flex items-center gap-2 tracking-wide font-extrabold text-ink">
                WebAI <span className="bg-primary/20 text-primary border border-primary/30 text-[10px] px-2 py-0.5 rounded-full">DEV</span>
              </b>
              <small className="text-[11px] text-muted font-medium">Adaptive Learning Journey</small>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/teacher/login" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line text-muted hover:bg-soft hover:text-ink transition-all text-sm font-bold">
              <ShieldCheck className="w-4 h-4" /> สำหรับผู้สอน
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="max-w-[1000px] mx-auto px-6 text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8">
            <Compass className="w-4 h-4" /> รายวิชา การสร้างเว็บไซต์
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-ink">
            เริ่มต้นเส้นทาง <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              การสร้างเว็บไซต์
            </span>
          </h1>
          <div className="max-w-2xl mx-auto mb-10 space-y-4">
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal text-balance">
              เรียนรู้โครงสร้างและกระบวนการทำงานของเว็บไซต์อย่างเป็นระบบ
              <br className="hidden sm:inline" />
              ผ่านภารกิจการเรียนรู้แบบปรับเหมาะเฉพาะบุคคล{' '}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm sm:text-base align-middle">
                Adaptive Learning
              </span>
              <br className="hidden sm:inline" />
              สนุก ท้าทาย และนำไปประยุกต์ใช้ได้จริง
            </p>

            {/* Feature Highlights Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-line shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                เรียนรู้ตามระดับความสามารถ
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-line shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                ฝึกปฏิบัติและเขียนโค้ดจริง
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-line shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                วิเคราะห์ผลแบบปรับเหมาะ
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-[0_4px_20px_var(--primary-dim)] hover:-translate-y-1">
              <Terminal className="w-5 h-5" /> เข้าสู่ระบบเรียน
            </Link>
            <Link href="/student/lessons" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface border border-line text-ink font-bold text-lg flex items-center justify-center gap-3 hover:bg-soft transition-all hover:-translate-y-1">
              <MapIcon className="w-5 h-5" /> ดูบทเรียน
            </Link>
          </div>
        </section>

        {/* Digital Web World UI Showcase */}
        <section className="max-w-[1100px] mx-auto px-6 mb-32 relative perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent blur-[100px] -z-10" />
          
          <div className="win shadow-2xl transform rotate-x-[2deg] hover:rotate-x-0 transition-transform duration-700 ease-out border-line">
            <div className="win-bar">
              <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
              <div className="win-title flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted" />
                <span>localhost:3000/quest/01</span>
              </div>
              <div className="win-actions hidden sm:flex text-xs font-mono text-muted uppercase">
                เชื่อมต่อระบบสำเร็จ
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
              
              {/* Code Panel */}
              <div className="p-8 bg-bg-base font-mono text-sm leading-loose overflow-x-auto">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-primary uppercase">
                  <Code2 className="w-4 h-4" /> index.html
                </div>
                <pre className="text-muted">
                  <span className="text-faint">&lt;!-- 🎯 ภารกิจ: โครงสร้างเอกสาร --&gt;</span>{'\n'}
                  <span className="text-danger">&lt;!DOCTYPE html&gt;</span>{'\n'}
                  <span className="text-secondary">&lt;html</span> <span className="text-accent">lang</span>=<span className="text-highlight">"th"</span><span className="text-secondary">&gt;</span>{'\n'}
                  <span className="text-secondary">&lt;head&gt;</span>{'\n'}
                  {'  '}<span className="text-secondary">&lt;title&gt;</span><span className="text-ink">การสร้างเว็บไซต์</span><span className="text-secondary">&lt;/title&gt;</span>{'\n'}
                  <span className="text-secondary">&lt;/head&gt;</span>{'\n'}
                  <span className="text-secondary">&lt;body</span> <span className="text-accent">class</span>=<span className="text-highlight">"developer-journey"</span><span className="text-secondary">&gt;</span>{'\n'}
                  {'  '}<span className="text-secondary">&lt;h1&gt;</span><span className="text-ink">หน่วยที่ 1: พื้นฐานเว็บไซต์</span><span className="text-secondary">&lt;/h1&gt;</span>{'\n'}
                  {'  '}<span className="text-secondary">&lt;p&gt;</span><span className="text-muted">เตรียมพร้อมสู่การเป็นนักพัฒนา</span><span className="text-secondary">&lt;/p&gt;</span>{'\n'}
                  <span className="text-secondary">&lt;/body&gt;</span>{'\n'}
                  <span className="text-secondary">&lt;/html&gt;</span>
                </pre>
              </div>
              
              {/* Quest UI Panel */}
              <div className="p-8 flex flex-col justify-center bg-surface relative">
                <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold font-mono text-success bg-success/10 px-3 py-1 rounded-full border border-success/20">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  SYSTEM ONLINE
                </div>
                
                <div className="card p-6 border-line bg-bg-base mt-6">
                  <div className="text-[10px] font-mono font-bold text-primary mb-1 uppercase">ภารกิจแนะนำสำหรับคุณ</div>
                  <h3 className="text-xl font-bold text-ink mb-2">โครงสร้าง HTML พื้นฐาน</h3>
                  <p className="text-sm text-muted mb-6">เรียนรู้องค์ประกอบที่สำคัญที่สุดของการสร้างเว็บไซต์ (HTML, HEAD, BODY)</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-success"><CheckCircle2 className="w-4 h-4" /></div>
                      <span className="text-sm text-ink font-medium">ประกาศประเภทเอกสาร HTML5</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-surface border border-line flex items-center justify-center"></div>
                      <span className="text-sm text-muted font-medium">ส่วนหัวข้อมูลเว็บไซต์ (Head)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-line">
                    <div className="flex items-center gap-2 text-highlight font-bold text-sm">
                      <Sparkles className="w-4 h-4" /> +150 XP
                    </div>
                    <button className="btn btn-primary btn-sm">
                      ทำภารกิจต่อ <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-[1000px] mx-auto px-6 mb-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <MapIcon className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-mono font-bold text-ink mb-1">5</h3>
            <p className="text-muted text-sm font-medium">หน่วยการเรียนรู้</p>
          </div>
          <div className="card p-6 text-center flex flex-col items-center border-l-4 border-l-secondary">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 text-secondary">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-mono font-bold text-ink mb-1">40+</h3>
            <p className="text-muted text-sm font-medium">ภารกิจท้าทาย</p>
          </div>
          <div className="card p-6 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 text-accent">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-mono font-bold text-ink mb-1">100%</h3>
            <p className="text-muted text-sm font-medium">ระบบปรับเหมาะอัตโนมัติ</p>
          </div>
        </section>

      </main>

      <footer className="border-t border-line bg-surface py-8 text-center">
        <p className="font-mono text-xs text-muted tracking-widest uppercase">
          &lt;/&gt; WebAI Adventure · Adaptive Developer Journey
        </p>
      </footer>

    </div>
  );
}
