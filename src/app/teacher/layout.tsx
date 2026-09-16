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
  Sun,
  Moon,
  Search,
  Bell,
  Settings,
  LineChart,
  FileQuestion,
  Activity,
  Map,
  ShieldCheck,
  TrendingUp
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
      {/* Playful Soft Background */}
      <div className="playful-bg" aria-hidden="true" />
      
      {/* Sidebar for Desktop */}
      <aside className={`hidden md:flex flex-col fixed inset-y-4 left-4 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-sm transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center h-20 ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6'} border-b border-slate-100 dark:border-slate-700`}>
          {!isSidebarCollapsed && (
            <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
              Teacher Pro
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
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/teacher');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-4 px-4'} py-3 pill-button transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
                }`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <div className="relative flex-shrink-0">
                  <item.icon className={`w-5 h-5 ${isActive ? "opacity-100" : "opacity-70"}`} strokeWidth={2} />
                </div>
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 pb-6 border-t border-slate-100 dark:border-slate-700 px-3 flex flex-col gap-1.5">
          <button 
            onClick={toggleTheme} 
            className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-4 px-4'} py-3 w-full pill-button text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300`} 
            title={isSidebarCollapsed ? "สลับโหมดหน้าจอ" : undefined}
          >
            {theme === 'dark' ? (
              <><Sun className="w-5 h-5 flex-shrink-0 opacity-70" strokeWidth={2} />{!isSidebarCollapsed && <span>โหมดสว่าง</span>}</>
            ) : (
              <><Moon className="w-5 h-5 flex-shrink-0 opacity-70" strokeWidth={2} />{!isSidebarCollapsed && <span>โหมดมืด</span>}</>
            )}
          </button>
          
          <button onClick={handleLogout} className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-4 px-4'} py-3 w-full pill-button text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300`} title={isSidebarCollapsed ? "ออกจากระบบ" : undefined}>
            <LogOut className="w-5 h-5 flex-shrink-0 opacity-70" strokeWidth={2} />
            {!isSidebarCollapsed && <span>ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`${isSidebarCollapsed ? 'md:ml-28' : 'md:ml-72'} flex flex-col min-h-screen transition-all duration-300 mr-4`}>
        
        {/* Page Content */}
        <main className="flex-1 pb-32 md:pb-8 relative z-10 w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300" id="teacher-bottom-nav">
        <nav className="bg-white dark:bg-slate-900 flex items-center justify-around pt-3 pb-8 px-2 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] rounded-t-3xl overflow-x-auto">
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
                  isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <div className={`relative flex items-center justify-center p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/40 scale-110 shadow-sm' : 'bg-transparent'}`}>
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
