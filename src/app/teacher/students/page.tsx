'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_CLASS_STUDENTS } from '@/lib/mock-data';
import { SubDomainCode } from '@/types/database';
import {
  Users,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useTeacherContext } from '@/components/teacher/TeacherContext';

export default function StudentManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isResearchMode } = useTeacherContext();

  // Sort students by average score descending, then mock theta
  const students = [...MOCK_CLASS_STUDENTS].sort((a, b) => b.avgScore - a.avgScore);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter max-w-[1200px] mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#00ff9d]" />
            นักเรียนทั้งหมด
          </h1>
          <p className="text-sm text-slate-400">
            ดูรายชื่อ จัดกลุ่ม และวิเคราะห์ความสามารถของนักเรียนเป็นรายบุคคล
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อนักเรียน..."
              className="pl-9 pr-4 py-2.5 rounded-xl bg-[rgba(16,22,38,0.6)] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00ff9d] w-full sm:w-64 transition-colors"
            />
          </div>
          <button className="px-4 py-2.5 rounded-xl bg-[rgba(16,22,38,0.6)] border border-white/10 text-sm font-bold text-white hover:bg-white/10 flex items-center gap-2">
            <Filter className="w-4 h-4" /> ตัวกรอง
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[rgba(255,255,255,0.02)] text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-wider">ห้อง</th>
                <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-wider">ทดสอบล่าสุด</th>
                <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-wider">
                  {isResearchMode ? 'ความสามารถ (θ)' : 'ความสามารถ'}
                </th>
                {isResearchMode && (
                  <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-wider">SE</th>
                )}
                <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-wider">จุดแข็ง</th>
                <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-wider">จุดที่ต้องพัฒนา</th>
                <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-4 text-right font-bold text-xs"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.map((std, idx) => {
                const weakCodes = (Object.keys(std.scores) as SubDomainCode[]).filter((c) => (std.scores[c] || 0) < 60);
                const strongCodes = (Object.keys(std.scores) as SubDomainCode[]).filter((c) => (std.scores[c] || 0) >= 80);
                
                // Mock theta logic based on score
                const rawScore = std.avgScore / 100;
                const theta = (rawScore * 6 - 3).toFixed(2);
                const se = (0.2 + (Math.random() * 0.1)).toFixed(2); // Mock Standard Error

                return (
                  <tr key={std.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{std.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">{std.id}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-300">
                      ปวช.1/1
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-slate-400">
                      วันนี้ 10:30
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isResearchMode ? (
                        <span className="font-mono font-bold text-[#00e5ff]">{theta}</span>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]" style={{ width: `${std.avgScore}%` }} />
                          </div>
                          <span className="text-xs font-bold text-[#00e5ff]">{std.avgScore}%</span>
                        </div>
                      )}
                    </td>
                    {isResearchMode && (
                      <td className="px-6 py-4 text-center font-mono text-slate-500">
                        {se}
                      </td>
                    )}
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
                        )) : <span className="text-slate-500">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {weakCodes.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[#ffaa00] text-[11px] font-bold bg-[#ffaa00]/10 px-2 py-1 rounded-md">
                          <AlertTriangle className="w-3 h-3" /> ควรติดตาม
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#00ff9d] text-[11px] font-bold bg-[#00ff9d]/10 px-2 py-1 rounded-md">
                          <CheckCircle2 className="w-3 h-3" /> ปกติ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/teacher/students/${std.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
                        <ExternalLink className="w-4 h-4" />
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
