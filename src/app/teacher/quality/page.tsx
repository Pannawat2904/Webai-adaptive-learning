'use client';

import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useTeacherContext } from '@/components/teacher/TeacherContext';

export default function QualityPage() {
  const { isResearchMode } = useTeacherContext();

  // Mock Quality Data
  const systemHealth = 92;
  const reliability = 0.86;
  const effectSize = 1.2;

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter max-w-[1200px] mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md mb-2 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#00ff9d]" />
            คุณภาพระบบ (System Quality)
          </h1>
          <p className="text-sm text-slate-400">
            ตรวจสอบความน่าเชื่อถือและประสิทธิภาพการประเมินของระบบ
          </p>
        </div>
      </div>

      {!isResearchMode ? (
        // Simplified View for Teachers
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-8 flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-bold text-slate-300 mb-4">สถานะระบบการประเมิน</h3>
            <div className="w-32 h-32 rounded-full border-4 border-[#00ff9d] flex items-center justify-center mb-4">
              <span className="text-4xl font-black text-[#00ff9d]">{systemHealth}%</span>
            </div>
            <p className="text-[#00ff9d] font-bold">ระบบมีความน่าเชื่อถือสูงมาก</p>
            <p className="text-sm text-slate-400 mt-2">ข้อสอบมีการจำแนกผู้เรียนได้ดีและมีข้อสอบครอบคลุมเพียงพอ</p>
          </div>
          
          <div className="card p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-300">ผลสัมฤทธิ์ทางการเรียน</h3>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">ความก้าวหน้าโดยรวม</span>
                <span className="font-bold text-[#00ff9d]">สูงมาก</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#00ff9d] w-[85%]"></div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#00e5ff]" />
                <span className="font-bold text-[#00e5ff]">AI Insights</span>
              </div>
              <p className="text-sm text-slate-300">
                นักเรียนมีการพัฒนาทักษะอย่างมีนัยสำคัญหลังจากการทำ Code Lab ระบบประเมินว่านักเรียนมีความเข้าใจเพิ่มขึ้นเทียบเท่ากับการเรียนปกติ 1.5 เดือน
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Advanced Research Mode View
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card border-[rgba(176,92,255,0.3)] bg-[rgba(176,92,255,0.02)] p-6">
              <h3 className="text-lg font-bold text-[#b05cff] mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" /> ความเที่ยงตรง (Reliability)
              </h3>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-4xl font-black text-white">{reliability}</div>
                  <div className="text-xs text-slate-400 mt-1">Marginal Reliability (เกณฑ์ &gt; 0.8)</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#b05cff]">ดีมาก</div>
                  <div className="text-[10px] text-slate-500">SE เฉลี่ย: 0.25</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-300 leading-relaxed">
                  ระบบ Adaptive Testing มีความสามารถในการวัด θ ของผู้เรียนได้สม่ำเสมอ ความคลาดเคลื่อน (Standard Error) อยู่ในเกณฑ์ต่ำ แสดงให้เห็นว่ากฎการหยุด (Stopping Rule) ทำงานได้อย่างมีประสิทธิภาพ
                </p>
              </div>
            </div>

            <div className="card border-[rgba(0,255,157,0.3)] bg-[rgba(0,255,157,0.02)] p-6">
              <h3 className="text-lg font-bold text-[#00ff9d] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> ขนาดอิทธิพล (Effect Size)
              </h3>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-4xl font-black text-white">{effectSize}</div>
                  <div className="text-xs text-slate-400 mt-1">Cohen&apos;s d (เกณฑ์ &gt; 0.8)</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#00ff9d]">สูงมาก (Large Effect)</div>
                  <div className="text-[10px] text-slate-500">Pre-test vs Post-test</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-300 leading-relaxed">
                  การเรียนรู้ร่วมกับ AI Assistant ส่งผลให้คะแนนความสามารถเฉลี่ยของผู้เรียนเพิ่มขึ้นอย่างมีนัยสำคัญทางสถิติเมื่อเทียบกับก่อนเรียน (Pre-test)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
