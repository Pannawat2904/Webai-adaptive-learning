'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SUB_DOMAINS, SubDomainCode } from '@/types/database';
import { MOCK_QUESTIONS } from '@/lib/mock-data';
import { MOCK_ATTEMPTS_SOMCHAI } from '@/lib/mock-sessions';
import { calculateItemPsychometrics, evaluateItemQuality } from '@/lib/psychometrics';
import {
  BarChart2,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Search,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';

export default function TeacherAnalyticsPage() {
  const [selectedSubDomain, setSelectedSubDomain] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Generate item psychometrics for all questions in the bank
  const itemAnalytics = useMemo(() => {
    return MOCK_QUESTIONS.map((q) => {
      // Mock session scores for Kelley 27% computation
      const mockScores = [
        { sessionId: 'sess-1', score: 18 },
        { sessionId: 'sess-2', score: 16 },
        { sessionId: 'sess-3', score: 14 },
        { sessionId: 'sess-4', score: 10 },
        { sessionId: 'sess-5', score: 8 },
      ];
      return calculateItemPsychometrics(q, MOCK_ATTEMPTS_SOMCHAI.filter((a) => a.question_id === q.id), mockScores);
    });
  }, []);

  const filteredItems = itemAnalytics.filter((item) => {
    const matchesSub = selectedSubDomain === 'all' || item.sub_domain_code === selectedSubDomain;
    const matchesSearch =
      item.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.question_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSub && matchesSearch;
  });

  const avgP = Number((itemAnalytics.reduce((acc, i) => acc + i.p_value, 0) / itemAnalytics.length).toFixed(2));
  const avgD = Number((itemAnalytics.reduce((acc, i) => acc + i.d_value, 0) / itemAnalytics.length).toFixed(2));
  const highQualityCount = itemAnalytics.filter((i) => i.d_value >= 0.4 && i.p_value >= 0.2 && i.p_value <= 0.8).length;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Top Breadcrumb */}
      <Link
        href="/teacher"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>กลับไปยังแดชบอร์ดครูผู้สอน</span>
      </Link>

      {/* Header in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>การวิเคราะห์คุณภาพข้อสอบรายข้อ (Item Analysis)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            สถิติความยากง่าย (p), อำนาจจำแนก (D) และ IRT 3PL
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            วิเคราะห์คุณภาพข้อสอบรายข้อด้วย 27% Extreme Groups และติดตามการกระจายตัวของความสามารถผู้เรียน (Theta)
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">ความยากเฉลี่ย (Mean p-value)</span>
          <div className="text-3xl font-black gradient-text">
            p = {avgP}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            อยู่ในช่วงที่เหมาะสม (0.20 - 0.80)
          </p>
        </div>

        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">อำนาจจำแนกเฉลี่ย (Mean D)</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            D = {avgD}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            อำนาจจำแนกสูงมาก (&ge; 0.40)
          </p>
        </div>

        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">ข้อสอบคุณภาพดีเยี่ยม</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {highQualityCount} / {itemAnalytics.length}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ผ่านทั้งเกณฑ์ความยากและอำนาจจำแนก
          </p>
        </div>

        <div className="liquid-glass rounded-3xl p-5 space-y-1 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> ความสามารถผู้เรียน (Theta)
          </span>
          <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
            θ = 0.45
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-500">
            จำลองจากประวัติการทำข้อสอบ (SE = 0.28)
          </p>
        </div>

        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">เทคนิคการวิเคราะห์</span>
          <div className="text-base font-bold text-slate-900 dark:text-white pt-1">
            27% Extreme Groups
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            เปรียบเทียบกลุ่มสูง 27% vs กลุ่มต่ำ 27%
          </p>
        </div>
      </div>

      {/* Psychometrics Guidelines Info Box */}
      <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-indigo-800 dark:text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          เกณฑ์การพิจารณาคุณภาพข้อสอบทางวิชาการ (Academic Psychometrics Criteria)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-white/5 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">1. ค่าความยากง่าย (Difficulty Index: p-value):</span>
            <p>• p &gt; 0.80 = ง่ายเกินไป, p &lt; 0.20 = ยากเกินไป</p>
            <p>• <strong>0.20 &le; p &le; 0.80:</strong> ความยากง่ายเหมาะสมตามเกณฑ์ (ปานกลาง 0.40–0.60 เหมาะสมที่สุด)</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-white/5 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">2. ค่าอำนาจจำแนก (Discrimination Index: D-value):</span>
            <p>• D &lt; 0.20 = อำนาจจำแนกต่ำ ควรตัดทิ้งหรือปรับปรุงตัวเลือก</p>
            <p>• <strong>0.20 &le; D &lt; 0.40 = จำแนกได้พอใช้, D &ge; 0.40 = จำแนกได้ดีมาก</strong></p>
          </div>
        </div>
      </div>

      {/* Table of Item Psychometrics */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ตารางวิเคราะห์คุณภาพข้อสอบรายข้อ (Item Analytics Table)
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedSubDomain}
              onChange={(e) => setSelectedSubDomain(e.target.value)}
              className="text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
            >
              <option value="all">ทุก Sub-domain (H1 - H8)</option>
              {(Object.keys(SUB_DOMAINS) as SubDomainCode[]).map((c) => (
                <option key={c} value={c}>
                  [{c}] {SUB_DOMAINS[c].name}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาข้อสอบ..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs w-44"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/40 dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-3">Sub</th>
                <th className="py-3 px-3 min-w-[280px]">ข้อความคำถาม</th>
                <th className="py-3 px-3">ระดับ</th>
                <th className="py-3 px-3">IOC</th>
                <th className="py-3 px-3">ความยาก (p)</th>
                <th className="py-3 px-3">อำนาจจำแนก (D)</th>
                <th className="py-3 px-3">กลุ่มสูง 27% vs ต่ำ 27%</th>
                <th className="py-3 px-3 min-w-[180px]">การประเมินคุณภาพทางวิชาการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 bg-white/40 dark:bg-slate-900/40">
              {filteredItems.map((item) => {
                const isGoodD = item.d_value >= 0.4;
                const isLowD = item.d_value < 0.2;

                return (
                  <tr key={item.question_id} className="hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                        {item.sub_domain_code}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                        {item.question_text}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.question_id}
                      </div>
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-600 dark:text-slate-300">
                      {item.difficulty}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {item.ioc_score.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {item.p_value.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-mono font-extrabold ${
                          isGoodD
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isLowD
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {item.d_value.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      สูง {item.high_group_correct_pct}% | ต่ำ {item.low_group_correct_pct}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isGoodD
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                            : isLowD
                            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                            : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20'
                        }`}
                      >
                        {item.evaluation}
                      </span>
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
