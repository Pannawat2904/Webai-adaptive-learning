'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Sun,
  Moon,
  Search,
  Bell,
  Bot,
  Gamepad2
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
  const { profile, signOut } = useAuth();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300 font-sans">
      <div className="playful-bg" aria-hidden="true" />
      
      {/* Sidebar for Desktop */}
      <aside className={`hidden md:flex flex-col fixed inset-y-4 left-4 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-sm transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center h-20 ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6'} border-b border-slate-100 dark:border-slate-700`}>
          {!isSidebarCollapsed && (
            <span className="font-extrabold text-xl tracking-tight text-purple-600 dark:text-purple-400">
              HTML Adaptive
            </span>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/student');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-md font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-l-[3px] border-purple-500 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border-l-[3px] border-transparent"
                }`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <div className="relative flex-shrink-0">
                  <item.icon className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-70"}`} strokeWidth={2.5} />
                </div>
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 pb-6 border-t border-slate-100 dark:border-slate-800 px-3 flex flex-col gap-1.5 font-bold text-sm">
          <button 
            onClick={toggleTheme} 
            className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 w-full rounded-md text-slate-500 hover:text-purple-600 hover:bg-purple-500/10 transition-all duration-300 border-l-[3px] border-transparent`} 
            title={isSidebarCollapsed ? "สลับโหมดหน้าจอ" : undefined}
          >
            {theme === 'dark' ? (
              <><Sun className="w-4 h-4 flex-shrink-0 opacity-70" strokeWidth={2.5} />{!isSidebarCollapsed && <span>โหมดสว่าง</span>}</>
            ) : (
              <><Moon className="w-4 h-4 flex-shrink-0 opacity-70" strokeWidth={2.5} />{!isSidebarCollapsed && <span>โหมดมืด</span>}</>
            )}
          </button>
          
          <button onClick={handleLogout} className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 w-full rounded-md text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 border-l-[3px] border-transparent`} title={isSidebarCollapsed ? "ออกจากระบบ" : undefined}>
            <LogOut className="w-4 h-4 flex-shrink-0 opacity-70" strokeWidth={2.5} />
            {!isSidebarCollapsed && <span>ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`${isSidebarCollapsed ? 'md:ml-28' : 'md:ml-72'} flex flex-col min-h-screen transition-all duration-300 mr-4`}>
        
        {/* Page Content */}
        <main className="flex-1 pb-32 md:pb-8 pt-6 md:pt-10 relative z-10 w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300" id="student-bottom-nav">
        <nav className="bg-white dark:bg-slate-900 flex items-center justify-around pt-3 pb-8 px-2 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] rounded-t-3xl">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/student');
            
            let shortName = item.name;
            if (item.name === "แดชบอร์ด") shortName = "หลัก";
            if (item.name === "บทเรียน HTML") shortName = "เรียน";
            if (item.name === "ฝึกเขียนโค้ด") shortName = "โค้ด";
            if (item.name === "ตะลุยด่าน") shortName = "ด่าน";
            if (item.name === "แบบทดสอบ") shortName = "สอบ";
            if (item.name === "AI ผู้ช่วยสอน") shortName = "AI";
            if (item.name === "โปรไฟล์") shortName = "ฉัน";

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all duration-300 relative w-[64px] ${
                  isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <div className={`relative flex items-center justify-center p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-purple-100 dark:bg-purple-900/40 scale-110 shadow-sm' : 'bg-transparent'}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? "opacity-100" : "opacity-80"}`} strokeWidth={isActive ? 2.5 : 2} />
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
