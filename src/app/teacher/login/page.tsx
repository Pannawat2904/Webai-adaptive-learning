'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BookOpen, LogIn, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function TeacherLoginPage() {
  const { switchRole } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'teacher1234' && password === 'teacher1234') {
      switchRole('teacher');
      router.push('/teacher');
    } else if (username === 'admin1234' && password === 'admin1234') {
      switchRole('admin');
      router.push('/admin/users');
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 relative font-sans">
      {/* Playful Soft Background */}
      <div className="playful-bg" aria-hidden="true" />
      
      {/* Floating HTML Tags Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-10 dark:opacity-5">
        <div className="absolute top-32 right-20 text-5xl font-mono text-purple-600 font-bold -rotate-12">&lt;admin&gt;</div>
        <div className="absolute bottom-20 left-10 text-6xl font-mono text-emerald-600 font-bold rotate-12">&lt;teacher/&gt;</div>
      </div>

      <div className="w-full max-w-md p-8 rounded-[32px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-[24px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-2">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            ระบบจัดการสำหรับผู้สอน
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            เข้าสู่ระบบสำหรับผู้สอนและผู้ดูแลระบบ
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl text-center font-bold">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">ชื่อผู้ใช้ (Username)</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-sm rounded-full py-3.5 pl-12 pr-4 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-300 focus:ring-2 ring-emerald-100 dark:ring-emerald-900/40 transition-all font-medium"
                  placeholder="กรอกชื่อผู้ใช้งาน"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">รหัสผ่าน (Password)</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-sm rounded-full py-3.5 pl-12 pr-4 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-300 focus:ring-2 ring-emerald-100 dark:ring-emerald-900/40 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="group w-full flex items-center justify-center gap-2 px-4 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
          >
            <LogIn className="w-5 h-5" />
            <span>เข้าสู่ระบบผู้สอน</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            &larr; กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
