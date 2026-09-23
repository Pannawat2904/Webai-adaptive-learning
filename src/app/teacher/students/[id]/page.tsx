'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_CLASS_STUDENTS } from '@/lib/mock-data';
import { SubDomainCode } from '@/types/database';
import {
  User,
  ArrowLeft,
  TrendingUp,
  Activity,
  Award,
  Bot,
  BrainCircuit,
  FileQuestion,
  Terminal
} from 'lucide-react';
import { useTeacherContext } from '@/components/teacher/TeacherContext';

export default function StudentProfilePage() {
  const { id } = useParams();
  const { isResearchMode } = useTeacherContext();

  const student = MOCK_CLASS_STUDENTS.find(s => s.id === id) || MOCK_CLASS_STUDENTS[0];

  const weakCodes = (Object.keys(student.scores) as SubDomainCode[]).filter((c) => (student.scores[c] || 0) < 60);
  const strongCodes = (Object.keys(student.scores) as SubDomainCode[]).filter((c) => (student.scores[c] || 0) >= 80);

  // Mock IRT values
  const rawScore = student.avgScore / 100;
  const theta = (rawScore * 6 - 3).toFixed(2);
  const se = (0.2 + (Math.random() * 0.1)).toFixed(2);

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter max-w-[1200px] mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link href="/teacher/students" className="inline-flex items-center gap-2 text-sm text-[#00e5ff] font-bold hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" /> กลับหน้ารวมนักเรียน
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
              <User className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                {student.name}
              </h1>
              <p className="text-sm text-slate-400 font-mono mt-1">
                รหัส: {student.id} • ห้อง: ปวช.1/1 • อัปเดตล่าสุด: วันนี้ 10:30
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn bg-white/5 text-white hover:bg-white/10">
            ดูผลการประเมินย้อนหลัง
          </button>
          <button className="btn bg-[#ffaa00] text-black hover:bg-[#ffaa00]/90 shadow-[0_0_15px_rgba(255,170,0,0.4)]">
            แนะนำบทเรียนเสริม
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & AI */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">ความสามารถรวม (Overall)</h3>
              <div className="p-2 rounded-lg bg-[rgba(176,92,255,0.1)] text-[#b05cff]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-center py-4">
              {isResearchMode ? (
                <>
                  <div className="text-5xl font-black text-white font-mono mb-2">θ = {theta}</div>
                  <div className="text-xs text-slate-400 font-mono">SE = {se}</div>
                </>
              ) : (
                <>
                  <div className="text-5xl font-black text-white font-mono mb-2">{student.avgScore}%</div>
                  <div className="text-xs text-slate-400">เกรดประเมินล่าสุด: A</div>
                </>
              )}
            </div>
          </div>

          <div className="card border-[rgba(0,255,157,0.3)] bg-[rgba(0,255,157,0.02)]">
            <div className="card-head flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#00ff9d]" />
              <h3 className="text-lg text-[#00ff9d]">AI Recommendation</h3>
            </div>
            <div className="card-body">
              <p className="text-sm text-slate-300 leading-relaxed">
                นักเรียนมีความสามารถในการจัดโครงสร้าง HTML พื้นฐานได้ดีมาก แต่ยังมีปัญหาเกี่ยวกับการใช้งาน Form (H7) แนะนำให้ให้ทำแบบฝึกหัดเสริมเรื่อง <code>&lt;form&gt;</code> และ <code>&lt;input&gt;</code> ใน Code Lab เพื่อเสริมสร้างความเข้าใจ
              </p>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1.5 rounded bg-[rgba(0,255,157,0.1)] border border-[rgba(0,255,157,0.2)] text-[11px] font-bold text-[#00ff9d] hover:bg-[rgba(0,255,157,0.2)]">
                  มอบหมาย Code Lab: Forms
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle/Right Column: Domain Profile & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-head flex items-center justify-between">
              <h3>Domain Profile (H1-H8)</h3>
            </div>
            <div className="card-body p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {(Object.entries(student.scores) as [string, number][]).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-300">{key}</span>
                      <span className="font-mono text-slate-400">{val}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          val >= 80 ? 'bg-[#00ff9d] shadow-[0_0_10px_#00ff9d]' : 
                          val >= 60 ? 'bg-[#ffaa00] shadow-[0_0_10px_#ffaa00]' : 
                          'bg-[#ff3366] shadow-[0_0_10px_#ff3366]'
                        }`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">จุดแข็ง (Strengths)</h4>
                  <div className="flex flex-wrap gap-2">
                    {strongCodes.length > 0 ? strongCodes.map(c => (
                      <span key={c} className="chip chip-green font-mono">{c}</span>
                    )) : <span className="text-slate-500 text-xs">ไม่มีข้อมูล</span>}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">จุดที่ควรพัฒนา (Needs Improvement)</h4>
                  <div className="flex flex-wrap gap-2">
                    {weakCodes.length > 0 ? weakCodes.map(c => (
                      <span key={c} className="chip chip-amber font-mono">{c}</span>
                    )) : <span className="text-slate-500 text-xs">ไม่มีข้อมูล</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>ประวัติการทดสอบล่าสุด (Assessment History)</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[rgba(0,229,255,0.1)] text-[#00e5ff]">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white">การทดสอบก่อนเรียน (Pre-test) - CAT</p>
                          <p className="text-xs text-slate-400">แบบทดสอบปรับเหมาะตามความสามารถ</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-400">เมื่อวาน 09:00</td>
                    <td className="px-6 py-4 text-right">
                      {isResearchMode ? (
                        <span className="font-bold font-mono text-[#00ff9d]">θ = {theta} (SE {se})</span>
                      ) : (
                        <span className="font-bold text-[#00ff9d]">ได้คะแนน {student.avgScore}%</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[rgba(176,92,255,0.1)] text-[#b05cff]">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white">ฝึกเขียนโค้ด (Code Lab) - H1</p>
                          <p className="text-xs text-slate-400">ผ่านการคอมไพล์โค้ด HTML พื้นฐาน</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-400">3 วันที่แล้ว</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-[#b05cff]">สำเร็จ</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
