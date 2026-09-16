'use client';

import React, { useState, useEffect } from 'react';
import {
  TestSession,
  Attempt,
  SubDomainCode,
  SUB_DOMAINS,
  QuestionDifficulty,
} from '@/types/database';
import { MOCK_TEST_SESSIONS } from '@/lib/mock-sessions';
import {
  ShieldCheck,
  FileSpreadsheet,
  Printer,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  Filter,
  Download,
  Sparkles,
} from 'lucide-react';

export default function AdaptiveLogsPage() {
  const [sessions, setSessions] = useState<TestSession[]>(MOCK_TEST_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    MOCK_TEST_SESSIONS[0].id
  );

  // Load any newly created sessions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('webai_test_sessions');
      if (stored) {
        const parsed: TestSession[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge avoiding duplicates
          const merged = [...parsed, ...MOCK_TEST_SESSIONS.filter((m) => !parsed.some((p) => p.id === m.id))];
          setSessions(merged);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const activeSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];
  const attempts: Attempt[] = activeSession?.attempts || [];

  // Map difficulty to numeric height for trajectory chart (Easy=1, Medium=2, Hard=3)
  const diffToVal = (d?: QuestionDifficulty): number => {
    if (d === 'hard') return 3;
    if (d === 'easy') return 1;
    return 2;
  };

  // Export to CSV for Research Appendix
  const handleExportCSV = () => {
    if (!activeSession || attempts.length === 0) return;

    const headers = [
      'ลำดับข้อ (Sequence)',
      'รหัส Sub-domain',
      'ชื่อหน่วยการเรียนรู้',
      'ระดับความยากข้อนี้ (Previous Difficulty)',
      'คำตอบที่เลือก (Answer)',
      'ผลการตอบ (Result)',
      'เวลาตอบ (วินาที)',
      'ระดับความยากที่ระบบเลือกถัดไป (Selected Difficulty)',
      'เหตุผลการตัดสินใจของอัลกอริทึม (Selection Reason)',
      'ความครอบคลุมเนื้อหา ณ ขณะนั้น (Domain Coverage Snapshot)',
      'เหตุผลการยุติ (Stop Reason)',
    ];

    const rows = attempts.map((a) => {
      const domainName = a.sub_domain_code ? SUB_DOMAINS[a.sub_domain_code]?.name : '';
      const coverageStr = a.domain_coverage_snapshot
        ? Object.entries(a.domain_coverage_snapshot)
            .map(([k, v]) => `${k}:${v}`)
            .join(' | ')
        : '';
      return [
        a.sequence,
        a.sub_domain_code || '',
        `"${domainName}"`,
        a.difficulty || a.previous_difficulty || 'medium',
        a.answer,
        a.correct ? 'ถูกต้อง (1)' : 'ไม่ถูกต้อง (0)',
        a.response_time,
        a.selected_difficulty || '',
        `"${a.selection_reason || ''}"`,
        `"${coverageStr}"`,
        `"${a.stop_reason || ''}"`,
      ].join(',');
    });

    const csvContent =
      '\uFEFF' +
      `รายงานหลักฐานการทำงานของระบบ Rule-based Adaptive Testing\n` +
      `รหัสเซสชัน: ${activeSession.id}, ผู้เรียน: ${activeSession.student_name || activeSession.student_id}, วันที่: ${new Date(activeSession.start_at).toLocaleString('th-TH')}\n` +
      `คะแนน: ${activeSession.correct_count}/${activeSession.total_questions} (${activeSession.score_percentage}%)\n\n` +
      headers.join(',') +
      '\n' +
      rows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `adaptive-audit-trail-${activeSession.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16 print:p-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            ระบบตรวจสอบย้อนหลัง (Audit Trail & Verification)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Log การทำงานของ Rule-based Adaptive Testing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            ตรวจสอบเส้นทางการปรับระดับความยากรายข้อ (Difficulty Trajectory) และหลักฐานเชิงประจักษ์
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export หลักฐาน (CSV)
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl liquid-card border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            พิมพ์รายงาน / PDF
          </button>
        </div>
      </div>

      {/* Session Selector & Metadata Card */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/40 dark:border-white/10">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              เลือกเซสชันการทดสอบของผู้เรียน
            </label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full sm:w-80 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.student_name || s.student_id} — {s.test_type} ({s.score_percentage}%)
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              {activeSession ? new Date(activeSession.start_at).toLocaleString('th-TH') : '-'}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              ทดสอบ 20 ข้อ (Fixed-length)
            </div>
          </div>
        </div>

        {/* Quick Session Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl liquid-card border border-white/40 dark:border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">ผู้เรียน</span>
            <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
              {activeSession?.student_name || 'สมชาย รักการเรียน'}
            </p>
          </div>

          <div className="p-4 rounded-2xl liquid-card border border-white/40 dark:border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">คะแนนรวม</span>
            <p className="font-extrabold text-sm sm:text-base text-indigo-600 dark:text-indigo-400">
              {activeSession?.correct_count} / {activeSession?.total_questions} ข้อ ({activeSession?.score_percentage}%)
            </p>
          </div>

          <div className="p-4 rounded-2xl liquid-card border border-white/40 dark:border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">รูปแบบการทดสอบ</span>
            <p className="font-extrabold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
              Rule-based Adaptive
            </p>
          </div>

          <div className="p-4 rounded-2xl liquid-card border border-white/40 dark:border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">การครอบคลุม</span>
            <p className="font-extrabold text-sm sm:text-base text-violet-600 dark:text-violet-400">
              ครบ 8 Sub-domain
            </p>
          </div>
        </div>

        {/* Stop Reason Note */}
        {activeSession?.stop_reason && (
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-indigo-500" />
            <span>
              <strong>เหตุผลการยุติการทดสอบ (Stopping Rule):</strong> {activeSession.stop_reason}
            </span>
          </div>
        )}
      </div>

      {/* Trajectory Visualizer (กราฟเส้นจำลองระดับความยากทีละข้อ) */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            กราฟลำดับการปรับระดับความยากทีละข้อ (Difficulty Trajectory)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            แสดงการตอบสนองของกฎ Stepwise: ตอบถูกจะปรับขึ้น (↗) ตอบผิดจะปรับลง (↘) พิสูจน์การทำงานตรงตามอัลกอริทึม
          </p>
        </div>

        {/* Trajectory Step Canvas / Chart */}
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-white/40 dark:border-white/5 overflow-x-auto">
          <div className="min-w-[700px] h-48 relative flex items-end pb-8 pt-4 px-4">
            {/* Level Reference Lines */}
            <div className="absolute inset-x-4 top-6 border-b border-rose-500/20 flex items-center justify-between text-[10px] text-rose-500 font-bold">
              <span>Hard (ยาก)</span>
              <span>Level 3</span>
            </div>
            <div className="absolute inset-x-4 top-20 border-b border-amber-500/20 flex items-center justify-between text-[10px] text-amber-500 font-bold">
              <span>Medium (ปานกลาง - Starting Rule)</span>
              <span>Level 2</span>
            </div>
            <div className="absolute inset-x-4 top-34 border-b border-emerald-500/20 flex items-center justify-between text-[10px] text-emerald-500 font-bold">
              <span>Easy (ง่าย)</span>
              <span>Level 1</span>
            </div>

            {/* Trajectory Nodes & Connections */}
            <div className="relative z-10 w-full flex items-center justify-between">
              {attempts.map((att, idx) => {
                const val = diffToVal(att.difficulty || att.previous_difficulty);
                // Top positions: Hard=24px, Medium=80px, Easy=136px
                const topPx = val === 3 ? 16 : val === 2 ? 72 : 128;

                return (
                  <div key={att.id || idx} className="flex flex-col items-center group relative">
                    <div
                      style={{ marginTop: `${topPx}px` }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md transition-transform group-hover:scale-125 ${
                        att.correct
                          ? 'bg-emerald-500 shadow-emerald-500/30'
                          : 'bg-amber-500 shadow-amber-500/30'
                      }`}
                    >
                      {att.sequence}
                    </div>

                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute bottom-12 z-30 w-48 p-2.5 rounded-xl bg-slate-900 text-white text-[10px] shadow-xl transition-opacity space-y-1">
                      <div className="font-bold text-indigo-300">
                        ข้อที่ {att.sequence} ({att.sub_domain_code})
                      </div>
                      <div>ระดับ: {att.difficulty || att.previous_difficulty}</div>
                      <div>ผล: {att.correct ? 'ตอบถูก (Stepwise Up)' : 'ตอบผิด (Stepwise Down)'}</div>
                      <div className="text-slate-400 text-[9px]">{att.selection_reason}</div>
                    </div>

                    {/* Sequence label */}
                    <span className="absolute -bottom-6 text-[10px] font-mono text-slate-400">
                      Q{att.sequence}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>ตอบถูกต้อง (รักษาระดับ หรือ ปรับระดับความยากขึ้น)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>ตอบไม่ถูกต้อง (ปรับระดับความยากลดลง)</span>
          </div>
        </div>
      </div>

      {/* Detailed Audit Trail Table */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              ตารางบันทึกการตัดสินใจของอัลกอริทึม (Audit Trail Records)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ข้อมูลครบ 5 มิติ: Previous Difficulty, Selected Difficulty, Reason, Coverage Snapshot, Stop Reason
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/40 dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-3">ข้อที่</th>
                <th className="py-3 px-3">Sub-domain</th>
                <th className="py-3 px-3">ความยากข้อนี้</th>
                <th className="py-3 px-3">ผลตอบ</th>
                <th className="py-3 px-3">ความยากข้อถัดไป</th>
                <th className="py-3 px-3 min-w-[220px]">เหตุผลการตัดสินใจ (Selection Reason)</th>
                <th className="py-3 px-3 min-w-[180px]">Domain Coverage Snapshot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 bg-white/40 dark:bg-slate-900/40">
              {attempts.map((att) => {
                const sub = att.sub_domain_code ? SUB_DOMAINS[att.sub_domain_code] : null;
                const coverage = att.domain_coverage_snapshot;

                return (
                  <tr key={att.id} className="hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {att.sequence}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                        {att.sub_domain_code}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          att.difficulty === 'hard'
                            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                            : att.difficulty === 'medium'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {att.difficulty || att.previous_difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {att.correct ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ถูก
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                          <XCircle className="w-3.5 h-3.5" /> ผิด
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          att.selected_difficulty === 'hard'
                            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                            : att.selected_difficulty === 'medium'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {att.selected_difficulty || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                      {att.selection_reason}
                      {att.stop_reason && (
                        <div className="mt-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          🛑 {att.stop_reason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {coverage ? (
                        <div className="grid grid-cols-4 gap-1">
                          {Object.entries(coverage).map(([k, v]) => (
                            <span key={k} className="px-1 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800/50">
                              {k}:{v}
                            </span>
                          ))}
                        </div>
                      ) : (
                        '-'
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
