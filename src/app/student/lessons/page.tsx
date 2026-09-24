'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Play,
  ArrowRight,
  Zap,
  Lock,
  CheckCircle2,
  Terminal,
  FileCode,
  Globe,
  Database,
  LayoutTemplate,
  FormInput,
  Network,
  Cpu
} from 'lucide-react';

const JOURNEY_NODES = [
  { id: 'H1', title: 'โครงสร้างพื้นฐานของภาษา HTML', desc: 'โครงสร้างเอกสาร HTML5, ความหมาย Tag, Tag เปิด-ปิด, Comment, <head>, <body>, <title>', icon: Globe, status: 'mastered' },
  { id: 'H2', title: 'การแทรกข้อความและลิงก์ในหน้าเว็บ', desc: 'Heading, Paragraph, การจัดรูปแบบข้อความ, การขึ้นบรรทัด/เส้นคั่น, Lists (Ordered/Unordered) และการสร้างลิงก์', icon: FileCode, status: 'progress' },
  { id: 'H3', title: 'การแทรกรูปภาพและตารางในหน้าเว็บ', desc: 'แท็ก <img>, Relative/Absolute Path, การสร้างตาราง <table>, แถว คอลัมน์ และหัวตาราง', icon: LayoutTemplate, status: 'available' },
  { id: 'H4', title: 'การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML', desc: 'Semantic Tags (Header, Nav, Main, Section, Article, Aside, Footer), Div/Span, Block และ Inline Element', icon: Cpu, status: 'locked' },
  { id: 'H5', title: 'การสร้างฟอร์มรับข้อมูล', desc: 'Form Tag, Label, Input ชนิดต่างๆ (Text, Email, Password, Number, Date), Textarea, Select, Radio, Checkbox, Button', icon: FormInput, status: 'locked' },
];

export default function StudentJourneyPage() {
  return (
    <div className="main-inner enter max-w-[900px] mx-auto">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-8">
        <span className="flex items-center gap-2 text-sm font-bold text-muted bg-surface px-4 py-2 rounded-full border border-line">
          <Terminal className="w-4 h-4 text-primary" /> ~/เส้นทางการเรียนรู้
        </span>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-3xl font-black text-ink mb-2">เส้นทางการเรียนรู้<span className="text-primary">.</span></h1>
        <p className="text-muted">เส้นทางการเดินทางเพื่อเป็นนักพัฒนาเว็บไซต์ของคุณ</p>
      </div>

      {/* Visual Journey Path */}
      <div className="relative py-8">
        {/* The continuous line connecting nodes */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-line -translate-x-1/2 hidden md:block"></div>
        <div className="absolute left-[36px] top-0 bottom-0 w-1 bg-line md:hidden"></div>

        <div className="flex flex-col gap-8 md:gap-4 relative z-10">
          
          <div className="flex items-center justify-start md:justify-center mb-4">
            <div className="bg-surface border border-line px-4 py-2 rounded-full text-xs font-bold font-mono tracking-widest text-muted z-10 md:mr-0 ml-[10px] md:ml-0">
              เริ่มต้น
            </div>
          </div>

          {JOURNEY_NODES.map((node, index) => {
            const isLeft = index % 2 === 0;
            const Icon = node.icon;
            let statusColor = 'text-muted';
            let statusBg = 'bg-surface';
            let statusBorder = 'border-line';
            let iconBg = 'bg-surface';
            let lineGlow = '';

            if (node.status === 'mastered') {
              statusColor = 'text-success';
              statusBg = 'bg-success-dim';
              statusBorder = 'border-success';
              iconBg = 'bg-success';
              lineGlow = 'drop-shadow-[0_0_10px_var(--success)]';
            } else if (node.status === 'progress') {
              statusColor = 'text-primary';
              statusBg = 'bg-primary-dim';
              statusBorder = 'border-primary';
              iconBg = 'bg-primary';
              lineGlow = 'drop-shadow-[0_0_15px_var(--primary)]';
            } else if (node.status === 'available') {
              statusColor = 'text-ink';
              statusBorder = 'border-muted';
            }

            return (
              <div key={node.id} className={`flex flex-col md:flex-row items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Node Card */}
                <div className="w-full md:w-1/2 flex px-4 md:px-12 pl-16 md:pl-12">
                  <Link 
                    href={node.status !== 'locked' ? `/student/lessons/u-${node.id.toLowerCase()}` : '#'}
                    className={`w-full card p-5 relative border-2 ${
                      node.status === 'locked' ? 'opacity-60 cursor-not-allowed' : 'card-hover cursor-pointer'
                    } ${node.status === 'progress' ? 'border-primary shadow-[0_0_20px_var(--primary-dim)]' : 'border-line'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-mono text-[10px] font-bold text-muted uppercase tracking-widest">{node.id}</span>
                      {node.status === 'mastered' && <CheckCircle2 className="w-5 h-5 text-success" />}
                      {node.status === 'progress' && <Zap className="w-5 h-5 text-primary animate-pulse" />}
                      {node.status === 'locked' && <Lock className="w-4 h-4 text-muted" />}
                    </div>
                    <h3 className={`text-lg font-bold mb-1 ${node.status === 'locked' ? 'text-muted' : 'text-ink'}`}>
                      {node.title}
                    </h3>
                    <p className="text-xs text-muted mb-4">{node.desc}</p>
                    
                    {node.status !== 'locked' && (
                      <div className="flex items-center gap-2 mt-auto">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${statusBg} ${statusColor}`}>
                          {node.status === 'mastered' ? 'เรียนรู้แล้ว' : node.status === 'progress' ? 'กำลังเรียน' : 'พร้อมเรียน'}
                        </span>
                      </div>
                    )}
                  </Link>
                </div>

                {/* Central Timeline Point */}
                <div className={`absolute left-[36px] md:relative md:left-auto w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-full border-4 border-bg-base ${iconBg} ${statusColor === 'text-muted' ? 'text-muted' : 'text-white'} flex items-center justify-center z-10 ${lineGlow} transform -translate-x-1/2 md:translate-x-0`}>
                  <Icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>

                {/* Empty space for the other side on desktop */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
