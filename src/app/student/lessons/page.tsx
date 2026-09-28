'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUnits, subscribeToDatabase } from '@/lib/database-service';
import { Unit } from '@/types/database';
import {
  getCourseProgress,
  ALL_UNIT_IDS,
  subscribeToProgress,
} from '@/lib/progress-service';
import {
  Zap,
  Lock,
  CheckCircle2,
  Terminal,
  FileCode,
  Globe,
  LayoutTemplate,
  FormInput,
  Cpu,
  Gamepad2,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

const SUBDOMAIN_ICONS: Record<string, React.ElementType> = {
  H1: Globe,
  H2: FileCode,
  H3: LayoutTemplate,
  H4: Cpu,
  H5: FormInput,
};

export default function StudentJourneyPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [courseProgress, setCourseProgress] = useState(getCourseProgress());

  const loadData = () => {
    setUnits(getUnits());
    setCourseProgress(getCourseProgress());
  };

  useEffect(() => {
    loadData();
    const unsubDb = subscribeToDatabase((event) => {
      if (event.type === 'unit' || event.type === 'reset') {
        loadData();
      }
    });
    const unsubProg = subscribeToProgress(() => {
      setCourseProgress(getCourseProgress());
    });
    return () => {
      unsubDb();
      unsubProg();
    };
  }, []);

  const completedLessons = courseProgress.completed_lessons || [];
  const allLessonsDone = ALL_UNIT_IDS.every((id) => completedLessons.includes(id));
  const completedCount = completedLessons.length;
  const progressPct = Math.min(100, Math.round((completedCount / (units.length || 5)) * 100));

  return (
    <div className="main-inner enter max-w-[900px] mx-auto pb-16">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap gap-2 items-center justify-between mb-6">
        <span className="flex items-center gap-2 text-sm font-bold text-muted bg-surface px-4 py-2 rounded-full border border-line">
          <Terminal className="w-4 h-4 text-primary" /> ~/ขั้นตอนที่ 2: บทเรียน HTML
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted">
            ความคืบหน้า {completedCount} / {units.length || 5} บท ({progressPct}%)
          </span>
          <div className="bar w-28 sm:w-36">
            <span style={{ width: `${progressPct}%` }}></span>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black text-ink mb-2">
          เส้นทางการเรียนรู้บทเรียน HTML<span className="text-primary">.</span>
        </h1>
        <p className="text-muted text-sm max-w-xl mx-auto">
          ศึกษาเนื้อหาสไลด์การสอนให้ครบทั้ง 5 หน่วยการเรียนรู้ เมื่อเรียนครบทุกบทแล้ว ระบบจะปลดล็อกขั้นตอนที่ 3: เกมกู้เว็บพัง ให้อัตโนมัติ
        </p>
      </div>

      {/* Progress & Game Unlock Banner */}
      {allLessonsDone ? (
        <div className="card p-6 bg-gradient-to-r from-emerald-500/15 via-primary/10 to-indigo-500/15 border-2 border-emerald-500/30 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                <span>🎉 ยินดีด้วย! คุณเรียนจบเนื้อหาครบทั้ง 5 บทเรียนแล้ว</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                ปลดล็อกขั้นตอนที่ 3: เกมกู้เว็บพัง เรียบร้อยแล้ว พร้อมฝึกทักษะการซ่อมโค้ดแล้ว
              </p>
            </div>
          </div>
          <Link
            href="/student/game"
            className="btn btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white border-none ring-2 ring-emerald-500/40"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>เข้าสู่เกมกู้เว็บพัง (Step 3) ➔</span>
          </Link>
        </div>
      ) : (
        <div className="card p-4 sm:p-5 bg-surface/90 border border-line rounded-2xl shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted font-bold uppercase tracking-wider mb-0.5">
                เงื่อนไขการปลดล็อกเกมกู้เว็บพัง (Step 3)
              </div>
              <div className="text-sm font-bold text-ink">
                เรียนสำเร็จแล้ว <span className="text-primary font-mono">{completedCount}</span> / 5 บทเรียน
                {completedCount < 5 && (
                  <span className="text-xs font-normal text-muted ml-2">
                    (เหลืออีก {5 - completedCount} บทเรียน)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-48 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-muted">
              <span>ความคืบหน้ารวม</span>
              <span className="font-bold text-primary">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-line rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Visual Journey Path */}
      <div className="relative py-4">
        {/* The continuous line connecting nodes */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-line -translate-x-1/2 hidden md:block"></div>
        <div className="absolute left-[36px] top-0 bottom-0 w-1 bg-line md:hidden"></div>

        <div className="flex flex-col gap-8 md:gap-4 relative z-10">
          <div className="flex items-center justify-start md:justify-center mb-4">
            <div className="bg-surface border border-line px-4 py-2 rounded-full text-xs font-bold font-mono tracking-widest text-muted z-10 md:mr-0 ml-[10px] md:ml-0 shadow-2xs">
              จุดเริ่มต้นบทเรียน
            </div>
          </div>

          {units.map((unit, index) => {
            const isLeft = index % 2 === 0;
            const Icon = SUBDOMAIN_ICONS[unit.sub_domain_code] || Globe;

            // Dynamic progression status based on actual student slide viewing
            const isDone = completedLessons.includes(unit.id);
            const isAvailable = index === 0 || completedLessons.includes(units[index - 1]?.id);

            let status: 'mastered' | 'progress' | 'available' = 'available';
            if (isDone) {
              status = 'mastered';
            } else if (isAvailable) {
              status = 'progress';
            }

            let lineGlow = '';
            if (status === 'mastered') {
              lineGlow = 'drop-shadow-[0_0_10px_var(--success)]';
            } else if (status === 'progress') {
              lineGlow = 'drop-shadow-[0_0_15px_var(--primary)]';
            }

            return (
              <div
                key={unit.id}
                className={`flex flex-col md:flex-row items-center w-full ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Node Card */}
                <div className="w-full md:w-1/2 flex px-4 md:px-12 pl-16 md:pl-12">
                  <Link
                    href={`/student/lessons/${unit.id}`}
                    className={`w-full card p-5 relative border-2 card-hover cursor-pointer transition-all ${
                      status === 'mastered'
                        ? 'border-emerald-500/40 bg-emerald-500/[0.03] shadow-xs'
                        : status === 'progress'
                        ? 'border-primary shadow-[0_0_20px_var(--primary-dim)] bg-primary/[0.02]'
                        : 'border-line opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-mono text-[10px] font-bold text-muted uppercase tracking-widest">
                        {unit.sub_domain_code}
                      </span>
                      {status === 'mastered' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>สำเร็จแล้ว ✓</span>
                        </span>
                      )}
                      {status === 'progress' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 text-[11px] font-bold">
                          <Zap className="w-3.5 h-3.5 animate-pulse" />
                          <span>กำลังเรียน</span>
                        </span>
                      )}
                      {status === 'available' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-line/60 text-muted text-[10px] font-mono">
                          <span>รอเรียน</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-ink text-base mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
                      <span>{unit.title}</span>
                      <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {unit.description}
                    </p>
                  </Link>
                </div>

                {/* Central Node Badge */}
                <div className="absolute left-[36px] md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${lineGlow} z-20 ${
                      status === 'mastered'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                        : status === 'progress'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-line bg-surface text-muted'
                    }`}
                  >
                    {status === 'mastered' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Spacer */}
                <div className="w-full md:w-1/2 hidden md:block"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
