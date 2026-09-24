'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Terminal,
  Network,
  Database,
  Globe,
  FileCode,
  LayoutTemplate,
  FormInput,
  Cpu,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const SKILLS = [
  { id: 'H1', title: '3.1 โครงสร้างพื้นฐานของภาษา HTML', status: 'MASTERED', progress: 100, icon: Globe },
  { id: 'H2', title: '3.2 การแทรกข้อความและลิงก์ในหน้าเว็บ', status: 'MASTERED', progress: 85, icon: FileCode },
  { id: 'H3', title: '3.3 การแทรกรูปภาพและตารางในหน้าเว็บ', status: 'IN_PROGRESS', progress: 50, icon: LayoutTemplate },
  { id: 'H4', title: '3.4 การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML', status: 'AVAILABLE', progress: 15, icon: Cpu },
  { id: 'H5', title: '3.5 การสร้างฟอร์มรับข้อมูล', status: 'LOCKED', progress: 0, icon: FormInput },
];

export default function StudentSkillMapPage() {
  return (
    <div className="main-inner enter max-w-[1000px] mx-auto">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-8">
        <span className="flex items-center gap-2 text-sm font-bold text-muted bg-surface px-4 py-2 rounded-full border border-line">
          <Network className="w-4 h-4 text-primary" /> ~/skills/map
        </span>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-3xl font-black text-ink mb-2">Web Developer Skill Map<span className="text-primary">.</span></h1>
        <p className="text-muted">ตรวจสอบความเชี่ยวชาญ (Mastery) ในแต่ละทักษะย่อยของคุณ</p>
      </div>

      {/* Grid Network Representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        
        {/* Background Network Lines (Decorative) */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{
          backgroundImage: 'radial-gradient(circle at center, var(--primary-dim) 0%, transparent 70%)'
        }}></div>

        {SKILLS.map((skill) => {
          const Icon = skill.icon;
          let borderColor = 'border-line';
          let iconColor = 'text-muted';
          let iconBg = 'bg-surface';
          let statusColor = 'text-muted';
          let statusBg = 'bg-surface';
          let StatusIcon = null;

          switch (skill.status) {
            case 'MASTERED':
              borderColor = 'border-success';
              iconColor = 'text-success';
              iconBg = 'bg-success-dim';
              statusColor = 'text-success';
              statusBg = 'bg-success-dim';
              StatusIcon = CheckCircle2;
              break;
            case 'IN_PROGRESS':
              borderColor = 'border-primary shadow-[0_0_15px_var(--primary-dim)]';
              iconColor = 'text-primary';
              iconBg = 'bg-primary-dim';
              statusColor = 'text-primary';
              statusBg = 'bg-primary-dim';
              break;
            case 'NEEDS_PRACTICE':
              borderColor = 'border-danger';
              iconColor = 'text-danger';
              iconBg = 'bg-danger-dim';
              statusColor = 'text-danger';
              statusBg = 'bg-danger-dim';
              StatusIcon = AlertCircle;
              break;
            case 'AVAILABLE':
              borderColor = 'border-muted';
              iconColor = 'text-ink';
              iconBg = 'bg-soft';
              statusColor = 'text-ink';
              statusBg = 'bg-soft';
              break;
            case 'LOCKED':
              borderColor = 'border-line';
              iconColor = 'text-muted';
              iconBg = 'bg-bg-base';
              statusColor = 'text-muted';
              statusBg = 'bg-bg-base';
              StatusIcon = Lock;
              break;
          }

          return (
            <div key={skill.id} className={`card p-5 relative border-2 ${borderColor} ${skill.status === 'LOCKED' ? 'opacity-50' : 'card-hover'} flex flex-col justify-between`}>
              
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-mono text-sm font-bold text-muted bg-bg-base px-2 py-1 rounded border border-line">
                  {skill.id}
                </div>
              </div>

              <div className="mb-4">
                <h3 className={`text-lg font-bold mb-1 ${skill.status === 'LOCKED' ? 'text-muted' : 'text-ink'}`}>
                  {skill.title}
                </h3>
                <div className={`text-[10px] font-bold px-2 py-1 rounded inline-flex items-center gap-1 mt-1 ${statusBg} ${statusColor} uppercase tracking-wider`}>
                  {StatusIcon && <StatusIcon className="w-3 h-3" />}
                  {skill.status.replace('_', ' ')}
                </div>
              </div>

              {skill.status !== 'LOCKED' && (
                <div className="mt-auto pt-4 border-t border-line">
                  <div className="flex justify-between text-xs font-bold text-muted mb-2">
                    <span>Mastery</span>
                    <span className={iconColor}>{skill.progress}%</span>
                  </div>
                  <div className="bar bg-bg-base">
                    <span 
                      style={{ width: `${skill.progress}%` }} 
                      className={
                        skill.status === 'MASTERED' ? '!bg-success' : 
                        skill.status === 'NEEDS_PRACTICE' ? '!bg-danger' : 
                        '!bg-primary'
                      }
                    ></span>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
