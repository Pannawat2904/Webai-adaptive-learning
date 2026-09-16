'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  GraduationCap,
  ChevronLeft,
} from 'lucide-react';

function AdminLoginContent() {
  const { loginWithCredentials, loginAsStudent } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/teacher';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password.trim()) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน');
      return;
    }

    setIsSubmitting(true);
    const result = await loginWithCredentials(username, password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.role === 'admin') {
        router.push('/admin/users');
      } else {
        router.push(redirectPath);
      }
    } else {
      setErrorMessage(result.error || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 animate-in fade-in">
      <div className="w-full max-w-md liquid-glass rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-white/60 dark:border-white/10 relative overflow-hidden">
        {/* Decorative Top Ambient Light */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />

        {/* Back to Home / Student */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            หน้าแรก
          </Link>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            SECURE BACKOFFICE
          </span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            เข้าสู่ระบบหลังบ้าน
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            สำหรับครูผู้สอนและผู้ดูแลระบบ เพื่อเข้าถึงการวิเคราะห์คะแนน Log ระบบ และจัดการคลังข้อสอบ
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ชื่อผู้ใช้งาน (Username หรือ Email)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="teacher หรือ admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <span>{isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบหลังบ้าน'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Fill Credentials (สำหรับนำเสนอและสอบนวัตกรรม) */}
        <div className="pt-2 border-t border-white/40 dark:border-white/10 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            ข้อมูลบัญชีทดสอบสำหรับคณะกรรมการ / ครู:
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('teacher', 'teacher1234')}
              className="p-2.5 rounded-xl liquid-card border border-indigo-500/20 text-left hover:border-indigo-500/40 transition-all group cursor-pointer"
            >
              <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-between">
                <span>👨‍🏫 ครูผู้สอน</span>
                <span className="text-[10px] text-slate-400 group-hover:text-indigo-500">คลิกกรอก</span>
              </div>
              <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                user: teacher
                <br />
                pass: teacher1234
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'admin1234')}
              className="p-2.5 rounded-xl liquid-card border border-purple-500/20 text-left hover:border-purple-500/40 transition-all group cursor-pointer"
            >
              <div className="font-bold text-purple-600 dark:text-purple-400 text-xs flex items-center justify-between">
                <span>🛡️ ผู้ดูแลระบบ</span>
                <span className="text-[10px] text-slate-400 group-hover:text-purple-500">คลิกกรอก</span>
              </div>
              <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                user: admin
                <br />
                pass: admin1234
              </div>
            </button>
          </div>
        </div>

        {/* Link to Student Portal */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              loginAsStudent();
              router.push('/student');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>สำหรับนักเรียน ปวช. คลิกที่นี่เพื่อเข้าสู่ห้องเรียน</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-indigo-600 animate-pulse" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
