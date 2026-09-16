'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import { TeacherAdminGuard } from '@/components/auth/TeacherAdminGuard';

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
    <TeacherAdminGuard allowedRoles={['admin']}>
      <div className="space-y-6 pb-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับหน้าแรก</span>
        </Link>

        {/* Header in Liquid Glass */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                <span>Security & Audit Trails</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                บันทึกประวัติการทำงานของระบบ (Audit Logs)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                ตรวจสอบการทำรายการสำคัญ เช่น การเข้าสู่ระบบ การส่งงาน และการแก้ไขบทเรียน/ข้อสอบ
              </p>
            </div>

            <button
              onClick={loadLogs}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl liquid-glass border border-white/60 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 hover:scale-105 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
              <span>รีเฟรชประวัติ</span>
            </button>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="liquid-glass rounded-3xl p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 font-bold">
                  <th className="p-3.5">เวลาที่ทำรายการ</th>
                  <th className="p-3.5">ผู้กระทำ (Actor)</th>
                  <th className="p-3.5">บทบาท</th>
                  <th className="p-3.5">การกระทำ (Action)</th>
                  <th className="p-3.5">เป้าหมาย (Entity)</th>
                  <th className="p-3.5">รายละเอียด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-purple-500/5 transition-colors">
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap font-mono">
                      {new Date(log.timestamp).toLocaleString('th-TH')}
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {log.actor_name || 'ระบบอัตโนมัติ'}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                          log.actor_role === 'teacher'
                            ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30'
                            : log.actor_role === 'admin'
                            ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {log.actor_role === 'teacher' ? '👩‍🏫 ครูผู้สอน' : log.actor_role === 'admin' ? '🛡️ แอดมิน' : '👨‍🎓 นักเรียน'}
                      </span>
                    </td>
                    <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                      {log.action}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {log.entity}
                    </td>
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 text-[11px] max-w-xs truncate font-mono">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TeacherAdminGuard>
  );
}
