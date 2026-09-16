'use client';

import React from 'react';
import Link from 'next/link';
import { SUB_DOMAINS, SubDomainCode } from '@/types/database';
import {
  BarChart2,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function TeacherAnalyticsPage() {
  const subDomainAnalytics = [
    { code: 'H1', name: 'โครงสร้างเอกสาร HTML พื้นฐาน', correctRate: 85, avgTime: 24, totalAttempts: 120, diff: 'easy' },
    { code: 'H2', name: 'การจัดการข้อความและ Heading/Paragraph', correctRate: 88, avgTime: 20, totalAttempts: 115, diff: 'easy' },
    { code: 'H3', name: 'Hyperlink และการเชื่อมโยง', correctRate: 72, avgTime: 28, totalAttempts: 104, diff: 'medium' },
    { code: 'H4', name: 'รูปภาพและสื่อประสม', correctRate: 68, avgTime: 32, totalAttempts: 98, diff: 'medium' },
    { code: 'H5', name: 'รายการข้อมูล (Lists)', correctRate: 76, avgTime: 26, totalAttempts: 90, diff: 'medium' },
    { code: 'H6', name: 'ตาราง (Tables & Colspan/Rowspan)', correctRate: 52, avgTime: 45, totalAttempts: 130, diff: 'hard' },
    { code: 'H7', name: 'ฟอร์มและการรับข้อมูล (Forms & Inputs)', correctRate: 56, avgTime: 42, totalAttempts: 140, diff: 'hard' },
    { code: 'H8', name: 'Semantic HTML5 และโครงสร้างทั้งหน้า', correctRate: 64, avgTime: 35, totalAttempts: 88, diff: 'medium' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <Link
        href="/teacher"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>กลับไปยังภาพรวมชั้นเรียน</span>
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <BarChart2 className="w-4 h-4" />
          <span>Question Analytics & Cognitive Load</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          การวิเคราะห์ความยากง่ายและเวลาตอบเฉลี่ยราย Sub-domain
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          สถิติอัตราความถูกต้องและระยะเวลาในการตอบสนอง (Response Time) แยกตามเนื้อหา
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subDomainAnalytics.map((item) => {
          const isHighAccuracy = item.correctRate >= 75;
          const isLowAccuracy = item.correctRate < 60;

          return (
            <div
              key={item.code}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {item.code}
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    item.diff === 'easy'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : item.diff === 'medium'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {item.diff === 'easy' ? 'ง่าย' : item.diff === 'medium' ? 'ปานกลาง' : 'ท้าทาย'}
                </span>
              </div>

              {/* Progress and Stats */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>อัตราความถูกต้อง (Accuracy Rate):</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.correctRate}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isHighAccuracy
                        ? 'bg-emerald-500'
                        : isLowAccuracy
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${item.correctRate}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>เวลาตอบเฉลี่ย: <strong>{item.avgTime} วินาที/ข้อ</strong></span>
                </span>
                <span>จำนวนการทดสอบ: {item.totalAttempts} ครั้ง</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
