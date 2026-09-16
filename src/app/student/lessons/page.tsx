'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_UNITS } from '@/lib/mock-data';
import { SUB_DOMAINS, SubDomainCode } from '@/types/database';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Tv,
  Presentation,
  FileText,
  Terminal,
} from 'lucide-react';

export default function StudentLessonsListPage() {
  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <BookOpen className="w-4 h-4" />
          <span>หลักสูตรโครงสร้างภาษา HTML</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          หน่วยการเรียนรู้ 8 Sub-domain
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          ครอบคลุมทุกองค์ประกอบของโครงสร้างภาษา HTML สำหรับนักเรียน ปวช. พร้อมสไลด์การสอนและวิดีโอบรรยาย
        </p>
      </div>

      {/* Grid of 8 Units in Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_UNITS.map((unit) => {
          const domain = SUB_DOMAINS[unit.sub_domain_code as SubDomainCode];
          return (
            <div
              key={unit.id}
              className="liquid-card p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                    {unit.sub_domain_code}
                  </span>
                  <div className="flex items-center gap-2.5 text-slate-400 text-xs font-medium">
                    <span className="flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-lg">
                      <Presentation className="w-3.5 h-3.5 text-indigo-500" />
                      สไลด์
                    </span>
                    <span className="flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-lg">
                      <Tv className="w-3.5 h-3.5 text-violet-500" />
                      วิดีโอ
                    </span>
                    <span className="flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-lg">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" />
                      เอกสาร
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-normal">
                    {unit.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                <Link
                  href={`/student/codelab?subdomain=${unit.sub_domain_code}`}
                  className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  <span>ฝึกใน Code Lab</span>
                </Link>

                <Link
                  href={`/student/lessons/${unit.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <span>เข้าสู่บทเรียน</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
