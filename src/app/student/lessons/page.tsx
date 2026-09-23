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
      <div className="topline">
        <span className="path-pill"><Terminal className="w-3.5 h-3.5" />~/หลักสูตร_HTML</span>
        <span className="chip chip-line chip-mono hide-mobile">5 / 8 หน่วยเรียนจบแล้ว</span>
      </div>

      <div className="page-heading">
        <h1>หน่วยการเรียนรู้ทั้ง 8 หัวข้อ<span className="accent">.</span></h1>
        <p>ครอบคลุมทุกองค์ประกอบของโครงสร้างภาษา HTML สำหรับนักเรียน ปวช. พร้อมสไลด์การสอน วิดีโอ และเอกสารประกอบ</p>
      </div>

      <div className="flex-col gap-4" style={{ display: 'flex' }}>
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
              
              <div className="win-body grid-paper" style={{ display: 'flex', alignItems: 'center', gap: '26px', flexWrap: 'wrap' }}>
                <div 
                  className="mono" 
                  style={{ 
                    fontSize: '22px', 
                    fontWeight: 700, 
                    padding: '16px 20px', 
                    borderRadius: '14px', 
                    background: state === 'next' ? 'var(--soft)' : 'var(--code-bg)', 
                    border: state === 'next' ? '1px solid var(--line)' : 'none',
                    color: state === 'next' ? 'var(--faint)' : (state === 'progress' ? '#61a6ff' : 'var(--green)'), 
                    flexShrink: 0 
                  }}
                >
                  &lt;{unit.sub_domain_code}&gt;
                </div>
                
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700 }}>{unit.title}</h3>
                  <p className="muted" style={{ margin: state === 'progress' ? '0 0 10px' : '0', fontSize: '12.5px', lineHeight: 1.7, maxWidth: '560px' }}>
                    <span className="mono faint">// </span>{unit.description}
                  </p>
                  
                  {state === 'progress' && (
                    <div className="bar" style={{ maxWidth: '280px' }}><span style={{ width: '64%' }}></span></div>
                  )}
                  
                  {state === 'done' && (
                    <div className="flex gap-2 wrap" style={{ marginTop: '12px' }}>
                      <span className="chip chip-line mono"><Presentation className="w-3 h-3"/>slide.ppt</span>
                      <span className="chip chip-line mono"><Tv className="w-3 h-3"/>video.mp4</span>
                      <span className="chip chip-line mono"><FileText className="w-3 h-3"/>doc.pdf</span>
                    </div>
                  )}
                </div>
                
                {state !== 'next' ? (
                  <div className="flex-col gap-3" style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                    <Link href={`/student/codelab?subdomain=${unit.sub_domain_code}`} className="chip chip-green mono" style={{ cursor: 'pointer' }}>
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
                  <Link href={`/student/lessons/${unit.id}`} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                    เริ่มเรียนหน่วยนี้ <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}

        {/* Locked Items */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>
          {MOCK_UNITS.map((unit, index) => {
            if (index < 4) return null; // Already rendered above
            
            return (
              <div key={unit.id} className="card" style={{ padding: '18px', opacity: .65, display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="mono" style={{ fontSize: '15px', fontWeight: 700, padding: '10px 13px', borderRadius: '10px', background: 'var(--soft)', border: '1px solid var(--line)', color: 'var(--faint)' }}>
                  {unit.sub_domain_code}
                </div>
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: '13px' }}>{unit.title}</b>
                  <div className="faint" style={{ fontSize: '11px', marginTop: '2px' }}>{unit.description}</div>
                </div>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center faint mono" style={{ fontSize: '10px', padding: '22px 0' }}>&lt;/&gt; WEB LEARNING STUDIO · HTML LEARNING PLATFORM</div>
    </div>
  );
}
