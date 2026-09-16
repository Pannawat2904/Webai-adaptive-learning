'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import { SystemPrinciplesModal } from '@/components/modals/SystemPrinciplesModal';

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 py-6 px-4 text-xs text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              การพัฒนานวัตกรรมการเรียนรู้แบบปรับเหมาะเฉพาะบุคคลโดยบูรณาการพื้นที่จำลองการเขียนโค้ด เรื่อง โครงสร้างภาษา HTML
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              เพื่อส่งเสริมทักษะทางวิชาชีพด้านการพัฒนาเว็บไซต์ สำหรับนักเรียนระดับชั้นประกาศนียบัตรวิชาชีพ (ปวช.)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              หลักการทำงานของระบบ
            </button>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              เอกสารระเบียบวิธีวิจัย
            </Link>
          </div>
        </div>
      </footer>

      <SystemPrinciplesModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
