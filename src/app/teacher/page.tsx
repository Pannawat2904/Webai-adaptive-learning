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
    if (val >= 80) return 'text-[#16a34a] dark:text-[#00ff9d] bg-[#16a34a]/10 dark:bg-[#00ff9d]/10';
    if (val >= 60) return 'text-[#d97706] dark:text-[#ffaa00] bg-[#d97706]/10 dark:bg-[#ffaa00]/10';
    return 'text-[#e11d48] dark:text-[#ff3366] bg-[#e11d48]/10 dark:bg-[#ff3366]/10';
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
            className="px-4 py-2 rounded-xl bg-white dark:bg-[rgba(16,22,38,0.6)] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-white focus:outline-none focus:border-[#0284c7] dark:focus:border-[#00ff9d] appearance-none"
          >
            <option value="all">ทุกห้อง (ปวช.1)</option>
            <option value="1">ห้อง 1/1</option>
            <option value="2">ห้อง 1/2</option>
          </select>
          <select 
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[rgba(16,22,38,0.6)] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-white focus:outline-none focus:border-[#0284c7] dark:focus:border-[#00ff9d] appearance-none"
          >
            <option value="1/2569">ภาคเรียนที่ 1/2569</option>
            <option value="2/2568">ภาคเรียนที่ 2/2568</option>
          </select>
        </div>
      </div>

      {/* SECTION 1: ภาพรวมแบบเข้าใจง่าย */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">นักเรียนทั้งหมด</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{totalStudents} <span className="text-sm font-normal text-slate-500">คน</span></div>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-[0.05] dark:opacity-10 pointer-events-none">
            <CheckCircle2 className="w-24 h-24 text-[#0284c7] dark:text-[#00e5ff]" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#0284c7]/10 dark:bg-[rgba(0,229,255,0.1)] text-[#0284c7] dark:text-[#00e5ff] flex items-center justify-center shadow-sm dark:shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">ทำแบบทดสอบแล้ว</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{testedStudents} <span className="text-sm font-normal text-slate-500">คน</span></div>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#9333ea]/10 dark:bg-[rgba(176,92,255,0.1)] text-[#9333ea] dark:text-[#b05cff] flex items-center justify-center shadow-sm dark:shadow-[0_0_15px_rgba(176,92,255,0.2)]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">ความสามารถเฉลี่ย</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">θ = {avgTheta}</div>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-between border-[#e11d48]/20 dark:border-[rgba(255,51,102,0.3)] bg-[#e11d48]/5 dark:bg-[rgba(255,51,102,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#e11d48]/10 dark:bg-[rgba(255,51,102,0.1)] text-[#e11d48] dark:text-[#ff3366] flex items-center justify-center shadow-sm dark:shadow-[0_0_15px_rgba(255,51,102,0.2)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#e11d48] dark:text-[#ff3366] uppercase tracking-wider mb-1">ต้องติดตาม</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{atRiskStudents.length} <span className="text-sm font-normal text-[#e11d48] dark:text-[#ff3366]">คน</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 2: AI Teacher Assistant / Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-head flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0284c7] to-[#0ea5e9] dark:from-[#00ff9d] dark:to-[#00e5ff] flex items-center justify-center text-white dark:text-black">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg text-slate-900 dark:text-white">Teacher AI Insight</h3>
                <p className="text-[11px] text-[#0284c7] dark:text-[#00ff9d] uppercase tracking-widest mt-0.5">สิ่งที่ควรสนใจวันนี้</p>
              </div>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#e11d48]/5 dark:bg-[rgba(255,51,102,0.05)] border border-[#e11d48]/20 dark:border-[rgba(255,51,102,0.2)]">
                <AlertTriangle className="w-5 h-5 text-[#e11d48] dark:text-[#ff3366] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">จากผลการประเมินล่าสุด นักเรียน 7 คนมี Skill Gap ด้าน Form (H7)</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">คะแนนเฉลี่ย H7 ลดลงต่ำกว่า 50% แนะนำให้จัดกิจกรรมทบทวนเนื้อหานี้</p>
                  <div className="flex gap-3 mt-3">
                    <Link href="/teacher/students?filter=H7" className="text-xs font-bold text-[#e11d48] dark:text-[#ff3366] hover:underline">ดูรายชื่อนักเรียน →</Link>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#d97706]/5 dark:bg-[rgba(255,170,0,0.05)] border border-[#d97706]/20 dark:border-[rgba(255,170,0,0.2)]">
                <FileQuestion className="w-5 h-5 text-[#d97706] dark:text-[#ffaa00] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">มีข้อสอบ 12 ข้อรอการตรวจสอบคุณภาพ (IOC)</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">เพื่อนำไปใช้ในกระบวนการ Calibration สำหรับ IRT 3PL</p>
                  <div className="flex gap-3 mt-3">
                    <Link href="/teacher/questions?status=review" className="text-xs font-bold text-[#d97706] dark:text-[#ffaa00] hover:underline">ตรวจสอบข้อสอบ →</Link>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#16a34a]/5 dark:bg-[rgba(0,255,157,0.05)] border border-[#16a34a]/20 dark:border-[rgba(0,255,157,0.2)]">
                <TrendingUp className="w-5 h-5 text-[#16a34a] dark:text-[#00ff9d] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">ผลการทดสอบล่าสุดมีการเปลี่ยนแปลงเชิงบวก</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">นักเรียนส่วนใหญ่ทำแบบทดสอบ H3 ได้ดีขึ้น ความสามารถเฉลี่ยเพิ่มขึ้น +0.15 θ</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: นักเรียนที่ควรติดตาม */}
          <div className="card">
            <div className="card-head">
              <h3 className="text-slate-900 dark:text-white">นักเรียนที่ควรติดตาม (At-Risk Students)</h3>
              <Link href="/teacher/students" className="text-xs font-bold text-[#0284c7] dark:text-[#00e5ff] hover:underline">ดูทั้งหมด</Link>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">นักเรียน</th>
                    <th className="px-6 py-4 text-center font-bold">ความสามารถ (θ)</th>
                    <th className="px-6 py-4 text-center font-bold">จุดอ่อน</th>
                    <th className="px-6 py-4 font-bold">คำแนะนำจากระบบ</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {atRiskStudents.slice(0, 3).map((std, i) => {
                    const weakCodes = (Object.keys(std.scores) as SubDomainCode[]).filter((c) => (std.scores[c] || 0) < 60);
                    return (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{std.name}</td>
                        <td className="px-6 py-4 text-center text-[#e11d48] dark:text-[#ff3366] font-mono">
                          {((std.avgScore / 100) * 6 - 3).toFixed(2)}
                          <span className="text-lg ml-1">↓</span>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">
                          {weakCodes[0] || 'H7 Form'}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">ควรทบทวนเรื่องโครงสร้าง Form เบื้องต้น</td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/teacher/students/${std.id}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
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
          <div className="card">
            <div className="card-head">
              <h3 className="text-slate-900 dark:text-white">ภาพรวมทักษะรายโดเมน</h3>
            </div>
            <div className="card-body flex flex-col gap-4">
              {Object.entries(skillAverages).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600 dark:text-slate-300">
                      {key === 'H1' ? 'โครงสร้างพื้นฐาน' : 
                       key === 'H2' ? 'ข้อความ & Heading' :
                       key === 'H3' ? 'Links & Navigation' :
                       key === 'H4' ? 'Images & Media' :
                       key === 'H5' ? 'Tables' :
                       key === 'H6' ? 'Lists' :
                       key === 'H7' ? 'Forms (กำลังมีปัญหา)' :
                       key === 'H8' ? 'Semantic HTML' : key} ({key})
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono ${getStatusColor(val)}`}>{val}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div 
                      className={`h-full rounded-full shadow-sm dark:shadow-[0_0_10px_currentColor] ${
                        val >= 80 ? 'bg-[#16a34a] dark:bg-[#00ff9d] text-[#16a34a] dark:text-[#00ff9d]' : 
                        val >= 60 ? 'bg-[#d97706] dark:bg-[#ffaa00] text-[#d97706] dark:text-[#ffaa00]' : 
                        'bg-[#e11d48] dark:bg-[#ff3366] text-[#e11d48] dark:text-[#ff3366]'
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: Recent Activity */}
          <div className="card">
            <div className="card-head">
              <h3 className="text-slate-900 dark:text-white">กิจกรรมล่าสุด</h3>
            </div>
            <div className="card-body p-4 space-y-1">
              <div className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-default">
                <div className="w-8 h-8 rounded-lg bg-[#0284c7]/10 dark:bg-[rgba(0,229,255,0.1)] text-[#0284c7] dark:text-[#00e5ff] flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">สมชาย รักการเรียน ทำแบบทดสอบ CAT เสร็จสิ้น</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">10 นาทีที่แล้ว • วัดความสามารถได้ θ = 0.52</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-default">
                <div className="w-8 h-8 rounded-lg bg-[#9333ea]/10 dark:bg-[rgba(176,92,255,0.1)] text-[#9333ea] dark:text-[#b05cff] flex items-center justify-center shrink-0">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">นักเรียน 5 คน ผ่านด่าน Code Lab: H2</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">45 นาทีที่แล้ว</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-default">
                <div className="w-8 h-8 rounded-lg bg-[#16a34a]/10 dark:bg-[rgba(0,255,157,0.1)] text-[#16a34a] dark:text-[#00ff9d] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">ระบบอัปเดตคำแนะนำ AI ใหม่</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">2 ชั่วโมงที่แล้ว • จากผลการวิเคราะห์ล่าสุด</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
