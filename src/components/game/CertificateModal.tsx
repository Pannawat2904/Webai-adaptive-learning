'use client';

import React from 'react';
import { Award, Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { getRankByScore, getLevelByScore } from '@/lib/game/game-data';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  score: number;
}

export function CertificateModal({
  isOpen,
  onClose,
  playerName,
  score,
}: CertificateModalProps) {
  if (!isOpen) return null;

  const rank = getRankByScore(score);
  const level = getLevelByScore(score);
  const dateStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 m-0">
              ใบประกาศนียบัตรรับรองความสามารถ
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ / บันทึก PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-6 sm:p-10 overflow-y-auto">
          <div className="p-8 sm:p-12 rounded-3xl border-4 border-double border-amber-400/80 bg-gradient-to-b from-amber-50/40 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 text-center relative shadow-sm">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 text-amber-400 text-lg">✦</div>
            <div className="absolute top-3 right-3 text-amber-400 text-lg">✦</div>
            <div className="absolute bottom-3 left-3 text-amber-400 text-lg">✦</div>
            <div className="absolute bottom-3 right-3 text-amber-400 text-lg">✦</div>

            {/* Header Badge */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Award className="w-9 h-9" />
            </div>

            <p className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold mb-1">
              Certificate of Achievement · HTML5 Code Rescue
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              ประกาศนียบัตรรับรองทักษะนักพัฒนาเว็บ HTML5
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              ขอมอบประกาศนียบัตรฉบับนี้เพื่อแสดงว่า
            </p>

            {/* Student Name */}
            <div className="my-3 pb-2 border-b-2 border-slate-300 dark:border-slate-700 max-w-sm mx-auto">
              <h1 className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                {playerName || 'ผู้เรียนนวัตกรรม ปวช.'}
              </h1>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
              ได้ปฏิบัติภารกิจกู้เว็บไซต์ที่เสียหาย ค้นหาและแก้ไขข้อผิดพลาดทางไวยากรณ์ HTML5
              ตั้งแต่โครงสร้างพื้นฐาน การจัดการแท็ก ลิงก์ รูปภาพ จนถึงแบบฟอร์มรับข้อมูล และปราบ BOSS สำเร็จครบทั้ง 5 ด่าน
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg mx-auto mb-8 text-left">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 font-bold">คะแนนรวม</div>
                <div className="text-sm font-black text-amber-600 dark:text-amber-400">
                  ⭐ {score} แต้ม
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 font-bold">ระดับเลเวล</div>
                <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                  {level.title}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 font-bold">ยศนักพัฒนา</div>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 truncate">
                  {rank.name}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 font-bold">สถานะภารกิจ</div>
                <div className="text-sm font-black text-blue-600 dark:text-blue-400">
                  5/5 ด่าน (100%)
                </div>
              </div>
            </div>

            {/* Seal & Signatures */}
            <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800/80 pt-6 max-w-lg mx-auto">
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verified by WebAI Adaptive Learning</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  วันที่ออกเอกสาร: {dateStr}
                </div>
              </div>

              <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-500/80 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-[9px] uppercase tracking-wider text-center rotate-[-12deg] shadow-inner">
                HTML5<br />MASTER
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
