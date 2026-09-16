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
  BookOpen,
  FileQuestion,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function TeacherOverviewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(MOCK_CLASS_STUDENTS);

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
    const headers = ['รหัสนักเรียน', 'ชื่อ-นามสกุล', 'ความคืบหน้า (%)', 'คะแนนเฉลี่ย', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];
    const rows = students.map((s) => [
      s.id,
      s.name,
      s.completion,
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
    link.setAttribute('download', `รายงานผลการเรียน_โครงสร้างHTML_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>แดชบอร์ดครูผู้สอน (Teacher Dashboard)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ภาพรวมชั้นเรียน: โครงสร้างภาษา HTML (ปวช.1)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            ติดตามพัฒนาการ ประเมินจุดอ่อนจุดแข็งราย Sub-domain และจัดการคลังสื่อการสอน
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>ส่งออกรายงานเป็น CSV</span>
        </button>
      </div>

      {/* 3 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="liquid-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">จำนวนนักเรียนในห้อง</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {totalStudents} คน
            </div>
            <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              แผนกวิชาเทคโนโลยีสารสนเทศ
            </div>
          </div>
        </div>

        <div className="liquid-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">อัตราการเรียนจบเฉลี่ย</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {avgCompletion}%
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              ดูสไลด์ครบและส่งงาน
            </div>
          </div>
        </div>

        <div className="liquid-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">คะแนนประเมินเฉลี่ยห้อง</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {avgScore}%
            </div>
            <div className="text-[11px] font-bold text-violet-600 dark:text-violet-400">
              จาก Adaptive Test & Code Lab
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/teacher/heatmap"
          className="liquid-card p-5 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Sub-domain Heatmap (H1-H8)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ตารางสี 8 คอลัมน์แสดงภาพรวมทั้งห้อง
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/teacher/questions"
          className="liquid-card p-5 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
              <FileQuestion className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                จัดการคลังข้อสอบ (Question Bank)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                เพิ่ม/แก้ไขข้อสอบ 8 Sub-domain
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/teacher/lessons"
          className="liquid-card p-5 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                จัดการสื่อการสอน (Media Organizer)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                จัดลำดับสไลด์ วิดีโอ และเอกสาร
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Student List Table in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              รายชื่อนักเรียนและการประเมินรายบุคคล
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              คลิกเพื่อดู Learning Profile 8 มิติของนักเรียนแต่ละคน
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อนักเรียน..."
              className="pl-9 pr-4 py-2 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 shadow-2xs"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-indigo-500/5 text-slate-500 uppercase font-bold text-[11px]">
              <tr>
                <th className="p-3.5 rounded-l-2xl">ชื่อ-นามสกุล</th>
                <th className="p-3.5 text-center">ความคืบหน้า</th>
                <th className="p-3.5 text-center">คะแนนเฉลี่ย</th>
                <th className="p-3.5 text-center">หัวข้อที่เด่น</th>
                <th className="p-3.5 text-center">หัวข้อที่ควรพัฒนา</th>
                <th className="p-3.5 text-right rounded-r-2xl">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {filteredStudents.map((std) => {
                const weakCodes = (Object.keys(std.scores) as SubDomainCode[]).filter(
                  (c) => (std.scores[c] || 0) < 60
                );
                const strongCodes = (Object.keys(std.scores) as SubDomainCode[]).filter(
                  (c) => (std.scores[c] || 0) >= 80
                );

                return (
                  <tr
                    key={std.id}
                    className="hover:bg-indigo-500/5 transition-colors"
                  >
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {std.name}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${std.completion}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {std.completion}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-black text-indigo-600 dark:text-indigo-400">
                      {std.avgScore}%
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {strongCodes.length > 0 ? (
                          strongCodes.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded-lg text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono font-bold"
                            >
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {weakCodes.length > 0 ? (
                          weakCodes.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded-lg text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-mono font-bold"
                            >
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-emerald-600 font-bold text-[11px]">ผ่านเกณฑ์</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href="/student/profile"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl liquid-glass hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-all shadow-2xs"
                      >
                        <span>ดู Profile</span>
                        <ExternalLink className="w-3 h-3" />
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
