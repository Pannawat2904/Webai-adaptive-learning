import Link from 'next/link';
import { BookOpen, BrainCircuit, ChevronRight, Code2, LineChart, Play, Terminal, Zap, CheckCircle2, Bot } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col font-sans bg-code-bg-2 text-white overflow-hidden selection:bg-purple-500/30">
      
      {/* Dark theme background grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--code-line) 1px, transparent 1px), linear-gradient(90deg, var(--code-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none z-0" />

      {/* Floating HTML Tags Decoration - Dark Mode variant */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.04]">
        <div className="absolute top-32 left-10 text-5xl font-mono text-purple-400 font-bold rotate-12">&lt;html&gt;</div>
        <div className="absolute bottom-40 right-12 text-6xl font-mono text-emerald-400 font-bold -rotate-12">&lt;/div&gt;</div>
        <div className="absolute top-1/2 left-20 text-4xl font-mono text-blue-400 font-bold -rotate-6">&lt;body&gt;</div>
        <div className="absolute top-40 right-20 text-5xl font-mono text-yellow-400 font-bold rotate-6">&lt;style&gt;</div>
      </div>
      
      <div className="relative z-10 flex-col flex flex-1">
        <Navbar />

        <div className="flex-1 flex flex-col pt-12 pb-24 px-4 sm:px-6">
          {/* Hero Section */}
          <section className="max-w-[1000px] mx-auto w-full mt-6 sm:mt-12">
            <div className="flex flex-col items-center text-center space-y-8 relative">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm font-bold text-purple-300 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                </span>
                การทดสอบแบบปรับเหมาะเชิงกฎเกณฑ์ (Rule-based Adaptive)
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.15] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                สนุกกับการเขียนโค้ด <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 relative inline-block">
                  โครงสร้างภาษา HTML
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-purple-500/20 blur-md -z-10"></div>
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                ระบบการเรียนรู้ที่ปรับระดับความยากให้เหมาะกับคุณโดยอัตโนมัติ พร้อม <strong className="text-slate-200">Code Lab</strong> ให้ฝึกปฏิบัติจริง สนุก เข้าใจง่าย เหมือนเล่นเกม!
              </p>

              {/* Entrance Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <Link 
                  href="/student" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>เริ่มเรียนเลย (นักเรียน)</span>
                </Link>
                
                <Link 
                  href="/teacher/login" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg transition-all active:scale-95"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>สำหรับผู้สอน</span>
                </Link>
              </div>
            </div>

            {/* Code Lab Preview UI (Terminal Style) */}
            <div className="mt-20 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 shadow-2xl shadow-black/50">
              <div className="flex flex-col rounded-2xl overflow-hidden border border-code-line bg-code-bg">
                <div className="bg-code-bg-2 p-3 px-4 flex items-center justify-between border-b border-code-line shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2"><i className="w-3 h-3 rounded-full bg-[#ff5f57]"></i><i className="w-3 h-3 rounded-full bg-[#febc2e]"></i><i className="w-3 h-3 rounded-full bg-[#28c840]"></i></div>
                    <span className="chip mono bg-green-900/30 text-theme-green border border-green-500/20 text-xs hidden sm:flex"><Code2 className="w-3.5 h-3.5" />index.html</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-500 hidden sm:block">AI-Powered Code Lab</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-theme-green text-xs font-bold transition-colors">
                      <Play className="w-3.5 h-3.5 fill-current" /> RUN
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px]">
                  <div className="p-5 font-mono text-sm leading-[1.8] text-[#c9d4e8] border-b md:border-b-0 md:border-r border-code-line overflow-x-auto">
                    <span className="text-[#71809a]">&lt;!-- ภารกิจ: สร้างโครงสร้าง HTML --&gt;</span>{'\n'}
                    <span className="text-[#ff8fa3]">&lt;!doctype</span> <span className="text-[#7ee0b7]">html</span><span className="text-[#ff8fa3]">&gt;</span>{'\n'}
                    <span className="text-[#ff8fa3]">&lt;html</span> <span className="text-[#7ee0b7]">lang</span>=<span className="text-[#f5c977]">"th"</span><span className="text-[#ff8fa3]">&gt;</span>{'\n'}
                    <span className="text-[#ff8fa3]">&lt;head&gt;</span>{'\n'}
                    {'  '}<span className="text-[#ff8fa3]">&lt;title&gt;</span>เว็บไซต์ของฉัน<span className="text-[#ff8fa3]">&lt;/title&gt;</span>{'\n'}
                    <span className="text-[#ff8fa3]">&lt;/head&gt;</span>{'\n'}
                    <span className="text-[#ff8fa3]">&lt;body&gt;</span>{'\n'}
                    {'  '}<span className="text-[#ff8fa3]">&lt;h1&gt;</span>ยินดีต้อนรับสู่ HTML Adaptive<span className="text-[#ff8fa3]">&lt;/h1&gt;</span>{'\n'}
                    {'  '}<span className="text-[#ff8fa3]">&lt;p&gt;</span>ระบบเรียนรู้ปรับเหมาะอัตโนมัติ<span className="text-[#ff8fa3]">&lt;/p&gt;</span>{'\n'}
                    <span className="text-[#ff8fa3]">&lt;/body&gt;</span>{'\n'}
                    <span className="text-[#ff8fa3]">&lt;/html&gt;</span>
                  </div>
                  <div className="p-6 bg-white text-black relative flex flex-col justify-center items-center font-sans">
                    <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Preview
                    </div>
                    <div className="text-center">
                      <h1 className="text-3xl font-bold mb-4">ยินดีต้อนรับสู่ HTML Adaptive</h1>
                      <p className="text-slate-600 text-lg">ระบบเรียนรู้ปรับเหมาะอัตโนมัติ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-4 sm:px-6 max-w-6xl mx-auto w-full mt-24 md:mt-32">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">ฟีเจอร์เด่นของระบบ</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">ยกระดับการเรียนรู้ด้วยเทคโนโลยีที่ช่วยให้คุณเก่งขึ้นอย่างเป็นธรรมชาติ</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="bg-code-bg border border-code-line rounded-[24px] p-8 hover:border-purple-500/50 hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">ระบบปรับความยากอัตโนมัติ</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  วิเคราะห์คำตอบและจัดสรรข้อสอบข้อถัดไปให้เหมาะกับระดับของคุณ (Rule-based & IRT 3PL) ลดความตึงเครียดและวัดผลแม่นยำ
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-code-bg border border-code-line rounded-[24px] p-8 hover:border-emerald-500/50 hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Terminal className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">ห้องปฏิบัติการเขียนโค้ด</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  เรียนรู้ HTML จากการลงมือทำจริง (Code Lab) พิมพ์โค้ดปุ๊บ เห็นผลลัพธ์ปั๊บ พร้อม AI ช่วยตรวจไวยากรณ์และให้คำแนะนำ
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-code-bg border border-code-line rounded-[24px] p-8 hover:border-blue-500/50 hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <LineChart className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">แดชบอร์ดวิเคราะห์ผลลัพธ์</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  สรุปผลการเรียน พร้อมวิเคราะห์ค่าความเชื่อมั่น KR-20 และ Effect Size (Cohen's d) ช่วยให้ครูเข้าใจพัฒนาการได้อย่างลึกซึ้ง
                </p>
              </div>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
