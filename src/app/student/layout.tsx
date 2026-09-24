'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  LayoutDashboard, 
  BookOpen, 
  Code2, 
  BrainCircuit, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bot,
  Gamepad2,
  Sparkles
} from 'lucide-react';

const navItems = [
  { name: 'แดชบอร์ด', href: '/student', icon: LayoutDashboard },
  { name: 'บทเรียน HTML', href: '/student/lessons', icon: BookOpen },
  { name: 'ฝึกเขียนโค้ด', href: '/student/codelab', icon: Code2 },
  { name: 'ตะลุยด่าน', href: '/student/quests', icon: Gamepad2 },
  { name: 'แบบทดสอบ', href: '/student/assessment', icon: BrainCircuit },
  { name: 'AI ผู้ช่วยสอน', href: '/student/tutor', icon: Bot },
  { name: 'โปรไฟล์', href: '/student/profile', icon: User },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if user has explicitly logged in
    const role = localStorage.getItem('webai_demo_role');
    if (!role) {
      router.push('/login');
      return;
    }
    
    setMounted(true);
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans text-ink">
      {/* Sidebar for Desktop - Glassmorphism */}
      <aside className={`hidden md:flex flex-col fixed inset-y-4 left-4 z-40 bg-surface/80 backdrop-blur-xl border border-line rounded-[24px] shadow-lg transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center h-20 ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6'} border-b border-line`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-[0_0_15px_var(--primary-dim)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-ink">
                WebAI
              </span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-xl hover:bg-surface text-muted transition-colors border border-transparent hover:border-line"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/student');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl font-bold text-sm transition-all duration-300 relative group ${
                  isActive
                    ? "text-primary bg-primary-dim border border-primary/20 shadow-sm"
                    : "text-muted hover:text-primary hover:bg-primary-dim/50 border border-transparent"
                }`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md shadow-sm" />
                )}
                <div className="relative flex-shrink-0">
                  <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-primary" : "opacity-70 group-hover:text-primary"}`} strokeWidth={2.5} />
                </div>
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 pb-6 border-t border-line px-3 flex flex-col gap-2">
          {!isSidebarCollapsed && profile && (
            <div className="px-4 py-2 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-surface rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-muted" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">{profile?.full_name || 'นักเรียน'}</p>
                <p className="text-[10px] text-primary font-mono">STUDENT</p>
              </div>
            </div>
          )}
          
          <button onClick={handleLogout} className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 w-full rounded-xl text-muted hover:text-danger hover:bg-danger-dim hover:border hover:border-danger/20 transition-all duration-300 font-bold text-sm border border-transparent`} title={isSidebarCollapsed ? "ออกจากระบบ" : undefined}>
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
        <div className="absolute inset-0 bg-surface/90 backdrop-blur-xl border-t border-line" />
        <nav className="relative flex items-center justify-around pt-3 pb-6 px-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/student');
            
            let shortName = item.name;
            if (item.name === "แดชบอร์ด") shortName = "หลัก";
            if (item.name === "บทเรียน HTML") shortName = "เรียน";
            if (item.name === "ฝึกเขียนโค้ด") shortName = "โค้ด";
            if (item.name === "ตะลุยด่าน") shortName = "ด่าน";
            if (item.name === "แบบทดสอบ") shortName = "สอบ";

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all duration-300 relative min-w-[64px] ${
                  isActive ? "text-primary" : "text-muted hover:text-ink"
                }`}
              >
                <div className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary-dim border border-primary/30 shadow-sm scale-110' : 'bg-transparent border border-transparent'}`}>
                  <item.icon className={`w-5 h-5`} strokeWidth={isActive ? 2.5 : 2} />
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
