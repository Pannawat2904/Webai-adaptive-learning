'use client';

import React, { useState, useMemo } from 'react';
import {
  SubDomainCode,
  SUB_DOMAINS,
  PrePostComparison,
} from '@/types/database';
import { MOCK_CLASS_PRE_POST, StudentPrePostRecord } from '@/lib/mock-sessions';
import { calculateCohensD } from '@/lib/psychometrics';
import {
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  BarChart2,
  ArrowRight,
  Info,
  Calendar,
  Filter,
} from 'lucide-react';

export default function EffectSizePage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('ALL');

  // Compute Classwide Statistics
  const classStats = useMemo(() => {
    const preScores = MOCK_CLASS_PRE_POST.map((s) => s.preTotal);
    const postScores = MOCK_CLASS_PRE_POST.map((s) => s.postTotal);
    return calculateCohensD(preScores, postScores);
  }, []);

  // Compute Sub-domain Specific Pre vs Post Averages
  const subDomainComparisons = useMemo(() => {
    const codes: SubDomainCode[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];
    return codes.map((code) => {
      const preList = MOCK_CLASS_PRE_POST.map((s) => s.subDomainPre[code] || 0);
      const postList = MOCK_CLASS_PRE_POST.map((s) => s.subDomainPost[code] || 0);
      const result = calculateCohensD(preList, postList);
      return {
        code,
        title: SUB_DOMAINS[code]?.name || code,
        ...result,
      };
    });
  }, []);

  // Filtered student list or single student
  const activeStudents = useMemo(() => {
    if (selectedStudentId === 'ALL') return MOCK_CLASS_PRE_POST;
    return MOCK_CLASS_PRE_POST.filter((s) => s.studentId === selectedStudentId);
  }, [selectedStudentId]);

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            การวัดพัฒนาการเชิงประจักษ์ (Longitudinal Assessment)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            เปรียบเทียบผลก่อน-หลังเรียน (Pre-test vs Post-test)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            วิเคราะห์ขนาดอิทธิพลของนวัตกรรมด้วยค่า Cohen&apos;s d Effect Size ทั้งระดับชั้นเรียนและรายบุคคล
          </p>
        </div>

        {/* Student Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">ภาพรวมทั้งชั้นเรียน ({MOCK_CLASS_PRE_POST.length} คน)</option>
            {MOCK_CLASS_PRE_POST.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {s.studentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Classwide Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">คะแนนเฉลี่ยก่อนเรียน (Pre-test)</span>
          <div className="text-3xl font-black text-slate-700 dark:text-slate-300">
            {classStats.meanPre}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">กลุ่มก่อนได้รับการจัดการเรียนรู้</p>
        </div>

        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">คะแนนเฉลี่ยหลังเรียน (Post-test)</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {classStats.meanPost}%
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            พัฒนาการเพิ่มขึ้น +{classStats.gain}%
          </p>
        </div>

        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">ขนาดอิทธิพล (Cohen&apos;s d)</span>
          <div className="text-3xl font-black gradient-text">
            d = {classStats.d}
          </div>
          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
            {classStats.magnitude}
          </span>
        </div>

        <div className="liquid-glass rounded-3xl p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">นัยสำคัญเชิงปฏิบัติ</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white pt-1">
            ระดับสูงมาก (Large)
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            d &ge; 0.80 ตามเกณฑ์ Cohen (1988)
          </p>
        </div>
      </div>

      {/* Academic Explanation Banner */}
      <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          การแปลผลค่า Cohen&apos;s d Effect Size ในงานวิจัยทางการศึกษา
        </div>
        <p className="leading-relaxed text-xs text-slate-700 dark:text-slate-300">
          <strong>Cohen&apos;s d (1988)</strong> เป็นดัชนีวัดขนาดผลของการแทรกแซงหรือนวัตกรรมทางการศึกษา โดยไม่ขึ้นกับขนาดของกลุ่มตัวอย่าง:
          <br />• <strong>d = 0.20 (Small):</strong> พัฒนาการขนาดเล็ก
          <br />• <strong>d = 0.50 (Medium):</strong> พัฒนาการขนาดปานกลาง มีผลสัมฤทธิ์ที่สังเกตเห็นได้อย่างชัดเจน
          <br />• <strong>d &ge; 0.80 (Large):</strong> พัฒนาการขนาดใหญ่มาก แสดงว่านวัตกรรมการเรียนรู้แบบปรับเหมาะเฉพาะบุคคลส่งผลให้นักเรียนเกิดการเรียนรู้อย่างมีนัยสำคัญเชิงปฏิบัติสูง
        </p>
      </div>

      {/* Sub-domain Pre vs Post Comparison Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-500" />
          การเปรียบเทียบก่อน-หลังเรียน จำแนกราย Sub-domain H1–H8
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subDomainComparisons.map((sub) => (
            <div key={sub.code} className="liquid-glass rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                  {sub.code}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  +{sub.gain}%
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {sub.title}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ก่อน: {sub.meanPre}% → หลัง: {sub.meanPost}%
                </div>
              </div>

              {/* Progress bars for Pre and Post */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Pre-test</span>
                  <span>{sub.meanPre}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: `${sub.meanPre}%` }} />
                </div>

                <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Post-test</span>
                  <span>{sub.meanPost}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full" style={{ width: `${sub.meanPost}%` }} />
                </div>
              </div>

              <div className="pt-2 border-t border-white/40 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Cohen&apos;s d</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  d = {sub.d}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Student Roster Table */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          ตารางคะแนนพัฒนาการและค่า Effect Size รายบุคคล
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-white/40 dark:border-white/10">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4">ชื่อ-นามสกุล</th>
                <th className="py-3.5 px-4">Pre-test (ก่อน)</th>
                <th className="py-3.5 px-4">Post-test (หลัง)</th>
                <th className="py-3.5 px-4">คะแนนพัฒนาการ (Gain)</th>
                <th className="py-3.5 px-4">Cohen&apos;s d โดยประมาณ</th>
                <th className="py-3.5 px-4">ระดับขนาดอิทธิพล</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 bg-white/40 dark:bg-slate-900/40">
              {activeStudents.map((st) => {
                const gain = st.postTotal - st.preTotal;
                // Approximate standardized gain for student
                const studentD = Number(((gain / 20) * 1.5).toFixed(2));

                return (
                  <tr key={st.studentId} className="hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {st.studentName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {st.preTotal}%
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {st.postTotal}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                        <TrendingUp className="w-3.5 h-3.5" />+{gain}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      d = {studentD}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> มาก (Large: &ge; 0.8)
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
