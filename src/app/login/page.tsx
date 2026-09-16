'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Code2, Sparkles, LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { signInWithGoogle, switchRole, role } = useAuth();
  const router = useRouter();

  const handleDemoLogin = (targetRole: 'student' | 'teacher' | 'admin') => {
    switchRole(targetRole);
    if (targetRole === 'student') {
      router.push('/student');
    } else if (targetRole === 'teacher') {
      router.push('/teacher');
    } else {
      router.push('/admin/users');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 mb-2">
            <Code2 className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            เข้าสู่ระบบการเรียนรู้
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ระบบการเรียนรู้แบบปรับเหมาะเฉพาะบุคคล เรื่อง โครงสร้างภาษา HTML
          </p>
        </div>

        {/* Primary Google Login Button */}
        <div className="space-y-3">
          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium text-sm shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>เข้าสู่ระบบด้วย Google (Google OAuth)</span>
          </button>

          <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
            ระบบจะสร้างบัญชีนักเรียน (Student Role) ให้โดยอัตโนมัติเมื่อเข้าสู่ระบบครั้งแรก
          </p>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
          <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 absolute">
            หรือทดลองใช้งานในโหมดทดสอบ
          </span>
        </div>

        {/* Demo Roles for immediate evaluation */}
        <div className="space-y-2">
          <button
            onClick={() => handleDemoLogin('student')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors text-left group"
          >
            <div>
              <div className="font-semibold text-xs flex items-center gap-1.5">
                <span>👨‍🎓 เข้าใช้งานในฐานะ นักเรียน ปวช.</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200/60 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                  นายสมชาย
                </span>
              </div>
              <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-0.5">
                เรียนบทเรียน, ทำแบบทดสอบ Adaptive, ทำ Code Lab, ถาม AI Tutor
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleDemoLogin('teacher')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-left group"
          >
            <div>
              <div className="font-semibold text-xs flex items-center gap-1.5">
                <span>👩‍🏫 เข้าใช้งานในฐานะ ครูผู้สอน</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-200/60 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                  อ.กานต์รวี
                </span>
              </div>
              <div className="text-[11px] text-indigo-700/80 dark:text-indigo-400 mt-0.5">
                แดชบอร์ดชั้นเรียน, Heatmap H1-H8, จัดการข้อสอบ/สื่อ, ส่งออก CSV
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleDemoLogin('admin')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 text-purple-800 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-left group"
          >
            <div>
              <div className="font-semibold text-xs flex items-center gap-1.5">
                <span>⚙️ เข้าใช้งานในฐานะ ผู้ดูแลระบบ (Admin)</span>
              </div>
              <div className="text-[11px] text-purple-700/80 dark:text-purple-400 mt-0.5">
                จัดการสิทธิ์ผู้ใช้ และตรวจสอบบันทึกระบบ Audit Logs
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
