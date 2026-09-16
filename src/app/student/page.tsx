'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SUB_DOMAINS, SubDomainCode, SkillProfile } from '@/types/database';
import { MOCK_STUDENT_SKILLS } from '@/lib/mock-data';
import {
  Code2,
  Terminal,
  Play,
  ArrowRight,
  Book,
  Clock,
  ChevronRight,
  Flame,
  Activity,
  BarChart3
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

  const subDomainKeys = Object.keys(SUB_DOMAINS) as SubDomainCode[];

  // Calculate overall mastery for display
  const skillValues = Object.values(skills);
  const avgLevel =
    skillValues.length > 0
      ? Math.round(
          skillValues.reduce((acc, curr) => acc + Number(curr.estimated_level), 0) /
            skillValues.length
        )
      : 0;

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
        
        {/* LEFT COLUMN: Main Learning Focus */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
          
          {/* 1. Integrated Hero & Profile Block (Clean Window Style) */}
          <section>
            <div className="group relative w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 overflow-hidden flex flex-col min-h-[300px]">
              {/* Top Bar (macOS Window Control) */}
              <div className="bg-slate-50 dark:bg-slate-950 px-5 py-3.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 shrink-0">
                {/* Mac Dots */}
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm"></div>
                </div>
                
                {/* File Name */}
                <div className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                  <Code2 className="w-3.5 h-3.5 text-purple-500" />
                  <span className="font-sans">ภาพรวมการเรียน</span>
                </div>
                
                <div className="w-12"></div> {/* Spacer */}
              </div>

              {/* Window Content */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 relative bg-white dark:bg-[#12161f]">
                {/* Subtle Background Grid (Graph Paper) */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50"></div>

                {/* Profile Data */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-purple-200 dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">👦🏻</span>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
                        สวัสดี, {profile.full_name || 'นักเรียน'}
                      </h1>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs font-semibold text-slate-500">ระดับความเชี่ยวชาญ:</span>
                        <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${avgLevel}%` }}></div>
                        </div>
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400">{avgLevel}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-xs font-bold text-orange-600 dark:text-orange-400 w-fit border border-orange-200 dark:border-orange-500/20 shadow-sm">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>เข้าเรียนต่อเนื่อง 3 วัน</span>
                  </div>
                </div>
                
                {/* Current Lesson */}
                <div className="relative z-10 mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400 mb-3 border border-blue-200/50 dark:border-blue-500/20">
                      <Activity className="w-3.5 h-3.5" />
                      <span>กำลังเรียนอยู่</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-2 text-slate-800 dark:text-white tracking-tight">
                      โครงสร้าง HTML เชิงลึก
                    </h3>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      เรียนต่อจากหัวข้อ: H3 แอตทริบิวต์ HTML
                    </p>
                  </div>
                  
                  <Link href="/student/lessons" className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 group/btn">
                    <span>เข้าสู่บทเรียน</span>
                    <Play className="w-4 h-4 fill-current" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Code Lab Banner (Modern Code-Themed Banner) */}
          <section>
            <Link href="/student/codelab" className="group relative w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700 shadow-xl shadow-slate-900/10 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-emerald-500/50 overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none"></div>
              
              <div className="space-y-2 relative z-10">
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                  <Terminal className="w-6 h-6 text-emerald-400" />
                  ห้องปฏิบัติการเขียนโค้ด (Code Lab)
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  &gt; พิมพ์แท็ก HTML โต้ตอบแบบเรียลไทม์ พร้อมตรวจจับข้อผิดพลาด
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/5 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0 group-hover:scale-110 shadow-lg relative z-10">
                <Play className="w-5 h-5 ml-1 fill-current" />
              </div>
            </Link>
          </section>
        </div>

        {/* RIGHT COLUMN: Analytics & Progress */}
        <div className="flex flex-col gap-6 lg:gap-8">
          
          {/* 2. Metrics Split Cards */}
          <section>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 mb-4 px-1">
              <BarChart3 className="w-4 h-4" />
              <span>สรุปผลการเรียน</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 xl:grid-cols-2">
              {/* Lessons Card */}
              <div className="group relative w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1 p-5 overflow-hidden flex flex-col justify-between min-h-[140px]">
                <div className="absolute -bottom-4 -right-4 text-6xl font-black opacity-[0.03] dark:opacity-5 pointer-events-none text-blue-500">8</div>
                
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs z-10">
                  <Book className="w-4 h-4" />
                  <span>จำนวนหน่วยกิต</span>
                </div>
                <div className="flex items-end justify-between z-10">
                  <div>
                    <span className="text-4xl font-black text-slate-800 dark:text-white">8</span>
                    <span className="text-xs font-bold text-slate-400 ml-1">หน่วย</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 transition-colors">
                    <ArrowRight className="w-4 h-4 -rotate-45" />
                  </div>
                </div>
              </div>

              {/* Score Card */}
              <div className="group relative w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 p-5 overflow-hidden flex flex-col justify-between min-h-[140px]">
                <div className="absolute -bottom-4 -right-4 text-6xl font-black opacity-[0.03] dark:opacity-5 pointer-events-none text-emerald-500">%</div>
                
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs z-10">
                  <Clock className="w-4 h-4" />
                  <span>ความแม่นยำเฉลี่ย</span>
                </div>
                <div className="flex items-end justify-between z-10">
                  <div>
                    <span className="text-4xl font-black text-slate-800 dark:text-white">{avgLevel}</span>
                    <span className="text-xs font-bold text-slate-400 ml-1">%</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors">
                    <ArrowRight className="w-4 h-4 -rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Progress Chart */}
          <section className="flex-1 flex flex-col">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 mb-4 px-1 mt-2">
              <Activity className="w-4 h-4" />
              <span>ความเชี่ยวชาญรายหัวข้อ</span>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-500 min-h-[300px]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>
              
              <div className="flex items-end justify-between gap-4 h-48 relative z-10">
                {subDomainKeys.slice(0, 4).map((code, idx) => {
                  const score = skills[code]?.estimated_level ?? 0;
                  const colors = [
                    'bg-purple-500',
                    'bg-emerald-500',
                    'bg-amber-500',
                    'bg-blue-500'
                  ];
                  const colorClass = colors[idx % colors.length];

                  return (
                    <div key={code} className="flex flex-col items-center gap-3 w-full h-full justify-end group/bar">
                      <div className="w-full relative flex justify-center items-end bg-slate-50 dark:bg-slate-800/50 rounded-xl h-full p-1.5 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div 
                          className={`w-full rounded-lg transition-all duration-1000 ${colorClass} relative`}
                          style={{ height: `${Math.max(score, 15)}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                            {score}%
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{code}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center relative z-10">
                <Link href="/student/profile" className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                  <span>ดูการวิเคราะห์ทั้ง 8 หัวข้อ</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
