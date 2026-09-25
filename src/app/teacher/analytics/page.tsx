'use client';

import React, { useState, useEffect } from 'react';
import { getStudents, getQuestions, subscribeToDatabase, StudentRecord } from '@/lib/database-service';
import { Question, SUB_DOMAINS, SubDomainCode } from '@/types/database';
import { calculateItemPsychometrics } from '@/lib/psychometrics';
import { MOCK_ATTEMPTS_SOMCHAI } from '@/lib/mock-sessions';
import {
  BarChart2,
  PieChart,
  Layers,
  Activity,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { useTeacherContext } from '@/components/teacher/TeacherContext';

export default function AnalyticsPage() {
  const { isResearchMode } = useTeacherContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'heatmap' | 'items'>('overview');
  
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const loadData = () => {
    setStudents(getStudents());
    setQuestions(getQuestions());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToDatabase((event) => {
      if (event.type === 'student' || event.type === 'question' || event.type === 'reset') {
        loadData();
      }
    });
    return () => unsubscribe();
  }, []);

  // Data for Heatmap
  const subDomainCodes: SubDomainCode[] = ['H1', 'H2', 'H3', 'H4', 'H5'];
  const classAverages: Record<SubDomainCode, number> = {} as any;
  subDomainCodes.forEach((code) => {
    const total = students.length > 0 ? students.reduce((acc, std) => acc + (std.scores[code] || 0), 0) : 0;
    classAverages[code] = students.length > 0 ? Math.round(total / students.length) : 75;
  });
  const overallClassAvg = Math.round(Object.values(classAverages).reduce((a, b) => a + b, 0) / subDomainCodes.length);

  // Data for Item Analytics
  const itemAnalytics = questions.map((q) => {
    const mockScores = [
      { sessionId: 'sess-1', score: 18 },
      { sessionId: 'sess-2', score: 16 },
      { sessionId: 'sess-3', score: 14 },
      { sessionId: 'sess-4', score: 10 },
      { sessionId: 'sess-5', score: 8 },
    ];
    return calculateItemPsychometrics(q, MOCK_ATTEMPTS_SOMCHAI.filter((a) => a.question_id === q.id), mockScores);
  });

  const getPillStyle = (score: number) => {
    if (score >= 80) return 'bg-[#16a34a]/10 dark:bg-[#00ff9d]/20 text-[#16a34a] dark:text-[#00ff9d] border-[#16a34a]/20 dark:border-[#00ff9d]/30';
    if (score >= 60) return 'bg-[#d97706]/10 dark:bg-[#ffaa00]/20 text-[#d97706] dark:text-[#ffaa00] border-[#d97706]/20 dark:border-[#ffaa00]/30';
    return 'bg-[#e11d48]/10 dark:bg-[#ff3366]/20 text-[#e11d48] dark:text-[#ff3366] border-[#e11d48]/20 dark:border-[#ff3366]/30';
  };

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter max-w-[1200px] mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-md mb-2 flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-[#0284c7] dark:text-[#00ff9d]" />
            วิเคราะห์ผลการเรียน (Analytics)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ดูภาพรวมของชั้นเรียน วิเคราะห์จุดแข็ง-จุดอ่อน และตรวจสอบคุณภาพข้อสอบ
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/10">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview' ? 'border-[#0284c7] dark:border-[#00ff9d] text-[#0284c7] dark:text-[#00ff9d]' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <PieChart className="w-4 h-4" /> ภาพรวมชั้นเรียน
        </button>
        <button 
          onClick={() => setActiveTab('heatmap')}
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'heatmap' ? 'border-[#0284c7] dark:border-[#00ff9d] text-[#0284c7] dark:text-[#00ff9d]' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Layers className="w-4 h-4" /> Domain Heatmap
        </button>
        {isResearchMode && (
          <button 
            onClick={() => setActiveTab('items')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'items' ? 'border-[#9333ea] dark:border-[#b05cff] text-[#9333ea] dark:text-[#b05cff]' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Activity className="w-4 h-4" /> Item Psychometrics
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card border-[#16a34a]/30 dark:border-[rgba(0,255,157,0.3)] bg-[#16a34a]/5 dark:bg-[rgba(0,255,157,0.02)] p-6 flex flex-col justify-center items-center text-center shadow-sm dark:shadow-none">
                <span className="text-sm font-bold text-[#16a34a] dark:text-[#00ff9d] uppercase mb-2">คะแนนเฉลี่ยรวมทั้งชั้นเรียน</span>
                <div className="text-6xl font-black text-slate-900 dark:text-white">{overallClassAvg}%</div>
                <div className="text-xs text-[#16a34a] dark:text-[#00ff9d] mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> สูงกว่าเกณฑ์ 15%
                </div>
              </div>
              <div className="card p-6 flex flex-col justify-center space-y-4 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">หัวข้อที่ทำได้ดีที่สุด</span>
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-white">H1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">หัวข้อที่ต้องซ่อมเสริม</span>
                  <span className="px-2 py-1 rounded bg-[#e11d48]/10 dark:bg-[rgba(255,51,102,0.1)] text-[#e11d48] dark:text-[#ff3366] text-xs font-bold">H7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">นักเรียนกลุ่มเสี่ยง (ทำได้ &lt;50%)</span>
                  <span className="text-slate-900 dark:text-white font-bold text-lg">3 คน</span>
                </div>
              </div>
              <div className="card border-[#9333ea]/30 dark:border-[rgba(176,92,255,0.3)] bg-[#9333ea]/5 dark:bg-[rgba(176,92,255,0.02)] p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#9333ea] dark:text-[#b05cff]" />
                  <h3 className="text-[#9333ea] dark:text-[#b05cff] font-bold">AI Recommendations</h3>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  พบว่านักเรียนมากกว่า 40% มีปัญหาในการทำความเข้าใจการส่งข้อมูลจาก Form (H7) แนะนำให้ทบทวนเรื่อง <code>method="POST"</code> และ <code>action</code> ในคาบเรียนถัดไป
                </p>
                <button className="mt-4 px-4 py-2 rounded-lg bg-[#9333ea]/10 dark:bg-[rgba(176,92,255,0.2)] text-[#9333ea] dark:text-[#b05cff] text-xs font-bold hover:bg-[#9333ea]/20 dark:hover:bg-[rgba(176,92,255,0.3)] transition-colors w-full">
                  สร้างบทเรียนซ่อมเสริมอัตโนมัติ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HEATMAP TAB */}
        {activeTab === 'heatmap' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Heatmap ความเข้าใจรายบุคคล</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>ระดับ:</span>
                <span className="px-2 py-1 rounded bg-[#16a34a]/10 dark:bg-[#00ff9d]/20 text-[#16a34a] dark:text-[#00ff9d]">ดีเยี่ยม (&ge;80)</span>
                <span className="px-2 py-1 rounded bg-[#d97706]/10 dark:bg-[#ffaa00]/20 text-[#d97706] dark:text-[#ffaa00]">ปานกลาง (60-79)</span>
                <span className="px-2 py-1 rounded bg-[#e11d48]/10 dark:bg-[#ff3366]/20 text-[#e11d48] dark:text-[#ff3366]">ต้องพัฒนา (&lt;60)</span>
              </div>
            </div>
            
            <div className="card p-0 overflow-x-auto border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <table className="w-full text-center text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[rgba(255,255,255,0.02)]">
                    <th className="p-4 text-left font-bold text-slate-700 dark:text-slate-300">ชื่อ-นามสกุล</th>
                    {subDomainCodes.map(c => (
                      <th key={c} className="p-4 font-bold text-slate-700 dark:text-slate-300">
                        <div className="text-slate-900 dark:text-white">{c}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{SUB_DOMAINS[c].name.substring(0, 10)}...</div>
                      </th>
                    ))}
                    <th className="p-4 font-bold text-[#0284c7] dark:text-[#00ff9d]">เฉลี่ย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-transparent">
                  {students.map(std => (
                    <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="p-4 text-left">
                        <div className="font-bold text-slate-900 dark:text-white">{std.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{std.id}</div>
                      </td>
                      {subDomainCodes.map(code => (
                        <td key={code} className="p-2">
                          <div className={`mx-auto w-10 h-8 flex items-center justify-center rounded text-xs font-bold border ${getPillStyle(std.scores[code])}`}>
                            {std.scores[code]}
                          </div>
                        </td>
                      ))}
                      <td className="p-4 font-black text-[#0284c7] dark:text-[#00ff9d]">{std.avgScore}</td>
                    </tr>
                  ))}
                  
                  {/* Class Averages Row */}
                  <tr className="bg-[#16a34a]/5 dark:bg-[rgba(0,255,157,0.05)] border-t border-[#16a34a]/20 dark:border-[#00ff9d]/30">
                    <td className="p-4 text-left font-bold text-[#16a34a] dark:text-[#00ff9d]">เฉลี่ยทั้งห้อง</td>
                    {subDomainCodes.map(code => (
                      <td key={code} className="p-2">
                        <div className={`mx-auto w-10 h-8 flex items-center justify-center rounded text-xs font-black border ${getPillStyle(classAverages[code])}`}>
                          {classAverages[code]}
                        </div>
                      </td>
                    ))}
                    <td className="p-4 font-black text-white bg-[#16a34a] dark:bg-[#00ff9d] dark:text-black rounded-br-xl">
                      {overallClassAvg}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ITEMS TAB (Research Mode) */}
        {activeTab === 'items' && isResearchMode && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Item Psychometrics Analysis (3PL)</h3>
            </div>
            
            <div className="card p-0 overflow-x-auto border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#9333ea]/5 dark:bg-[rgba(176,92,255,0.05)] text-slate-500 dark:text-slate-400 border-b border-[#9333ea]/20 dark:border-[#b05cff]/20">
                  <tr>
                    <th className="px-6 py-4 font-bold text-xs">ID / Sub-domain</th>
                    <th className="px-6 py-4 font-bold text-xs max-w-[200px]">คำถาม</th>
                    <th className="px-6 py-4 text-center font-bold text-xs">Difficulty (p)</th>
                    <th className="px-6 py-4 text-center font-bold text-xs">Discrimination (D)</th>
                    <th className="px-6 py-4 text-center font-bold text-xs">Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-transparent">
                  {itemAnalytics.map(item => (
                    <tr key={item.question_id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="text-slate-900 dark:text-white font-mono text-[11px]">{item.question_id.slice(0, 8)}...</div>
                        <div className="text-[#0284c7] dark:text-[#00e5ff] font-bold text-[10px] uppercase">{item.sub_domain_code}</div>
                      </td>
                      <td className="px-6 py-4 truncate max-w-[250px] text-slate-900 dark:text-white">
                        {item.question_text}
                      </td>
                      <td className="px-6 py-4 text-center font-mono">
                        <span className="text-slate-900 dark:text-white">{item.p_value.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono">
                        <span className={item.d_value >= 0.4 ? 'text-[#16a34a] dark:text-[#00ff9d] font-bold' : 'text-[#d97706] dark:text-[#ffaa00]'}>
                          {item.d_value.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.d_value >= 0.4 ? 'bg-[#16a34a]/10 dark:bg-[#00ff9d]/20 text-[#16a34a] dark:text-[#00ff9d]' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300'}`}>
                          {item.evaluation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
