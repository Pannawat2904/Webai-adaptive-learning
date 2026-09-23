'use client';

import React, { useState } from 'react';
import { MOCK_TEST_SESSIONS } from '@/lib/mock-sessions';
import { SUB_DOMAINS } from '@/types/database';
import {
  Activity,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Download,
  Terminal
} from 'lucide-react';
import { useTeacherContext } from '@/components/teacher/TeacherContext';

export default function AdaptiveLogsPage() {
  const { isResearchMode } = useTeacherContext();
  const [sessions] = useState(MOCK_TEST_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState(MOCK_TEST_SESSIONS[0].id);

  const activeSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];
  const attempts = activeSession?.attempts || [];

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter max-w-[1200px] mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-[#00ff9d]" />
            CAT Monitoring
          </h1>
          <p className="text-sm text-slate-400">
            ติดตามพฤติกรรมการทดสอบและวิเคราะห์ผลแบบปรับเหมาะ (Adaptive Testing)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-white/5 text-white text-sm font-bold hover:bg-white/10 flex items-center gap-2 transition-all">
            <Download className="w-4 h-4" /> ส่งออกข้อมูล (CSV)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Session Selector & Summary */}
        <div className="space-y-6">
          <div className="card p-6">
            <label className="block text-xs font-bold text-[#00ff9d] uppercase tracking-wider mb-2">เลือกผู้เรียน (Session)</label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(16,22,38,0.6)] border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-[#00ff9d] appearance-none"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.student_name || s.student_id} ({s.score_percentage}%)
                </option>
              ))}
            </select>
          </div>

          <div className="card space-y-4">
            <div className="card-head pb-0">
              <h3>ข้อมูล Session</h3>
            </div>
            <div className="card-body pt-0 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">ผู้เรียน</span>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-[#00e5ff]" />
                  <span className="font-bold text-white">{activeSession?.student_name}</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">วันที่ทดสอบ</span>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-[#00e5ff]" />
                  <span className="font-bold text-white">{new Date(activeSession.start_at).toLocaleString('th-TH')}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">จำนวนข้อ</span>
                  <div className="text-xl font-black text-white mt-1">{activeSession.total_questions}</div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">ความสามารถ (θ)</span>
                  <div className="text-xl font-black text-[#00ff9d] mt-1">
                    {((activeSession.score_percentage / 100) * 6 - 3).toFixed(2)}
                  </div>
                </div>
              </div>
              
              {activeSession.stop_reason && (
                <div className="mt-4 p-3 rounded-xl bg-[rgba(176,92,255,0.1)] border border-[rgba(176,92,255,0.2)]">
                  <span className="text-[10px] font-bold text-[#b05cff] uppercase">เหตุผลการยุติ (Stop Rule)</span>
                  <p className="text-xs text-white mt-1">{activeSession.stop_reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Item Sequence */}
        <div className="lg:col-span-3 card p-0 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">ลำดับการตอบ (Item Sequence)</h3>
            {isResearchMode && (
              <span className="px-2 py-1 rounded bg-[rgba(176,92,255,0.1)] text-[#b05cff] text-[10px] font-bold uppercase">
                Research Mode Active
              </span>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[rgba(255,255,255,0.02)] text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs">ข้อที่</th>
                  <th className="px-6 py-4 font-bold text-xs">Domain</th>
                  <th className="px-6 py-4 text-center font-bold text-xs">ผลตอบ</th>
                  
                  {/* Research Mode Columns */}
                  {isResearchMode && (
                    <>
                      <th className="px-6 py-4 text-center font-bold text-xs">Difficulty (b)</th>
                      <th className="px-6 py-4 text-center font-bold text-xs">θ ก่อนตอบ</th>
                      <th className="px-6 py-4 text-center font-bold text-xs">θ หลังตอบ</th>
                      <th className="px-6 py-4 text-center font-bold text-xs">SE</th>
                      <th className="px-6 py-4 font-bold text-xs">Algorithm Decision</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {attempts.map((att) => {
                  return (
                    <tr key={att.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-6 py-4 font-bold text-white text-center w-16">{att.sequence}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                          {att.sub_domain_code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {att.correct ? (
                          <span className="inline-flex items-center gap-1 text-[#00ff9d] font-bold">
                            <CheckCircle2 className="w-4 h-4" /> ถูก
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#ffaa00] font-bold">
                            <XCircle className="w-4 h-4" /> ผิด
                          </span>
                        )}
                      </td>
                      
                      {isResearchMode && (
                        <>
                          <td className="px-6 py-4 text-center font-mono text-slate-300">
                            {att.difficulty === 'hard' ? '1.50' : att.difficulty === 'medium' ? '0.00' : '-1.50'}
                          </td>
                          <td className="px-6 py-4 text-center font-mono text-slate-400">0.00</td>
                          <td className="px-6 py-4 text-center font-mono text-[#00e5ff] font-bold">
                            {att.correct ? '+0.45' : '-0.30'}
                          </td>
                          <td className="px-6 py-4 text-center font-mono text-slate-400">
                            {(0.5 - (att.sequence * 0.02)).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-[10px] text-slate-400 whitespace-normal min-w-[200px]">
                            {att.selection_reason}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
