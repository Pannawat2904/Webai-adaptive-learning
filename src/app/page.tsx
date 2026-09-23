'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BookOpen, 
  Terminal, 
  LineChart, 
  Bot, 
  ShieldCheck, 
  Play, 
  Code2, 
  BrainCircuit,
  Sparkles,
  Rocket
} from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('dark');
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      
      {/* Top Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0d1424]/40 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-[1320px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00e5ff] to-[#b05cff] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all">
              <Code2 className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col">
              <b className="text-[15px] flex items-center gap-2 tracking-wide font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                WebAI <span className="bg-[#b05cff]/20 text-[#b05cff] border border-[#b05cff]/30 text-[10px] px-2 py-0.5 rounded-full">TH</span>
              </b>
              <small className="text-[11px] text-slate-400 font-medium">Adaptive Learning Platform</small>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <Link href="/student" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              <LayoutDashboard className="w-4 h-4 text-[#00e5ff]" /> ภาพรวม
            </Link>
            <Link href="/student/lessons" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              <BookOpen className="w-4 h-4 text-[#00ff9d]" /> บทเรียน
            </Link>
            <Link href="/student/codelab" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              <Terminal className="w-4 h-4 text-[#ffaa00]" /> Code Lab
            </Link>
            <Link href="/student/tutor" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              <Bot className="w-4 h-4 text-[#b05cff]" /> AI Tutor
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/teacher/login" className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm font-bold backdrop-blur-md">
              <ShieldCheck className="w-4 h-4" /> สำหรับผู้สอน
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="max-w-[1000px] mx-auto px-6 text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(176,92,255,0.15)] border border-[rgba(176,92,255,0.3)] text-[#b05cff] text-xs font-bold mb-8 shadow-[0_0_20px_rgba(176,92,255,0.2)]">
            <Sparkles className="w-4 h-4" /> ระบบทดสอบปรับเหมาะเชิงกฎเกณฑ์ (Rule-based Adaptive)
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">ก้าวสู่จักรวาลแห่งการโค้ดดิ้ง</span><br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-[#b05cff] to-[#ff3366] drop-shadow-[0_0_30px_rgba(0,229,255,0.4)]">
              ด้วย AI อัจฉริยะ
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            ระบบการเรียนรู้ที่ปรับระดับความยากให้เหมาะกับคุณโดยอัตโนมัติ พร้อม <strong className="text-[#00e5ff]">Code Lab</strong> ให้ฝึกปฏิบัติจริง สนุก เข้าใจง่าย เหมือนท่องอวกาศ!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/student" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00e5ff] to-[#b05cff] text-black font-extrabold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,229,255,0.4)]">
              <Rocket className="w-6 h-6" /> เริ่มผจญภัย
            </Link>
            <Link href="/methodology" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/10 transition-colors backdrop-blur-md">
              <BrainCircuit className="w-6 h-6" /> วิธีการทำงาน
            </Link>
          </div>
        </section>

        {/* Floating Code Preview */}
        <section className="max-w-[1100px] mx-auto px-6 mb-32 relative perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00e5ff]/20 to-transparent blur-[100px] -z-10" />
          
          {/* We use the `.win` class from globals.css which now provides a beautiful glass UI */}
          <div className="win shadow-[0_30px_80px_rgba(0,229,255,0.15)] transform rotate-x-[2deg] hover:rotate-x-0 transition-transform duration-700 ease-out">
            <div className="win-bar">
              <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
              <div className="win-title">
                <span className="text-[#00e5ff] flex items-center gap-2"><Code2 className="w-4 h-4"/> index.html</span>
              </div>
              <div className="win-actions hidden sm:flex">
                <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">WebAI Engine Online</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="p-8 bg-[#060a12]/80 font-mono text-sm leading-loose overflow-x-auto">
                <pre className="text-slate-300">
                  <span className="text-slate-500">&lt;!-- ภารกิจ: สร้างโครงสร้าง HTML --&gt;</span>{'\n'}
                  <span className="text-[#ff3366]">&lt;!doctype</span> <span className="text-[#00ff9d]">html</span><span className="text-[#ff3366]">&gt;</span>{'\n'}
                  <span className="text-[#ff3366]">&lt;html</span> <span className="text-[#00ff9d]">lang</span>=<span className="text-[#ffaa00]">"th"</span><span className="text-[#ff3366]">&gt;</span>{'\n'}
                  <span className="text-[#ff3366]">&lt;head&gt;</span>{'\n'}
                  {'  '}<span className="text-[#ff3366]">&lt;title&gt;</span><span className="text-white">เว็บไซต์ของฉัน</span><span className="text-[#ff3366]">&lt;/title&gt;</span>{'\n'}
                  <span className="text-[#ff3366]">&lt;/head&gt;</span>{'\n'}
                  <span className="text-[#ff3366]">&lt;body</span> <span className="text-[#00ff9d]">class</span>=<span className="text-[#ffaa00]">"deep-space"</span><span className="text-[#ff3366]">&gt;</span>{'\n'}
                  {'  '}<span className="text-[#ff3366]">&lt;h1&gt;</span><span className="text-white drop-shadow-[0_0_5px_#fff]">ยินดีต้อนรับสู่ HTML Adaptive</span><span className="text-[#ff3366]">&lt;/h1&gt;</span>{'\n'}
                  {'  '}<span className="text-[#ff3366]">&lt;p&gt;</span><span className="text-slate-300">ระบบเรียนรู้ปรับเหมาะอัตโนมัติ</span><span className="text-[#ff3366]">&lt;/p&gt;</span>{'\n'}
                  <span className="text-[#ff3366]">&lt;/body&gt;</span>{'\n'}
                  <span className="text-[#ff3366]">&lt;/html&gt;</span>
                </pre>
              </div>
              
              <div className="p-10 flex flex-col items-center justify-center text-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-black/40">
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff9d] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff9d]"></span>
                  </span>
                  <span className="text-[#00ff9d] text-xs font-mono font-bold tracking-widest">LIVE PREVIEW</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-white drop-shadow-md">ยินดีต้อนรับสู่ HTML Adaptive</h1>
                <p className="text-slate-400 text-lg">ระบบเรียนรู้ปรับเหมาะอัตโนมัติ</p>
                <div className="mt-8 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2 text-sm text-slate-300">
                  <Bot className="w-4 h-4 text-[#b05cff]" /> โค้ดถูกต้อง! ผ่านภารกิจ
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-[1000px] mx-auto px-6 mb-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card card-body text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(0,229,255,0.1)] flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-[#00e5ff]" />
            </div>
            <h3 className="text-4xl font-mono font-bold text-white mb-2">8</h3>
            <p className="text-slate-400 font-medium">หน่วยเรียนครอบคลุม ปวช.</p>
          </div>
          <div className="card card-body text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(176,92,255,0.1)] flex items-center justify-center mb-6">
              <Terminal className="w-8 h-8 text-[#b05cff]" />
            </div>
            <h3 className="text-4xl font-mono font-bold text-white mb-2">40+</h3>
            <p className="text-slate-400 font-medium">ภารกิจฝึกโค้ดเสมือนจริง</p>
          </div>
          <div className="card card-body text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(0,255,157,0.1)] flex items-center justify-center mb-6">
              <BrainCircuit className="w-8 h-8 text-[#00ff9d]" />
            </div>
            <h3 className="text-4xl font-mono font-bold text-white mb-2">100%</h3>
            <p className="text-slate-400 font-medium">ปรับแต่งโจทย์ตามความสามารถ</p>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/10 bg-[#0d1424]/80 backdrop-blur-lg py-10 text-center">
        <p className="font-mono text-xs text-slate-500 tracking-widest">
          &lt;/&gt; WEB LEARNING STUDIO · DEEP SPACE ENGINE V2.0
        </p>
      </footer>

    </div>
  );
}
