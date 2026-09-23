'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_UNITS } from '@/lib/mock-data';
import { SUB_DOMAINS, SubDomainCode } from '@/types/database';
import {
  Code2,
  Tv,
  Presentation,
  FileText,
  Terminal,
  Play,
  ArrowRight,
  Zap,
  Lock
} from 'lucide-react';

export default function StudentLessonsListPage() {
  return (
    <div className="main-inner enter">
      <div className="topline flex flex-wrap gap-2 items-center justify-between">
        <span className="path-pill"><Terminal className="w-3.5 h-3.5" />~/หลักสูตร_HTML</span>
        <span className="chip chip-line chip-mono hidden sm:inline-flex">5 / 8 หน่วยเรียนจบแล้ว</span>
      </div>

      <div className="page-heading">
        <h1>หน่วยการเรียนรู้ทั้ง 8 หัวข้อ<span className="accent">.</span></h1>
        <p>ครอบคลุมทุกองค์ประกอบของโครงสร้างภาษา HTML สำหรับนักเรียน ปวช. พร้อมสไลด์การสอน วิดีโอ และเอกสารประกอบ</p>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_UNITS.map((unit, index) => {
          // Using mock logic to simulate progress state based on HTML prototype
          // H1, H2 (index 0, 1) = Done
          // H3 (index 2) = In Progress
          // H4 (index 3) = Next
          // H5-H8 (index 4-7) = Locked
          
          let state = 'locked';
          if (index < 2) state = 'done';
          else if (index === 2) state = 'progress';
          else if (index === 3) state = 'next';

          if (state === 'locked') {
            return null; // Will render locked ones grouped below
          }

          return (
            <article 
              key={unit.id} 
              className={`win ${state !== 'next' ? 'card-hover' : ''}`}
              style={
                state === 'progress' 
                  ? { borderColor: 'rgba(47,123,246,.35)', boxShadow: '0 0 0 3px var(--blue-dim), var(--shadow-window)' } 
                  : {}
              }
            >
              <div className="win-bar">
                <div className="win-dots"><i className="r"></i><i className="y"></i><i className="g"></i></div>
                <div className="win-title">
                  <Code2 className={`w-3.5 h-3.5 ${state === 'next' ? 'text-slate-400' : 'text-theme-blue'}`} />
                  บทเรียน_{unit.sub_domain_code.toLowerCase()}.html
                </div>
                <div className="win-actions">
                  {state === 'done' && <span className="chip chip-blue">✓ เรียนจบแล้ว</span>}
                  {state === 'progress' && <span className="chip chip-amber mono"><Zap className="w-3 h-3" />กำลังเรียน · 64%</span>}
                  {state === 'next' && <span className="chip chip-line mono">ถัดไป</span>}
                </div>
              </div>
              
              <div className="win-body grid-paper flex flex-col md:flex-row items-start md:items-center gap-6">
                <div 
                  className={`mono text-[22px] font-bold p-4 rounded-xl shrink-0 ${state === 'next' ? 'bg-soft border border-line text-faint' : 'bg-code-bg border-none ' + (state === 'progress' ? 'text-[#61a6ff]' : 'text-theme-green')}`}
                >
                  &lt;{unit.sub_domain_code}&gt;
                </div>
                
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="m-0 mb-1.5 text-[17px] font-bold">{unit.title}</h3>
                  <p className={`muted m-0 ${state === 'progress' ? 'mb-2.5' : ''} text-[12.5px] leading-[1.7] max-w-[560px]`}>
                    <span className="mono faint">// </span>{unit.description}
                  </p>
                  
                  {state === 'progress' && (
                    <div className="bar max-w-[280px] mt-2"><span style={{ width: '64%' }}></span></div>
                  )}
                  
                  {state === 'done' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="chip chip-line mono"><Presentation className="w-3 h-3"/>slide.ppt</span>
                      <span className="chip chip-line mono"><Tv className="w-3 h-3"/>video.mp4</span>
                      <span className="chip chip-line mono"><FileText className="w-3 h-3"/>doc.pdf</span>
                    </div>
                  )}
                </div>
                
                {state !== 'next' ? (
                  <div className="flex flex-col gap-3 items-stretch md:items-end w-full md:w-auto shrink-0 mt-2 md:mt-0">
                    <Link href={`/student/codelab?subdomain=${unit.sub_domain_code}`} className="chip chip-green mono cursor-pointer justify-center md:justify-start">
                      <Terminal className="w-3.5 h-3.5" />เข้าห้องปฏิบัติการ
                    </Link>
                    <Link href={`/student/lessons/${unit.id}`} className={state === 'progress' ? "btn btn-navy btn-sm" : "btn btn-ghost btn-sm"}>
                      {state === 'progress' ? (
                        <>เรียนต่อ <Play className="w-3 h-3" fill="currentColor"/></>
                      ) : (
                        <>ทบทวนอีกครั้ง <ArrowRight className="w-3 h-3" /></>
                      )}
                    </Link>
                  </div>
                ) : (
                  <Link href={`/student/lessons/${unit.id}`} className="btn btn-ghost btn-sm shrink-0 w-full md:w-auto mt-2 md:mt-0 justify-center">
                    เริ่มเรียนหน่วยนี้ <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}

        {/* Locked Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_UNITS.map((unit, index) => {
            if (index < 4) return null; // Already rendered above
            
            return (
              <div key={unit.id} className="card p-4 md:p-[18px] opacity-65 flex items-center gap-3.5">
                <div className="mono text-[15px] font-bold px-[13px] py-[10px] rounded-[10px] bg-soft border border-line text-faint">
                  {unit.sub_domain_code}
                </div>
                <div className="flex-1 min-w-0">
                  <b className="text-[13px] block truncate">{unit.title}</b>
                  <div className="faint text-[11px] mt-0.5 truncate">{unit.description}</div>
                </div>
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center faint mono text-[10px] py-6">&lt;/&gt; WEB LEARNING STUDIO · HTML LEARNING PLATFORM</div>
    </div>
  );
}
