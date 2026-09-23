'use client';

import React, { useState } from 'react';
import {
  TestTube2,
  Plus,
  Settings2,
  PlayCircle,
  Clock,
  MoreVertical,
  Activity,
  Target,
  FileQuestion
} from 'lucide-react';
import { useTeacherContext } from '@/components/teacher/TeacherContext';

export default function AssessmentManagementPage() {
  const { isResearchMode } = useTeacherContext();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [mode, setMode] = useState('CAT');
  const [name, setName] = useState('แบบประเมินความสามารถ HTML ครั้งที่ 1');
  const [minItems, setMinItems] = useState(10);
  const [maxItems, setMaxItems] = useState(30);
  const [targetSE, setTargetSE] = useState(0.30);

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter max-w-[1200px] mx-auto relative">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-md mb-2 flex items-center gap-3">
            <TestTube2 className="w-8 h-8 text-[#16a34a] dark:text-[#00ff9d]" />
            จัดการแบบทดสอบ (Assessments)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            สร้างและกำหนดค่าการประเมินแบบปรับเหมาะ (CAT) หรือแบบทดสอบปกติ (Fixed Test)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#16a34a] dark:bg-[#00ff9d] text-white dark:text-black text-sm font-bold shadow-sm dark:shadow-[0_0_15px_rgba(0,255,157,0.4)] hover:bg-[#15803d] dark:hover:bg-[#00e5ff] flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> สร้างแบบประเมิน
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Existing Assessment Card */}
        <div className="card p-6 flex flex-col justify-between group border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16a34a]/10 dark:bg-[rgba(0,255,157,0.1)] text-[#16a34a] dark:text-[#00ff9d] text-[10px] font-bold uppercase tracking-wider border border-[#16a34a]/20 dark:border-[rgba(0,255,157,0.2)]">
                <Activity className="w-3 h-3" /> CAT Mode
              </span>
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Pre-test: โครงสร้าง HTML (ปวช.1)</h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-6">
              <p className="flex items-center gap-2"><Target className="w-3.5 h-3.5" /> 8 Sub-domains (H1-H8)</p>
              <p className="flex items-center gap-2"><Settings2 className="w-3.5 h-3.5" /> Min 10, Max 25 (Target SE: 0.3)</p>
              <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> กำลังเปิดสอบ (เริ่ม 1 ก.ย.)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-colors">
              ตั้งค่า
            </button>
            <button className="flex-1 py-2 rounded-lg bg-[#16a34a]/10 dark:bg-[rgba(0,255,157,0.1)] text-[#16a34a] dark:text-[#00ff9d] border border-[#16a34a]/20 dark:border-[rgba(0,255,157,0.2)] text-xs font-bold hover:bg-[#16a34a]/20 dark:hover:bg-[rgba(0,255,157,0.2)] transition-colors">
              ดูผลสอบ
            </button>
          </div>
        </div>

        {/* Fixed Test Example */}
        <div className="card p-6 flex flex-col justify-between group opacity-70 hover:opacity-100 transition-opacity border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-white/10">
                <FileQuestion className="w-3 h-3" /> Fixed Test
              </span>
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Quiz: โครงสร้างเอกสาร HTML พื้นฐาน (H1)</h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-6">
              <p className="flex items-center gap-2"><Target className="w-3.5 h-3.5" /> เฉพาะ H1</p>
              <p className="flex items-center gap-2"><Settings2 className="w-3.5 h-3.5" /> 10 ข้อ (เรียงตามลำดับ)</p>
              <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> ปิดรับคำตอบ</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-colors">
              ตั้งค่า
            </button>
            <button className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-colors">
              ดูผลสอบ
            </button>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#16a34a] dark:text-[#00ff9d]" /> สร้างแบบประเมินใหม่
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ชื่อแบบประเมิน (Assessment Name)</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-[#16a34a] dark:focus:border-[#00ff9d] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">รูปแบบการทดสอบ (Mode)</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${mode === 'CAT' ? 'border-[#16a34a] dark:border-[#00ff9d] bg-[#16a34a]/10 dark:bg-[rgba(0,255,157,0.1)]' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <input type="radio" name="mode" value="CAT" checked={mode === 'CAT'} onChange={() => setMode('CAT')} className="hidden" />
                    <Activity className={`w-8 h-8 ${mode === 'CAT' ? 'text-[#16a34a] dark:text-[#00ff9d]' : 'text-slate-400 dark:text-slate-500'}`} />
                    <div className="text-center">
                      <div className={`font-bold ${mode === 'CAT' ? 'text-[#16a34a] dark:text-[#00ff9d]' : 'text-slate-700 dark:text-slate-300'}`}>CAT (IRT 3PL)</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">แบบทดสอบปรับเหมาะตามความสามารถ</div>
                    </div>
                  </label>
                  <label className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${mode === 'Fixed' ? 'border-[#16a34a] dark:border-[#00ff9d] bg-[#16a34a]/10 dark:bg-[rgba(0,255,157,0.1)]' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <input type="radio" name="mode" value="Fixed" checked={mode === 'Fixed'} onChange={() => setMode('Fixed')} className="hidden" />
                    <FileQuestion className={`w-8 h-8 ${mode === 'Fixed' ? 'text-[#16a34a] dark:text-[#00ff9d]' : 'text-slate-400 dark:text-slate-500'}`} />
                    <div className="text-center">
                      <div className={`font-bold ${mode === 'Fixed' ? 'text-[#16a34a] dark:text-[#00ff9d]' : 'text-slate-700 dark:text-slate-300'}`}>Fixed Test</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">แบบทดสอบปกติ (เรียงตามลำดับ)</div>
                    </div>
                  </label>
                </div>
              </div>

              {mode === 'CAT' && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/5">
                  <h3 className="text-sm font-bold text-[#16a34a] dark:text-[#00ff9d] uppercase tracking-wider">CAT Configuration</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Minimum Items</label>
                      <input type="number" value={minItems} onChange={e => setMinItems(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono focus:border-[#16a34a] dark:focus:border-[#00ff9d] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Maximum Items</label>
                      <input type="number" value={maxItems} onChange={e => setMaxItems(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono focus:border-[#16a34a] dark:focus:border-[#00ff9d] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Target SE (Stop Rule)</label>
                      <input type="number" step="0.01" value={targetSE} onChange={e => setTargetSE(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono focus:border-[#16a34a] dark:focus:border-[#00ff9d] focus:outline-none" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Content Balance</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'].map(h => (
                        <div key={h} className="flex items-center justify-between p-2 rounded bg-slate-100 dark:bg-white/5">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{h}</span>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">12.5%</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">* ระบบจะสุ่มข้อสอบให้ครอบคลุมทุก Domain อย่างสมดุล (ตั้งค่าสัดส่วนอัตโนมัติ)</p>
                  </div>
                </div>
              )}

            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">
                ยกเลิก
              </button>
              <button onClick={() => setShowCreateModal(false)} className="px-5 py-2 rounded-xl bg-[#16a34a] dark:bg-[#00ff9d] text-white dark:text-black text-sm font-bold shadow-sm dark:shadow-[0_0_15px_rgba(0,255,157,0.4)] hover:bg-[#15803d] dark:hover:bg-[#00e5ff] transition-all">
                บันทึกการประเมิน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
