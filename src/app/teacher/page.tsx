'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_CLASS_STUDENTS } from '@/lib/mock-data';
import { SubDomainCode } from '@/types/database';
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Download,
  Search,
  ArrowRight,
  BarChart3,
  FileQuestion,
  ExternalLink,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

export default function TeacherOverviewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students] = useState(MOCK_CLASS_STUDENTS);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const avgCompletion = Math.round(
    students.reduce((acc, s) => acc + s.completion, 0) / totalStudents
  );
  const avgScore = (
    students.reduce((acc, s) => acc + s.avgScore, 0) / totalStudents
  ).toFixed(1);

  const handleExportCSV = () => {
    // CSV logic
    const link = document.createElement('a');
    link.href = '#';
    link.download = `รายงานผล_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter">
      
      {/* Top Banner */}
      <div className="win p-8 flex flex-wrap items-center justify-between gap-6 border-[#00ff9d]/20">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20 shadow-[0_0_15px_rgba(0,255,157,0.1)]">
            <Users className="w-4 h-4" /> แดชบอร์ดครูผู้สอน (Teacher Dashboard)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
            ภาพรวมชั้นเรียน: โครงสร้างภาษา HTML (ปวช.1)
          </h1>
          <p className="text-sm text-slate-300">
            ติดตามพัฒนาการ ประเมินจุดอ่อนจุดแข็งราย Sub-domain และจัดการคลังสื่อการสอน
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn bg-[#00ff9d] text-black hover:bg-[#00e5ff] shadow-[0_0_20px_rgba(0,255,157,0.4)]">
          <Download className="w-4 h-4" /> ส่งออกรายงาน CSV
        </button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card card-hover p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-1">จำนวนนักเรียนในห้อง</div>
            <div className="text-3xl font-black text-white">{totalStudents} คน</div>
            <div className="text-[11px] font-bold text-[#00e5ff] mt-1">แผนกวิชาเทคโนโลยีสารสนเทศ</div>
          </div>
        </div>

        <div className="card card-hover p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[rgba(0,255,157,0.1)] border border-[rgba(0,255,157,0.2)] text-[#00ff9d] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-1">อัตราการเรียนจบเฉลี่ย</div>
            <div className="text-3xl font-black text-white">{avgCompletion}%</div>
            <div className="text-[11px] font-bold text-[#00ff9d] mt-1">ดูสไลด์ครบและส่งงาน</div>
          </div>
        </div>

        <div className="card card-hover p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[rgba(176,92,255,0.1)] border border-[rgba(176,92,255,0.2)] text-[#b05cff] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(176,92,255,0.2)]">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-1">คะแนนประเมินเฉลี่ยห้อง</div>
            <div className="text-3xl font-black text-white">{avgScore}%</div>
            <div className="text-[11px] font-bold text-[#b05cff] mt-1">จาก Adaptive Test & Code Lab</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/teacher/adaptive-logs" className="card card-hover p-6 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[rgba(0,229,255,0.1)] text-[#00e5ff] group-hover:bg-[#00e5ff] group-hover:text-black transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-[15px] text-white">Log ตรวจสอบระบบ</h2>
              <p className="text-xs text-slate-400 mt-1">กราฟ Trajectory & Export</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#00e5ff] group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/teacher/reliability" className="card card-hover p-6 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[rgba(0,255,157,0.1)] text-[#00ff9d] group-hover:bg-[#00ff9d] group-hover:text-black transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-[15px] text-white">ความเที่ยงข้อสอบ</h2>
              <p className="text-xs text-slate-400 mt-1">ความเชื่อมั่นราย Sub-domain</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#00ff9d] group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/teacher/effect-size" className="card card-hover p-6 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[rgba(176,92,255,0.1)] text-[#b05cff] group-hover:bg-[#b05cff] group-hover:text-black transition-colors">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-[15px] text-white">Effect Size</h2>
              <p className="text-xs text-slate-400 mt-1">วิเคราะห์ขนาดอิทธิพล (Cohen's d)</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#b05cff] group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/teacher/questions" className="card card-hover p-6 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[rgba(255,51,102,0.1)] text-[#ff3366] group-hover:bg-[#ff3366] group-hover:text-black transition-colors">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-[15px] text-white">คลังข้อสอบ (IOC)</h2>
              <p className="text-xs text-slate-400 mt-1">เกณฑ์ &ge; 0.67 & Validated</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#ff3366] group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/teacher/analytics" className="card card-hover p-6 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[rgba(255,170,0,0.1)] text-[#ffaa00] group-hover:bg-[#ffaa00] group-hover:text-black transition-colors">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-[15px] text-white">วิเคราะห์ข้อสอบ (p,r)</h2>
              <p className="text-xs text-slate-400 mt-1">ดัชนีความยากง่ายและอำนาจจำแนก</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#ffaa00] group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/teacher/heatmap" className="card card-hover p-6 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[rgba(0,255,157,0.1)] text-[#00ff9d] group-hover:bg-[#00ff9d] group-hover:text-black transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-[15px] text-white">Sub-domain Heatmap</h2>
              <p className="text-xs text-slate-400 mt-1">ตารางสี 8 คอลัมน์</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#00ff9d] group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Student List */}
      <div className="card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg text-white">รายชื่อนักเรียนและการประเมินรายบุคคล</h2>
            <p className="text-xs text-slate-400 mt-1">คลิกเพื่อดู Learning Profile 8 มิติของนักเรียนแต่ละคน</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อนักเรียน..."
              className="pl-9 pr-4 py-2.5 rounded-xl bg-[rgba(0,0,0,0.2)] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00ff9d] w-full sm:w-64 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[rgba(255,255,255,0.02)] text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold text-xs">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 text-center font-bold text-xs">ความคืบหน้า</th>
                <th className="px-6 py-4 text-center font-bold text-xs">คะแนนเฉลี่ย</th>
                <th className="px-6 py-4 text-center font-bold text-xs">หัวข้อที่เด่น</th>
                <th className="px-6 py-4 text-center font-bold text-xs">หัวข้อที่ควรพัฒนา</th>
                <th className="px-6 py-4 text-right font-bold text-xs">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.map((std) => {
                const weakCodes = (Object.keys(std.scores) as SubDomainCode[]).filter((c) => (std.scores[c] || 0) < 60);
                const strongCodes = (Object.keys(std.scores) as SubDomainCode[]).filter((c) => (std.scores[c] || 0) >= 80);

                return (
                  <tr key={std.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{std.name}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-[#00ff9d] shadow-[0_0_10px_#00ff9d]" style={{ width: `${std.completion}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#00ff9d]">{std.completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-[#00e5ff]">{std.avgScore}%</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        {strongCodes.length > 0 ? strongCodes.map((c) => (
                          <span key={c} className="chip chip-green font-mono">{c}</span>
                        )) : <span className="text-slate-500">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        {weakCodes.length > 0 ? weakCodes.map((c) => (
                          <span key={c} className="chip chip-amber font-mono">{c}</span>
                        )) : <span className="text-[#00ff9d] text-xs font-bold">ผ่านเกณฑ์</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href="/student/profile" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#00e5ff] hover:text-[#00e5ff] transition-colors text-xs font-bold text-slate-300">
                        ดู Profile <ExternalLink className="w-3.5 h-3.5" />
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
  );
}
