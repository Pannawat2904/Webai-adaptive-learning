'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TeacherProvider, useTeacherContext } from '@/components/teacher/TeacherContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  FileQuestion,
  User,
  Sparkles,
  Users,
  TestTube2,
  BarChart4,
  BrainCircuit,
  Settings,
  Microscope,
  Menu,
  ChevronRight as ChevronRightSmall
} from 'lucide-react';

const navGroups = [
  {
    title: 'หลัก',
    items: [
      { name: 'ภาพรวม', href: '/teacher', icon: LayoutDashboard },
    ]
  },
  {
    title: 'ผู้เรียน',
    items: [
      { name: 'นักเรียนทั้งหมด', href: '/teacher/students', icon: Users },
    ]
  },
  {
    title: 'การประเมิน',
    items: [
      { name: 'แบบทดสอบ (CAT)', href: '/teacher/assessments', icon: TestTube2 },
      { name: 'คลังข้อสอบ', href: '/teacher/questions', icon: FileQuestion },
      { name: 'CAT Monitoring', href: '/teacher/adaptive-logs', icon: Activity },
    ]
  },
  {
    title: 'เนื้อหา',
    items: [
      { name: 'บทเรียน', href: '/teacher/lessons', icon: BookOpen },
    ]
  },
  {
    title: 'วิเคราะห์ (Analytics)',
    items: [
      { name: 'ผลการเรียนรู้', href: '/teacher/analytics', icon: BarChart4 },
      { name: 'คุณภาพการประเมิน', href: '/teacher/quality', icon: ShieldCheck },
    ]
  }
];

function TeacherSidebar({ isSidebarCollapsed, setIsSidebarCollapsed, profile, handleLogout }: any) {
  const pathname = usePathname();
  const { isResearchMode, toggleResearchMode } = useTeacherContext();

  return (
    <aside className={`hidden md:flex flex-col fixed inset-y-4 left-4 z-40 bg-[#0d1424]/60 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
      <div className={`flex items-center h-20 ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6'} border-b border-white/5 shrink-0`}>
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00ff9d] text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.4)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,255,157,0.3)]">
              Teacher Pro
            </span>
          </div>
        )}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-4 px-3 flex flex-col gap-6">
        {navGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 mb-1">{group.title}</span>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl font-bold text-[13.5px] transition-all duration-300 relative group ${
                    isActive
                      ? "text-white bg-[rgba(0,255,157,0.1)] border border-[rgba(0,255,157,0.2)] shadow-[0_0_15px_rgba(0,255,157,0.05)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00ff9d] rounded-r-md shadow-[0_0_10px_#00ff9d]" />
                  )}
                  <div className="relative flex-shrink-0">
                    <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-[#00ff9d] drop-shadow-[0_0_8px_rgba(0,255,157,0.6)]" : "opacity-70 group-hover:text-[#00ff9d]"}`} strokeWidth={2.5} />
                  </div>
                  {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 pb-6 border-t border-white/5 px-3 flex flex-col gap-2 shrink-0">
        
        {/* Research Mode Toggle */}
        <button 
          onClick={toggleResearchMode}
          className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4 justify-between'} py-3 w-full rounded-xl transition-all duration-300 font-bold text-sm border ${
            isResearchMode 
              ? 'bg-[rgba(176,92,255,0.15)] border-[rgba(176,92,255,0.3)] text-white shadow-[0_0_15px_rgba(176,92,255,0.1)]' 
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
          }`} 
          title={isSidebarCollapsed ? "Research Mode" : undefined}
        >
          <div className="flex items-center gap-3">
            <Microscope className={`w-[18px] h-[18px] flex-shrink-0 ${isResearchMode ? 'text-[#b05cff] drop-shadow-[0_0_8px_rgba(176,92,255,0.6)]' : ''}`} strokeWidth={2.5} />
            {!isSidebarCollapsed && <span className="truncate">Research Mode</span>}
          </div>
          {!isSidebarCollapsed && (
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isResearchMode ? 'bg-[#b05cff]' : 'bg-slate-700'}`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isResearchMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          )}
        </button>

        {!isSidebarCollapsed && profile && (
          <div className="px-4 py-2 mt-2 mb-2 flex items-center gap-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00ff9d] to-[#00e5ff] flex items-center justify-center p-[2px]">
              <div className="w-full h-full bg-[#0d1424] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white/80" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white truncate">{profile?.full_name || 'ผู้สอน'}</p>
              <p className="text-[9px] text-[#00ff9d] font-mono tracking-widest uppercase">TEACHER</p>
            </div>
          </div>
        )}
        
        <button onClick={handleLogout} className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 w-full rounded-xl text-slate-400 hover:text-[#ff3366] hover:bg-[#ff3366]/10 hover:border hover:border-[#ff3366]/20 transition-all duration-300 font-bold text-[13.5px] border border-transparent`} title={isSidebarCollapsed ? "ออกจากระบบ" : undefined}>
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2.5} />
          {!isSidebarCollapsed && <span>ออกจากระบบ</span>}
        </button>
      </div>
    </aside>
  );
}

function TeacherLayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { profile, signOut } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  // Generate breadcrumbs from pathname
  const pathParts = pathname.split('/').filter(p => p && p !== 'teacher');
  const breadcrumbs = [
    { name: 'ภาพรวม', href: '/teacher' }
  ];
  
  if (pathParts.length > 0) {
    const p1 = pathParts[0];
    if (p1 === 'students') breadcrumbs.push({ name: 'ผู้เรียน', href: '/teacher/students' });
    if (p1 === 'assessments') breadcrumbs.push({ name: 'แบบทดสอบ', href: '/teacher/assessments' });
    if (p1 === 'questions') breadcrumbs.push({ name: 'คลังข้อสอบ', href: '/teacher/questions' });
    if (p1 === 'adaptive-logs') breadcrumbs.push({ name: 'CAT Monitoring', href: '/teacher/adaptive-logs' });
    if (p1 === 'lessons') breadcrumbs.push({ name: 'บทเรียน', href: '/teacher/lessons' });
    if (p1 === 'analytics') breadcrumbs.push({ name: 'ผลการเรียนรู้', href: '/teacher/analytics' });
    if (p1 === 'quality') breadcrumbs.push({ name: 'คุณภาพการประเมิน', href: '/teacher/quality' });
    
    // Check if looking at student detail
    if (p1 === 'students' && pathParts.length > 1) {
      breadcrumbs.push({ name: 'โปรไฟล์นักเรียน', href: '#' });
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans text-white relative">
      
      <TeacherSidebar 
        isSidebarCollapsed={isSidebarCollapsed} 
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        profile={profile}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className={`${isSidebarCollapsed ? 'md:ml-28' : 'md:ml-80'} flex flex-col min-h-screen transition-all duration-300 mr-4`}>
        
        {/* Breadcrumb Header */}
        <header className="h-16 flex items-center px-6 mt-4 rounded-[20px] bg-[rgba(16,22,38,0.4)] backdrop-blur-md border border-white/5 shadow-md">
          <div className="flex items-center gap-2 text-sm font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRightSmall className="w-4 h-4 text-slate-500" />}
                <Link href={crumb.href} className={idx === breadcrumbs.length - 1 ? 'text-[#00ff9d] font-bold' : 'text-slate-400 hover:text-white transition-colors'}>
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </header>

        <main className="flex-1 pb-32 md:pb-8 pt-6 relative z-10 w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav - Simplified */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 pb-safe">
        <div className="absolute inset-0 bg-[#0d1424]/90 backdrop-blur-xl border-t border-white/10" />
        <nav className="relative flex items-center justify-around pt-3 pb-6 px-2">
          {[
            { name: 'ภาพรวม', href: '/teacher', icon: LayoutDashboard },
            { name: 'ผู้เรียน', href: '/teacher/students', icon: Users },
            { name: 'ข้อสอบ', href: '/teacher/questions', icon: FileQuestion },
            { name: 'สถิติ', href: '/teacher/analytics', icon: BarChart4 },
          ].map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/teacher');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all duration-300 relative min-w-[64px] ${
                  isActive ? "text-[#00ff9d]" : "text-slate-400 hover:text-white"
                }`}
              >
                <div className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-[rgba(0,255,157,0.15)] border border-[rgba(0,255,157,0.3)] shadow-[0_0_15px_rgba(0,255,157,0.2)] scale-110' : 'bg-transparent border border-transparent'}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] leading-none mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('dark');
  }, []);

  if (!mounted) return null;

  return (
    <TeacherProvider>
      <TeacherLayoutContent>
        {children}
      </TeacherLayoutContent>
    </TeacherProvider>
  );
}
