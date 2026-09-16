'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, RefreshCw, Clock } from 'lucide-react';

interface AuditItem {
  id: string;
  actor_name?: string;
  actor_role?: string;
  action: string;
  entity: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditItem[]>([
    {
      id: 'log-seed-1',
      actor_name: 'อาจารย์ กานต์รวี พัฒนาเว็บ',
      actor_role: 'teacher',
      action: 'update_lesson_media_order',
      entity: 'lesson_media',
      details: { unit: 'H1', count: 3 },
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: 'log-seed-2',
      actor_name: 'สมชาย รักการเรียน',
      actor_role: 'student',
      action: 'complete_assessment',
      entity: 'test_session',
      details: { scorePercentage: 85, mode: 'adaptive' },
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: 'log-seed-3',
      actor_name: 'สมชาย รักการเรียน',
      actor_role: 'student',
      action: 'submit_assignment',
      entity: 'codelab',
      details: { assignmentId: 'a-h1', passed: true },
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'log-seed-4',
      actor_name: 'ผู้ดูแลระบบ นวัตกรรม ปวช.',
      actor_role: 'admin',
      action: 'system_security_check',
      entity: 'rls_policies',
      details: { status: 'secure', tablesAudited: 15 },
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ]);

  const loadLogs = () => {
    try {
      const stored = localStorage.getItem('webai_audit_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        setLogs([...parsed, ...logs.filter((l) => !parsed.some((p: any) => p.id === l.id))]);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>กลับหน้าแรก</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Security & Audit Trails</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            บันทึกประวัติการทำงานของระบบ (Audit Logs)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ตรวจสอบการทำรายการสำคัญ เช่น การเข้าสู่ระบบ การส่งงาน และการแก้ไขบทเรียน/ข้อสอบ
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>รีเฟรชประวัติ</span>
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-3 rounded-l-lg">เวลาที่ทำรายการ</th>
                <th className="p-3">ผู้กระทำ (Actor)</th>
                <th className="p-3">บทบาท</th>
                <th className="p-3">การกระทำ (Action)</th>
                <th className="p-3">เป้าหมาย (Entity)</th>
                <th className="p-3 rounded-r-lg">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('th-TH')}
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 font-sans">
                    {log.actor_name || 'ระบบอัตโนมัติ'}
                  </td>
                  <td className="p-3 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.actor_role === 'teacher'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : log.actor_role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {log.actor_role || 'system'}
                    </span>
                  </td>
                  <td className="p-3 text-indigo-600 dark:text-indigo-400 font-bold">
                    {log.action}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {log.entity}
                  </td>
                  <td className="p-3 text-slate-500 text-[11px] max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
