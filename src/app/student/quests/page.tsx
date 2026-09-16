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
  ArrowRight
} from 'lucide-react';

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

  const subDomainCodes: SubDomainCode[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];

  // Count available quests
  const totalQuests = MOCK_ASSIGNMENTS.length;
  // Mock completed quests (for UI demo)
  const completedQuests = 1;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Gamepad2 className="w-5 h-5" />
            <span>โหมดตะลุยด่าน (Quest Mode)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            แผนที่การเรียนรู้ HTML
          </h1>
          <p className="text-slate-400 max-w-lg text-sm sm:text-base">
            เขียนโค้ดแก้โจทย์ปัญหาในแต่ละ World เพื่อปลดล็อคเนื้อหาใหม่ สะสมดาวและมุ่งสู่การเป็นเซียนโค้ด!
          </p>
        </div>

        <div className="relative z-10 flex gap-4 shrink-0">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700 text-center min-w-[100px]">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">ความคืบหน้า</div>
            <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
              <span>{completedQuests}</span>
              <span className="text-slate-500 text-lg">/</span>
              <span className="text-slate-500 text-lg">{totalQuests}</span>
            </div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700 text-center min-w-[100px]">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">ดาวสะสม 🌟</div>
            <div className="text-2xl font-black text-amber-400">{completedQuests * 3}</div>
          </div>
        </div>
      </div>

      {/* Map Content */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Map className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">เลือกด่านที่คุณต้องการผจญภัย</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subDomainCodes.map((code, index) => {
            const domain = SUB_DOMAINS[code];
            const questsInWorld = MOCK_ASSIGNMENTS.filter(a => a.sub_domain_code === code);
            const hasQuests = questsInWorld.length > 0;
            
            // Logic for mockup: World 1 is unlocked, others might be locked if no quests or if prior isn't done.
            // For now, unlock if it has quests, otherwise lock.
            const isUnlocked = hasQuests || index === 0;

            return (
              <div 
                key={code}
                className={`relative rounded-2xl p-6 transition-all duration-300 ${
                  isUnlocked 
                    ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500' 
                    : 'bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 opacity-70 grayscale'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute top-4 right-4 p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                {isUnlocked && hasQuests && (
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <Star className={`w-4 h-4 ${index === 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    <Star className={`w-4 h-4 ${index === 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    <Star className={`w-4 h-4 ${index === 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-black tracking-widest text-blue-500 uppercase mb-1">
                      World {index + 1}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1">
                      {domain.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px]">
                    {domain.description}
                  </p>

                  <div className="pt-2">
                    {hasQuests ? (
                      <Link
                        href={`/student/quests/${questsInWorld[0].id}`}
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
                      >
                        <Gamepad2 className="w-4 h-4" />
                        <span>เริ่มเล่นด่านนี้</span>
                      </Link>
                    ) : (
                      <button disabled className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-sm font-bold cursor-not-allowed">
                        <span>เร็วๆ นี้</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
