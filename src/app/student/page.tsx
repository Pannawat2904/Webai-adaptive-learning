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
      <div className="topline">
        <span className="path-pill"><Terminal className="w-3.5 h-3.5" />~/หลักสูตร_HTML</span>
        <div className="flex gap-2">
          <button className="icon-btn hide-mobile"><Bell className="w-4 h-4" /></button>
          <span className="chip chip-green chip-mono hide-mobile"><Zap className="w-3 h-3" />3 วันติดต่อกัน</span>
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
          <div className="grid" style={{ gridTemplateColumns: '1.25fr 0.85fr', gap: '22px' }}>
            <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--line)' }}>
              <span className="chip chip-green chip-mono" style={{ alignSelf: 'flex-start', marginBottom: '14px' }}>
                <Terminal className="w-3 h-3" />STUDENT_DASHBOARD()
              </span>
              <h2 style={{ margin: '0 0 10px', fontSize: '26px', fontWeight: 700, lineHeight: 1.3 }}>
                สวัสดีครับ {profile?.full_name?.split(' ')[0] || 'ผู้เรียน'} 👋<br />พร้อมสร้างเว็บไซต์หน้าถัดไปหรือยัง?
              </h2>
              <p className="muted" style={{ margin: '0 0 20px', fontSize: '14px', lineHeight: 1.8, maxWidth: '520px' }}>
                วันนี้ระบบแนะนำให้เรียนต่อที่หน่วย <strong style={{ color: 'var(--ink)' }}>H3 · โครงสร้าง HTML เชิงลึก</strong> — คุณทำไปแล้ว {avgLevel}% ของหน่วยนี้
              </p>
              <div className="flex gap-3 wrap">
                <Link href="/student/lessons" className="btn btn-navy">เข้าสู่บทเรียนต่อ <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/student/quests" className="btn btn-soft"><Gamepad2 className="w-4 h-4" />ดูตะลุยด่าน</Link>
              </div>
            </div>

            <div style={{ background: 'radial-gradient(420px 220px at 100% 0%, rgba(79,216,172,.18), transparent 60%), linear-gradient(160deg,var(--navy),var(--navy-2))', borderRadius: 'var(--r-lg)', padding: '26px', color: '#fff', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', right: '-10px', bottom: '-24px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '130px', color: 'rgba(255,255,255,.05)', pointerEvents: 'none' }}>&lt;/&gt;</div>
              <div className="flex items-center gap-4" style={{ position: 'relative' }}>
                <svg className="ring" width="88" height="88" viewBox="0 0 120 120">
                  <circle className="ring-bg" cx="60" cy="60" r="52" strokeWidth="10" />
                  <circle className="ring-fg" cx="60" cy="60" r="52" strokeWidth="10" strokeDasharray="326.7" strokeDashoffset={326.7 - (326.7 * avgLevel) / 100} />
                </svg>
                <div>
                  <small style={{ color: '#aebbd0', fontSize: '10.5px', fontFamily: 'var(--font-mono)', letterSpacing: '.03em' }}>COURSE_PROGRESS</small>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '32px', marginTop: '2px' }}>{avgLevel}%</div>
                  <div style={{ color: '#c7d2e3', fontSize: '11.5px', marginTop: '2px' }}>5 / 8 หน่วย · กำลังเรียน H3</div>
                </div>
              </div>
              <div className="flex justify-between" style={{ position: 'relative', marginTop: '22px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,.12)' }}>
                <div>
                  <small style={{ color: '#aebbd0', fontSize: '10.5px' }}>คะแนนสะสม</small>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '18px', marginTop: '3px' }}>780 XP</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <small style={{ color: '#aebbd0', fontSize: '10.5px' }}>Streak</small>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '18px', marginTop: '3px' }}>🔥 3 วัน</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginTop: '16px' }}>
            <Link href="/student/quests" className="card card-hover flex items-center gap-4" style={{ padding: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <b style={{ fontSize: '13.5px', display: 'block' }}>ตะลุยด่าน (Quests)</b>
                <small className="muted" style={{ fontSize: '11px' }}>ลุยด่านเขียนโค้ดแบบเกม</small>
              </div>
            </Link>
            <Link href="/student/assessment" className="card card-hover flex items-center gap-4" style={{ padding: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--green-dim)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <b style={{ fontSize: '13.5px', display: 'block' }}>ทำแบบทดสอบ</b>
                <small className="muted" style={{ fontSize: '11px' }}>ประเมินความเข้าใจรายหัวข้อ</small>
              </div>
            </Link>
            <Link href="/student/codelab" className="card card-hover flex items-center gap-4" style={{ padding: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--purple-dim)', color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <b style={{ fontSize: '13.5px', display: 'block' }}>ฝึกเขียนโค้ด</b>
                <small className="muted" style={{ fontSize: '11px' }}>Code Lab พร้อม AI ตรวจโค้ด</small>
              </div>
            </Link>
          </div>

          {/* Roadmap + Skills */}
          <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: '16px', marginTop: '16px', alignItems: 'start' }}>
            <div className="card">
              <div className="card-head">
                <h3>เส้นทางการเรียนรู้</h3>
                <span className="tag">8 SUB-DOMAINS</span>
              </div>
              <div className="card-body" style={{ paddingTop: '6px' }}>
                <div className="flex items-center gap-4" style={{ padding: '13px 6px', borderBottom: '1px dashed var(--line)' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--green-dim)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>H1</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700 }}>โครงสร้างเอกสาร HTML พื้นฐาน</h4>
                    <p className="muted" style={{ margin: '3px 0 0', fontSize: '11.5px' }}>เรียนจบแล้ว · แบบทดสอบผ่าน</p>
                  </div>
                  <span className="chip chip-blue">✓ สำเร็จ</span>
                </div>
                <div className="flex items-center gap-4" style={{ padding: '13px 6px', borderBottom: '1px dashed var(--line)' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--green-dim)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>H2</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700 }}>การจัดการข้อความและ Heading/Paragraph</h4>
                    <p className="muted" style={{ margin: '3px 0 0', fontSize: '11.5px' }}>เรียนจบแล้ว · ผ่านด่านตะลุยด่านแล้ว</p>
                  </div>
                  <span className="chip chip-blue">✓ สำเร็จ</span>
                </div>
                <div className="flex items-center gap-4" style={{ padding: '13px 6px', borderBottom: '1px dashed var(--line)' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', flexShrink: 0, boxShadow: '0 0 0 3px var(--blue-dim)' }}>H3</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700 }}>โครงสร้าง HTML เชิงลึก</h4>
                    <div className="bar thin" style={{ marginTop: '6px', maxWidth: '220px' }}>
                      <span style={{ width: '64%' }}></span>
                    </div>
                  </div>
                  <Link href="/student/lessons" className="chip chip-blue" style={{ cursor: 'pointer' }}>เรียนต่อ →</Link>
                </div>
                <div className="flex items-center gap-4" style={{ padding: '13px 6px', borderBottom: '1px dashed var(--line)', opacity: .6 }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--soft)', color: 'var(--faint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>H4</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700 }}>การเชื่อมโยงและการแทรกสื่อ</h4>
                    <p className="muted" style={{ margin: '3px 0 0', fontSize: '11.5px' }}>หน่วยถัดไป</p>
                  </div>
                  <span className="chip chip-line">ถัดไป</span>
                </div>
                <div className="flex items-center gap-4" style={{ padding: '13px 6px', opacity: .5 }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--soft)', color: 'var(--faint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>H5</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700 }}>การสร้างแบบฟอร์ม HTML</h4>
                    <p className="muted" style={{ margin: '3px 0 0', fontSize: '11.5px' }}>ยังไม่เริ่มเรียน</p>
                  </div>
                  <span className="chip chip-line">ถัดไป</span>
                </div>
              </div>
            </div>

            <div className="flex-col gap-4" style={{ display: 'flex' }}>
              <div className="card">
                <div className="card-head">
                  <h3>ทักษะของฉัน</h3>
                  <span className="tag">MASTERY</span>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div className="flex justify-between" style={{ fontSize: '11.5px', fontWeight: 700, marginBottom: '6px' }}>
                      <span>โครงสร้าง HTML (H1)</span><span className="mono muted">86%</span>
                    </div>
                    <div className="bar"><span style={{ width: '86%' }}></span></div>
                  </div>
                  <div>
                    <div className="flex justify-between" style={{ fontSize: '11.5px', fontWeight: 700, marginBottom: '6px' }}>
                      <span>ข้อความและ Heading (H2)</span><span className="mono muted">74%</span>
                    </div>
                    <div className="bar"><span style={{ width: '74%' }}></span></div>
                  </div>
                  <div>
                    <div className="flex justify-between" style={{ fontSize: '11.5px', fontWeight: 700, marginBottom: '6px' }}>
                      <span>Links และ Navigation (H3)</span><span className="mono muted">58%</span>
                    </div>
                    <div className="bar"><span style={{ width: '58%' }}></span></div>
                  </div>
                  <div>
                    <div className="flex justify-between" style={{ fontSize: '11.5px', fontWeight: 700, marginBottom: '6px' }}>
                      <span>Images และ Media (H4)</span><span className="mono muted">67%</span>
                    </div>
                    <div className="bar"><span style={{ width: '67%' }}></span></div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ flex: 1 }}>
                <div className="card-head">
                  <h3>กิจกรรมล่าสุด</h3>
                  <span className="tag">RECENT</span>
                </div>
                <div className="card-body" style={{ paddingTop: '8px' }}>
                  <div className="flex gap-3" style={{ padding: '10px 0', borderBottom: '1px dashed var(--line)' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'var(--green-dim)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <b style={{ fontSize: '11.5px', display: 'block' }}>ผ่านแบบฝึกหัด HTML Structure</b>
                      <small className="faint" style={{ fontSize: '10px' }}>วันนี้ · 10 นาทีที่แล้ว</small>
                    </div>
                  </div>
                  <div className="flex gap-3" style={{ padding: '10px 0', borderBottom: '1px dashed var(--line)' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Code2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <b style={{ fontSize: '11.5px', display: 'block' }}>ผ่านด่านตะลุยด่าน: H2</b>
                      <small className="faint" style={{ fontSize: '10px' }}>เมื่อวาน · ดาวสะสม +3</small>
                    </div>
                  </div>
                  <div className="flex gap-3" style={{ padding: '10px 0' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'var(--purple-dim)', color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <b style={{ fontSize: '11.5px', display: 'block' }}>ทำแบบทดสอบ H2</b>
                      <small className="faint" style={{ fontSize: '10px' }}>2 วันที่แล้ว · ความแม่นยำ 80%</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center faint mono" style={{ fontSize: '10px', padding: '22px 0' }}>&lt;/&gt; WEB LEARNING STUDIO · HTML LEARNING PLATFORM</div>
    </div>
  );
}
