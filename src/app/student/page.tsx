'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SUB_DOMAINS, SubDomainCode, SkillProfile, Recommendation } from '@/types/database';
import {
  MOCK_UNITS,
  MOCK_STUDENT_SKILLS,
  MOCK_RECOMMENDATIONS,
} from '@/lib/mock-data';
import {
  BookOpen,
  BrainCircuit,
  Terminal,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Award,
  ChevronRight,
  Compass,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<Record<string, SkillProfile>>(MOCK_STUDENT_SKILLS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(MOCK_RECOMMENDATIONS);

  useEffect(() => {
    try {
      const savedSkills = localStorage.getItem('webai_student_skills');
      if (savedSkills) setSkills(JSON.parse(savedSkills));
      const savedRecs = localStorage.getItem('webai_student_recommendations');
      if (savedRecs) setRecommendations(JSON.parse(savedRecs));
    } catch {
      // ignore
    }
  }, []);

  const subDomainKeys = Object.keys(SUB_DOMAINS) as SubDomainCode[];

  // Calculate overall mastery
  const skillValues = Object.values(skills);
  const avgLevel =
    skillValues.length > 0
      ? Math.round(
          skillValues.reduce((acc, curr) => acc + Number(curr.estimated_level), 0) /
            skillValues.length
        )
      : 0;

  const weakDomains = subDomainKeys.filter(
    (code) => (skills[code]?.estimated_level ?? 0) < 60
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-4">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>พื้นที่การเรียนรู้เฉพาะบุคคลของคุณ</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            สวัสดี, {profile.full_name} 👋
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            ยินดีต้อนรับสู่ระบบเรียนรู้โครงสร้างภาษา HTML สำหรับนักเรียน ปวช.
            ระบบได้ปรับแต่งเส้นทางการเรียนรู้และแบบทดสอบให้เหมาะสมกับระดับความสามารถของคุณ
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/student/assessment"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>ทำแบบประเมิน Adaptive Test</span>
            </Link>
            <Link
              href="/student/codelab"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl liquid-glass text-slate-700 dark:text-slate-200 font-bold text-xs hover:text-indigo-600 hover:-translate-y-0.5 transition-all"
            >
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>เข้าสู่ Code Lab ฝึกเขียนโค้ด</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards in Liquid Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="liquid-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">ระดับความเชี่ยวชาญเฉลี่ย</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {avgLevel}%
            </div>
            <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              {avgLevel >= 80 ? 'ระดับสูง (เกณฑ์ดีเยี่ยม)' : avgLevel >= 60 ? 'ระดับดี (พัฒนาบางจุด)' : 'ควรพัฒนาเพิ่มเติม'}
            </div>
          </div>
        </div>

        <div className="liquid-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">หน่วยการเรียนรู้โครงสร้าง HTML</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              8 / 8
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              ครบทุกหัวข้อ พร้อมให้เรียน
            </div>
          </div>
        </div>

        <div className="liquid-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">หัวข้อที่แนะนำให้พัฒนาเพิ่ม</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {weakDomains.length} หัวข้อ
            </div>
            <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">
              {weakDomains.length > 0 ? `เน้น ${weakDomains.join(', ')}` : 'ความรู้พื้นฐานแน่นพร้อมสอบ'}
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations Section (การ์ดแนะนำสำหรับคุณ) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              แนะนำสำหรับคุณ
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            อิงจากผลการเรียนล่าสุดของคุณ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => {
            const domain = SUB_DOMAINS[rec.sub_domain_code as SubDomainCode];
            const isRetest = rec.resource_type === 're_test';
            const isCodeLab = rec.resource_type === 'code_lab';

            return (
              <div
                key={rec.id}
                className="liquid-card p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                      {rec.sub_domain_code} • {domain?.name}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        isRetest
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : isCodeLab
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {isRetest ? 'ทดสอบซ้ำ' : isCodeLab ? 'ฝึกใน Code Lab' : 'ทบทวนบทเรียน'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {rec.reason}
                  </p>
                </div>

                <Link
                  href={rec.action_url || '/student/lessons'}
                  className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-xs font-bold group transition-all"
                >
                  <span>{isRetest ? 'เริ่มทดสอบซ้ำทันที' : isCodeLab ? 'เปิดโจทย์ฝึกปฏิบัติ' : 'อ่านบทเรียนและดูสื่อ'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 Sub-domain Skill Level Bars */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-600"></div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              ความเชี่ยวชาญแยกตามหัวข้อโครงสร้าง HTML
            </h2>
          </div>
          <Link
            href="/student/profile"
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>ดู Learning Profile 8 มิติ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subDomainKeys.map((code) => {
            const domain = SUB_DOMAINS[code];
            const score = skills[code]?.estimated_level ?? 0;

            const isHigh = score >= 80;
            const isMedium = score >= 60 && score < 80;

            const barColor = isHigh
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
              : isMedium
              ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
              : 'bg-gradient-to-r from-amber-500 to-orange-500';

            const statusText = isHigh
              ? 'ระดับสูง'
              : isMedium
              ? 'ระดับดี'
              : 'ควรพัฒนา';

            return (
              <div
                key={code}
                className="liquid-card p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      [{code}]
                    </span>
                    <span>{domain.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white">
                      {score}%
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isHigh
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : isMedium
                          ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {statusText}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[220px]">{domain.description}</span>
                  <Link
                    href={`/student/lessons/u-${code.toLowerCase()}`}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline shrink-0 ml-2"
                  >
                    เรียนหน่วยนี้
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 Units Grid in Liquid Glass */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              บทเรียนและสื่อการสอนทั้ง 8 หน่วย
            </h2>
          </div>
          <Link
            href="/student/lessons"
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>ดูทั้งหมด</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_UNITS.map((unit) => (
            <Link
              key={unit.id}
              href={`/student/lessons/${unit.id}`}
              className="liquid-card p-5 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                    {unit.sub_domain_code}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    พร้อมเรียน
                  </span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {unit.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                  {unit.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                <span>เปิดบทเรียน</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
