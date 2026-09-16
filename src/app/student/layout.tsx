'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, GraduationCap } from 'lucide-react';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      {/* Student Portal Header Strip */}
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2 font-bold">
          <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>ระบบการเรียนรู้สำหรับนักเรียน ปวช. (Student Learning Portal)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span>ผู้เรียน: <strong className="text-slate-800 dark:text-slate-200">{profile.full_name}</strong></span>
        </div>
      </div>
      {children}
    </div>
  );
}
