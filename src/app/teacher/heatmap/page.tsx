'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_CLASS_STUDENTS } from '@/lib/mock-data';
import { SUB_DOMAINS, SubDomainCode } from '@/types/database';
import {
  BarChart3,
  ArrowLeft,
  Info,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Award,
  Users,
  Layers,
  Search,
  Download,
} from 'lucide-react';

export default function TeacherHeatmapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const students = MOCK_CLASS_STUDENTS;
  const subDomainCodes: SubDomainCode[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];

  // Calculate average score per sub-domain across the entire class
  const classAverages: Record<SubDomainCode, number> = {} as any;
  subDomainCodes.forEach((code) => {
    const total = students.reduce((acc, std) => acc + (std.scores[code] || 0), 0);
    classAverages[code] = Math.round(total / students.length);
  });

  // Find lowest & highest sub-domain in class
  let lowestCode: SubDomainCode = 'H6';
  let lowestScore = 100;
  let highestCode: SubDomainCode = 'H1';
  let highestScore = 0;

  subDomainCodes.forEach((code) => {
    if (classAverages[code] < lowestScore) {
      lowestScore = classAverages[code];
      lowestCode = code;
    }
    if (classAverages[code] > highestScore) {
      highestScore = classAverages[code];
      highestCode = code;
    }
  });

  const overallClassAvg = Math.round(
    Object.values(classAverages).reduce((a, b) => a + b, 0) / 8
  );

  const filteredStudents = students.filter((std) =>
    std.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modern Liquid Glass Color Pills
  const getPillStyle = (score: number) => {
    if (score >= 80) {
      return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs';
    }
    if (score >= 60) {
      return 'bg-indigo-500/15 border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs';
    }
    return 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold shadow-xs';
  };

  const handleExportCSV = () => {
    const headers = ['รหัสนักเรียน', 'ชื่อ-นามสกุล', 'คะแนนเฉลี่ย', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];
    const rows = students.map((s) => [
      s.id,
      s.name,
      s.avgScore,
      s.scores.H1,
      s.scores.H2,
      s.scores.H3,
      s.scores.H4,
      s.scores.H5,
      s.scores.H6,
      s.scores.H7,
      s.scores.H8,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heatmap_H1_H8_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl liquid-glass text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับแดชบอร์ดชั้นเรียน</span>
        </Link>
      </div>

      {/* Hero Header in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>การวิเคราะห์ความรู้ระดับ Sub-domain</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Sub-domain Heatmap (H1 - H8) ทั้งห้องเรียน
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              เมทริกซ์วิเคราะห์ระดับความเชี่ยวชาญ 8 มิติของโครงสร้างภาษา HTML สำหรับนักเรียน ปวช.1
              เพื่อระบุจุดที่ควรจัดกิจกรรมซ่อมเสริมอย่างตรงจุด
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>ส่งออกตาราง CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Liquid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              คะแนนเฉลี่ยรวมทั้งห้อง
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {overallClassAvg}%
          </div>
          <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            {overallClassAvg >= 80 ? 'ระดับสูง (เกณฑ์ดีเยี่ยม)' : overallClassAvg >= 60 ? 'ระดับดี (พัฒนาบางจุด)' : 'ควรพัฒนาเพิ่มเติม'}
          </div>
        </div>

        <div className="liquid-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              หัวข้อที่ทำได้ดีที่สุด
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {highestCode} ({highestScore}%)
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
            {SUB_DOMAINS[highestCode].name}
          </div>
        </div>

        <div className="liquid-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              หัวข้อที่ควรพัฒนาเร่งด่วน
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {lowestCode} ({lowestScore}%)
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
            {SUB_DOMAINS[lowestCode].name}
          </div>
        </div>

        <div className="liquid-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              จำนวนนักเรียนทั้งหมด
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {students.length} คน
          </div>
          <div className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
            ปวช.1 เทคโนโลยีสารสนเทศ
          </div>
        </div>
      </div>

      {/* Remediation Guide Banner */}
      <div className="liquid-glass rounded-2xl p-5 border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 flex items-start gap-4">
        <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
          <TrendingDown className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <span>คำแนะนำการจัดกิจกรรมซ่อมเสริมสำหรับครูผู้สอน</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300">
              แนะนำโดย AI
            </span>
          </h2>
          <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
            นักเรียนส่วนใหญ่ยังติดปัญหาในหัวข้อ <strong>[{lowestCode}] {SUB_DOMAINS[lowestCode].title}</strong> (เฉลี่ย {lowestScore}%)
            โดยเฉพาะการผสานเซลล์ด้วย <code>colspan</code> / <code>rowspan</code> และการวางโครงสร้างแบบฟอร์ม
            แนะนำให้ครูมอบหมายโจทย์ใน Code Lab ภารกิจที่ 4 หรือ 5 เพื่อให้นักเรียนได้ลงมือปฏิบัติจริง
          </p>
        </div>
      </div>

      {/* Main Heatmap Matrix Container */}
      <div className="liquid-glass rounded-3xl p-6 space-y-5">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>ตาราง Matrix ระดับความเชี่ยวชาญ 8 คอลัมน์</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Color Legend */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span>เกณฑ์:</span>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                &ge;80% สูง
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                60-79% ดี
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                &lt;60% พัฒนา
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อนักเรียน..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-44"
              />
            </div>
          </div>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60">
                <th className="p-3.5 text-left font-bold text-slate-800 dark:text-slate-200 min-w-[180px]">
                  ชื่อ-นามสกุล นักเรียน
                </th>
                {subDomainCodes.map((code) => {
                  const domain = SUB_DOMAINS[code];
                  return (
                    <th key={code} className="p-2 min-w-[85px] group">
                      <div className="p-2 rounded-xl liquid-glass border-slate-200/40 dark:border-white/5 transition-all group-hover:border-indigo-500/40">
                        <div className="font-mono font-black text-xs text-indigo-600 dark:text-indigo-400">
                          {code}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[75px]" title={domain.name}>
                          {domain.name}
                        </div>
                      </div>
                    </th>
                  );
                })}
                <th className="p-2 min-w-[80px]">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 font-black text-indigo-600 dark:text-indigo-400 text-xs">
                    คะแนนเฉลี่ย
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-indigo-500/5 transition-colors">
                  <td className="p-3.5 text-left font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
                        {std.name.charAt(0)}
                      </div>
                      <span className="truncate">{std.name}</span>
                    </div>
                  </td>
                  {subDomainCodes.map((code) => {
                    const score = std.scores[code] || 0;
                    return (
                      <td key={code} className="p-2">
                        <div className={`py-1.5 px-2 rounded-xl text-xs border transition-all ${getPillStyle(score)}`}>
                          {score}%
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-2">
                    <div className="py-1.5 px-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 text-slate-900 dark:text-white font-extrabold text-xs">
                      {std.avgScore}%
                    </div>
                  </td>
                </tr>
              ))}

              {/* Summary Class Averages Row */}
              <tr className="bg-indigo-500/10 border-t-2 border-indigo-500/30 font-bold">
                <td className="p-3.5 text-left text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>คะแนนเฉลี่ยทั้งชั้นเรียน</span>
                </td>
                {subDomainCodes.map((code) => {
                  const avg = classAverages[code];
                  return (
                    <td key={code} className="p-2">
                      <div className={`py-2 px-2 rounded-xl text-xs border font-black ${getPillStyle(avg)}`}>
                        {avg}%
                      </div>
                    </td>
                  );
                })}
                <td className="p-2">
                  <div className="py-2 px-2 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-sm">
                    {overallClassAvg}%
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
