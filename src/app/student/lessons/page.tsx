'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUnits, subscribeToDatabase } from '@/lib/database-service';
import { Unit } from '@/types/database';
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

  const loadData = () => {
    setUnits(getUnits());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToDatabase((event) => {
      if (event.type === 'unit' || event.type === 'reset') {
        loadData();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="main-inner enter max-w-[900px] mx-auto">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-8">
        <span className="flex items-center gap-2 text-sm font-bold text-muted bg-surface px-4 py-2 rounded-full border border-line">
          <Terminal className="w-4 h-4 text-primary" /> ~/เส้นทางการเรียนรู้
        </span>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-3xl font-black text-ink mb-2">เส้นทางการเรียนรู้<span className="text-primary">.</span></h1>
        <p className="text-muted">เส้นทางการเดินทางเพื่อเป็นนักพัฒนาเว็บไซต์ของคุณ (อัปเดตตามแผนการสอนของครูแบบ Real-time)</p>
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

          {units.map((unit, index) => {
            const isLeft = index % 2 === 0;
            const Icon = SUBDOMAIN_ICONS[unit.sub_domain_code] || Globe;

            // Simple progression logic for demo: H1 mastered, H2 in progress, H3-H5 open
            let status = 'available';
            if (index === 0) status = 'mastered';
            else if (index === 1) status = 'progress';

            let lineGlow = '';
            if (status === 'mastered') {
              lineGlow = 'drop-shadow-[0_0_10px_var(--success)]';
            } else if (status === 'progress') {
              lineGlow = 'drop-shadow-[0_0_15px_var(--primary)]';
            }

            return (
              <div key={unit.id} className={`flex flex-col md:flex-row items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                {/* Node Card */}
                <div className="w-full md:w-1/2 flex px-4 md:px-12 pl-16 md:pl-12">
                  <Link 
                    href={`/student/lessons/${unit.id}`}
                    className={`w-full card p-5 relative border-2 card-hover cursor-pointer ${
                      status === 'progress' ? 'border-primary shadow-[0_0_20px_var(--primary-dim)]' : 'border-line'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-mono text-[10px] font-bold text-muted uppercase tracking-widest">{unit.sub_domain_code}</span>
                      {status === 'mastered' && <CheckCircle2 className="w-5 h-5 text-success" />}
                      {status === 'progress' && <Zap className="w-5 h-5 text-primary animate-pulse" />}
                    </div>

                    <h3 className="font-bold text-ink text-base mb-2 group-hover:text-primary transition-colors">
                      {unit.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {unit.description}
                    </p>
                  </Link>
                </div>

                {/* Central Node Badge */}
                <div className="absolute left-[36px] md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className={`w-10 h-10 rounded-full border-2 border-line bg-surface flex items-center justify-center ${lineGlow} z-20`}>
                    <Icon className="w-5 h-5 text-primary" />
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
