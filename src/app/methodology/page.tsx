'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Scale,
  Calculator,
  Award,
  ArrowLeft,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { SUB_DOMAINS } from '@/types/database';

export default function MethodologyPage() {
  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Top Breadcrumb / Return */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าหลัก
        </Link>
        <span className="text-xs font-mono text-slate-400">
          DOCUMENT: ACADEMIC-CAT-SPEC-2026.09
        </span>
      </div>

      {/* Header Banner */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4 border border-white/60 dark:border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          คู่มือระเบียบวิธีวิจัยและกรอบแนวคิดระบบ
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
          หลักการทำงาน: Rule-based Adaptive Testing
          <span className="block text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 mt-1">
            การทดสอบแบบปรับเหมาะเชิงกฎเกณฑ์ เรื่อง โครงสร้างภาษา HTML
          </span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          เอกสารชี้แจงโครงสร้างทางวิชาการและอัลกอริทึม สำหรับงานวิจัย: &quot;การพัฒนานวัตกรรมการเรียนรู้แบบปรับเหมาะเฉพาะบุคคลโดยบูรณาการพื้นที่จำลองการเขียนโค้ด เรื่อง โครงสร้างภาษา HTML เพื่อส่งเสริมทักษะทางวิชาชีพด้านการพัฒนาเว็บไซต์ สำหรับนักเรียนระดับชั้นประกาศนียบัตรวิชาชีพ (ปวช.)&quot;
        </p>
      </div>

      {/* Academic Integrity & Transparency Box */}
      <div className="p-6 rounded-3xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-950 dark:text-amber-200 space-y-3">
        <div className="flex items-center gap-2.5 font-bold text-base text-amber-900 dark:text-amber-300">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          การชี้แจงความโปร่งใสทางวิชาการ (Academic Integrity Statement)
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/90">
          ระบบนี้ทำงานด้วยกลไก <strong>Rule-based Adaptive Testing (การทดสอบแบบปรับเหมาะเชิงกฎเกณฑ์)</strong> โดยปรับระดับความยากของข้อสอบแบบ Stepwise (Easy ↔ Medium ↔ Hard) ตามผลการตอบรายข้อ ร่วมกับการกระจายเนื้อหา (Content Balancing) ครอบคลุม Sub-domain H1–H8{' '}
          <strong>ระบบนี้ไม่ได้คำนวณพารามิเตอร์ทางสถิติด้วยแบบจำลอง Item Response Theory (IRT)</strong> และไม่ได้ประมาณค่าความสามารถ (Theta) ผ่านฟังก์ชันข้อมูลข้อสอบ (Item Information Function) ทางผู้วิจัยระบุชื่อระบบไว้อย่างชัดเจนและตรงตามความเป็นจริง เพื่อป้องกันการกล่าวอ้างเกินจริงทางวิชาการในรายงานวิจัยและเล่มนวัตกรรม
        </p>
      </div>

      {/* 4 Pillars of Adaptive Testing (Wainer et al., 2000) */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          1. โครงสร้าง 4 องค์ประกอบหลักของ Adaptive Testing (Wainer et al., 2000)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="liquid-card rounded-2xl p-5 border border-white/60 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-extrabold">1</span>
              คลังข้อสอบ (Calibrated Item Pool)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ข้อสอบครอบคลุมเนื้อหา 8 Sub-domain (H1–H8) โดยแต่ละข้อมีการระบุระดับความยาก 3 ระดับ (Easy, Medium, Hard) และต้องผ่านการประเมินค่าดัชนีความสอดคล้อง (IOC ≥ 0.67) จากผู้เชี่ยวชาญก่อนปล่อยให้นักเรียนทำในระบบจริง
            </p>
          </div>

          <div className="liquid-card rounded-2xl p-5 border border-white/60 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-extrabold">2</span>
              กฎจุดเริ่มต้น (Starting Rule)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ผู้เรียนทุกคนจะเริ่มต้นข้อสอบข้อแรกที่ระดับความยาก <strong>Medium (ปานกลาง)</strong> เสมอ เพื่อเป็นจุดอ้างอิงและปรับความพร้อมของผู้เรียนก่อนที่อัลกอริทึมจะปรับตามผลตอบ
            </p>
          </div>

          <div className="liquid-card rounded-2xl p-5 border border-white/60 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-extrabold">3</span>
              อัลกอริทึมเลือกข้อสอบ (Item Selection Algorithm)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ใช้กฎ Stepwise Transition Rule:
              <br />• <strong>ตอบถูก:</strong> ปรับเพิ่มความยาก 1 ระดับ (Easy → Medium → Hard)
              <br />• <strong>ตอบผิด:</strong> ปรับลดความยาก 1 ระดับ (Hard → Medium → Easy)
              <br />ผสานกับ Content Balancing เพื่อกระจายข้อสอบให้ครบทุก Sub-domain
            </p>
          </div>

          <div className="liquid-card rounded-2xl p-5 border border-white/60 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-extrabold">4</span>
              กฎการยุติการทดสอบ (Stopping Rule)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ใช้เกณฑ์ความยาวคงที่ (Fixed-length Stopping Rule):
              <br />• <strong>แบบทดสอบรวม:</strong> สิ้นสุดที่ 20 ข้อ (ครอบคลุม H1–H8 อย่างน้อย 2 รอบ)
              <br />• <strong>แบบทดสอบซ่อมเสริม (Re-test):</strong> สิ้นสุดที่ 10 ข้อเฉพาะ Sub-domain นั้น
            </p>
          </div>
        </div>
      </div>

      {/* Content Balancing (Kingsbury & Zara, 1989) */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          2. หลักการควบคุมความสมดุลของเนื้อหา (Content Balancing: Kingsbury & Zara, 1989)
        </h2>
        <div className="liquid-glass rounded-3xl p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Kingsbury & Zara (1989) ระบุว่าข้อจำกัดสำคัญของ Adaptive Testing คือความเสี่ยงที่อัลกอริทึมจะเลือกข้อสอบกระจุกตัวอยู่เฉพาะเนื้อหาบางส่วน ระบบนี้จึงออกแบบให้มี <strong>Content Balancing Constraint</strong> ดังนี้:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {Object.values(SUB_DOMAINS).map((sub) => (
              <div key={sub.code} className="p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-white/5">
                <span className="inline-block font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {sub.code}
                </span>
                <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                  {sub.name}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            * อัลกอริทึมจะตรวจสอบก่อนเลือกข้อสอบเสมอว่า Sub-domain ใดถูกทดสอบไปน้อยที่สุด และจะให้ลำดับความสำคัญก่อน (Priority Selection)
          </p>
        </div>
      </div>

      {/* Psychometric Formulas */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          3. สูตรการคำนวณทางจิตมิติ (Psychometric Formulas)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* KR-20 */}
          <div className="liquid-glass rounded-3xl p-6 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500" />
              ความเชื่อมั่น Kuder-Richardson (KR-20)
            </h3>
            <div className="p-3 rounded-2xl bg-indigo-500/10 font-mono text-xs text-indigo-700 dark:text-indigo-300">
              r_KR20 = [ k / (k - 1) ] × [ 1 - ( ∑(p_i × q_i) / S^2_t ) ]
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• <strong>k:</strong> จำนวนข้อสอบใน Sub-domain นั้น</li>
              <li>• <strong>p_i:</strong> สัดส่วนผู้ตอบถูกในข้อที่ i, <strong>q_i:</strong> 1 - p_i</li>
              <li>• <strong>S^2_t:</strong> ความแปรปรวนของคะแนนรวม (Variance)</li>
              <li>• <strong>เกณฑ์ยอมรับได้:</strong> r_KR20 ≥ 0.70</li>
            </ul>
          </div>

          {/* Cohen's d */}
          <div className="liquid-glass rounded-3xl p-6 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-500" />
              ขนาดอิทธิพล Cohen&apos;s d Effect Size
            </h3>
            <div className="p-3 rounded-2xl bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-300">
              d = ( Mean_post - Mean_pre ) / SD_pooled
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• <strong>d &lt; 0.20:</strong> แทบไม่มีความแตกต่าง (Negligible)</li>
              <li>• <strong>0.20 ≤ d &lt; 0.50:</strong> พัฒนาการขนาดเล็ก (Small Effect)</li>
              <li>• <strong>0.50 ≤ d &lt; 0.80:</strong> พัฒนาการขนาดปานกลาง (Medium Effect)</li>
              <li>• <strong>d ≥ 0.80:</strong> พัฒนาการขนาดมาก มีนัยสำคัญเชิงปฏิบัติสูง (Large Effect)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formal Academic Citations List */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          เอกสารอ้างอิงทางวิชาการ (Academic References - APA 7th Edition)
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-mono leading-relaxed pl-2 border-l-2 border-indigo-500">
          <p>
            Choi, S. W., Grady, M. W., & Dodd, B. G. (2011). A new stopping rule for computerized adaptive testing. <em>Educational and Psychological Measurement</em>, 71(1), 80-100.
          </p>
          <p>
            Cohen, J. (1988). <em>Statistical Power Analysis for the Behavioral Sciences</em> (2nd ed.). Lawrence Erlbaum Associates.
          </p>
          <p>
            Kingsbury, G. G., & Weiss, D. J. (1983). A comparison of adaptive and conventional testing for problems of bias, content balance, and test length. In D. J. Weiss (Ed.), <em>New Horizons in Testing</em> (pp. 157-173). Academic Press.
          </p>
          <p>
            Kingsbury, G. G., & Zara, A. R. (1989). Procedures for selecting items for computerized adaptive tests. <em>Applied Measurement in Education</em>, 2(4), 359-375.
          </p>
          <p>
            Wainer, H., Dorans, N. J., Flaugher, R., Green, B. F., & Mislevy, R. J. (2000). <em>Computerized Adaptive Testing: A Primer</em> (2nd ed.). Lawrence Erlbaum Associates.
          </p>
          <p>
            Weiss, D. J., & Kingsbury, G. G. (1984). Application of computerized adaptive testing to educational problems. <em>Journal of Educational Measurement</em>, 21(4), 361-375.
          </p>
        </div>
      </div>
    </div>
  );
}
