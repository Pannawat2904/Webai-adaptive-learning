import Link from 'next/link';
import { BookOpen, BrainCircuit, ChevronRight, Code2, LineChart, Play, UserCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col font-sans">
      {/* Playful Soft Background */}
      <div className="playful-bg" aria-hidden="true" />
      
      {/* Floating HTML Tags Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-10 dark:opacity-5">
        <div className="absolute top-24 left-10 text-5xl font-mono text-purple-600 font-bold rotate-12">&lt;html&gt;</div>
        <div className="absolute bottom-32 right-12 text-6xl font-mono text-emerald-600 font-bold -rotate-12">&lt;/div&gt;</div>
        <div className="absolute top-1/2 left-20 text-4xl font-mono text-yellow-500 font-bold -rotate-6">&lt;body&gt;</div>
        <div className="absolute top-40 right-20 text-5xl font-mono text-blue-500 font-bold rotate-6">&lt;style&gt;</div>
      </div>
      
      {/* Include the global Navbar just for the landing page */}
      <Navbar />

      <div className="relative z-10 flex-1 flex flex-col pt-8 pb-24">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mt-6 sm:mt-12 lg:mt-20">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
            
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-sm font-bold text-purple-600 dark:text-purple-400 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
              การทดสอบแบบปรับเหมาะเชิงกฎเกณฑ์
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-800 dark:text-white leading-[1.15]">
              สนุกกับการเขียนโค้ด <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
                โครงสร้างภาษา HTML
              </span>
            </h1>
            
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
              ระบบการเรียนรู้ที่ปรับระดับความยากให้เหมาะกับคุณโดยอัตโนมัติ พร้อม Code Lab ให้ฝึกปฏิบัติจริง สนุก เข้าใจง่าย เหมือนเล่นเกม!
            </p>

            {/* Entrance Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
              <Link 
                href="/student" 
                className="w-full sm:w-auto pill-button flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg shadow-lg shadow-purple-500/30"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>เริ่มเรียนเลย (นักเรียน)</span>
              </Link>
              
              <Link 
                href="/teacher/login" 
                className="w-full sm:w-auto pill-button flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-lg shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <BookOpen className="w-5 h-5" />
                <span>สำหรับผู้สอน</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Section (Asymmetrical layout instead of strict bento grid) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            
            {/* Card 1: Adaptive Engine (Lavender) */}
            <div className="soft-card card-lavender flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <div className="icon-circle w-14 h-14 text-purple-600 dark:text-purple-400">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2">ปรับความยากอัตโนมัติ</h3>
                  <p className="text-purple-900/70 dark:text-purple-200/70 font-medium leading-relaxed">
                    ระบบจะวิเคราะห์คำตอบและจัดสรรข้อสอบข้อถัดไปให้เหมาะกับระดับของคุณ ช่วยลดความตึงเครียดและวัดผลได้แม่นยำยิ่งขึ้น
                  </p>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <div className="w-12 h-12 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Card 2: Code Lab (Mint) */}
            <div className="soft-card card-mint flex flex-col justify-between h-full group md:translate-y-12">
              <div className="space-y-4">
                <div className="icon-circle w-14 h-14 text-emerald-600 dark:text-emerald-400">
                  <Code2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2">ห้องปฏิบัติการเขียนโค้ด</h3>
                  <p className="text-emerald-900/70 dark:text-emerald-200/70 font-medium leading-relaxed">
                    เรียนรู้ HTML จากการลงมือทำจริง พิมพ์โค้ดปุ๊บ เห็นผลลัพธ์ปั๊บ พร้อมระบบตรวจไวยากรณ์อัตโนมัติ
                  </p>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <div className="w-12 h-12 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Card 3: Analytics (Yellow) */}
            <div className="soft-card card-yellow flex flex-col justify-between h-full group md:col-span-2 mt-8 md:mt-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="icon-circle w-14 h-14 text-yellow-600 dark:text-yellow-500">
                    <LineChart className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-2">วิเคราะห์ผลสำหรับผู้สอน</h3>
                    <p className="text-yellow-900/70 dark:text-yellow-100/70 font-medium leading-relaxed max-w-xl">
                      แดชบอร์ดสรุปผลการเรียน พร้อมวิเคราะห์ค่าความเชื่อมั่น KR-20 และ Effect Size (Cohen's d) ช่วยให้ครูเข้าใจพัฒนาการของนักเรียนได้อย่างลึกซึ้ง
                    </p>
                  </div>
                </div>
                
                {/* Decorative Chart Graphic */}
                <div className="w-full md:w-64 h-40 bg-white/40 dark:bg-black/20 rounded-3xl p-4 flex items-end justify-between gap-3 border border-white/50 dark:border-white/5">
                  <div className="w-full bg-yellow-300 dark:bg-yellow-600/60 rounded-t-xl h-[40%]"></div>
                  <div className="w-full bg-yellow-400 dark:bg-yellow-500/70 rounded-t-xl h-[60%]"></div>
                  <div className="w-full bg-yellow-500 dark:bg-yellow-400/80 rounded-t-xl h-[85%]"></div>
                  <div className="w-full bg-yellow-600 dark:bg-yellow-300/90 rounded-t-xl h-[100%]"></div>
                </div>
              </div>
            </div>
            
          </div>
        </section>
      </div>
    </main>
  );
}
