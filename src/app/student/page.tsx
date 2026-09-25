'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SkillProfile } from '@/types/database';
import { MOCK_STUDENT_SKILLS } from '@/lib/mock-data';
import { 
  Terminal, 
  Target, 
  CheckCircle2, 
  Trophy, 
  Zap, 
  ArrowRight, 
  Code2, 
  Sparkles, 
  Map as MapIcon,
  Shield,
  Activity,
  Gamepad2,
  Lock,
  BookOpen,
  ClipboardList,
  CheckSquare,
} from 'lucide-react';
import { UnitPathStepper } from '@/components/UnitPathStepper';
import {
  getCurrentCourseStep,
  COURSE_STEPS_CONFIG,
  subscribeToProgress,
} from '@/lib/progress-service';

export default function StudentDashboardPage() {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<Record<string, SkillProfile>>(MOCK_STUDENT_SKILLS);
  const [, setProgressTick] = useState(0);

  const currentCourseStep = getCurrentCourseStep();
  const currentStepConfig = COURSE_STEPS_CONFIG.find((s) => s.key === currentCourseStep) || COURSE_STEPS_CONFIG[0];
  const currentStepUrl = currentStepConfig.href;

  useEffect(() => {
    try {
      const savedSkills = localStorage.getItem('webai_student_skills');
      if (savedSkills) setSkills(JSON.parse(savedSkills));
    } catch {
      // ignore
    }

    const unsub = subscribeToProgress(() => {
      setProgressTick((prev) => prev + 1);
    });
    return () => unsub();
  }, []);

  const skillValues = Object.values(skills);
  const avgLevel =
    skillValues.length > 0
      ? Math.round(
          skillValues.reduce((acc, curr) => acc + Number(curr.estimated_level), 0) /
            skillValues.length
        )
      : 0;

  return (
    <div className="main-inner enter max-w-[1200px] mx-auto">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-8">
        <span className="flex items-center gap-2 text-sm font-bold text-muted bg-surface px-4 py-2 rounded-full border border-line">
          <Terminal className="w-4 h-4 text-primary" /> ~/แดชบอร์ด
        </span>
        <div className="flex gap-2">
          <span className="chip chip-warning chip-mono hidden md:inline-flex"><Zap className="w-3 h-3" />เรียนต่อเนื่อง 3 วัน</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-ink mb-2">ศูนย์การเรียนรู้ WebAI<span className="text-primary">.</span></h1>
        <p className="text-muted">ยินดีต้อนรับสู่ศูนย์บัญชาการนักพัฒนา ติดตามภารกิจและการเติบโตของคุณที่นี่</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mb-6">
        
        {/* Developer Profile Card */}
        <div className="card p-6 md:p-8 flex flex-col justify-between border-l-4 border-l-primary bg-gradient-to-br from-surface to-bg-base relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <Code2 className="w-64 h-64 text-primary" />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="chip chip-primary chip-mono">
                <Shield className="w-3 h-3" /> ระดับ 2 : ผู้สร้าง HTML
              </span>
              <div className="flex items-center gap-2 text-highlight font-bold bg-highlight-dim px-3 py-1 rounded-lg border border-highlight-dim text-sm">
                <Sparkles className="w-4 h-4" /> 1,240 XP
              </div>
            </div>
            
            <h2 className="mb-2 text-2xl md:text-3xl font-bold leading-tight text-ink">
              สวัสดี, {profile?.full_name?.split(' ')[0] || 'นักเรียน'} 👋
            </h2>
            <p className="text-muted mb-8 text-sm leading-relaxed max-w-xl">
              คุณทำภารกิจสำเร็จไปแล้ว 3 ภารกิจในสัปดาห์นี้ ทักษะของคุณกำลังพัฒนาอย่างต่อเนื่อง ไปลุยภารกิจต่อไปกันเลย!
            </p>
            
            <div className="flex flex-col mb-4">
              <div className="flex justify-between text-xs font-bold text-muted mb-2 uppercase tracking-wide">
                <span>ความก้าวหน้าสู่ระดับ 3</span>
                <span className="text-ink">1,240 / 2,000 XP</span>
              </div>
              <div className="bar"><span style={{ width: '62%' }}></span></div>
            </div>
          </div>
        </div>

        {/* Recommended Quest Card */}
        <div className="card p-6 bg-surface border-line quest-card flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">ภารกิจแนะนำสำหรับคุณ</div>
              <div className="text-xs font-bold text-success bg-success-dim px-2 py-0.5 rounded flex items-center gap-1">
                <Target className="w-3 h-3" /> เหมาะสม
              </div>
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">ภารกิจสร้างแบบฟอร์ม (Form Builder)</h3>
            <p className="text-sm text-muted mb-4">
              สร้างฟอร์มสมัครสมาชิกที่สมบูรณ์แบบ ทักษะ <strong className="text-ink">H7 (Forms)</strong> ของคุณต้องการการฝึกฝนเพิ่มเติม
            </p>
            
            <div className="flex gap-2 mb-6">
              <span className="text-[10px] px-2 py-1 bg-bg-base border border-line rounded text-muted font-bold">ระดับความยาก: ปานกลาง</span>
              <span className="text-[10px] px-2 py-1 bg-highlight-dim border border-highlight-dim rounded text-highlight font-bold">+150 XP</span>
            </div>
          </div>
          
          <Link href="/student/codelab" className="btn btn-primary w-full text-sm">
            เริ่มภารกิจ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* HTML5 Code Rescue Game Featured Banner */}
      <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/30">
            <span>🎮</span>
            <span>เกมการเรียนรู้เชิงโต้ตอบใหม่ล่าสุด</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            HTML5 Code Rescue — กู้เว็บพัง!
          </h2>
          <p className="text-white/90 text-sm leading-relaxed mb-4">
            สวมบทบาท Web Developer ซ่อมแซมโค้ดเว็บไซต์ที่เสียหาย! เปลี่ยนแท็กจริง กด ▶ Run ดูพรีวิวสด และกู้เว็บผ่านครบ 5 ด่านเพื่อชิงตำแหน่ง 🏆 HTML5 MASTER
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-white/90">
            <span className="px-2.5 py-1 rounded-lg bg-black/20">🚪 เปิดประตู HTML</span>
            <span className="px-2.5 py-1 rounded-lg bg-black/20">🏷️ Tag Hunter</span>
            <span className="px-2.5 py-1 rounded-lg bg-black/20">🔗 Links & Images</span>
            <span className="px-2.5 py-1 rounded-lg bg-black/20">📝 Form Factory</span>
            <span className="px-2.5 py-1 rounded-lg bg-black/20">👾 BOSS เว็บพัง</span>
          </div>
        </div>

        <div className="relative z-10 shrink-0 w-full md:w-auto flex flex-col items-center gap-2">
          <Link
            href="/student/game"
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-indigo-600 font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <span>🎮 เล่นเกมกู้เว็บพัง</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-[11px] text-white/80">ระบบซ่อมโค้ดจริง ไม่ใช่แค่ตอบคำถาม</span>
        </div>
      </div>

      {/* 5 Sequential Steps Progress Card */}
      <div className="mb-8 p-6 rounded-3xl bg-surface border-2 border-line shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>ลำดับขั้นตอนการเรียนรู้ (SEQUENTIAL FLOW)</span>
            </div>
            <h2 className="text-xl font-black text-ink">
              เรื่อง โครงสร้างภาษา HTML
            </h2>
            <p className="text-xs text-muted mt-0.5">
              ระบบบังคับเรียนและทำแบบทดสอบตามลำดับ 5 ขั้นตอนเพื่อสร้างความเข้าใจที่มั่นคง
            </p>
          </div>

          <Link
            href={currentStepUrl}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-primary/20 shrink-0 transition-transform active:scale-95"
          >
            <span>ทำต่อที่ขั้น {currentStepConfig.stepNumber}: {currentStepConfig.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <UnitPathStepper currentStep={currentCourseStep} />
      </div>

      {/* Skill Map & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
        <div className="card border-line">
          <div className="card-head">
            <h3>แผนผังทักษะการสร้างเว็บไซต์</h3>
            <span className="chip chip-mono">ระดับความเชี่ยวชาญ</span>
          </div>
          <div className="card-body flex flex-col gap-5">
            <div>
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-success"></div> H1 โครงสร้าง HTML</span>
                <span className="text-success">ชำนาญแล้ว</span>
              </div>
              <div className="bar success"><span style={{ width: '100%' }}></span></div>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-success"></div> H2 ข้อความและหัวข้อ</span>
                <span className="text-success">ชำนาญแล้ว</span>
              </div>
              <div className="bar success"><span style={{ width: '100%' }}></span></div>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> H3 ลิงก์เชื่อมโยง</span>
                <span className="text-primary">กำลังเรียนรู้</span>
              </div>
              <div className="bar"><span style={{ width: '65%' }}></span></div>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-danger"></div> H7 แบบฟอร์ม</span>
                <span className="text-danger">ควรฝึกฝนเพิ่ม</span>
              </div>
              <div className="bar danger"><span style={{ width: '30%' }}></span></div>
            </div>
            
            <Link href="/student/lessons" className="btn btn-ghost w-full mt-2 text-xs">
              ดูแผนผังทักษะแบบเต็ม
            </Link>
          </div>
        </div>

        <div className="card flex-1 border-line">
          <div className="card-head">
            <h3>กิจกรรมล่าสุด</h3>
            <span className="chip chip-mono">บันทึกกิจกรรม</span>
          </div>
          <div className="card-body pt-2 space-y-1">
            <div className="flex gap-4 py-3 border-b border-dashed border-line">
              <div className="w-10 h-10 rounded-lg bg-success-dim text-success flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm block text-ink">ปลดล็อกความสำเร็จ!</b>
                <small className="text-muted text-xs block mb-1">"Link Master" (เชื่อมโยงหน้าเว็บ 5 หน้า)</small>
                <span className="text-[10px] text-highlight font-bold">+50 XP</span>
              </div>
            </div>
            <div className="flex gap-4 py-3 border-b border-dashed border-line">
              <div className="w-10 h-10 rounded-lg bg-primary-dim text-primary flex items-center justify-center shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm block text-ink">สำเร็จภารกิจ: การสร้างลิงก์พื้นฐาน</b>
                <small className="text-muted text-xs block mb-1">ผ่านภารกิจการสร้างแท็ก &lt;a&gt;</small>
                <span className="text-[10px] text-highlight font-bold">+100 XP</span>
              </div>
            </div>
            <div className="flex gap-4 py-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-dim text-secondary flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm block text-ink">แบบทดสอบปรับเหมาะ (H1-H2)</b>
                <small className="text-muted text-xs block mb-1">θ อัปเดตเป็น 0.85</small>
                <span className="text-[10px] text-muted font-bold">2 วันที่แล้ว</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
