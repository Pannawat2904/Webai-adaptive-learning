'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  LayoutDashboard, 
  BookOpen, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Map,
  ShieldCheck,
  TrendingUp,
  Activity,
  FileQuestion,
  User,
  Sparkles
} from 'lucide-react';

const navItems = [
  { name: 'แดชบอร์ด', href: '/teacher', icon: LayoutDashboard },
  { name: 'บทเรียน', href: '/teacher/lessons', icon: BookOpen },
  { name: 'คลังข้อสอบ', href: '/teacher/questions', icon: FileQuestion },
  { name: 'บันทึก Adaptive', href: '/teacher/adaptive-logs', icon: Activity },
  { name: 'ฮีตแมป', href: '/teacher/heatmap', icon: Map },
  { name: 'ความเชื่อมั่น', href: '/teacher/reliability', icon: ShieldCheck },
  { name: 'ขนาดอิทธิพล', href: '/teacher/effect-size', icon: TrendingUp },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force global dark theme class for Deep Space aesthetic
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans text-white">
      {/* Sidebar for Desktop - Glassmorphism */}
      <aside className={`hidden md:flex flex-col fixed inset-y-4 left-4 z-40 bg-[#0d1424]/60 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center h-20 ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6'} border-b border-white/5`}>
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

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/teacher');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl font-bold text-sm transition-all duration-300 relative group ${
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
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 pb-6 border-t border-white/5 px-3 flex flex-col gap-2">
          {!isSidebarCollapsed && profile && (
            <div className="px-4 py-2 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00ff9d] to-[#00e5ff] flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-[#0d1424] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white/80" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{profile?.full_name || 'ผู้สอน'}</p>
                <p className="text-[10px] text-[#00ff9d] font-mono">TEACHER</p>
              </div>
            </div>
          )}
          
          <button onClick={handleLogout} className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 w-full rounded-xl text-slate-400 hover:text-[#ff3366] hover:bg-[#ff3366]/10 hover:border hover:border-[#ff3366]/20 transition-all duration-300 font-bold text-sm border border-transparent`} title={isSidebarCollapsed ? "ออกจากระบบ" : undefined}>
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2.5} />
            {!isSidebarCollapsed && <span>ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`${isSidebarCollapsed ? 'md:ml-28' : 'md:ml-72'} flex flex-col min-h-screen transition-all duration-300 mr-4`}>
        <main className="flex-1 pb-32 md:pb-8 pt-6 md:pt-10 relative z-10 w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav - Glassmorphism */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 pb-safe">
        <div className="absolute inset-0 bg-[#0d1424]/80 backdrop-blur-xl border-t border-white/10" />
        <nav className="relative flex items-center justify-around pt-3 pb-6 px-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/teacher');
            
            let shortName = item.name;
            if (item.name === "แดชบอร์ด") shortName = "หลัก";
            if (item.name === "บทเรียน") shortName = "เรียน";
            if (item.name === "คลังข้อสอบ") shortName = "สอบ";
            if (item.name === "บันทึก Adaptive") shortName = "บันทึก";
            if (item.name === "ฮีตแมป") shortName = "ฮีตแมป";

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
                <span className={`text-[10px] leading-none mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{shortName}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
