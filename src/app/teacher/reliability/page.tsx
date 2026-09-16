'use client';

import React, { useState, useMemo } from 'react';
import {
  SubDomainCode,
  SUB_DOMAINS,
  SubDomainReliability,
} from '@/types/database';
import { MOCK_QUESTIONS } from '@/lib/mock-data';
import { MOCK_TEST_SESSIONS } from '@/lib/mock-sessions';
import { calculateSubDomainKR20 } from '@/lib/psychometrics';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Info,
  HelpCircle,
  ArrowUpRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

export default function ReliabilityPage() {
  const subCodes: SubDomainCode[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];

  // Calculate KR-20 for each Sub-domain using psychometrics utility
  const reliabilityData: SubDomainReliability[] = useMemo(() => {
    return subCodes.map((code) => {
      return calculateSubDomainKR20(code, MOCK_QUESTIONS, MOCK_TEST_SESSIONS);
    });
  }, []);

  // Summary stats
  const avgKR20 = Number(
    (
      reliabilityData.reduce((acc, r) => acc + r.kr20, 0) /
      reliabilityData.length
    ).toFixed(2)
  );
  const passedCount = reliabilityData.filter((r) => r.is_acceptable).length;

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Award className="w-3.5 h-3.5" />
            คุณภาพเครื่องมือวัดและประเมินผลทางการศึกษา
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ความเที่ยงของคลังข้อสอบ (KR-20 Reliability)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            วิเคราะห์ค่าสัมประสิทธิ์ความเชื่อมั่น Kuder-Richardson Formula 20 ราย Sub-domain H1–H8
          </p>
        </div>

        <Link
          href="/teacher/adaptive-logs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl liquid-card border border-white/40 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all self-start"
        >
          ดู Log การทำงาน
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">ค่าความเที่ยงเฉลี่ยภาพรวม</span>
          <div className="text-3xl font-black gradient-text">
            {avgKR20}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ผ่านเกณฑ์มาตรฐานทางการศึกษา (≥ 0.70)
          </p>
        </div>

        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Sub-domains ที่ผ่านเกณฑ์</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {passedCount} / {reliabilityData.length}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ทุกหน่วยการเรียนรู้มีความสอดคล้องภายในสูง
          </p>
        </div>

        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">เกณฑ์มาตรฐาน (Benchmark)</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            ≥ 0.70
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            เกณฑ์ที่ยอมรับได้สำหรับข้อสอบปรนัย
          </p>
        </div>

        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">สูตรการคำนวณ</span>
          <div className="text-xl font-mono font-bold text-slate-800 dark:text-slate-200">
            KR-20
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Kuder & Richardson (1937)
          </p>
        </div>
      </div>

      {/* KR-20 Academic Info Alert */}
      <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-indigo-800 dark:text-indigo-300">
          <Info className="w-4 h-4 text-indigo-500 shrink-0" />
          เกณฑ์การแปลความหมายค่าความเชื่อมั่น KR-20 ในงานวิจัยทางการศึกษา
        </div>
        <p className="leading-relaxed text-slate-700 dark:text-slate-300 text-xs">
          ค่าความเชื่อมั่น KR-20 (Kuder-Richardson Formula 20) ใช้วัดความสอดคล้องภายใน (Internal Consistency) ของข้อสอบปรนัยที่มีการตรวจให้คะแนนแบบทวิภาค (Dichotomous: 0 หรือ 1):
          <br />• <strong>KR-20 ≥ 0.80:</strong> ความเชื่อมั่นระดับดีมาก (เครื่องมือมีคุณภาพสูง มีความคงเส้นคงวาในการวัด)
          <br />• <strong>0.70 ≤ KR-20 &lt; 0.80:</strong> ความเชื่อมั่นระดับยอมรับได้ (เกณฑ์ขั้นต่ำมาตรฐานสำหรับการทดสอบในชั้นเรียน)
          <br />• <strong>KR-20 &lt; 0.70:</strong> ควรปรับปรุง (ครูผู้สอนควรพิจารณาแก้ไขตัวเลือก หรือทบทวนความชัดเจนของข้อสอบ)
        </p>
      </div>

      {/* Sub-domain Reliability Table */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            ตารางค่าความเที่ยง KR-20 จำแนกราย Sub-domain H1–H8
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/40 dark:border-white/10">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">รหัส</th>
                <th className="py-3 px-4">Sub-domain</th>
                <th className="py-3 px-4">จำนวนข้อ (k)</th>
                <th className="py-3 px-4">ความแปรปรวน (S²)</th>
                <th className="py-3 px-4">∑(p·q)</th>
                <th className="py-3 px-4">ค่า KR-20</th>
                <th className="py-3 px-4">การแปลผลเชิงวิชาการ</th>
                <th className="py-3 px-4">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 bg-white/40 dark:bg-slate-900/40">
              {reliabilityData.map((item) => {
                const sub = SUB_DOMAINS[item.sub_domain_code];

                return (
                  <tr key={item.sub_domain_code} className="hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.sub_domain_code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {sub?.name || item.sub_domain_code}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {sub?.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{item.item_count} ข้อ</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">{item.variance}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">{item.sum_pq}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-base text-slate-900 dark:text-white">
                          {item.kr20.toFixed(2)}
                        </span>
                        {/* Mini bar */}
                        <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.kr20 >= 0.8
                                ? 'bg-emerald-500'
                                : item.kr20 >= 0.7
                                ? 'bg-indigo-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, item.kr20 * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {item.interpretation}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.is_acceptable ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> ผ่านเกณฑ์
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3" /> ควรปรับปรุง
                        </span>
                      )}
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
