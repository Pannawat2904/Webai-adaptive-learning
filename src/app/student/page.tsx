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
  Activity
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<Record<string, SkillProfile>>(MOCK_STUDENT_SKILLS);

  useEffect(() => {
    try {
      const savedSkills = localStorage.getItem('webai_student_skills');
      if (savedSkills) setSkills(JSON.parse(savedSkills));
    } catch {
      // ignore
    }
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
          <Terminal className="w-4 h-4 text-primary" /> ~/journey/dashboard
        </span>
        <div className="flex gap-2">
          <span className="chip chip-warning chip-mono hidden md:inline-flex"><Zap className="w-3 h-3" />3 Day Streak</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-ink mb-2">WebAI Adventure<span className="text-primary">.</span></h1>
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
                <Shield className="w-3 h-3" /> LEVEL 2 : HTML BUILDER
              </span>
              <div className="flex items-center gap-2 text-highlight font-bold bg-highlight-dim px-3 py-1 rounded-lg border border-highlight-dim text-sm">
                <Sparkles className="w-4 h-4" /> 1,240 XP
              </div>
            </div>
            
            <h2 className="mb-2 text-2xl md:text-3xl font-bold leading-tight text-ink">
              สวัสดี, {profile?.full_name?.split(' ')[0] || 'Developer'} 👋
            </h2>
            <p className="text-muted mb-8 text-sm leading-relaxed max-w-xl">
              คุณทำภารกิจสำเร็จไปแล้ว 3 ภารกิจในสัปดาห์นี้ ทักษะของคุณกำลังพัฒนาอย่างต่อเนื่อง ไปลุยภารกิจต่อไปกันเลย!
            </p>
            
            <div className="flex flex-col mb-4">
              <div className="flex justify-between text-xs font-bold text-muted mb-2 uppercase tracking-wide">
                <span>Progress to Level 3</span>
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
              <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Recommended Quest</div>
              <div className="text-xs font-bold text-success bg-success-dim px-2 py-0.5 rounded flex items-center gap-1">
                <Target className="w-3 h-3" /> MATCH
              </div>
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">Form Builder Mission</h3>
            <p className="text-sm text-muted mb-4">
              สร้างฟอร์มสมัครสมาชิกที่สมบูรณ์แบบ ทักษะ <strong className="text-ink">H7 (Forms)</strong> ของคุณต้องการการฝึกฝนเพิ่มเติม
            </p>
            
            <div className="flex gap-2 mb-6">
              <span className="text-[10px] px-2 py-1 bg-bg-base border border-line rounded text-muted font-bold">Difficulty: Medium</span>
              <span className="text-[10px] px-2 py-1 bg-highlight-dim border border-highlight-dim rounded text-highlight font-bold">+150 XP</span>
            </div>
          </div>
          
          <Link href="/student/codelab" className="btn btn-primary w-full text-sm">
            เริ่มภารกิจ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/student/lessons" className="card card-hover flex items-center gap-4 p-4 border-line">
          <div className="w-12 h-12 rounded-xl bg-primary-dim text-primary flex items-center justify-center shrink-0">
            <MapIcon className="w-6 h-6" />
          </div>
          <div>
            <b className="text-[14px] block text-ink">เส้นทาง (Journey)</b>
            <small className="text-muted text-[12px]">ดูแผนที่การเรียนรู้ของคุณ</small>
          </div>
        </Link>
        <Link href="/student/assessment" className="card card-hover flex items-center gap-4 p-4 border-line">
          <div className="w-12 h-12 rounded-xl bg-accent-dim text-accent flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <b className="text-[14px] block text-ink">ประเมินทักษะ (CAT)</b>
            <small className="text-muted text-[12px]">ทดสอบวัดระดับ θ ของคุณ</small>
          </div>
        </Link>
        <Link href="/student/codelab" className="card card-hover flex items-center gap-4 p-4 border-line">
          <div className="w-12 h-12 rounded-xl bg-secondary-dim text-secondary flex items-center justify-center shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <b className="text-[14px] block text-ink">ห้องฝึกปฏิบัติ (Lab)</b>
            <small className="text-muted text-[12px]">เขียนโค้ดแก้โจทย์จริง</small>
          </div>
        </Link>
      </div>

      {/* Skill Map & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
        <div className="card border-line">
          <div className="card-head">
            <h3>Web Skill Map</h3>
            <span className="chip chip-mono">MASTERY LEVELS</span>
          </div>
          <div className="card-body flex flex-col gap-5">
            <div>
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-success"></div> H1 โครงสร้าง HTML</span>
                <span className="text-success">Mastered</span>
              </div>
              <div className="bar success"><span style={{ width: '100%' }}></span></div>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-success"></div> H2 Text & Headings</span>
                <span className="text-success">Mastered</span>
              </div>
              <div className="bar success"><span style={{ width: '100%' }}></span></div>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> H3 Hyperlinks</span>
                <span className="text-primary">In Progress</span>
              </div>
              <div className="bar"><span style={{ width: '65%' }}></span></div>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-danger"></div> H7 Forms</span>
                <span className="text-danger">Needs Practice</span>
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
            <h3>Recent Activity</h3>
            <span className="chip chip-mono">LOGS</span>
          </div>
          <div className="card-body pt-2 space-y-1">
            <div className="flex gap-4 py-3 border-b border-dashed border-line">
              <div className="w-10 h-10 rounded-lg bg-success-dim text-success flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm block text-ink">Achievement Unlocked!</b>
                <small className="text-muted text-xs block mb-1">"Link Master" (เชื่อมโยงหน้าเว็บ 5 หน้า)</small>
                <span className="text-[10px] text-highlight font-bold">+50 XP</span>
              </div>
            </div>
            <div className="flex gap-4 py-3 border-b border-dashed border-line">
              <div className="w-10 h-10 rounded-lg bg-primary-dim text-primary flex items-center justify-center shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm block text-ink">Completed Mission: Links 101</b>
                <small className="text-muted text-xs block mb-1">ผ่านภารกิจการสร้างแท็ก &lt;a&gt;</small>
                <span className="text-[10px] text-highlight font-bold">+100 XP</span>
              </div>
            </div>
            <div className="flex gap-4 py-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-dim text-secondary flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm block text-ink">Adaptive Test (H1-H2)</b>
                <small className="text-muted text-xs block mb-1">θ อัพเดทเป็น 0.85</small>
                <span className="text-[10px] text-muted font-bold">2 วันที่แล้ว</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
