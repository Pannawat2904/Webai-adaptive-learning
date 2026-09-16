'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types/database';
import {
  Code2,
  BookOpen,
  BrainCircuit,
  Terminal,
  BarChart3,
  MessageSquare,
  Users,
  ShieldCheck,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  FileQuestion,
  Activity,
  Award,
  TrendingUp,
} from 'lucide-react';

export function Navbar() {
  const { profile, role, switchRole, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const studentLinks = [
    { href: '/student', label: 'ภาพรวม', icon: LayoutDashboard },
    { href: '/student/lessons', label: 'บทเรียน HTML', icon: BookOpen },
    { href: '/student/assessment', label: 'Adaptive Test', icon: BrainCircuit },
    { href: '/student/codelab', label: 'Code Lab', icon: Terminal },
    { href: '/student/profile', label: 'Learning Profile', icon: BarChart3 },
    { href: '/student/tutor', label: 'AI Tutor', icon: MessageSquare },
  ];

  const teacherLinks = [
    { href: '/teacher', label: 'แดชบอร์ดภาพรวม', icon: LayoutDashboard },
    { href: '/teacher/adaptive-logs', label: 'Log ตรวจสอบระบบ', icon: Activity },
    { href: '/teacher/reliability', label: 'ความเที่ยง KR-20', icon: Award },
    { href: '/teacher/effect-size', label: 'Pre/Post & Effect Size', icon: TrendingUp },
    { href: '/teacher/questions', label: 'คลังข้อสอบ & IOC', icon: FileQuestion },
    { href: '/teacher/analytics', label: 'วิเคราะห์ข้อสอบ', icon: BarChart3 },
    { href: '/teacher/heatmap', label: 'Heatmap H1-H8', icon: Users },
  ];

  const adminLinks = [
    { href: '/admin/users', label: 'จัดการผู้ใช้งาน', icon: Users },
    { href: '/admin/audit', label: 'Audit Logs', icon: ShieldCheck },
  ];

  const currentLinks =
    role === 'student' ? studentLinks : role === 'teacher' ? teacherLinks : adminLinks;

  const roleLabels: Record<UserRole, { label: string; badgeColor: string }> = {
    student: {
      label: 'นักเรียน ปวช.',
      badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    },
    teacher: {
      label: 'ครูผู้สอน',
      badgeColor: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    },
    admin: {
      label: 'ผู้ดูแลระบบ',
      badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    },
  };

  return (
    <header className="sticky top-0 z-50 liquid-glass border-b border-white/60 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo with liquid glow */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base leading-tight tracking-tight flex items-center gap-1.5 text-slate-900 dark:text-white">
                  HTML Adaptive
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                    <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                    ปวช.
                  </span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                  ระบบเรียนรู้แบบปรับเหมาะเฉพาะบุคคล
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/5 backdrop-blur-md">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              title="สลับโหมดมืด/สว่าง"
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-white/60 dark:border-white/10 shadow-2xs transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Portal Action / Auth State */}
            {role === 'student' ? (
              // Student Portal: Direct access to admin login
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                  👨‍🎓 นักเรียน ปวช.
                </span>

                <Link
                  href="/admin/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-xs shadow-2xs transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>เข้าสู่ระบบครู/แอดมิน</span>
                </Link>
              </div>
            ) : (
              // Teacher / Admin Backoffice Mode
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 text-xs font-semibold shadow-2xs hover:bg-white dark:hover:bg-slate-800 transition-all backdrop-blur-md cursor-pointer"
                >
                  <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold ${roleLabels[role].badgeColor}`}>
                    {role === 'teacher' ? '👨‍🏫 ครูผู้สอน' : '🛡️ ผู้ดูแลระบบ'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 liquid-glass rounded-2xl shadow-2xl border border-white/80 dark:border-white/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setRoleMenuOpen(false)}
                  >
                    <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      ระบบหลังบ้าน (Authenticated)
                    </div>
                    <div className="px-3.5 py-1 text-xs font-bold text-slate-900 dark:text-white">
                      {profile.full_name}
                    </div>
                    <div className="px-3.5 pb-2 text-[11px] text-slate-500">
                      {profile.email || 'เข้าสู่ระบบด้วยรหัสผ่านแล้ว'}
                    </div>

                    <div className="border-t border-slate-200/60 dark:border-slate-800/60 my-1"></div>

                    <Link
                      href="/student"
                      className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-indigo-50/70 dark:hover:bg-slate-800/70 font-semibold transition-colors"
                    >
                      <span>👨‍🎓 สลับไปมุมมองนักเรียน (Student Portal)</span>
                    </Link>

                    {role === 'admin' && (
                      <Link
                        href="/admin/users"
                        className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between text-purple-700 dark:text-purple-300 hover:bg-purple-50/70 dark:hover:bg-slate-800/70 font-semibold transition-colors"
                      >
                        <span>⚙️ จัดการผู้ใช้ระบบ (Admin Users)</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-200/60 dark:border-slate-800/60 my-1"></div>

                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      ออกจากระบบหลังบ้าน (Logout)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/60 dark:border-white/10 liquid-glass px-4 pt-3 pb-5 space-y-1.5 animate-in slide-in-from-top-2">
          <div className="py-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800/60 mb-2 flex items-center justify-between">
            <span>เข้าสู่ระบบ: <strong>{profile.full_name}</strong></span>
            <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${roleLabels[role].badgeColor}`}>
              {roleLabels[role].label}
            </span>
          </div>
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {role === 'student' ? (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 mt-2">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>เข้าสู่ระบบครู/แอดมิน (Admin Portal)</span>
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 mt-2 space-y-1">
              <Link
                href="/student"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50/70 dark:hover:bg-slate-800/70"
              >
                <span>👨‍🎓 สลับไปมุมมองนักเรียน</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>ออกจากระบบหลังบ้าน (Logout)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
