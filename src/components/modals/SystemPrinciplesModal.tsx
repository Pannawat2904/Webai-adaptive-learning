'use client';

import React from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface SystemPrinciplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemPrinciplesModal({ isOpen, onClose }: SystemPrinciplesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Liquid Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 w-full max-w-3xl liquid-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/60 dark:border-white/10 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/30 dark:border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              กรอบแนวคิดและความถูกต้องทางวิชาการ
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              หลักการทำงาน: Rule-based Adaptive Testing
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              การทดสอบแบบปรับเหมาะเชิงกฎเกณฑ์ สำหรับประเมินทักษะโครงสร้างภาษา HTML
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/40 dark:bg-slate-800/40 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic Transparency Note */}
        <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            คำชี้แจงความโปร่งใสทางวิชาการ (Academic Integrity & Transparency)
          </div>
          <p className="leading-relaxed">
            ระบบนี้ทำงานด้วยกลไก <strong>Rule-based Adaptive Testing (การทดสอบแบบปรับเหมาะเชิงกฎเกณฑ์)</strong> โดยปรับระดับความยากของข้อสอบแบบ Stepwise (Easy ↔ Medium ↔ Hard) ตามผลการตอบรายข้อ ร่วมกับ Content Balancing ครอบคลุม Sub-domain H1–H8{' '}
            <strong>ระบบนี้ไม่ได้คำนวณพารามิเตอร์ทางสถิติด้วยแบบจำลอง Item Response Theory (IRT)</strong> เพื่อความถูกต้องทางวิชาการและป้องกันการกล่าวอ้างเกินจริงในรายงานวิจัยนวัตกรรม
          </p>
        </div>

        {/* 4 Pillars of Adaptive Testing (Wainer et al., 2000) */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            โครงสร้าง 4 องค์ประกอบหลัก (Wainer et al., 2000)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl liquid-card border border-white/40 dark:border-white/5 space-y-1.5">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center text-xs">1</span>
                คลังข้อสอบ (Item Pool)
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                ข้อสอบแบ่งตาม Sub-domain H1–H8 ระดับความยาก (Easy, Medium, Hard) และต้องผ่านการตรวจสอบความสอดคล้องเชิงเนื้อหา (IOC ≥ 0.67) จึงจะเปิดให้นักเรียนทำได้
              </p>
            </div>

            <div className="p-3.5 rounded-2xl liquid-card border border-white/40 dark:border-white/5 space-y-1.5">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center text-xs">2</span>
                กฎจุดเริ่มต้น (Starting Rule)
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                เริ่มต้นข้อแรกด้วยระดับความยากปานกลาง (Medium Difficulty) เสมอ เพื่อปรับสภาพและประเมินระดับความสามารถเบื้องต้นของผู้เรียน
              </p>
            </div>

            <div className="p-3.5 rounded-2xl liquid-card border border-white/40 dark:border-white/5 space-y-1.5">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center text-xs">3</span>
                อัลกอริทึมเลือกข้อสอบ (Item Selection)
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                ตอบถูก → ปรับเพิ่มความยาก (Medium → Hard), ตอบผิด → ปรับลดความยาก (Medium → Easy) ควบคู่กับ Content Balancing กระจายให้ครบทุกเนื้อหา
              </p>
            </div>

            <div className="p-3.5 rounded-2xl liquid-card border border-white/40 dark:border-white/5 space-y-1.5">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center text-xs">4</span>
                กฎการยุติ (Stopping Rule)
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                ยุติการทดสอบเมื่อครบ 20 ข้อสำหรับแบบทดสอบรวม (Fixed-length Rule) หรือครบ 10 ข้อสำหรับ Re-test ประเมินซ่อมเสริมเฉพาะจุดประสงค์
              </p>
            </div>
          </div>
        </div>

        {/* Content Balancing & Educational CAT */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-500" />
            การควบคุมความสมดุลและการประยุกต์ใช้ในชั้นเรียน
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="p-3 rounded-2xl bg-white/30 dark:bg-slate-900/30 border border-white/30 dark:border-white/5">
              <strong>• Content Balancing (Kingsbury & Zara, 1989):</strong> ระบบจะหมุนเวียนสุ่มเลือกข้อสอบให้ครอบคลุม Sub-domain H1–H8 ทุกหน่วยอย่างน้อย 1 รอบก่อน จึงวนรอบถัดไป เพื่อประกันความครอบคลุมของมาตรฐานหลักสูตร
            </p>
            <p className="p-3 rounded-2xl bg-white/30 dark:bg-slate-900/30 border border-white/30 dark:border-white/5">
              <strong>• Stopping Rule (Kingsbury & Weiss, 1983; Choi et al., 2011):</strong> การใช้เกณฑ์ความยาวคงที่ (Fixed-length) เหมาะสมกับการสอบวัดผลในชั้นเรียนอาชีวศึกษา เพราะไม่สร้างความกังวลใจเรื่องระยะเวลาและจำนวนข้อสอบที่ไม่เท่ากัน
            </p>
            <p className="p-3 rounded-2xl bg-white/30 dark:bg-slate-900/30 border border-white/30 dark:border-white/5">
              <strong>• Educational Diagnostic Application (Weiss & Kingsbury, 1984):</strong> เน้นการประเมินเพื่อวินิจฉัย (Formative/Diagnostic) ชี้จุดแข็ง-จุดที่ต้องพัฒนา นำผลไปเชื่อมโยงกับบทเรียนและการจำลองโค้ด (Code Lab) โดยตรง
            </p>
          </div>
        </div>

        {/* Formal Academic References */}
        <div className="space-y-2 border-t border-white/30 dark:border-white/10 pt-4">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            เอกสารอ้างอิงทางวิชาการ (Academic References)
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
            <li>
              Wainer, H., Dorans, N. J., Flaugher, R., Green, B. F., & Mislevy, R. J. (2000). <em>Computerized Adaptive Testing: A Primer</em> (2nd ed.). Lawrence Erlbaum Associates.
            </li>
            <li>
              Kingsbury, G. G., & Zara, A. R. (1989). Procedures for selecting items for computerized adaptive tests. <em>Applied Measurement in Education</em>, 2(4), 359-375.
            </li>
            <li>
              Kingsbury, G. G., & Weiss, D. J. (1983). A comparison of adaptive and conventional testing for problems of bias, content balance, and test length. In D. J. Weiss (Ed.), <em>New Horizons in Testing</em> (pp. 157-173). Academic Press.
            </li>
            <li>
              Choi, S. W., Grady, M. W., & Dodd, B. G. (2011). A new stopping rule for computerized adaptive testing. <em>Educational and Psychological Measurement</em>, 71(1), 80-100.
            </li>
            <li>
              Weiss, D. J., & Kingsbury, G. G. (1984). Application of computerized adaptive testing to educational problems. <em>Journal of Educational Measurement</em>, 21(4), 361-375.
            </li>
          </ol>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Link
            href="/methodology"
            onClick={onClose}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            อ่านเอกสารคู่มือระเบียบวิธีวิจัยฉบับเต็ม
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition-all"
          >
            เข้าใจและปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
