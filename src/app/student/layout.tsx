'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { isCourseStepUnlocked, CourseStepKey, subscribeToProgress } from '@/lib/progress-service';
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Gamepad2,
  Code2,
  Sparkles,
  Trophy,
  Bot,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Lock,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  stepKey?: CourseStepKey;
}

// 1. ลำดับขั้นตอนการเรียนรู้หลัก (Sequential Gated Flow)
const mainNavItems: NavItem[] = [
  { name: 'แดชบอร์ด', href: '/student', icon: LayoutDashboard },
  { name: 'แบบทดสอบก่อนเรียน', href: '/student/assessment?type=pre_test', icon: ClipboardList, stepKey: 'pretest' },
  { name: 'บทเรียน HTML', href: '/student/lessons', icon: BookOpen, stepKey: 'lessons' },
  { name: 'เกมกู้เว็บพัง', href: '/student/game', icon: Gamepad2, stepKey: 'game' },
  { name: 'ตะลุยด่าน', href: '/student/quests', icon: Sparkles, stepKey: 'quest' },
  { name: 'แบบทดสอบหลังเรียน', href: '/student/assessment?type=post_test', icon: Trophy, stepKey: 'posttest' },
];

// 2. เครื่องมือเสริมและพื้นที่ฝึกฝนอิสระ (เปิดให้เข้าใช้งานได้ตลอดเวลา)
const toolNavItems: NavItem[] = [
  { name: 'ฝึกเขียนโค้ด', href: '/student/codelab', icon: Code2 },
  { name: 'AI ผู้ช่วยสอน', href: '/student/tutor', icon: Bot },
  { name: 'โปรไฟล์', href: '/student/profile', icon: User },
];

function StudentLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, isLoading, signOut } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lockedToast, setLockedToast] = useState<string | null>(null);
  const [, setProgressTick] = useState(0);
  const [isExamActive, setIsExamActive] = useState(false);

  useEffect(() => {
    const checkExamStatus = () => {
      if (typeof window !== 'undefined') {
        setIsExamActive(localStorage.getItem('webai_active_exam') === 'true');
      }
    };
    checkExamStatus();
    window.addEventListener('storage', checkExamStatus);
    window.addEventListener('webai_exam_status', checkExamStatus);
    return () => {
      window.removeEventListener('storage', checkExamStatus);
      window.removeEventListener('webai_exam_status', checkExamStatus);
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const role = localStorage.getItem('webai_demo_role');
    if (!role && !profile?.email) {
      router.push('/login');
      return;
    }
    setMounted(true);
  }, [isLoading, profile, router]);

  useEffect(() => {
    const unsub = subscribeToProgress(() => {
      setProgressTick((prev) => prev + 1);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleLockedClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.name === 'AI ผู้ช่วยสอน' && (pathname === '/student/assessment' || isExamActive)) {
      e.preventDefault();
      setLockedToast('🔒 ไม่อนุญาตให้ใช้งาน AI ผู้ช่วยสอนระหว่างทำแบบทดสอบ');
      setTimeout(() => setLockedToast(null), 3500);
      return;
    }
    if (item.stepKey && !isCourseStepUnlocked(item.stepKey)) {
      e.preventDefault();
      setLockedToast(`เมนู "${item.name}" ถูกล็อกอยู่ กรุณาทำตามลำดับขั้นตอนก่อนหน้าให้สำเร็จ`);
      setTimeout(() => setLockedToast(null), 3500);
    }
  };

  const renderNavItem = (item: NavItem) => {
    const isAiLockedByExam = item.name === 'AI ผู้ช่วยสอน' && (pathname === '/student/assessment' || isExamActive);
    const isLocked = item.stepKey ? !isCourseStepUnlocked(item.stepKey) : isAiLockedByExam;

    // Check active state
    let isActive = false;
    if (item.href === '/student') {
      isActive = pathname === '/student';
    } else if (item.href.includes('type=pre_test')) {
      isActive = pathname === '/student/assessment' && searchParams.get('type') === 'pre_test';
    } else if (item.href.includes('type=post_test')) {
      isActive = pathname === '/student/assessment' && searchParams.get('type') === 'post_test';
    } else {
      isActive = pathname.startsWith(item.href);
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={(e) => handleLockedClick(e, item)}
        className={`flex items-center ${
          isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
        } py-2.5 rounded-xl font-bold text-sm transition-all duration-300 relative group ${
          isLocked
            ? 'text-muted/60 hover:text-muted cursor-not-allowed opacity-60'
            : isActive
            ? 'text-primary bg-primary-dim border border-primary/20 shadow-sm'
            : 'text-muted hover:text-primary hover:bg-primary-dim/50 border border-transparent'
        }`}
        title={isSidebarCollapsed ? item.name : undefined}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary rounded-r-md shadow-sm" />
        )}
        <div className="relative flex-shrink-0">
          <item.icon
            className={`w-[18px] h-[18px] ${
              isLocked
                ? 'opacity-40'
                : isActive
                ? 'text-primary'
                : 'opacity-70 group-hover:text-primary'
            }`}
            strokeWidth={2.5}
          />
        </div>
        {!isSidebarCollapsed && (
          <span className="flex-1 truncate">{item.name}</span>
        )}
        {!isSidebarCollapsed && isLocked && (
          <Lock className="w-3.5 h-3.5 text-muted/60 shrink-0" />
        )}
      </Link>
    );
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans text-ink">
      {/* Toast Alert for Locked Steps */}
      {lockedToast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-300 animate-in fade-in slide-in-from-top-4">
          <Lock className="w-4 h-4 shrink-0 text-slate-950" />
          <span>{lockedToast}</span>
        </div>
      )}

      {/* Sidebar for Desktop - Glassmorphism (Original Layout) */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-4 left-4 z-40 bg-surface/80 backdrop-blur-xl border border-line rounded-[24px] shadow-lg transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div
          className={`flex items-center h-20 ${
            isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6'
          } border-b border-line`}
        >
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-[0_0_15px_var(--primary-dim)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-ink">WebAI</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-xl hover:bg-surface text-muted transition-colors border border-transparent hover:border-line"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Main Course Steps */}
          {mainNavItems.map(renderNavItem)}

          {/* Section Divider: Tools & Free Practice */}
          <div className="pt-3 pb-1">
            <div className="border-t border-line/60 my-1" />
            {!isSidebarCollapsed && (
              <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-muted uppercase tracking-wider">
                เครื่องมือเสริม
              </div>
            )}
          </div>

          {/* Free Practice & Tools */}
          {toolNavItems.map(renderNavItem)}
        </nav>

        <div className="mt-auto pt-4 pb-6 border-t border-line px-3 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
            } py-3 w-full rounded-xl text-muted hover:text-danger hover:bg-danger-dim hover:border hover:border-danger/20 transition-all duration-300 font-bold text-sm border border-transparent`}
            title={isSidebarCollapsed ? 'ออกจากระบบ' : undefined}
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2.5} />
            {!isSidebarCollapsed && <span>ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area (Original Layout) */}
      <div
        className={`${
          isSidebarCollapsed ? 'md:ml-28' : 'md:ml-72'
        } flex flex-col min-h-screen transition-all duration-300 mr-4`}
      >
        {/* Top Header Bar with User Account at Top-Right */}
        <header className="h-16 flex items-center justify-between px-6 mt-4 rounded-[20px] bg-surface/80 backdrop-blur-xl border border-line shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-primary bg-primary-dim px-3 py-1.5 rounded-full border border-primary/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> ระบบการเรียนรู้ WebAI
            </span>
          </div>

          {/* User Account Info at Top-Right */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-ink truncate max-w-[220px]">
              {profile?.full_name || 'นักเรียน'}
            </span>

            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'Account'}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-primary/30 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center p-[2px] shadow-sm">
                <div className="w-full h-full bg-surface rounded-full flex items-center justify-center font-bold text-xs text-primary">
                  {profile?.full_name ? (
                    profile.full_name.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-4 h-4 text-muted" />
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 pb-32 md:pb-8 pt-6 relative z-10 w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav - Glassmorphism */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 pb-safe">
        <div className="absolute inset-0 bg-surface/90 backdrop-blur-xl border-t border-line" />
        <nav className="relative flex items-center justify-around pt-3 pb-6 px-2">
          {mainNavItems.slice(0, 4).concat(toolNavItems.slice(0, 1)).map((item) => {
            const isLocked = item.stepKey ? !isCourseStepUnlocked(item.stepKey) : false;
            let isActive = false;
            if (item.href === '/student') {
              isActive = pathname === '/student';
            } else if (item.href.includes('type=pre_test')) {
              isActive = pathname === '/student/assessment' && searchParams.get('type') === 'pre_test';
            } else if (item.href.includes('type=post_test')) {
              isActive = pathname === '/student/assessment' && searchParams.get('type') === 'post_test';
            } else {
              isActive = pathname.startsWith(item.href);
            }

            let shortName = item.name;
            if (item.name === 'แดชบอร์ด') shortName = 'หลัก';
            if (item.name === 'แบบทดสอบก่อนเรียน') shortName = 'ก่อนเรียน';
            if (item.name === 'บทเรียน HTML') shortName = 'เรียน';
            if (item.name === 'เกมกู้เว็บพัง') shortName = 'เกม';
            if (item.name === 'ฝึกเขียนโค้ด') shortName = 'โค้ด';

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleLockedClick(e, item)}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all duration-300 relative min-w-[64px] ${
                  isLocked
                    ? 'opacity-40'
                    : isActive
                    ? 'text-primary'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <div
                  className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-dim border border-primary/30 shadow-sm scale-110'
                      : 'bg-transparent border border-transparent'
                  }`}
                >
                  <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] leading-none mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {shortName}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-bg-base" />}>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </React.Suspense>
  );
}
