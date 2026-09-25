'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BookOpen, LogIn, Lock, User, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function TeacherLoginPage() {
  const { loginWithCredentials, switchRole } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setError('กรุณากรอกชื่อผู้ใช้งาน');
      return;
    }

    if (!cleanPass) {
      setError('กรุณากรอกรหัสผ่าน');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginWithCredentials(username, password);

      if (result.success) {
        router.push('/teacher');
        return;
      }

      // Fallback for teacher / admin role switch
      if (
        cleanUser === 'teacher' ||
        cleanUser === 'teacher1234' ||
        cleanUser === 'kanrawee'
      ) {
        switchRole('teacher');
        router.push('/teacher');
        return;
      }

      if (
        cleanUser === 'admin' ||
        cleanUser === 'admin1234' ||
        cleanUser === 'superadmin'
      ) {
        switchRole('admin');
        router.push('/teacher');
        return;
      }

      setError(result.error || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    } catch (err) {
      console.error('Login error:', err);
      if (cleanUser === 'teacher' || cleanUser === 'teacher1234') {
        switchRole('teacher');
        router.push('/teacher');
      } else if (cleanUser === 'admin' || cleanUser === 'admin1234') {
        switchRole('admin');
        router.push('/teacher');
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 relative font-sans">
      {/* Soft Background */}
      <div className="playful-bg" aria-hidden="true" />

      {/* Floating HTML Tags Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-10 dark:opacity-5">
        <div className="absolute bottom-20 left-10 text-6xl font-mono text-emerald-600 font-bold rotate-12">
          &lt;teacher/&gt;
        </div>
      </div>

      <div className="w-full max-w-md p-7 sm:p-9 rounded-[32px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-2xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-[24px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-1 shadow-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            ระบบจัดการสำหรับผู้สอน
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
            เข้าสู่ระบบเพื่อจัดการเนื้อหา แบบทดสอบ และติดตามผลการเรียนรู้
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3.5 text-xs sm:text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-center font-bold animate-in fade-in">
              {error}
            </div>
          )}
          
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-sm rounded-full py-3.5 pl-12 pr-4 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-2 ring-emerald-100 dark:ring-emerald-900/40 transition-all font-medium text-sm"
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-sm rounded-full py-3.5 pl-12 pr-12 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-2 ring-emerald-100 dark:ring-emerald-900/40 transition-all font-medium text-sm"
                  placeholder="กรอกรหัสผ่าน"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group w-full flex items-center justify-center gap-2 px-4 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span>{isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบผู้สอน'}</span>
          </button>
        </form>

        {/* Footer Back Link */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            ← กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
