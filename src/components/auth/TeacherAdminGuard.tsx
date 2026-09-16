'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ShieldAlert, Lock, ArrowRight, GraduationCap } from 'lucide-react';

interface TeacherAdminGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('teacher' | 'admin')[];
}

export function TeacherAdminGuard({
  children,
  allowedRoles = ['teacher', 'admin'],
}: TeacherAdminGuardProps) {
  const { role, isAdminAuthenticated, loginAsStudent } = useAuth();

  // If user is logged in as teacher or admin with password
  const isAuthorized =
    (role === 'teacher' || role === 'admin') &&
    isAdminAuthenticated &&
    allowedRoles.includes(role);

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md liquid-glass rounded-3xl p-6 sm:p-8 text-center space-y-5 border border-amber-500/30 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              พื้นที่เฉพาะครูผู้สอนและผู้ดูแลระบบ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              หน้านี้เป็นระบบหลังบ้าน (Backoffice) ต้องยืนยันตัวตนด้วย <strong>Username และ Password</strong> ก่อนเข้าใช้งาน
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/admin/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
            >
              <span>เข้าสู่ระบบด้วย Username &amp; Password</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => loginAsStudent()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span>กลับสู่ระบบฝั่งนักเรียน (Student Portal)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
