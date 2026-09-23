'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SUB_DOMAINS, SubDomainCode, SkillProfile } from '@/types/database';
import { MOCK_STUDENT_SKILLS } from '@/lib/mock-data';
import {
  BarChart3,
  TrendingUp,
  RotateCcw,
  Sparkles,
  AlertCircle,
  LayoutDashboard,
  User
} from 'lucide-react';

export default function StudentLearningProfilePage() {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<Record<string, SkillProfile>>(MOCK_STUDENT_SKILLS);
  const [irtTheta, setIrtTheta] = useState<number | null>(null);
  const [irtSE, setIrtSE] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('webai_student_skills');
      if (saved) setSkills(JSON.parse(saved));
      
      const t = localStorage.getItem('webai_irt_theta');
      const se = localStorage.getItem('webai_irt_se');
      if (t) setIrtTheta(parseFloat(t));
      if (se) setIrtSE(parseFloat(se));
    } catch {
      // ignore
    }
  }, []);

  const subDomainCodes: SubDomainCode[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];

  // Radar Chart Math (8 vertices)
  const size = 340;
  const center = size / 2;
  const radius = center - 50;

  const getCoordinates = (index: number, valuePercentage: number) => {
    const angle = (Math.PI * 2 / 8) * index - Math.PI / 2;
    const r = (radius * valuePercentage) / 100;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = subDomainCodes
    .map((code, idx) => {
      const score = skills[code]?.estimated_level ?? 50;
      const { x, y } = getCoordinates(idx, score);
      return `${x},${y}`;
    })
    .join(' ');

  // Identify strengths and weaknesses
  const weakDomains = subDomainCodes.filter(
    (code) => (skills[code]?.estimated_level ?? 0) < 60
  );

  const strongDomains = subDomainCodes.filter(
    (code) => (skills[code]?.estimated_level ?? 0) >= 80
  );

  return (
    <div className="space-y-6 pb-16 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
          <BarChart3 className="w-4 h-4" />
          <span>Diagnostic Analytics & Learning Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          โปรไฟล์ความเชี่ยวชาญเฉพาะบุคคล (HTML Structure)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          ผลการวิเคราะห์ระดับความรู้ 8 Sub-domain โครงสร้างภาษา HTML ของ {profile.full_name || 'ผู้ใช้'}
        </p>
      </div>

      {/* IRT Overall Ability */}
      {irtTheta !== null && irtSE !== null && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
              <User className="w-5 h-5" /> 
              IRT Overall Ability (ระดับความสามารถรวม)
            </h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-500">
              ค่าจากการประมาณความสามารถของผู้เรียน (Theta, θ) ตามแบบจำลอง 3PL CAT
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center min-w-[120px] shadow-sm">
              <div className="text-xs font-bold text-slate-500 mb-1">ความสามารถ (θ)</div>
              <div className="text-2xl font-black text-emerald-600">{irtTheta.toFixed(2)}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center min-w-[120px] shadow-sm">
              <div className="text-xs font-bold text-slate-500 mb-1">คลาดเคลื่อน (SE)</div>
              <div className="text-2xl font-black text-emerald-600">{irtSE.toFixed(3)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: 8-Axis Radar Chart + AI Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 8-Axis Radar Chart */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center space-y-6">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>เรดาร์ความสามารถ 8 มิติ</span>
            </h2>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              0 - 100%
            </span>
          </div>

          <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
            <svg width={size} height={size} className="overflow-visible">
              <defs>
                <linearGradient id="radarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Background web circles */}
              {[25, 50, 75, 100].map((ring) => {
                const ringPoints = subDomainCodes
                  .map((_, idx) => {
                    const { x, y } = getCoordinates(idx, ring);
                    return `${x},${y}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={ring}
                    points={ringPoints}
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="1"
                    strokeDasharray={ring === 100 ? 'none' : '3,3'}
                  />
                );
              })}

              {/* Axis lines */}
              {subDomainCodes.map((_, idx) => {
                const { x, y } = getCoordinates(idx, 100);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Student Polygon with Glowing Fill */}
              <polygon
                points={polygonPoints}
                fill="url(#radarGlow)"
                stroke="#2563eb"
                strokeWidth="2.5"
                className="transition-all duration-700 filter drop-shadow-sm"
              />

              {/* Data points */}
              {subDomainCodes.map((code, idx) => {
                const score = skills[code]?.estimated_level ?? 50;
                const { x, y } = getCoordinates(idx, score);
                return (
                  <circle
                    key={code}
                    cx={x}
                    cy={y}
                    r="4"
                    className="fill-blue-600 stroke-white dark:stroke-slate-900 stroke-2"
                  />
                );
              })}

              {/* Vertex Labels */}
              {subDomainCodes.map((code, idx) => {
                const { x, y } = getCoordinates(idx, 120);
                const score = skills[code]?.estimated_level ?? 0;
                return (
                  <text
                    key={code}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[10px] font-black fill-slate-600 dark:fill-slate-400 font-mono"
                  >
                    {code} ({score}%)
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>&ge;80%</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>60-79%</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>&lt;60%</span>
          </div>
        </div>

        {/* Right: AI Diagnostic Summary & Recommendations */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex-1 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900 dark:text-white">ข้อความสรุปและวิเคราะห์โดย AI Advisor</h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">สังเคราะห์จากข้อมูลการทำข้อสอบ Adaptive</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              <p>
                <strong>จุดเด่นของคุณ:</strong> มีความเชี่ยวชาญระดับสูงในหัวข้อ{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {strongDomains.map((c) => `${c} (${SUB_DOMAINS[c].name})`).join(', ') || 'โครงสร้างเอกสารพื้นฐาน'}
                </span>{' '}
                สามารถจัดลำดับ Heading h1-h6 และเขียนโครงสร้าง HTML5 ได้ถูกต้องตามข้อกำหนดสากล
              </p>
              {weakDomains.length > 0 ? (
                <p>
                  <strong>จุดที่ควรเสริมสร้าง:</strong> ยังพบข้อผิดพลาดในหัวข้อ{' '}
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    {weakDomains.map((c) => `${c} (${SUB_DOMAINS[c].name} ${skills[c]?.estimated_level ?? 0}%)`).join(', ')}
                  </span>{' '}
                  โดยเฉพาะเรื่องการใช้ colspan/rowspan ในตาราง และการจับคู่ label กับ input ในแบบฟอร์ม
                </p>
              ) : (
                <p className="text-emerald-600 font-semibold">
                  ยินดีด้วยครับ! คุณมีทักษะผ่านเกณฑ์มาตรฐานครบทั้ง 8 Sub-domain พร้อมสำหรับการทดสอบรวม
                </p>
              )}
            </div>

            {/* Personalized Action Plan */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                แผนการเรียนเสริมเฉพาะบุคคล (Personalized Action Plan):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {weakDomains.map((code) => {
                  const domain = SUB_DOMAINS[code];
                  return (
                    <div
                      key={code}
                      className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 flex flex-col gap-3"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>[{code}] {domain.name} ({skills[code]?.estimated_level ?? 0}%)</span>
                        </div>
                        <div className="text-[11px] text-amber-700 dark:text-amber-400">
                          ทบทวนบทเรียนและทำแบบทดสอบซ้ำเพื่อยกระดับความเชี่ยวชาญ
                        </div>
                      </div>

                      <Link
                        href={`/student/assessment?type=re_test&subdomain=${code}`}
                        className="flex justify-center items-center gap-1.5 w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>ทดสอบซ้ำ</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-test vs Post-test Longitudinal Evaluation with Cohen's d */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>พัฒนาการรายบุคคลและขนาดอิทธิพล (Cohen&apos;s d Effect Size)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              เปรียบเทียบผลสัมฤทธิ์ก่อนเรียนและหลังเรียนด้วยระบบการเรียนรู้แบบปรับเหมาะเฉพาะบุคคล
            </p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center sm:text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase">ค่า Effect Size ของคุณ</span>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-400">d = 1.65</div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">ระดับมาก (&ge; 0.80)</span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase">คะแนนก่อนเรียน (Pre-test)</span>
            <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">45%</div>
            <p className="text-[11px] text-slate-500 mt-1">ทดสอบครั้งแรกเพื่อวินิจฉัย</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase">คะแนนปัจจุบัน / หลังเรียน</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">75%</div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">คะแนนเฉลี่ย 8 Sub-domain</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase">พัฒนาการที่เพิ่มขึ้น (Gain)</span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-5 h-5" />+30%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">การเปลี่ยนแปลงของทักษะความรู้</p>
          </div>
        </div>

        {/* Academic Interpretation Alert */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          <div className="font-bold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />คำอธิบายเกณฑ์วิจัยทางการศึกษา:
          </div>
          <p>
            ค่าขนาดอิทธิพล Cohen&apos;s d = 1.65 ของคุณอยู่ในเกณฑ์ <strong>&quot;ระดับมาก (Large Effect: d &ge; 0.80)&quot;</strong> แสดงให้เห็นว่าการเรียนรู้ผ่านเนื้อหาปรับเหมาะเฉพาะบุคคลและการจำลองโค้ด (Code Lab) ช่วยยกระดับความสามารถในการเข้าใจโครงสร้างภาษา HTML ได้อย่างมีนัยสำคัญเชิงปฏิบัติสูงมาก
          </p>
        </div>
      </div>

      {/* Sub-domain Detailed Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-blue-600" />
          ตารางรายละเอียดระดับความเชี่ยวชาญแยกราย Sub-domain
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {subDomainCodes.map((code) => {
            const domain = SUB_DOMAINS[code];
            const score = skills[code]?.estimated_level ?? 0;
            const isHigh = score >= 80;
            const isMedium = score >= 60 && score < 80;

            return (
              <div key={code} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {code}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {domain.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {domain.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <div className="font-black text-sm text-slate-900 dark:text-white">{score}%</div>
                    <div
                      className={`text-[10px] font-bold ${
                        isHigh
                          ? 'text-emerald-600'
                          : isMedium
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {isHigh ? 'ระดับสูง' : isMedium ? 'ระดับดี' : 'ควรพัฒนา'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/student/lessons/u-${code.toLowerCase()}`}
                      className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      อ่านบทเรียน
                    </Link>
                    <Link
                      href={`/student/assessment?type=re_test&subdomain=${code}`}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                    >
                      ทดสอบซ้ำ
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
