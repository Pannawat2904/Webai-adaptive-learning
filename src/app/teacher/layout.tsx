'use client';

import React from 'react';
import { TeacherAdminGuard } from '@/components/auth/TeacherAdminGuard';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TeacherAdminGuard allowedRoles={['teacher', 'admin']}>
      <div className="space-y-6">
        {/* Backoffice Active Header Strip */}
        <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ระบบหลังบ้านครูผู้สอนและแอดมิน (Teacher Backoffice Active)</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
            SESSION AUTHENTICATED
          </span>
        </div>
        {children}
      </div>
    </TeacherAdminGuard>
  );
}
