'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SUB_DOMAINS, SubDomainCode, SkillProfile } from '@/types/database';
import { MOCK_STUDENT_SKILLS } from '@/lib/mock-data';
import { Lock, Star } from 'lucide-react';

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
    <div className="w-full max-w-[1500px] mx-auto pb-12 px-4 sm:px-6 font-sans">
      
      {/* Top Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="inline-flex items-center gap-2 bg-[#cdf9e7] dark:bg-[#0ba57d]/20 text-[#06966f] dark:text-[#39d6ad] px-4 py-2.5 rounded-lg font-mono font-bold text-sm">
          &gt;_ · /หลักสูตร_HTML
        </div>
      </header>

      {/* Heading */}
      <section className="mb-7">
        <h1 className="text-[clamp(42px,5.5vw,76px)] leading-[0.98] tracking-[-2.8px] font-bold m-0 mb-4 text-ink">
          ภาพรวมการเรียนรู้ <span className="text-theme-blue">:</span>
        </h1>
        <p className="text-lg text-muted m-0 leading-relaxed max-w-2xl">
          พื้นที่สำหรับติดตามความก้าวหน้า ฝึกเขียนโค้ด และพัฒนาทักษะการสร้างเว็บไซต์ของคุณ
        </p>
      </section>

      {/* Main Window */}
      <section className="mac-window">
        {/* Window Bar */}
        <div className="mac-window-bar">
          <div className="mac-dots">
            <i className="mac-dot r"></i>
            <i className="mac-dot y"></i>
            <i className="mac-dot g"></i>
          </div>
          <div className="mac-file-title">
            <em>&lt;/&gt;</em> dashboard.html
          </div>
        </div>

        {/* Window Body */}
        <div className="mac-window-body">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-7 items-stretch">
            <div className="p-6 lg:p-8">
              <div className="font-mono font-bold text-xs text-theme-green mb-3">&gt;_ STUDENT_DASHBOARD()</div>
              <h2 className="text-3xl font-bold leading-tight mb-3 text-ink">
                สวัสดีครับ 👋<br/>พร้อมสร้างเว็บไซต์ของคุณหรือยัง?
              </h2>
              <p className="text-sm text-muted leading-[1.8] mb-6 max-w-2xl">
                เรียนรู้ตั้งแต่โครงสร้าง HTML ไปจนถึงการสร้างหน้าเว็บจริง พร้อมฝึกปฏิบัติผ่าน Code Lab และตรวจสอบความเข้าใจด้วยแบบทดสอบแบบปรับเหมาะ
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/student/lessons" className="inline-block border-0 rounded-xl px-5 py-3 font-bold cursor-pointer bg-theme-navy text-white hover:bg-[#1d2b48] transition-colors">
                  เข้าสู่บทเรียนต่อ &rarr;
                </Link>
                <Link href="/student/quests" className="inline-block border-0 rounded-xl px-5 py-3 font-bold cursor-pointer bg-[#edf4ff] text-theme-blue hover:bg-[#dcecff] transition-colors">
                  ดูหลักสูตรตะลุยด่าน
                </Link>
              </div>
            </div>

            <div className="bg-theme-navy text-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-2 -bottom-6 font-mono font-bold text-[120px] text-white/5 pointer-events-none">
                &lt;/&gt;
              </div>
              <div>
                <small className="text-[#aebbd0] text-[11px] font-mono tracking-wider">COURSE_PROGRESS</small>
                <h3 className="font-mono font-bold text-5xl mt-1.5 mb-0.5 text-white">{avgLevel}%</h3>
                <p className="text-[#c7d2e3] text-xs m-0 mb-4">ความก้าวหน้าของรายวิชา</p>
                <div className="h-2 bg-[#2a3752] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#39d6ad] to-[#48a9ff] rounded-full" style={{ width: `${avgLevel}%` }}></div>
                </div>
                <div className="flex justify-between text-[#aebbd0] font-mono font-medium text-[10px] mt-2">
                  <span>5 / 8 หน่วย</span>
                  <span>กำลังเรียน H3</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between">
                <div>
                  <small className="text-[#aebbd0] text-[11px]">คะแนนสะสม</small>
                  <strong className="block font-mono font-bold text-lg mt-1 text-white">780</strong>
                </div>
                <div className="text-right">
                  <small className="text-[#aebbd0] text-[11px]">Streak</small>
                  <strong className="block font-mono font-bold text-lg mt-1 text-white">3 วัน</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Link href="/student/quests" className="bg-white dark:bg-slate-900 border border-line rounded-2xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(28,42,68,0.08)]">
              <div className="w-11 h-11 rounded-xl bg-[#e9f2ff] dark:bg-blue-900/30 text-theme-blue flex items-center justify-center font-mono font-bold text-base shrink-0">
                &lt;/&gt;
              </div>
              <div>
                <b className="text-sm text-ink block leading-tight">ตะลุยด่าน (Quests)</b>
                <small className="block text-[10px] text-muted mt-1">ลุยด่านเขียนโค้ดแบบเกม</small>
              </div>
            </Link>
            
            <Link href="/student/assessment" className="bg-white dark:bg-slate-900 border border-line rounded-2xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(28,42,68,0.08)]">
              <div className="w-11 h-11 rounded-xl bg-[#e7fbf4] dark:bg-emerald-900/30 text-[#0ba57d] flex items-center justify-center font-mono font-bold text-base shrink-0">
                ✓
              </div>
              <div>
                <b className="text-sm text-ink block leading-tight">ทำแบบทดสอบ</b>
                <small className="block text-[10px] text-muted mt-1">ประเมินความเข้าใจรายหัวข้อ</small>
              </div>
            </Link>
            
            <Link href="/student/tutor" className="bg-white dark:bg-slate-900 border border-line rounded-2xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(28,42,68,0.08)]">
              <div className="w-11 h-11 rounded-xl bg-[#f0ebff] dark:bg-purple-900/30 text-[#8657e9] flex items-center justify-center font-mono font-bold text-base shrink-0">
                AI
              </div>
              <div>
                <b className="text-sm text-ink block leading-tight">ถาม AI Tutor</b>
                <small className="block text-[10px] text-muted mt-1">ขอคำอธิบายเมื่อเจอจุดที่ไม่เข้าใจ</small>
              </div>
            </Link>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6 mt-6">
            
            {/* Left: Path */}
            <div className="bg-white dark:bg-slate-900 border border-line rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center px-5 py-4 border-b border-line">
                <h3 className="m-0 text-base font-bold text-ink">เส้นทางการเรียนรู้</h3>
                <span className="font-mono font-medium text-[10px] text-[#7a8ba4]">8 SUB-DOMAINS</span>
              </div>
              <div className="p-4 pt-3 space-y-0">
                <div className="grid grid-cols-[52px_1fr_90px] items-center gap-4 py-3 px-2 border-b border-dashed border-[#e1e7ef] dark:border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-[#e9faf5] dark:bg-emerald-900/20 text-[#0aa47c] flex items-center justify-center font-mono font-bold text-sm">H1</div>
                  <div>
                    <h4 className="m-0 text-sm font-bold text-ink">โครงสร้างเอกสาร HTML พื้นฐาน</h4>
                    <p className="m-0 mt-1 text-[11px] text-muted">เรียนจบแล้ว • แบบทดสอบผ่าน</p>
                  </div>
                  <div className="text-right text-xs font-bold text-theme-blue">✓ สำเร็จ</div>
                </div>
                <div className="grid grid-cols-[52px_1fr_90px] items-center gap-4 py-3 px-2 border-b border-dashed border-[#e1e7ef] dark:border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-[#e9faf5] dark:bg-emerald-900/20 text-[#0aa47c] flex items-center justify-center font-mono font-bold text-sm">H2</div>
                  <div>
                    <h4 className="m-0 text-sm font-bold text-ink">การจัดการข้อความและ Heading / Paragraph</h4>
                    <p className="m-0 mt-1 text-[11px] text-muted">เรียนจบแล้ว • ผ่านด่านเควสแล้ว</p>
                  </div>
                  <div className="text-right text-xs font-bold text-theme-blue">✓ สำเร็จ</div>
                </div>
                <div className="grid grid-cols-[52px_1fr_90px] items-center gap-4 py-3 px-2 border-b border-dashed border-[#e1e7ef] dark:border-slate-800">
                  <div className="w-12 h-12 rounded-xl shadow-[0_0_0_3px_#dcecff] dark:shadow-[0_0_0_3px_rgba(49,130,246,0.2)] bg-[#eaf3ff] dark:bg-blue-900/30 text-theme-blue flex items-center justify-center font-mono font-bold text-sm">H3</div>
                  <div>
                    <h4 className="m-0 text-sm font-bold text-ink">โครงสร้าง HTML เชิงลึก</h4>
                    <p className="m-0 mt-1 text-[11px] text-muted">กำลังเรียน • ความก้าวหน้า 64%</p>
                  </div>
                  <div className="text-right text-xs font-bold text-theme-blue cursor-pointer hover:underline">เรียนต่อ &rarr;</div>
                </div>
                <div className="grid grid-cols-[52px_1fr_90px] items-center gap-4 py-3 px-2 border-b border-dashed border-[#e1e7ef] dark:border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-theme-navy text-white flex items-center justify-center font-mono font-bold text-sm">H4</div>
                  <div>
                    <h4 className="m-0 text-sm font-bold text-ink">การเชื่อมโยงและการแทรกสื่อ</h4>
                    <p className="m-0 mt-1 text-[11px] text-muted">หน่วยถัดไป</p>
                  </div>
                  <div className="text-right text-xs font-bold text-[#9aa6b8]">ถัดไป</div>
                </div>
                <div className="grid grid-cols-[52px_1fr_90px] items-center gap-4 py-3 px-2">
                  <div className="w-12 h-12 rounded-xl bg-theme-navy text-white flex items-center justify-center font-mono font-bold text-sm">H5</div>
                  <div>
                    <h4 className="m-0 text-sm font-bold text-ink">การสร้างแบบฟอร์ม HTML</h4>
                    <p className="m-0 mt-1 text-[11px] text-muted">ยังไม่เริ่มเรียน</p>
                  </div>
                  <div className="text-right text-xs font-bold text-[#9aa6b8]">ถัดไป</div>
                </div>
              </div>
            </div>

            {/* Right: Skills & Activity */}
            <div className="flex flex-col gap-4">
              
              <div className="bg-white dark:bg-slate-900 border border-line rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center px-5 py-4 border-b border-line">
                  <h3 className="m-0 text-base font-bold text-ink">ทักษะของฉัน</h3>
                  <span className="font-mono font-medium text-[10px] text-[#7a8ba4]">MASTERY</span>
                </div>
                <div className="p-5 pb-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-2 text-ink">
                      <span>โครงสร้าง HTML (H1)</span>
                      <code className="font-mono font-medium text-[10px] text-muted">86%</code>
                    </div>
                    <div className="h-2 bg-[#edf1f5] dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-theme-blue to-[#52b6ff] rounded-full" style={{width: '86%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-2 text-ink">
                      <span>ข้อความและ Heading (H2)</span>
                      <code className="font-mono font-medium text-[10px] text-muted">74%</code>
                    </div>
                    <div className="h-2 bg-[#edf1f5] dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-theme-blue to-[#52b6ff] rounded-full" style={{width: '74%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-2 text-ink">
                      <span>Links และ Navigation (H4)</span>
                      <code className="font-mono font-medium text-[10px] text-muted">58%</code>
                    </div>
                    <div className="h-2 bg-[#edf1f5] dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-theme-blue to-[#52b6ff] rounded-full" style={{width: '58%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-2 text-ink">
                      <span>Images และ Media (H5)</span>
                      <code className="font-mono font-medium text-[10px] text-muted">67%</code>
                    </div>
                    <div className="h-2 bg-[#edf1f5] dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-theme-blue to-[#52b6ff] rounded-full" style={{width: '67%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-line rounded-2xl overflow-hidden flex-1">
                <div className="flex justify-between items-center px-5 py-4 border-b border-line">
                  <h3 className="m-0 text-base font-bold text-ink">กิจกรรมล่าสุด</h3>
                  <span className="font-mono font-medium text-[10px] text-[#7a8ba4]">RECENT</span>
                </div>
                <div className="px-5 py-2 pb-5">
                  <div className="flex gap-3 py-3 border-b border-dashed border-[#e1e7ef] dark:border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] dark:bg-slate-800 flex items-center justify-center text-theme-green shrink-0 text-sm">✓</div>
                    <div>
                      <b className="text-[11px] text-ink block">ผ่านแบบฝึกหัด HTML Structure</b>
                      <small className="block text-[9px] text-muted mt-1">วันนี้ • 10 นาทีที่แล้ว</small>
                    </div>
                  </div>
                  <div className="flex gap-3 py-3 border-b border-dashed border-[#e1e7ef] dark:border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] dark:bg-slate-800 flex items-center justify-center text-theme-blue shrink-0 font-mono text-[10px] font-bold">&lt;/&gt;</div>
                    <div>
                      <b className="text-[11px] text-ink block">ผ่านด่านตะลุยด่าน: H2</b>
                      <small className="block text-[9px] text-muted mt-1">เมื่อวาน • ดาวสะสม +3</small>
                    </div>
                  </div>
                  <div className="flex gap-3 py-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] dark:bg-slate-800 flex items-center justify-center text-theme-purple shrink-0 text-sm font-bold">✦</div>
                    <div>
                      <b className="text-[11px] text-ink block">ทำแบบทดสอบ H2</b>
                      <small className="block text-[9px] text-muted mt-1">2 วันที่แล้ว • ความแม่นยำ 80%</small>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <div className="text-center text-[#8492a7] text-[10px] font-mono py-6">
        &lt;/&gt; WEB LEARNING STUDIO · HTML LEARNING PLATFORM
      </div>
    </div>
  );
}
