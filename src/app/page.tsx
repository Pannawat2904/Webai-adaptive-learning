'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SUB_DOMAINS, SubDomainCode } from '@/types/database';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Terminal,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Users,
  Layers,
  GraduationCap,
  Code2,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  const { role, switchRole } = useAuth();
  const subDomainKeys = Object.keys(SUB_DOMAINS) as SubDomainCode[];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Liquid Glass Frame */}
      <section className="relative pt-6 sm:pt-10 pb-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 backdrop-blur-md shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>นวัตกรรมการศึกษาวิชาชีพ ระดับประกาศนียบัตรวิชาชีพ (ปวช.)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          ระบบการเรียนรู้แบบปรับเหมาะเฉพาะบุคคล <br />
          <span className="gradient-text">
            เรื่อง โครงสร้างภาษา HTML
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          บูรณาการพื้นที่จำลองการเขียนโค้ด (Code Lab) ร่วมกับระบบประเมินผลแบบปรับเหมาะ (Adaptive Assessment Engine)
          เพื่อส่งเสริมทักษะทางวิชาชีพด้านการพัฒนาเว็บไซต์สำหรับนักเรียน ปวช. ครอบคลุม 8 Sub-domain อย่างเจาะลึก
        </p>

        {/* Dual Entrance Portal Gateway (แยกฝั่งนักเรียนและครู/แอดมิน ชัดเจน) */}
        <div className="pt-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {/* Card 1: Student Portal */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-7 space-y-4 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/25 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  สำหรับนักเรียน ปวช.
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  ระบบการเรียนรู้ (Student Portal)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  เรียนรู้โครงสร้างภาษา HTML 8 หน่วย, ทำแบบทดสอบ Rule-based Adaptive Testing, จำลองเขียนโค้ด Code Lab และรับคำแนะนำจาก AI Tutor
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                  ✓ เข้าเรียนได้ทันที
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                  ✓ บันทึก Learning Profile
                </span>
              </div>
            </div>

            <Link
              href="/student"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all group-hover:shadow-emerald-600/40"
            >
              <span>เข้าสู่ระบบการเรียนรู้ (นักเรียน)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Teacher & Admin Backoffice */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-7 space-y-4 border border-indigo-500/30 hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/25 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  ครูผู้สอน &amp; แอดมิน
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  ระบบหลังบ้าน (Teacher Backoffice)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  แดชบอร์ดชั้นเรียน, กราฟ Trajectory รายข้อ, ความเที่ยง KR-20, พัฒนาการ Pre/Post Cohen&apos;s d, คลังข้อสอบ IOC และ Export ข้อมูล
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/50 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400">
                  🔐 เข้าสู่ระบบด้วย Username &amp; Password
                </span>
              </div>
            </div>

            <Link
              href="/admin/login"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all group-hover:shadow-indigo-600/40"
            >
              <span>เข้าสู่ระบบหลังบ้าน (ครู/แอดมิน)</span>
              <Lock className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="liquid-card p-6 space-y-3 group">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            บทเรียน 8 Sub-domain
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            เนื้อหาโครงสร้างภาษา HTML ครบ 8 มิติ พร้อม Slide Viewer เลื่อนทีละสไลด์ วิดีโอ และสรุปสูตรลัด
          </p>
        </div>

        <div className="liquid-card p-6 space-y-3 group">
          <div className="w-11 h-11 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Adaptive Assessment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            ประเมินผลแบบปรับเหมาะ ปรับระดับความยากตามคำตอบรายข้อ ไม่กดดัน มีนาฬิกานุ่มนวล
          </p>
        </div>

        <div className="liquid-card p-6 space-y-3 group">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Code Lab + AI Review
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            พื้นที่จำลองเขียนโค้ด HTML แบบ Live Preview ปลอดภัย พร้อมตรวจ Requirement Checklist และ AI วิเคราะห์
          </p>
        </div>

        <div className="liquid-card p-6 space-y-3 group">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Learning Profile & Heatmap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            เรดาร์ความสามารถ 8 แกนรายบุคคล และ Heatmap Matrix ของทั้งชั้นเรียนสำหรับครูผู้สอน
          </p>
        </div>
      </section>

      {/* 8 Sub-domains Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            8 Sub-domain ของโครงสร้างภาษา HTML
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            แกนกลางของทั้งบทเรียน คลังข้อสอบ Rule-based Adaptive Testing และ Learning Profile
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subDomainKeys.map((key, index) => {
            const domain = SUB_DOMAINS[key];
            return (
              <div
                key={key}
                className="liquid-card p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                    {domain.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">หน่วยที่ {index + 1}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {domain.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {domain.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role-Based Cards */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="max-w-2xl space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            ระบบผู้ใช้งานและสิทธิ์ (RBAC)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            ออกแบบเพื่อยกระดับการเรียนการสอนสายอาชีวะ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/60 dark:border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>สำหรับนักเรียน ปวช.</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>เรียนรู้บทเรียนพร้อมสไลด์และวิดีโอ</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>ฝึกเขียนโค้ดใน Code Lab ทันที</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>สอบ Adaptive Test ไร้ความกดดัน</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>ปรึกษา AI Tutor และรับคำแนะนำเฉพาะบุคคล</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/60 dark:border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span>สำหรับครูผู้สอน</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>ดูภาพรวมชั้นเรียนและ Heatmap 8 มิติ</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>จัดการสื่อการสอนและคลังข้อสอบ</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>วิเคราะห์ข้อสอบรายข้อยาก-ง่าย</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>ส่งออกรายงานผลการเรียนเป็นไฟล์ CSV</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/60 dark:border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm">
              <Layers className="w-4 h-4" />
              <span>ผู้ดูแลระบบ (Admin)</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>กำหนดสิทธิ์และบทบาทผู้ใช้งาน</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>ตรวจสอบ Audit Logs บันทึกการกระทำ</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>ระบบรักษาความปลอดภัย Server-side RLS</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
