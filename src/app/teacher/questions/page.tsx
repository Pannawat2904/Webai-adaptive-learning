'use client';

import React, { useState } from 'react';
import { MOCK_QUESTIONS } from '@/lib/mock-data';
import { Question, SubDomainCode, SUB_DOMAINS, QuestionDifficulty } from '@/types/database';
import {
  FileQuestion,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Edit,
  Trash2,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useTeacherContext } from '@/components/teacher/TeacherContext';

export default function QuestionBankPage() {
  const { isResearchMode } = useTeacherContext();
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  
  const [selectedSubDomain, setSelectedSubDomain] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);

  const filteredQuestions = questions.filter((q) => {
    const matchesSub = selectedSubDomain === 'all' || q.sub_domain_code === selectedSubDomain;
    const matchesSearch = q.question_text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSub && matchesSearch;
  });

  const totalQuestions = questions.length;
  const readyQuestions = questions.filter(q => q.validated && q.active).length;
  const waitingCalibration = questions.filter(q => q.validated && !q.active).length; // mock concept
  const needsImprovement = questions.filter(q => !q.validated).length;

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter max-w-[1200px] mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md mb-2 flex items-center gap-3">
            <FileQuestion className="w-8 h-8 text-[#00ff9d]" />
            คลังข้อสอบ (Question Bank)
          </h1>
          <p className="text-sm text-slate-400">
            จัดการข้อสอบ ตรวจสอบคุณภาพ (IOC) และสถานะ Calibration
          </p>
        </div>
        <button 
          onClick={() => setShowEditor(true)}
          className="px-4 py-2.5 rounded-xl bg-[#00ff9d] text-black text-sm font-bold shadow-[0_0_15px_rgba(0,255,157,0.4)] hover:bg-[#00e5ff] flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> เพิ่มข้อสอบใหม่
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">ข้อทั้งหมด</div>
          <div className="text-2xl font-bold text-white">{totalQuestions}</div>
        </div>
        <div className="card p-4 border-[rgba(0,255,157,0.3)] bg-[rgba(0,255,157,0.02)]">
          <div className="text-xs text-[#00ff9d] mb-1">พร้อมใช้งาน (Active)</div>
          <div className="text-2xl font-bold text-white">{readyQuestions}</div>
        </div>
        <div className="card p-4 border-[rgba(255,170,0,0.3)] bg-[rgba(255,170,0,0.02)]">
          <div className="text-xs text-[#ffaa00] mb-1">รอ Calibration</div>
          <div className="text-2xl font-bold text-white">{waitingCalibration}</div>
        </div>
        <div className="card p-4 border-[rgba(255,51,102,0.3)] bg-[rgba(255,51,102,0.02)]">
          <div className="text-xs text-[#ff3366] mb-1">ต้องปรับปรุง (IOC &lt; 0.67)</div>
          <div className="text-2xl font-bold text-white">{needsImprovement}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาข้อความข้อสอบ..."
            className="pl-9 pr-4 py-2 rounded-xl bg-[rgba(16,22,38,0.6)] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00ff9d] w-full sm:w-64 transition-colors"
          />
        </div>
        <select
          value={selectedSubDomain}
          onChange={(e) => setSelectedSubDomain(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[rgba(16,22,38,0.6)] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00ff9d] appearance-none"
        >
          <option value="all">ทุก Sub-domain</option>
          {(Object.keys(SUB_DOMAINS) as SubDomainCode[]).map((c) => (
            <option key={c} value={c}>{c} - {SUB_DOMAINS[c].name}</option>
          ))}
        </select>
        <button className="px-4 py-2 rounded-xl bg-[rgba(16,22,38,0.6)] border border-white/10 text-sm text-white hover:bg-white/10 flex items-center gap-2">
          <Filter className="w-4 h-4" /> ตัวกรองเพิ่มเติม
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[rgba(255,255,255,0.02)] text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold text-xs">ID</th>
                <th className="px-6 py-4 font-bold text-xs">หัวข้อ / ข้อความ</th>
                <th className="px-6 py-4 text-center font-bold text-xs">Domain</th>
                <th className="px-6 py-4 text-center font-bold text-xs">Difficulty</th>
                {isResearchMode && (
                  <>
                    <th className="px-6 py-4 text-center font-bold text-xs">a (Discrim)</th>
                    <th className="px-6 py-4 text-center font-bold text-xs">b (Diff)</th>
                    <th className="px-6 py-4 text-center font-bold text-xs">c (Guess)</th>
                  </>
                )}
                <th className="px-6 py-4 text-center font-bold text-xs">Calibration</th>
                <th className="px-6 py-4 text-center font-bold text-xs">สถานะ IOC</th>
                <th className="px-6 py-4 text-right font-bold text-xs">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredQuestions.map(q => {
                const isCalibrated = q.active && q.validated; // Mock rule
                const hasIrt = isResearchMode && isCalibrated;

                return (
                  <tr key={q.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{q.id.slice(0,8)}...</td>
                    <td className="px-6 py-4">
                      <div className="text-white truncate max-w-[200px] sm:max-w-xs">{q.question_text}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-[#00e5ff]">{q.sub_domain_code}</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-400 capitalize">{q.difficulty}</td>
                    
                    {isResearchMode && (
                      <>
                        <td className="px-6 py-4 text-center font-mono text-slate-300">
                          {hasIrt ? '1.24' : <span className="text-slate-600">-</span>}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-slate-300">
                          {hasIrt ? (q.difficulty === 'easy' ? '-1.10' : '0.50') : <span className="text-slate-600">-</span>}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-slate-300">
                          {hasIrt ? '0.20' : <span className="text-slate-600">-</span>}
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 text-center">
                      {isCalibrated ? (
                        <span className="inline-flex items-center gap-1 text-[#00ff9d] text-[10px] font-bold bg-[#00ff9d]/10 px-2 py-1 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Calibrated
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">ยังไม่ได้ Calibration</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {q.validated !== false ? (
                        <span className="inline-flex items-center gap-1 text-[#00e5ff] text-[10px] font-bold bg-[#00e5ff]/10 px-2 py-1 rounded">
                          <ShieldCheck className="w-3 h-3" /> ผ่าน (0.8)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#ff3366] text-[10px] font-bold bg-[#ff3366]/10 px-2 py-1 rounded">
                          <ShieldAlert className="w-3 h-3" /> รอแก้ไข (0.3)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d1424] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#00ff9d]" /> เพิ่ม/แก้ไขข้อสอบ
              </h2>
              <button onClick={() => setShowEditor(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SECTION 1 & 2: Info & Question */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-[#00ff9d] mb-4">ข้อมูลข้อสอบ</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Sub-domain</label>
                        <select className="w-full px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.3)] border border-white/10 text-white text-sm">
                          <option>H1 - โครงสร้าง HTML พื้นฐาน</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Objective</label>
                        <input type="text" placeholder="ระบุจุดประสงค์..." className="w-full px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.3)] border border-white/10 text-white text-sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#00ff9d] mb-4">คำถาม</h3>
                    <textarea 
                      rows={4}
                      placeholder="พิมพ์ข้อความคำถามที่นี่..." 
                      className="w-full px-4 py-3 rounded-lg bg-[rgba(0,0,0,0.3)] border border-white/10 text-white text-sm resize-none"
                    />
                  </div>
                </div>

                {/* SECTION 3: Options */}
                <div>
                  <h3 className="text-sm font-bold text-[#00ff9d] mb-4">ตัวเลือก (Options)</h3>
                  <div className="space-y-3">
                    {['A', 'B', 'C', 'D'].map((opt, i) => (
                      <div key={opt} className="flex gap-3">
                        <label className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-lg border cursor-pointer transition-colors ${i === 0 ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-[#00ff9d]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                          <input type="radio" name="correct" className="hidden" defaultChecked={i === 0} />
                          <span className="font-bold">{opt}</span>
                        </label>
                        <input type="text" placeholder={`ตัวเลือก ${opt}`} className={`flex-1 px-4 py-2 rounded-lg bg-[rgba(0,0,0,0.3)] border ${i === 0 ? 'border-[#00ff9d]/50' : 'border-white/10'} text-white text-sm`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SECTION 4: Metadata */}
                <div>
                  <h3 className="text-sm font-bold text-slate-300 mb-4">Metadata</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Cognitive Level</label>
                      <select className="w-full px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.3)] border border-white/10 text-white text-sm">
                        <option>Understand</option>
                        <option>Apply</option>
                        <option>Analyze</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Difficulty (Initial)</label>
                      <select className="w-full px-3 py-2 rounded-lg bg-[rgba(0,0,0,0.3)] border border-white/10 text-white text-sm">
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 5: IRT */}
                <div>
                  <h3 className="text-sm font-bold text-slate-300 mb-4 flex justify-between items-center">
                    <span>IRT Parameters (3PL)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-slate-400">Read-only</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400 mb-4 italic">
                      "ค่า IRT จะถูกกำหนดจากกระบวนการ Calibration โดยอัตโนมัติ ไม่ควรกำหนดด้วยการคาดเดา"
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">a (Discrim)</label>
                        <div className="text-sm font-mono text-slate-600">-</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">b (Diff)</label>
                        <div className="text-sm font-mono text-slate-600">-</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">c (Guess)</label>
                        <div className="text-sm font-mono text-slate-600">-</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setShowEditor(false)} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                ยกเลิก
              </button>
              <button onClick={() => setShowEditor(false)} className="px-5 py-2 rounded-xl bg-[#00ff9d] text-black text-sm font-bold shadow-[0_0_15px_rgba(0,255,157,0.4)] hover:bg-[#00e5ff] transition-all">
                บันทึกข้อสอบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
