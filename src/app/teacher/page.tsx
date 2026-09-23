'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_CLASS_STUDENTS } from '@/lib/mock-data';
import { SubDomainCode } from '@/types/database';
import {
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Search,
  Activity,
  Bot,
  Terminal,
  BookOpen,
  FileQuestion
} from 'lucide-react';

export default function TeacherOverviewPage() {
  const [classFilter, setClassFilter] = useState('all');
  const [termFilter, setTermFilter] = useState('1/2569');

  const students = MOCK_CLASS_STUDENTS;
  const totalStudents = students.length;
  const testedStudents = students.filter(s => s.completion > 0).length;
  // Mock average theta calculation based on average score for demo
  const avgScore = (students.reduce((acc, s) => acc + s.avgScore, 0) / totalStudents) / 100;
  const avgTheta = (avgScore * 6 - 3).toFixed(2); // Maps 0-1 to -3 to +3
  
  // Find at risk students (score < 60)
  const atRiskStudents = students.filter(s => s.avgScore < 60);

  // Calculate skill overview (H1-H8 averages)
  const skillAverages: Record<string, number> = {
    H1: 82, H2: 76, H3: 61, H4: 52, H5: 78, H6: 63, H7: 42, H8: 71
  };

  const getStatusColor = (val: number) => {
    if (val >= 80) return 'text-success bg-success-dim';
    if (val >= 60) return 'text-warning bg-warning-dim';
    return 'text-danger bg-danger-dim';
  };

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter max-w-[1200px] mx-auto">
      
      {/* Header & Selectors */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-md mb-2">
            สวัสดีครับ อาจารย์ 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ศูนย์ควบคุมการเรียนรู้ (Learning Control Center)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-surface border border-line text-sm font-bold text-ink focus:outline-none focus:border-primary appearance-none"
          >
            <option value="all">ทุกห้อง (ปวช.1)</option>
            <option value="1">ห้อง 1/1</option>
            <option value="2">ห้อง 1/2</option>
          </select>
          <select 
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-surface border border-line text-sm font-bold text-ink focus:outline-none focus:border-primary appearance-none"
          >
            <option value="1/2569">ภาคเรียนที่ 1/2569</option>
            <option value="2/2568">ภาคเรียนที่ 2/2568</option>
          </select>
        </div>
      </div>

      {/* SECTION 1: ภาพรวมแบบเข้าใจง่าย */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6 flex flex-col justify-between border-line">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-muted">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider mb-1">นักเรียนทั้งหมด</div>
            <div className="text-3xl font-black text-ink">{totalStudents} <span className="text-sm font-normal text-muted">คน</span></div>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-between relative overflow-hidden border-primary">
          <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
            <CheckCircle2 className="w-24 h-24 text-primary" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-dim text-primary flex items-center justify-center shadow-[0_0_15px_var(--primary-dim)]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider mb-1">ทำแบบทดสอบแล้ว</div>
            <div className="text-3xl font-black text-ink">{testedStudents} <span className="text-sm font-normal text-muted">คน</span></div>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-between border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-dim text-theme-purple flex items-center justify-center shadow-[0_0_15px_rgba(176,92,255,0.2)]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider mb-1">ความสามารถเฉลี่ย</div>
            <div className="text-3xl font-black text-ink">θ = {avgTheta}</div>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-between border-danger bg-danger-dim">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-danger/20 text-danger flex items-center justify-center shadow-[0_0_15px_var(--danger-dim)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-danger uppercase tracking-wider mb-1">ต้องติดตาม</div>
            <div className="text-3xl font-black text-ink">{atRiskStudents.length} <span className="text-sm font-normal text-danger">คน</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 2: AI Teacher Assistant / Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card border-line">
            <div className="flex items-center gap-3 p-4 border-b border-line bg-surface">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Teacher AI Insight</h3>
                <p className="text-[11px] font-bold text-primary uppercase tracking-widest mt-0.5">สิ่งที่ควรสนใจวันนี้</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-danger-dim border border-danger">
                <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-ink">จากผลการประเมินล่าสุด นักเรียน 7 คนมี Skill Gap ด้าน Form (H7)</p>
                  <p className="text-xs text-muted mt-1">คะแนนเฉลี่ย H7 ลดลงต่ำกว่า 50% แนะนำให้จัดกิจกรรมทบทวนเนื้อหานี้</p>
                  <div className="flex gap-3 mt-3">
                    <Link href="/teacher/students?filter=H7" className="text-xs font-bold text-danger hover:underline">ดูรายชื่อนักเรียน →</Link>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-warning-dim border border-warning">
                <FileQuestion className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-ink">มีข้อสอบ 12 ข้อรอการตรวจสอบคุณภาพ (IOC)</p>
                  <p className="text-xs text-muted mt-1">เพื่อนำไปใช้ในกระบวนการ Calibration สำหรับ IRT 3PL</p>
                  <div className="flex gap-3 mt-3">
                    <Link href="/teacher/questions?status=review" className="text-xs font-bold text-warning hover:underline">ตรวจสอบข้อสอบ →</Link>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-success-dim border border-success">
                <TrendingUp className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-ink">ผลการทดสอบล่าสุดมีการเปลี่ยนแปลงเชิงบวก</p>
                  <p className="text-xs text-muted mt-1">นักเรียนส่วนใหญ่ทำแบบทดสอบ H3 ได้ดีขึ้น ความสามารถเฉลี่ยเพิ่มขึ้น +0.15 θ</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: นักเรียนที่ควรติดตาม */}
          <div className="card border-line">
            <div className="flex items-center justify-between p-4 border-b border-line bg-surface">
              <h3 className="font-bold text-ink">นักเรียนที่ควรติดตาม (At-Risk Students)</h3>
              <Link href="/teacher/students" className="text-xs font-bold text-primary hover:underline">ดูทั้งหมด</Link>
            </div>
            <div className="p-0 overflow-x-auto bg-bg-base">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface text-muted text-xs uppercase tracking-wider border-b border-line">
                  <tr>
                    <th className="px-6 py-4 font-bold">นักเรียน</th>
                    <th className="px-6 py-4 text-center font-bold">ความสามารถ (θ)</th>
                    <th className="px-6 py-4 text-center font-bold">จุดอ่อน</th>
                    <th className="px-6 py-4 font-bold">คำแนะนำจากระบบ</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {atRiskStudents.slice(0, 3).map((std, i) => {
                    const weakCodes = (Object.keys(std.scores) as SubDomainCode[]).filter((c) => (std.scores[c] || 0) < 60);
                    return (
                      <tr key={i} className="hover:bg-surface transition-colors">
                        <td className="px-6 py-4 font-bold text-ink">{std.name}</td>
                        <td className="px-6 py-4 text-center text-danger font-mono">
                          {((std.avgScore / 100) * 6 - 3).toFixed(2)}
                          <span className="text-lg ml-1">↓</span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-muted">
                          {weakCodes[0] || 'H7 Form'}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted">ควรทบทวนเรื่องโครงสร้าง Form เบื้องต้น</td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/teacher/students/${std.id}`} className="px-3 py-1.5 rounded-lg border border-line text-xs font-bold text-muted hover:bg-surface transition-colors">
                            ดูรายละเอียด
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* SECTION 3: Skill Overview */}
          <div className="card border-line">
            <div className="p-4 border-b border-line bg-surface">
              <h3 className="font-bold text-ink">ภาพรวมทักษะรายโดเมน</h3>
            </div>
            <div className="p-4 flex flex-col gap-4 bg-bg-base">
              {Object.entries(skillAverages).map(([key, val]) => {
                const colorClass = val >= 80 ? 'bg-success text-success' : val >= 60 ? 'bg-warning text-warning' : 'bg-danger text-danger';
                return (
                <div key={key}>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-muted">
                      {key === 'H1' ? 'โครงสร้างพื้นฐาน' : 
                       key === 'H2' ? 'ข้อความ & Heading' :
                       key === 'H3' ? 'Links & Navigation' :
                       key === 'H4' ? 'Images & Media' :
                       key === 'H5' ? 'Tables' :
                       key === 'H6' ? 'Lists' :
                       key === 'H7' ? 'Forms (กำลังมีปัญหา)' :
                       key === 'H8' ? 'Semantic HTML' : key} ({key})
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${getStatusColor(val)}`}>{val}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${colorClass.split(' ')[0]}`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 5: Recent Activity */}
          <div className="card border-line">
            <div className="p-4 border-b border-line bg-surface">
              <h3 className="font-bold text-ink">กิจกรรมล่าสุด</h3>
            </div>
            <div className="p-4 space-y-1 bg-bg-base">
              <div className="flex gap-3 p-3 rounded-xl hover:bg-surface transition-colors cursor-default">
                <div className="w-8 h-8 rounded-lg bg-primary-dim text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">สมชาย รักการเรียน ทำแบบทดสอบ CAT เสร็จสิ้น</p>
                  <p className="text-[10px] text-muted mt-0.5">10 นาทีที่แล้ว • วัดความสามารถได้ θ = 0.52</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-xl hover:bg-surface transition-colors cursor-default">
                <div className="w-8 h-8 rounded-lg bg-purple-dim text-theme-purple flex items-center justify-center shrink-0 border border-purple-500/20">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">นักเรียน 5 คน ผ่านด่าน Code Lab: H2</p>
                  <p className="text-[10px] text-muted mt-0.5">45 นาทีที่แล้ว</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-xl hover:bg-surface transition-colors cursor-default">
                <div className="w-8 h-8 rounded-lg bg-success-dim text-success flex items-center justify-center shrink-0 border border-success/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">ระบบอัปเดตคำแนะนำ AI ใหม่</p>
                  <p className="text-[10px] text-muted mt-0.5">2 ชั่วโมงที่แล้ว • จากผลการวิเคราะห์ล่าสุด</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
