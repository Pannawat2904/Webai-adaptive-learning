'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SkillProfile } from '@/types/database';
import { MOCK_STUDENT_SKILLS } from '@/lib/mock-data';
import { Terminal, Gamepad2, CheckCircle2, Bot, Bell, Zap, ArrowRight, Code2, Sparkles, Lock } from 'lucide-react';

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
    <div className="main-inner enter">
      <div className="topline flex flex-wrap gap-2 items-center justify-between">
        <span className="path-pill"><Terminal className="w-3.5 h-3.5" />~/หลักสูตร_HTML</span>
        <div className="flex gap-2">
          <button className="icon-btn hidden md:flex"><Bell className="w-4 h-4" /></button>
          <span className="chip chip-green chip-mono hidden md:flex"><Zap className="w-3 h-3" />3 วันติดต่อกัน</span>
        </div>
      </div>

      <div className="page-heading">
        <h1>ภาพรวมการเรียนรู้<span className="accent">.</span></h1>
        <p>ติดตามความก้าวหน้า ฝึกเขียนโค้ดจริงใน Code Lab และประเมินความเข้าใจของคุณด้วยแบบทดสอบแบบปรับเหมาะ</p>
      </div>

      <section className="win">
        <div className="win-bar">
          <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
          <div className="win-title"><em>&lt;/&gt;</em> dashboard.html</div>
        </div>

        <div className="win-body">
          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.85fr] gap-6">
            <div className="card p-6 md:p-8 flex flex-col justify-center border-line">
              <span className="chip chip-green chip-mono self-start mb-4">
                <Terminal className="w-3 h-3" />STUDENT_DASHBOARD()
              </span>
              <h2 className="mb-3 text-2xl md:text-3xl font-bold leading-tight">
                สวัสดีครับ {profile?.full_name?.split(' ')[0] || 'ผู้เรียน'} 👋<br />พร้อมสร้างเว็บไซต์หน้าถัดไปหรือยัง?
              </h2>
              <p className="muted mb-5 text-sm md:text-[14px] leading-relaxed max-w-xl">
                วันนี้ระบบแนะนำให้เรียนต่อที่หน่วย <strong className="text-ink">H3 · โครงสร้าง HTML เชิงลึก</strong> — คุณทำไปแล้ว {avgLevel}% ของหน่วยนี้
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/student/lessons" className="btn btn-navy flex-1 sm:flex-none justify-center">เข้าสู่บทเรียนต่อ <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/student/quests" className="btn btn-soft flex-1 sm:flex-none justify-center"><Gamepad2 className="w-4 h-4" />ดูตะลุยด่าน</Link>
              </div>
            </div>

            <div className="relative overflow-hidden flex flex-col justify-between rounded-[var(--r-lg)] p-6 text-white" style={{ background: 'radial-gradient(420px 220px at 100% 0%, rgba(79,216,172,.18), transparent 60%), linear-gradient(160deg,var(--navy),var(--navy-2))' }}>
              <div className="absolute -right-2 -bottom-6 font-mono font-bold text-[100px] md:text-[130px] text-white/5 pointer-events-none">&lt;/&gt;</div>
              <div className="relative flex items-center gap-4">
                <svg className="ring" width="88" height="88" viewBox="0 0 120 120">
                  <circle className="ring-bg" cx="60" cy="60" r="52" strokeWidth="10" />
                  <circle className="ring-fg" cx="60" cy="60" r="52" strokeWidth="10" strokeDasharray="326.7" strokeDashoffset={326.7 - (326.7 * avgLevel) / 100} />
                </svg>
                <div>
                  <small className="text-[#aebbd0] text-[10.5px] font-mono tracking-wide">COURSE_PROGRESS</small>
                  <div className="font-mono font-bold text-3xl mt-0.5">{avgLevel}%</div>
                  <div className="text-[#c7d2e3] text-[11.5px] mt-0.5">5 / 8 หน่วย · กำลังเรียน H3</div>
                </div>
              </div>
              <div className="relative flex justify-between mt-6 pt-4 border-t border-white/10">
                <div>
                  <small className="text-[#aebbd0] text-[10.5px]">คะแนนสะสม</small>
                  <div className="font-mono font-bold text-lg mt-1">780 XP</div>
                </div>
                <div className="text-right">
                  <small className="text-[#aebbd0] text-[10.5px]">Streak</small>
                  <div className="font-mono font-bold text-lg mt-1">🔥 3 วัน</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <Link href="/student/quests" className="card card-hover flex items-center gap-4 p-4">
              <div className="w-11 h-11 rounded-xl bg-blue-dim text-theme-blue flex items-center justify-center shrink-0">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <b className="text-[13.5px] block">ตะลุยด่าน (Quests)</b>
                <small className="muted text-[11px]">ลุยด่านเขียนโค้ดแบบเกม</small>
              </div>
            </Link>
            <Link href="/student/assessment" className="card card-hover flex items-center gap-4 p-4">
              <div className="w-11 h-11 rounded-xl bg-green-dim text-theme-green flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <b className="text-[13.5px] block">ทำแบบทดสอบ</b>
                <small className="muted text-[11px]">ประเมินความเข้าใจรายหัวข้อ</small>
              </div>
            </Link>
            <Link href="/student/codelab" className="card card-hover flex items-center gap-4 p-4">
              <div className="w-11 h-11 rounded-xl bg-purple-dim text-theme-purple flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <b className="text-[13.5px] block">ฝึกเขียนโค้ด</b>
                <small className="muted text-[11px]">Code Lab พร้อม AI ตรวจโค้ด</small>
              </div>
            </Link>
          </div>

          {/* Roadmap + Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mt-4 items-start">
            <div className="card">
              <div className="card-head">
                <h3>เส้นทางการเรียนรู้</h3>
                <span className="tag">8 SUB-DOMAINS</span>
              </div>
              <div className="card-body pt-1.5">
                <div className="flex items-center gap-4 py-3 px-1.5 border-b border-dashed border-line">
                  <div className="w-11 h-11 rounded-xl bg-green-dim text-theme-green flex items-center justify-center font-mono font-bold text-[13px] shrink-0">H1</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="m-0 text-[13.5px] font-bold truncate">โครงสร้างเอกสาร HTML พื้นฐาน</h4>
                    <p className="muted m-0 mt-0.5 text-[11.5px] truncate">เรียนจบแล้ว · แบบทดสอบผ่าน</p>
                  </div>
                  <span className="chip chip-blue hidden sm:inline-flex shrink-0">✓ สำเร็จ</span>
                </div>
                <div className="flex items-center gap-4 py-3 px-1.5 border-b border-dashed border-line">
                  <div className="w-11 h-11 rounded-xl bg-green-dim text-theme-green flex items-center justify-center font-mono font-bold text-[13px] shrink-0">H2</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="m-0 text-[13.5px] font-bold truncate">การจัดการข้อความและ Heading/Paragraph</h4>
                    <p className="muted m-0 mt-0.5 text-[11.5px] truncate">เรียนจบแล้ว · ผ่านด่านตะลุยด่านแล้ว</p>
                  </div>
                  <span className="chip chip-blue hidden sm:inline-flex shrink-0">✓ สำเร็จ</span>
                </div>
                <div className="flex items-center gap-4 py-3 px-1.5 border-b border-dashed border-line">
                  <div className="w-11 h-11 rounded-xl bg-blue-dim text-theme-blue flex items-center justify-center font-mono font-bold text-[13px] shrink-0 ring-4 ring-blue-dim">H3</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="m-0 text-[13.5px] font-bold truncate">โครงสร้าง HTML เชิงลึก</h4>
                    <div className="bar thin mt-1.5 max-w-[220px]">
                      <span style={{ width: '64%' }}></span>
                    </div>
                  </div>
                  <Link href="/student/lessons" className="chip chip-blue cursor-pointer shrink-0">เรียนต่อ →</Link>
                </div>
                <div className="flex items-center gap-4 py-3 px-1.5 border-b border-dashed border-line opacity-60">
                  <div className="w-11 h-11 rounded-xl bg-soft text-faint flex items-center justify-center font-mono font-bold text-[13px] shrink-0">H4</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="m-0 text-[13.5px] font-bold truncate">การเชื่อมโยงและการแทรกสื่อ</h4>
                    <p className="muted m-0 mt-0.5 text-[11.5px] truncate">หน่วยถัดไป</p>
                  </div>
                  <span className="chip chip-line shrink-0">ถัดไป</span>
                </div>
                <div className="flex items-center gap-4 py-3 px-1.5 opacity-50">
                  <div className="w-11 h-11 rounded-xl bg-soft text-faint flex items-center justify-center font-mono font-bold text-[13px] shrink-0">H5</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="m-0 text-[13.5px] font-bold truncate">การสร้างแบบฟอร์ม HTML</h4>
                    <p className="muted m-0 mt-0.5 text-[11.5px] truncate">ยังไม่เริ่มเรียน</p>
                  </div>
                  <span className="chip chip-line shrink-0">ถัดไป</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="card">
                <div className="card-head">
                  <h3>ทักษะของฉัน</h3>
                  <span className="tag">MASTERY</span>
                </div>
                <div className="card-body flex flex-col gap-3.5">
                  <div>
                    <div className="flex justify-between text-[11.5px] font-bold mb-1.5">
                      <span>โครงสร้าง HTML (H1)</span><span className="mono muted">86%</span>
                    </div>
                    <div className="bar"><span style={{ width: '86%' }}></span></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11.5px] font-bold mb-1.5">
                      <span>ข้อความและ Heading (H2)</span><span className="mono muted">74%</span>
                    </div>
                    <div className="bar"><span style={{ width: '74%' }}></span></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11.5px] font-bold mb-1.5">
                      <span>Links และ Navigation (H3)</span><span className="mono muted">58%</span>
                    </div>
                    <div className="bar"><span style={{ width: '58%' }}></span></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11.5px] font-bold mb-1.5">
                      <span>Images และ Media (H4)</span><span className="mono muted">67%</span>
                    </div>
                    <div className="bar"><span style={{ width: '67%' }}></span></div>
                  </div>
                </div>
              </div>

              <div className="card flex-1">
                <div className="card-head">
                  <h3>กิจกรรมล่าสุด</h3>
                  <span className="tag">RECENT</span>
                </div>
                <div className="card-body pt-2">
                  <div className="flex gap-3 py-2.5 border-b border-dashed border-line">
                    <div className="w-8 h-8 rounded-lg bg-green-dim text-theme-green flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <b className="text-[11.5px] block">ผ่านแบบฝึกหัด HTML Structure</b>
                      <small className="faint text-[10px]">วันนี้ · 10 นาทีที่แล้ว</small>
                    </div>
                  </div>
                  <div className="flex gap-3 py-2.5 border-b border-dashed border-line">
                    <div className="w-8 h-8 rounded-lg bg-blue-dim text-theme-blue flex items-center justify-center shrink-0">
                      <Code2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <b className="text-[11.5px] block">ผ่านด่านตะลุยด่าน: H2</b>
                      <small className="faint text-[10px]">เมื่อวาน · ดาวสะสม +3</small>
                    </div>
                  </div>
                  <div className="flex gap-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-dim text-theme-purple flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <b className="text-[11.5px] block">ทำแบบทดสอบ H2</b>
                      <small className="faint text-[10px]">2 วันที่แล้ว · ความแม่นยำ 80%</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center faint mono text-[10px] py-6">&lt;/&gt; WEB LEARNING STUDIO · HTML LEARNING PLATFORM</div>
    </div>
  );
}
