'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUnits, subscribeToDatabase } from '@/lib/database-service';
import { Unit } from '@/types/database';
import {
  getUnitProgress,
  subscribeToProgress,
  isCourseStepUnlocked,
  getCourseProgress,
} from '@/lib/progress-service';
import { UnitPathStepper } from '@/components/UnitPathStepper';
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
  BookOpen,
  ClipboardList,
  Play,
  Gamepad2,
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
  const [courseProgress, setCourseProgress] = useState(() => getCourseProgress());

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
    const unsubProgress = subscribeToProgress(() => {
      loadData();
    });
    return () => {
      unsubDb();
      unsubProgress();
    };
  }, []);

  const isLessonsUnlocked = isCourseStepUnlocked('lessons');

  return (
    <div className="main-inner enter max-w-[900px] mx-auto pt-4">
      {/* 5-Step Course Stepper */}
      <UnitPathStepper currentStep="lessons" />

      {/* Gated Screen if Pre-test is not completed yet */}
      {!isLessonsUnlocked ? (
        <div className="card p-8 sm:p-10 text-center border-amber-500/30 bg-amber-500/5 shadow-lg my-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink mb-2">
            ขั้นตอนที่ 2: บทเรียนยังไม่ปลดล็อก
          </h2>
          <p className="text-sm text-muted mb-6 max-w-lg mx-auto leading-relaxed">
            ตามลำดับการเรียนรู้แบบต่อเนื่อง (Sequential Gating) คุณต้องทำแบบทดสอบก่อนเรียน (Step 1: Pre-test) เพื่อวัดความรู้พื้นฐานภาพรวมของภาษา HTML ก่อน จึงจะสามารถเข้าสู่เนื้อหาบทเรียนได้
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/student/assessment?type=pre_test"
              className="btn btn-primary px-6 py-3 font-bold text-sm shadow-md"
            >
              <Play className="w-4 h-4 mr-1.5" />
              <span>เริ่มทำแบบทดสอบก่อนเรียน (Step 1: Pre-test) &rarr;</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3.5 py-1.5 rounded-full mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>ขั้นตอนที่ 2: บทเรียนและแบบฝึกหัด (HTML Curriculum)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink mb-2">
              หน่วยการเรียนรู้ภาษา HTML<span className="text-primary">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
              เลือกศึกษาเนื้อหาย่อยแต่ละหน่วยตามลำดับ พร้อมรับชมสไลด์ วิดีโอ และทำแบบฝึกหัดท้ายหน่วย
            </p>
          </div>

          {/* Visual Journey Path */}
          <div className="relative py-4">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-line -translate-x-1/2 hidden md:block"></div>
            <div className="absolute left-[36px] top-0 bottom-0 w-1 bg-line md:hidden"></div>

            <div className="flex flex-col gap-6 md:gap-4 relative z-10">
              <div className="flex items-center justify-start md:justify-center mb-2">
                <div className="bg-surface border border-line px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-widest text-muted z-10 md:mr-0 ml-[10px] md:ml-0">
                  จุดเริ่มต้นบทเรียน
                </div>
              </div>

              {units.map((unit, index) => {
                const isLeft = index % 2 === 0;
                const Icon = SUBDOMAIN_ICONS[unit.sub_domain_code] || Globe;
                const progress = getUnitProgress(unit.id);
                const isCompleted = progress.lesson_done || progress.unit_quiz_done;

                let statusClass = 'border-line hover:border-primary/50';
                if (isCompleted) {
                  statusClass = 'border-emerald-500/50 bg-emerald-500/5';
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
                        className={`w-full card p-5 relative border-2 card-hover cursor-pointer transition-all ${statusClass}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-[10px] font-bold text-muted uppercase tracking-widest">
                            {unit.sub_domain_code}
                          </span>
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>ศึกษาแล้ว</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>พร้อมเรียน</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-ink text-base mb-1.5 group-hover:text-primary transition-colors">
                          {unit.title}
                        </h3>
                        <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-3">
                          {unit.description}
                        </p>

                        <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
                          <span className="text-primary font-semibold flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>สไลด์ • วิดีโอ • แบบฝึกหัด</span>
                          </span>
                          <span className="font-mono text-[11px] text-muted flex items-center gap-1">
                            <span>เข้าเรียน</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    </div>

                    {/* Central Node Badge */}
                    <div className="absolute left-[36px] md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                      <div
                        className={`w-10 h-10 rounded-full border-2 bg-surface flex items-center justify-center z-20 ${
                          isCompleted
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-line text-primary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="w-full md:w-1/2 hidden md:block"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Step CTA: Go to Game */}
          <div className="mt-8 p-6 card border-2 border-indigo-500/30 bg-indigo-500/5 text-center rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="font-bold text-ink text-sm sm:text-base flex items-center gap-2 mb-1">
                <Gamepad2 className="w-5 h-5 text-indigo-600" />
                <span>ขั้นตอนถัดไป: เกมกู้เว็บพัง (HTML5 Code Rescue)</span>
              </h3>
              <p className="text-xs text-muted m-0">
                เมื่อศึกษาเนื้อหาและทำความเข้าใจแล้ว สามารถไปทดสอบทักษะผ่านเกมเขียนโค้ดได้ทันที
              </p>
            </div>
            <Link
              href="/student/game"
              className="btn btn-primary px-5 py-2.5 text-xs font-bold shrink-0 shadow-md flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>ไปเล่นเกมกู้เว็บพัง (Step 3) &rarr;</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
