'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bot,
  Gamepad2,
  Sparkles,
  ClipboardList,
  CheckSquare,
  Trophy,
  Lock,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import {
  UnitStepKey,
  getUnitProgress,
  isStepUnlocked,
  subscribeToProgress,
  normalizeUnit,
} from '@/lib/progress-service';

const UNITS_LIST = [
  { id: 'u-h1', code: 'H1', stage: 1, title: 'หน่วย 1: โครงสร้าง HTML (H1)', shortTitle: 'H1 โครงสร้าง HTML' },
  { id: 'u-h2', code: 'H2', stage: 2, title: 'หน่วย 2: ข้อความและลิงก์ (H2)', shortTitle: 'H2 ข้อความและลิงก์' },
  { id: 'u-h3', code: 'H3', stage: 3, title: 'หน่วย 3: รูปภาพและตาราง (H3)', shortTitle: 'H3 รูปภาพและตาราง' },
  { id: 'u-h4', code: 'H4', stage: 4, title: 'หน่วย 4: Semantic HTML (H4)', shortTitle: 'H4 Semantic HTML' },
  { id: 'u-h5', code: 'H5', stage: 5, title: 'หน่วย 5: แบบฟอร์ม HTML (H5)', shortTitle: 'H5 แบบฟอร์ม HTML' },
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
  const [, setProgressTick] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Unit Detection
  const unitParam = searchParams.get('unit');
  const getInitialUnit = () => {
    if (unitParam) return normalizeUnit(unitParam).unitId;
    if (pathname.includes('/lessons/')) {
      const match = pathname.match(/\/lessons\/([^/?]+)/);
      if (match) return normalizeUnit(match[1]).unitId;
    }
    if (pathname.includes('/quests/asg-')) {
      const match = pathname.match(/\/quests\/asg-([1-5])/);
      if (match) return `u-h${match[1]}`;
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('webai_current_learning_unit');
      if (saved) return normalizeUnit(saved).unitId;
    }
    return 'u-h1';
  };

  const [activeUnit, setActiveUnit] = useState<string>(getInitialUnit);

  useEffect(() => {
    if (unitParam) {
      const norm = normalizeUnit(unitParam).unitId;
      setActiveUnit(norm);
      localStorage.setItem('webai_current_learning_unit', norm);
    } else if (pathname.includes('/lessons/')) {
      const match = pathname.match(/\/lessons\/([^/?]+)/);
      if (match) {
        const norm = normalizeUnit(match[1]).unitId;
        setActiveUnit(norm);
        localStorage.setItem('webai_current_learning_unit', norm);
      }
    } else if (pathname.includes('/quests/asg-')) {
      const match = pathname.match(/\/quests\/asg-([1-5])/);
      if (match) {
        const norm = `u-h${match[1]}`;
        setActiveUnit(norm);
        localStorage.setItem('webai_current_learning_unit', norm);
      }
    }
  }, [unitParam, pathname]);

  // Subscribe to progress changes across steps
  useEffect(() => {
    const unsub = subscribeToProgress(() => {
      setProgressTick((prev) => prev + 1);
    });
    return () => unsub();
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

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (!mounted) return null;

  const currentUnitConfig = UNITS_LIST.find((u) => u.id === activeUnit) || UNITS_LIST[0];
  const stageNum = currentUnitConfig.stage;
  const progress = getUnitProgress(activeUnit);

  // 6 Sequential Steps Configuration
  const sequentialSteps = [
    {
      step: 1,
      key: 'pretest' as UnitStepKey,
      title: 'แบบทดสอบก่อนเรียน',
      desc: 'Pre-test (ชุดข้อสอบคงที่)',
      icon: ClipboardList,
      href: `/student/assessment?unit=${activeUnit}&type=pre_test`,
      isUnlocked: true,
      isCompleted: progress.pretest_done,
      isActive: pathname.startsWith('/student/assessment') && searchParams.get('type') === 'pre_test',
      requiredStepName: '',
    },
    {
      step: 2,
      key: 'lesson' as UnitStepKey,
      title: 'เนื้อหาบทเรียน',
      desc: 'Slide & Video Tutorial',
      icon: BookOpen,
      href: `/student/lessons/${activeUnit}`,
      isUnlocked: isStepUnlocked(activeUnit, 'lesson'),
      isCompleted: progress.lesson_done,
      isActive: pathname.startsWith('/student/lessons') && searchParams.get('tab') !== 'quiz',
      requiredStepName: '1. แบบทดสอบก่อนเรียน (Pre-test)',
    },
    {
      step: 3,
      key: 'unit_quiz' as UnitStepKey,
      title: 'แบบฝึกหัดท้ายหน่วย',
      desc: 'Unit Quiz (ข้อสอบสั้น 4 ข้อ)',
      icon: CheckSquare,
      href: `/student/lessons/${activeUnit}?tab=quiz`,
      isUnlocked: isStepUnlocked(activeUnit, 'unit_quiz'),
      isCompleted: progress.unit_quiz_done,
      isActive: pathname.startsWith('/student/lessons') && searchParams.get('tab') === 'quiz',
      requiredStepName: '2. เนื้อหาบทเรียน (Lesson)',
    },
    {
      step: 4,
      key: 'game' as UnitStepKey,
      title: 'มินิเกมกู้เว็บพัง',
      desc: `Code Rescue (ด่าน ${stageNum})`,
      icon: Gamepad2,
      href: `/student/game?unit=${activeUnit}&stage=${stageNum}`,
      isUnlocked: isStepUnlocked(activeUnit, 'game'),
      isCompleted: progress.game_done,
      isActive: pathname.startsWith('/student/game'),
      requiredStepName: '3. แบบฝึกหัดท้ายหน่วย (Unit Quiz)',
    },
    {
      step: 5,
      key: 'quest' as UnitStepKey,
      title: 'ภารกิจเขียนโค้ด',
      desc: `Quest Lab (ด่าน ${stageNum})`,
      icon: Code2,
      href: `/student/quests/asg-${stageNum}?unit=${activeUnit}`,
      isUnlocked: isStepUnlocked(activeUnit, 'quest'),
      isCompleted: progress.quest_done,
      isActive: pathname.startsWith('/student/quests'),
      requiredStepName: '4. มินิเกมกู้เว็บพัง (Game)',
    },
    {
      step: 6,
      key: 'posttest' as UnitStepKey,
      title: 'แบบทดสอบหลังเรียน',
      desc: 'Post-test (Adaptive CAT)',
      icon: Trophy,
      href: `/student/assessment?unit=${activeUnit}&type=post_test`,
      isUnlocked: isStepUnlocked(activeUnit, 'posttest'),
      isCompleted: progress.posttest_done,
      isActive: pathname.startsWith('/student/assessment') && searchParams.get('type') === 'post_test',
      requiredStepName: '5. ภารกิจเขียนโค้ด (Quest Lab)',
    },
  ];

  // Prevent jumping ahead when clicking a locked step
  const handleStepClick = (e: React.MouseEvent, step: typeof sequentialSteps[0]) => {
    if (!step.isUnlocked) {
      e.preventDefault();
      setToastMessage(
        `🔒 ขั้นที่ ${step.step} "${step.title}" ยังถูกล็อกอยู่: คุณต้องทำ "${step.requiredStepName}" ให้ผ่านก่อนครับ`
      );
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }
  };

  const isDashboardActive = pathname === '/student';
  const isTutorActive = pathname.startsWith('/student/tutor');
  const isProfileActive = pathname.startsWith('/student/profile');

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans text-ink">
      {/* Toast Alert for Gating Notice */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-lg w-full px-4 pointer-events-none">
          <div className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-500/60 backdrop-blur-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40 animate-pulse">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-amber-300">
                ระบบเรียนตามลำดับ (Sequential Gating)
              </div>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-medium">
                {toastMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar for Desktop - Glassmorphism */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-4 left-4 z-40 bg-surface/90 backdrop-blur-xl border border-line rounded-[24px] shadow-lg transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Top Header */}
        <div
          className={`flex items-center h-18 ${
            isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-5'
          } border-b border-line`}
        >
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center shadow-md shadow-primary/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-lg tracking-tight text-ink block leading-none">
                  WebAI
                </span>
                <span className="text-[10px] text-muted font-mono font-medium">
                  Adaptive Learning
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-xl hover:bg-surface text-muted transition-colors border border-transparent hover:border-line cursor-pointer"
            title={isSidebarCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Main Dashboard Link */}
          <Link
            href="/student"
            className={`flex items-center ${
              isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'
            } py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border ${
              isDashboardActive
                ? 'text-primary bg-primary-dim border-primary/25 shadow-sm'
                : 'text-muted hover:text-primary hover:bg-primary-dim/40 border-transparent'
            }`}
            title={isSidebarCollapsed ? 'แดชบอร์ดภาพรวม' : undefined}
          >
            <LayoutDashboard className="w-[18px] h-[18px] shrink-0" strokeWidth={2.5} />
            {!isSidebarCollapsed && <span>แดชบอร์ด</span>}
          </Link>

          {/* Unit Selector Header */}
          {!isSidebarCollapsed ? (
            <div className="pt-2 border-t border-line/60">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  หน่วยที่กำลังเรียน
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">
                  {currentUnitConfig.code}
                </span>
              </div>

              {/* Unit Dropdown */}
              <select
                value={activeUnit}
                onChange={(e) => {
                  const newUnit = e.target.value;
                  setActiveUnit(newUnit);
                  localStorage.setItem('webai_current_learning_unit', newUnit);
                  router.push(`/student/lessons/${newUnit}`);
                }}
                className="w-full text-xs font-bold py-2 px-2.5 rounded-xl bg-surface border border-line text-ink focus:outline-none focus:border-primary shadow-sm cursor-pointer mb-3"
              >
                {UNITS_LIST.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.title}
                  </option>
                ))}
              </select>

              <div className="text-[10px] font-mono uppercase tracking-wider text-muted font-bold px-1 mb-1.5 flex items-center justify-between">
                <span>ลำดับขั้นตอน (6 ขั้น)</span>
                <span className="text-muted">บังคับตามลำดับ</span>
              </div>
            </div>
          ) : (
            <div className="border-t border-line my-2" />
          )}

          {/* 6 Sequential Learning Steps */}
          <div className="space-y-1.5">
            {sequentialSteps.map((step) => {
              const Icon = step.icon;
              const isLocked = !step.isUnlocked;
              const isDone = step.isCompleted;
              const isActive = step.isActive;

              return (
                <Link
                  key={step.key}
                  href={isLocked ? '#' : step.href}
                  onClick={(e) => handleStepClick(e, step)}
                  className={`flex items-center ${
                    isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                  } rounded-xl text-xs transition-all duration-200 relative group border ${
                    isActive
                      ? 'bg-primary-dim text-primary border-primary/30 shadow-sm font-bold'
                      : isLocked
                      ? 'text-slate-400 dark:text-slate-600 bg-transparent border-transparent opacity-60 cursor-not-allowed hover:bg-surface/40'
                      : isDone
                      ? 'text-slate-700 dark:text-slate-300 bg-surface/40 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/10'
                      : 'text-ink bg-surface/20 border-transparent hover:bg-surface hover:border-line'
                  }`}
                  title={
                    isLocked
                      ? `🔒 ขั้นที่ ${step.step}: ${step.title} (ล็อกอยู่: ต้องผ่าน ${step.requiredStepName} ก่อน)`
                      : `${step.step}. ${step.title} (${isDone ? 'ผ่านแล้ว' : 'พร้อมทำ'})`
                  }
                >
                  {/* Left Active Glow Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md shadow-sm" />
                  )}

                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border relative ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : isDone
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : isLocked
                          ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                          : 'bg-primary-dim text-primary border-primary/20'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {!isSidebarCollapsed && (
                      <div className="min-w-0 flex flex-col">
                        <span className="truncate font-bold leading-tight text-xs">
                          {step.step}. {step.title}
                        </span>
                        <span className="text-[10px] text-muted truncate">
                          {step.desc}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator Pill */}
                  {!isSidebarCollapsed && (
                    <div className="shrink-0 ml-1">
                      {isDone ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          ผ่าน
                        </span>
                      ) : isLocked ? (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-slate-200 dark:border-slate-700">
                          <Lock className="w-2.5 h-2.5" /> ล็อก
                        </span>
                      ) : isActive ? (
                        <span className="text-[10px] font-bold text-primary bg-primary-dim px-1.5 py-0.5 rounded border border-primary/30">
                          ทำอยู่
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">
                          พร้อม
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Tools & Secondary Navigation */}
          <div className="pt-3 border-t border-line/60 space-y-1">
            {!isSidebarCollapsed && (
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted font-bold px-1 mb-1">
                เครื่องมือเสริม
              </div>
            )}
            <Link
              href="/student/tutor"
              className={`flex items-center ${
                isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'
              } py-2 rounded-xl font-bold text-xs transition-all duration-200 border ${
                isTutorActive
                  ? 'text-primary bg-primary-dim border-primary/25 shadow-sm'
                  : 'text-muted hover:text-primary hover:bg-primary-dim/40 border-transparent'
              }`}
              title={isSidebarCollapsed ? 'AI ผู้ช่วยสอน' : undefined}
            >
              <Bot className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>AI ผู้ช่วยสอน</span>}
            </Link>

            <Link
              href="/student/profile"
              className={`flex items-center ${
                isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'
              } py-2 rounded-xl font-bold text-xs transition-all duration-200 border ${
                isProfileActive
                  ? 'text-primary bg-primary-dim border-primary/25 shadow-sm'
                  : 'text-muted hover:text-primary hover:bg-primary-dim/40 border-transparent'
              }`}
              title={isSidebarCollapsed ? 'โปรไฟล์' : undefined}
            >
              <User className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>โปรไฟล์ & ผลการเรียน</span>}
            </Link>
          </div>
        </div>

        {/* Logout Bottom */}
        <div className="mt-auto pt-3 pb-4 border-t border-line px-3 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'
            } py-2.5 w-full rounded-xl text-muted hover:text-danger hover:bg-danger-dim hover:border hover:border-danger/20 transition-all duration-200 font-bold text-xs border border-transparent cursor-pointer`}
            title={isSidebarCollapsed ? 'ออกจากระบบ' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" strokeWidth={2.5} />
            {!isSidebarCollapsed && <span>ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`${
          isSidebarCollapsed ? 'md:ml-28' : 'md:ml-80'
        } flex flex-col min-h-screen transition-all duration-300 mr-4`}
      >
        {/* Top Header Bar */}
        <header className="h-16 flex items-center justify-between px-6 mt-4 rounded-[20px] bg-surface/80 backdrop-blur-xl border border-line shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-primary bg-primary-dim px-3 py-1.5 rounded-full border border-primary/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> ระบบการเรียนรู้ WebAI
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-line">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              {currentUnitConfig.shortTitle}
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
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-muted" />}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 pb-32 md:pb-8 pt-6 relative z-10 w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation with 6 Steps Flow Quick Access */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 pb-safe">
        <div className="absolute inset-0 bg-surface/95 backdrop-blur-xl border-t border-line" />
        <nav className="relative flex items-center justify-around pt-2 pb-5 px-1 overflow-x-auto scrollbar-hide">
          <Link
            href="/student"
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all min-w-[52px] ${
              isDashboardActive ? 'text-primary font-bold' : 'text-muted'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px]">หลัก</span>
          </Link>

          {sequentialSteps.slice(0, 4).map((step) => {
            const Icon = step.icon;
            const isLocked = !step.isUnlocked;
            const isActive = step.isActive;
            return (
              <Link
                key={step.key}
                href={isLocked ? '#' : step.href}
                onClick={(e) => handleStepClick(e, step)}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all min-w-[52px] relative ${
                  isActive
                    ? 'text-primary font-bold'
                    : isLocked
                    ? 'text-slate-400 opacity-50'
                    : 'text-muted'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {isLocked && (
                    <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1.5 text-slate-500" />
                  )}
                  {step.isCompleted && (
                    <CheckCircle2 className="w-2.5 h-2.5 absolute -top-1 -right-1.5 text-emerald-500" />
                  )}
                </div>
                <span className="text-[9px] truncate max-w-[52px]">
                  ขั้น {step.step}
                </span>
              </Link>
            );
          })}

          <Link
            href={`/student/assessment?unit=${activeUnit}&type=post_test`}
            onClick={(e) => handleStepClick(e, sequentialSteps[5])}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all min-w-[52px] relative ${
              sequentialSteps[5].isActive
                ? 'text-primary font-bold'
                : !sequentialSteps[5].isUnlocked
                ? 'text-slate-400 opacity-50'
                : 'text-muted'
            }`}
          >
            <div className="relative">
              <Trophy className="w-4 h-4" />
              {!sequentialSteps[5].isUnlocked && (
                <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1.5 text-slate-500" />
              )}
            </div>
            <span className="text-[9px]">ขั้น 6</span>
          </Link>
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center font-bold text-sm text-muted">
          กำลังโหลดส่วนการเรียนรู้...
        </div>
      }
    >
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </Suspense>
  );
}
