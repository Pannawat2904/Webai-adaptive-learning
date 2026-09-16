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
  Award,
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Terminal,
  Layers,
} from 'lucide-react';

export default function StudentLearningProfilePage() {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<Record<string, SkillProfile>>(MOCK_STUDENT_SKILLS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('webai_student_skills');
      if (saved) setSkills(JSON.parse(saved));
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
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <BarChart3 className="w-4 h-4" />
          <span>Diagnostic Analytics & Learning Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          โปรไฟล์ความเชี่ยวชาญเฉพาะบุคคล (HTML Structure)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          ผลการวิเคราะห์ระดับความรู้ 8 Sub-domain โครงสร้างภาษา HTML ของ {profile.full_name}
        </p>
      </div>

      {/* Main Grid: 8-Axis Radar Chart + AI Diagnostics in Liquid Glass */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 8-Axis Radar Chart */}
        <div className="lg:col-span-6 liquid-glass rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between space-y-6">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>เรดาร์ความสามารถ 8 มิติ (H1 - H8)</span>
            </h2>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              0 - 100%
            </span>
          </div>

          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
            <svg width={size} height={size} className="overflow-visible">
              <defs>
                <linearGradient id="radarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
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
                stroke="#6366f1"
                strokeWidth="2.5"
                className="transition-all duration-700 filter drop-shadow-md"
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
                    r="4.5"
                    className="fill-indigo-600 stroke-white dark:stroke-slate-900 stroke-2"
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
                    className="text-[10px] font-black fill-slate-700 dark:fill-slate-300 font-mono"
                  >
                    {code} ({score}%)
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="w-full pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              &ge;80% ระดับสูง
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              60-79% ระดับดี
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              &lt;60% ควรพัฒนา
            </span>
          </div>
        </div>

        {/* Right: AI Diagnostic Summary & Recommendations */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  ข้อความสรุปและวิเคราะห์โดย AI Advisor
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  สังเคราะห์จากข้อมูลการทำข้อสอบ Adaptive และ Code Lab
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/80 dark:border-white/5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2.5">
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
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                แผนการเรียนเสริมเฉพาะบุคคล (Personalized Action Plan):
              </div>
              {weakDomains.map((code) => {
                const domain = SUB_DOMAINS[code];
                return (
                  <div
                    key={code}
                    className="p-3.5 rounded-2xl border border-amber-500/25 bg-amber-500/10 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>[{code}] {domain.name} ({skills[code]?.estimated_level ?? 0}%)</span>
                      </div>
                      <div className="text-[11px] text-amber-800/80 dark:text-amber-300 font-medium">
                        ทบทวนบทเรียนและทำแบบทดสอบซ้ำเพื่อยกระดับความเชี่ยวชาญ
                      </div>
                    </div>

                    <Link
                      href={`/student/assessment?type=re_test&subdomain=${code}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shrink-0 shadow-xs transition-all"
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

      {/* Sub-domain Detailed Breakdown Table */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
          ตารางรายละเอียดระดับความเชี่ยวชาญแยกราย Sub-domain
        </h2>

        <div className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
          {subDomainCodes.map((code) => {
            const domain = SUB_DOMAINS[code];
            const score = skills[code]?.estimated_level ?? 0;
            const isHigh = score >= 80;
            const isMedium = score >= 60 && score < 80;

            return (
              <div key={code} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                      {code}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {domain.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {domain.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="font-black text-sm text-slate-900 dark:text-white">
                      {score}%
                    </div>
                    <div
                      className={`text-[10px] font-bold ${
                        isHigh
                          ? 'text-emerald-600'
                          : isMedium
                          ? 'text-indigo-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {isHigh ? 'ระดับสูง' : isMedium ? 'ระดับดี' : 'ควรพัฒนา'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/student/lessons/u-${code.toLowerCase()}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white/60 dark:hover:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      อ่านบทเรียน
                    </Link>
                    <Link
                      href={`/student/assessment?type=re_test&subdomain=${code}`}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
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
