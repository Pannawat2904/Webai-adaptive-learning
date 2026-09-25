'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudents, subscribeToDatabase, StudentRecord } from '@/lib/database-service';
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
  const [students, setStudents] = useState<StudentRecord[]>([]);

  const loadData = () => {
    const list = getStudents();
    setStudents([...list].sort((a, b) => b.avgScore - a.avgScore));
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToDatabase((event) => {
      if (event.type === 'student' || event.type === 'session' || event.type === 'reset') {
        loadData();
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter max-w-[1200px] mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-md mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#0284c7] dark:text-[#00ff9d]" />
            นักเรียนทั้งหมด
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ดูรายชื่อ จัดกลุ่ม และวิเคราะห์ความสามารถของนักเรียนเป็นรายบุคคล
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อนักเรียน..."
              className="pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[rgba(16,22,38,0.6)] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0284c7] dark:focus:border-[#00ff9d] w-full sm:w-64 transition-colors"
            />
          </div>
          <button className="px-4 py-2.5 rounded-xl bg-white dark:bg-[rgba(16,22,38,0.6)] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 flex items-center gap-2">
            <Filter className="w-4 h-4" /> ตัวกรอง
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[rgba(255,255,255,0.02)] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
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
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-transparent">
              {filteredStudents.map((std, idx) => {
                const weakCodes = (Object.keys(std.scores) as SubDomainCode[]).filter((c) => (std.scores[c] || 0) < 60);
                const strongCodes = (Object.keys(std.scores) as SubDomainCode[]).filter((c) => (std.scores[c] || 0) >= 80);
                
                // Live theta and se calculation based on student record
                const rawScore = std.avgScore / 100;
                const theta = std.theta !== undefined ? std.theta.toFixed(2) : (rawScore * 6 - 3).toFixed(2);
                const se = std.se !== undefined ? std.se.toFixed(2) : '0.28';

                return (
                  <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{std.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">{std.id}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-600 dark:text-slate-300">
                      ปวช.1/1
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                      {std.lastTested || 'วันนี้ 10:30'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isResearchMode ? (
                        <span className="font-mono font-bold text-[#0284c7] dark:text-[#00e5ff]">{theta}</span>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                            <div className="h-full bg-[#0284c7] dark:bg-[#00e5ff] shadow-sm dark:shadow-[0_0_10px_#00e5ff]" style={{ width: `${std.avgScore}%` }} />
                          </div>
                          <span className="text-xs font-bold text-[#0284c7] dark:text-[#00e5ff]">{std.avgScore}%</span>
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
                        )) : <span className="text-slate-400 dark:text-slate-500">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        {weakCodes.length > 0 ? weakCodes.map((c) => (
                          <span key={c} className="chip chip-amber font-mono">{c}</span>
                        )) : <span className="text-slate-400 dark:text-slate-500">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {weakCodes.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[#d97706] dark:text-[#ffaa00] text-[11px] font-bold bg-[#d97706]/10 dark:bg-[#ffaa00]/10 px-2 py-1 rounded-md">
                          <AlertTriangle className="w-3 h-3" /> ควรติดตาม
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#16a34a] dark:text-[#00ff9d] text-[11px] font-bold bg-[#16a34a]/10 dark:bg-[#00ff9d]/10 px-2 py-1 rounded-md">
                          <CheckCircle2 className="w-3 h-3" /> ปกติ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/teacher/students/${std.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors">
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
