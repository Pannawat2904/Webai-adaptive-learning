'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Code2, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { signInWithGoogle, switchRole } = useAuth();
  const router = useRouter();

  const handleDemoLogin = (targetRole: 'student') => {
    switchRole(targetRole);
    router.push('/student');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 relative">
      <div className="playful-bg" aria-hidden="true" />

      {/* Floating HTML Tags Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-10 dark:opacity-5">
        <div className="absolute top-24 left-10 text-5xl font-mono text-purple-600 font-bold rotate-12">&lt;login&gt;</div>
        <div className="absolute bottom-32 right-12 text-6xl font-mono text-emerald-600 font-bold -rotate-12">&lt;/div&gt;</div>
      </div>

      <div className="w-full max-w-md p-6 sm:p-8 rounded-[32px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-[24px] bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 mb-2">
            <Code2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
            เข้าสู่ระบบนักเรียน
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            ระบบการเรียนรู้แบบปรับเหมาะโครงสร้าง HTML
          </p>
        </div>

        {/* Primary Google Login Button */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all active:scale-95"
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
            <span>เข้าสู่ระบบด้วย Google (นักเรียน)</span>
          </button>

          <p className="text-xs text-center text-slate-400 dark:text-slate-500">
            ระบบจะสร้างบัญชีนักเรียนให้อัตโนมัติเมื่อเข้าใช้งานครั้งแรก
          </p>
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
          <span className="bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-400 absolute rounded-full">
            ทดลองใช้งาน
          </span>
        </div>

        {/* Demo Roles for immediate evaluation */}
        <div className="space-y-3">
          <button
            onClick={() => handleDemoLogin('student')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-100 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all text-left group active:scale-95"
          >
            <div>
              <div className="font-bold text-sm flex items-center gap-1.5">
                <span>👨‍🎓 เข้าใช้งานในฐานะนักเรียน (Demo)</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="pt-4 text-center">
          <Link href="/" className="text-sm font-bold text-slate-400 hover:text-purple-600 transition-colors">
            &larr; กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
