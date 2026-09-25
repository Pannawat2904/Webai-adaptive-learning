'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SUB_DOMAINS, SubDomainCode, SkillProfile } from '@/types/database';
import { MOCK_STUDENT_SKILLS, MOCK_ASSIGNMENTS } from '@/lib/mock-data';
import {
  Gamepad2,
  Trophy,
  Lock,
  Unlock,
  CheckCircle2,
  Star,
  Map,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { UnitPathStepper } from '@/components/UnitPathStepper';
import { isCourseStepUnlocked } from '@/lib/progress-service';

export default function QuestMapPage() {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<Record<string, SkillProfile>>(MOCK_STUDENT_SKILLS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('webai_student_skills');
      if (saved) setSkills(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const subDomainCodes: SubDomainCode[] = ['H1', 'H2', 'H3', 'H4', 'H5'];

  // Count available quests
  const totalQuests = MOCK_ASSIGNMENTS.length;
  // Mock completed quests (for UI demo)
  const completedQuests = 1;
  const isQuestsUnlocked = isCourseStepUnlocked('quest');

  return (
    <div className="w-full max-w-[1500px] mx-auto pb-12 px-4 sm:px-6 font-sans pt-4">
      {/* 5-Step Course Stepper */}
      <UnitPathStepper currentStep="quest" />

      {!isQuestsUnlocked ? (
        <div className="card p-8 sm:p-10 text-center border-amber-500/30 bg-amber-500/5 shadow-lg my-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink mb-2">
            ขั้นตอนที่ 4: ภารกิจเขียนโค้ดยังไม่ปลดล็อก
          </h2>
          <p className="text-sm text-muted mb-6 max-w-lg mx-auto leading-relaxed">
            ตามลำดับขั้นตอนการเรียนรู้แบบต่อเนื่อง (Sequential Gating) คุณต้องเล่นเกมกู้เว็บพัง (Step 3: HTML5 Code Rescue) ให้ผ่านก่อน จึงจะสามารถปลดล็อกทำภารกิจเขียนโค้ดได้
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/student/game"
              className="btn btn-primary px-6 py-3 font-bold text-sm shadow-md"
            >
              <Gamepad2 className="w-4 h-4 mr-1.5" />
              <span>ไปเล่นเกมกู้เว็บพัง (Step 3: Game) &rarr;</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Top Header */}
          <header className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-2 bg-[#cdf9e7] dark:bg-[#0ba57d]/20 text-[#06966f] dark:text-[#39d6ad] px-4 py-2.5 rounded-lg font-mono font-bold text-sm">
              &gt;_ · /ตะลุยด่าน_Quests
            </div>
          </header>

          {/* Heading */}
          <section className="mb-7">
            <h1 className="text-[clamp(42px,5.5vw,76px)] leading-[0.98] tracking-[-2.8px] font-bold m-0 mb-4 text-ink">
              โหมดตะลุยด่าน <span className="text-theme-blue">:</span>
            </h1>
            <p className="text-lg text-muted m-0 leading-relaxed max-w-2xl">
              เขียนโค้ดแก้โจทย์ปัญหาในแต่ละ World เพื่อปลดล็อคเนื้อหาใหม่ สะสมดาวและมุ่งสู่การเป็นเซียนโค้ด!
            </p>
          </section>

      {/* Main Window */}
      <section className="mac-window">
        {/* Window Bar */}
        <div className="mac-window-bar">
          <div className="mac-dots">
            <i className="mac-dot r"></i>
            <i className="mac-dot y"></i>
            <i className="mac-dot g"></i>
          </div>
          <div className="mac-file-title">
            <em>&lt;/&gt;</em> quest-map.html
          </div>
        </div>

        {/* Window Body */}
        <div className="mac-window-body">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="font-mono font-bold text-xs text-theme-green">&gt;_ SELECT_WORLD()</div>
            
            <div className="flex gap-4">
              <div className="bg-white dark:bg-slate-900 border border-line rounded-xl px-4 py-2 text-center">
                <div className="text-[10px] font-mono text-muted mb-1 uppercase">ความคืบหน้า</div>
                <div className="text-lg font-mono font-bold text-ink">
                  {completedQuests} <span className="text-muted">/ {totalQuests}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-line rounded-xl px-4 py-2 text-center">
                <div className="text-[10px] font-mono text-muted mb-1 uppercase">ดาวสะสม 🌟</div>
                <div className="text-lg font-mono font-bold text-theme-orange">{completedQuests * 3}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subDomainCodes.map((code, index) => {
              const domain = SUB_DOMAINS[code];
              const questsInWorld = MOCK_ASSIGNMENTS.filter(a => a.sub_domain_code === code);
              const hasQuests = questsInWorld.length > 0;
              
              // Logic for mockup: World 1 is unlocked, others might be locked if no quests or if prior isn't done.
              const isUnlocked = hasQuests || index === 0;

              return (
                <div 
                  key={code}
                  className={`bg-white dark:bg-slate-900 border border-line rounded-2xl overflow-hidden transition-all duration-300 ${
                    isUnlocked ? 'hover:-translate-y-1 hover:shadow-lg' : 'opacity-70 grayscale'
                  }`}
                >
                  <div className="flex justify-between items-center px-5 py-4 border-b border-line bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="m-0 text-sm font-bold text-theme-blue font-mono">WORLD_{index + 1}</h3>
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4 text-muted" />
                    ) : hasQuests ? (
                      <div className="flex items-center gap-1">
                        <Star className={`w-3.5 h-3.5 ${index === 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                        <Star className={`w-3.5 h-3.5 ${index === 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                        <Star className={`w-3.5 h-3.5 ${index === 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                      </div>
                    ) : (
                      <div className="text-[10px] text-muted font-mono">COMING_SOON</div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-base font-bold text-ink mb-2 line-clamp-1">{domain.title}</h4>
                    <p className="text-xs text-muted line-clamp-2 min-h-[32px] mb-5">
                      {domain.description}
                    </p>

                    {hasQuests ? (
                      <Link
                        href={`/student/quests/${questsInWorld[0].id}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-theme-navy text-white text-sm font-bold hover:bg-[#1d2b48] transition-colors"
                      >
                        <Gamepad2 className="w-4 h-4" />
                        <span>เริ่มเล่นด่านนี้</span>
                      </Link>
                    ) : (
                      <button disabled className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#edf1f5] dark:bg-slate-800 text-muted text-sm font-bold cursor-not-allowed">
                        <span>ล็อคอยู่</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
      
        <div className="text-center text-[#8492a7] text-[10px] font-mono py-6">
          &lt;/&gt; WEB LEARNING STUDIO · HTML LEARNING PLATFORM
        </div>
      </>
    )}
  </div>
);
}
