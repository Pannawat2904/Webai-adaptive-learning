'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_UNITS } from '@/lib/mock-data';
import {
  Code2,
  Tv,
  Presentation,
  FileText,
  Terminal,
  Play
} from 'lucide-react';

export default function StudentLessonsListPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 px-4 sm:px-6 lg:px-8 font-sans space-y-8">
      {/* Header */}
      <div className="space-y-2 mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1.5 rounded">
          <Terminal className="w-4 h-4" />
          <span>./หลักสูตร_HTML</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-800 dark:text-white mt-4">
          หน่วยการเรียนรู้ 8 Sub-domain
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-3xl mt-2">
          ครอบคลุมทุกองค์ประกอบของโครงสร้างภาษา HTML สำหรับนักเรียน ปวช. พร้อมสไลด์การสอนและวิดีโอบรรยาย
        </p>
      </div>

      {/* Vertical Stack List (IDE Window Aesthetics) */}
      <div className="flex flex-col gap-6 sm:gap-8 relative z-10">
        {MOCK_UNITS.map((unit) => {
          return (
            <div
              key={unit.id}
              className="group relative w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/15 hover:border-emerald-500/40 overflow-hidden"
            >
              {/* Editor Top Bar (macOS Window Control) */}
              <div className="bg-slate-100 dark:bg-[#0d1117] px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                {/* Mac Dots */}
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-inner"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-inner"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-inner"></div>
                </div>
                
                {/* File Name */}
                <div className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                  <Code2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>บทเรียน_{unit.sub_domain_code.toLowerCase()}.html</span>
                </div>
                
                <div className="w-12"></div> {/* Spacer to balance absolute center */}
              </div>

              {/* Editor Content Area */}
              <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative bg-white dark:bg-[#161b22]">
                
                {/* Subtle Background Grid (Graph Paper) */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>

                {/* Left Side: Unit Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 flex-1 relative z-10 w-full">
                  
                  {/* Syntax Highlighted HTML Tag Badge */}
                  <div className="font-mono text-xl sm:text-2xl font-black px-5 py-4 rounded-xl bg-slate-900 text-emerald-400 shadow-inner shrink-0 border border-slate-700/80 group-hover:bg-black transition-colors duration-300">
                    <span className="text-pink-500 font-normal">{'<'}</span>
                    {unit.sub_domain_code}
                    <span className="text-pink-500 font-normal">{'>'}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-tight font-sans tracking-tight">
                      {unit.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 font-medium max-w-2xl leading-relaxed flex items-start gap-2">
                      <span className="text-slate-400 dark:text-slate-600 font-mono text-xs mt-0.5 select-none">{'//'}</span>
                      <span>{unit.description}</span>
                    </p>
                  </div>
                </div>

                {/* Right Side: Actions & Badges */}
                <div className="mt-6 md:mt-0 flex flex-col md:items-end gap-5 shrink-0 relative z-10 w-full md:w-auto">
                  
                  {/* Resource Files (Styled like file attachments) */}
                  <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400 text-[10px] font-bold font-mono">
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0d1117] px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
                      <Presentation className="w-3.5 h-3.5 text-blue-500" />
                      slide.ppt
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0d1117] px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
                      <Tv className="w-3.5 h-3.5 text-purple-500" />
                      video.mp4
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0d1117] px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
                      <FileText className="w-3.5 h-3.5 text-orange-500" />
                      doc.pdf
                    </span>
                  </div>

                  {/* Actions (Terminal / Execute) */}
                  <div className="flex flex-row items-center justify-between md:justify-end gap-6 w-full pt-1">
                    <Link
                      href={`/student/codelab?subdomain=${unit.sub_domain_code}`}
                      className="text-[11px] font-mono font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors group/lab"
                    >
                      <Terminal className="w-4 h-4 text-emerald-500 group-hover/lab:animate-pulse" />
                      <span className="border-b border-dashed border-slate-300 dark:border-slate-600 group-hover/lab:border-emerald-500 pb-0.5">เข้าห้องปฏิบัติการ()</span>
                    </Link>

                    <Link
                      href={`/student/lessons/${unit.id}`}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-lg shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <span>เข้าสู่บทเรียน</span>
                      <Play className="w-3.5 h-3.5 fill-emerald-400 dark:fill-white group-hover:fill-white transition-colors" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
