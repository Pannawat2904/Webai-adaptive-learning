'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SkillProfile } from '@/types/database';
import { MOCK_STUDENT_SKILLS } from '@/lib/mock-data';
import {
  getCourseProgress,
  getUnitProgress,
  subscribeToProgress,
  CourseProgress,
  UnitProgress,
} from '@/lib/progress-service';
import {
  Terminal,
  Target,
  CheckCircle2,
  Trophy,
  Zap,
  ArrowRight,
  Code2,
  Sparkles,
  Map as MapIcon,
  Shield,
  Activity,
  BookOpen,
  Calendar,
  Clock,
  Check,
  ChevronRight,
  Flame,
  Star,
  FileCode2,
  Type,
  Image as ImageIcon,
  LayoutTemplate,
  CheckSquare,
  Lock,
} from 'lucide-react';

const CURRICULUM_UNITS = [
  {
    id: 'u-h1',
    code: 'H1',
    title: 'โครงสร้างพื้นฐานของภาษา HTML',
    description: 'HTML5 Doctype, โครงสร้างแท็ก, Tag เปิด-ปิด, Head, Body, Title',
    icon: FileCode2,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    id: 'u-h2',
    code: 'H2',
    title: 'การแทรกข้อความและลิงก์ในหน้าเว็บ',
    description: 'Heading H1-H6, Paragraph, จัดรูปแบบตัวอักษร, Lists, Links <a>',
    icon: Type,
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  },
  {
    id: 'u-h3',
    code: 'H3',
    title: 'การแทรกรูปภาพและตารางในหน้าเว็บ',
    description: 'รูปภาพ <img>, กำหนด Path, ตาราง <table>, แถว, คอลัมน์ และหัวตาราง',
    icon: ImageIcon,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'u-h4',
    code: 'H4',
    title: 'การจัดโครงสร้างหน้าเว็บด้วย Semantic HTML',
    description: 'Header, Nav, Main, Section, Article, Aside, Footer, Block vs Inline',
    icon: LayoutTemplate,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'u-h5',
    code: 'H5',
    title: 'การสร้างฟอร์มรับข้อมูล',
    description: 'Form, Label, Input ประเภทต่างๆ, Textarea, Select, Radio, Button',
    icon: CheckSquare,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
];

export default function StudentDashboardPage() {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<Record<string, SkillProfile>>(MOCK_STUDENT_SKILLS);
  const [courseProgress, setCourseProgress] = useState<CourseProgress>(getCourseProgress());
  const [unitProgressList, setUnitProgressList] = useState<Record<string, UnitProgress>>({});

  // Clock & Study Timer State
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [studySeconds, setStudySeconds] = useState<number>(0);

  // Live Clock interval & Study counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setStudySeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync Progress & Skills
  useEffect(() => {
    try {
      const savedSkills = localStorage.getItem('webai_student_skills');
      if (savedSkills) setSkills(JSON.parse(savedSkills));
    } catch {
      // ignore
    }

    const updateProgress = () => {
      setCourseProgress(getCourseProgress());
      const units = ['u-h1', 'u-h2', 'u-h3', 'u-h4', 'u-h5'];
      const mapping: Record<string, UnitProgress> = {};
      units.forEach((u) => {
        mapping[u] = getUnitProgress(u);
      });
      setUnitProgressList(mapping);
    };

    updateProgress();
    const unsubscribe = subscribeToProgress(updateProgress);
    return () => unsubscribe();
  }, []);

  // Format Digital Clock: HH:mm:ss
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  // Format Thai Date: วันจันทร์ที่ 28 กันยายน 2569
  const thaiDays = [
    'วันอาทิตย์',
    'วันจันทร์',
    'วันอังคาร',
    'วันพุธ',
    'วันพฤหัสบดี',
    'วันศุกร์',
    'วันเสาร์',
  ];
  const thaiMonths = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];
  const dayName = thaiDays[currentTime.getDay()];
  const dateNum = currentTime.getDate();
  const monthName = thaiMonths[currentTime.getMonth()];
  const yearBE = currentTime.getFullYear() + 543;
  const thaiDateString = `${dayName}ที่ ${dateNum} ${monthName} ${yearBE}`;

  // Time-of-day greeting & cute theme
  const hour = currentTime.getHours();
  let greeting = {
    icon: '🌅',
    title: 'อรุณสวัสดิ์ยามเช้า',
    quote: 'เริ่มต้นวันใหม่ด้วยการฝึกเขียน HTML วันละนิด!',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20',
  };
  if (hour >= 12 && hour < 17) {
    greeting = {
      icon: '☀️',
      title: 'สวัสดีช่วงบ่าย',
      quote: 'เติมพลังและสมาธิ แล้วไปลุยบทเรียนต่อกันเลย!',
      badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/20',
    };
  } else if (hour >= 17 && hour < 21) {
    greeting = {
      icon: '🌆',
      title: 'สวัสดีช่วงเย็น',
      quote: 'ช่วงเวลาดีๆ สำหรับทบทวนโค้ดและทำแบบฝึกหัด',
      badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20',
    };
  } else if (hour >= 21 || hour < 5) {
    greeting = {
      icon: '🌙',
      title: 'ราตรีสวัสดิ์ยามค่ำ',
      quote: 'ทบทวนความรู้ก่อนนอน อย่าลืมพักผ่อนสายตาด้วยนะ',
      badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20',
    };
  }

  const formatStudyTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s} วินาที`;
    return `${m} นาที ${s} วิ`;
  };

  // Overall Course Progress Calculation
  const calculateOverallProgress = () => {
    let score = 0;
    if (courseProgress.pretest_done) score += 20;

    const units = ['u-h1', 'u-h2', 'u-h3', 'u-h4', 'u-h5'];
    units.forEach((u) => {
      const up = unitProgressList[u];
      if (up?.lesson_done) score += 4;
      if (up?.unit_quiz_done) score += 4;
    });

    if (courseProgress.quest_done) score += 20;
    if (courseProgress.posttest_done) score += 20;

    return Math.min(100, Math.round(score));
  };

  const overallPercentage = calculateOverallProgress();

  // Next Learning Action
  const getNextAction = () => {
    if (!courseProgress.pretest_done) {
      return {
        title: 'แบบทดสอบก่อนเรียน (Step 1)',
        desc: 'เริ่มต้นประเมินความรู้พื้นฐาน 20 ข้อ เพื่อปลดล็อกเข้าสู่บทเรียน HTML',
        href: '/student/assessment?type=pre_test',
        btnText: 'เริ่มทำแบบทดสอบก่อนเรียน ➔',
        badge: 'ขั้นตอนที่ 1 : จุดเริ่มต้น',
        isComplete: false,
      };
    }

    const units = [
      { id: 'u-h1', code: 'H1', name: 'โครงสร้างพื้นฐานของภาษา HTML' },
      { id: 'u-h2', code: 'H2', name: 'การแทรกข้อความและลิงก์' },
      { id: 'u-h3', code: 'H3', name: 'การแทรกรูปภาพและตาราง' },
      { id: 'u-h4', code: 'H4', name: 'Semantic HTML' },
      { id: 'u-h5', code: 'H5', name: 'การสร้างฟอร์มรับข้อมูล' },
    ];

    for (const u of units) {
      const up = unitProgressList[u.id];
      if (!up?.lesson_done || !up?.unit_quiz_done) {
        return {
          title: `เรียนต่อ: หน่วยที่ ${u.code} ${u.name}`,
          desc: 'ศึกษาเนื้อหาสไลด์ วิดีโอ และทำแบบฝึกหัดประจำหน่วยเพื่อสะสมทักษะ',
          href: `/student/lessons/${u.id}`,
          btnText: 'เข้าสู่บทเรียนนี้ ➔',
          badge: `บทเรียนแนะนำ : ${u.code}`,
          isComplete: false,
        };
      }
    }

    if (!courseProgress.quest_done) {
      return {
        title: 'ภารกิจเขียนโค้ด (Step 4: Quests)',
        desc: 'ตะลุยด่านเขียนโค้ดจริงเพื่อปลดล็อกแบบทดสอบหลังเรียน',
        href: '/student/quests',
        btnText: 'ไปทำภารกิจเขียนโค้ด ➔',
        badge: 'ขั้นตอนที่ 4 : ฝึกปฏิบัติการ',
        isComplete: false,
      };
    }

    if (!courseProgress.posttest_done) {
      return {
        title: 'แบบทดสอบหลังเรียน (Step 5: Post-test)',
        desc: 'ประเมินผลสัมฤทธิ์ปลายภาคด้วยระบบข้อสอบแบบปรับเหมาะ Adaptive CAT',
        href: '/student/assessment?type=post_test',
        btnText: 'ทำแบบทดสอบหลังเรียน ➔',
        badge: 'ขั้นตอนที่ 5 : ประเมินผลรวม',
        isComplete: false,
      };
    }

    return {
      title: 'ยินดีด้วย! คุณเรียนจบหลักสูตรครบทุกขั้นตอนแล้ว',
      desc: 'คุณได้ผ่านการประเมินทักษะ HTML ครบถ้วน สามารถทบทวนบทเรียนหรือทำแบบฝึกหัดเพิ่มเติมได้ตลอดเวลา',
      href: '/student/lessons',
      btnText: 'ดูบทเรียนทั้งหมด ➔',
      badge: '🏆 ผ่านหลักสูตร 100%',
      isComplete: true,
    };
  };

  const nextAction = getNextAction();

  // 5 Course Steps for Stepper
  const courseSteps = [
    {
      step: 1,
      title: 'แบบทดสอบก่อนเรียน',
      desc: 'Pre-test (20 ข้อ)',
      isDone: courseProgress.pretest_done,
      score: courseProgress.pretest_score,
      href: '/student/assessment?type=pre_test',
    },
    {
      step: 2,
      title: 'บทเรียน HTML',
      desc: '5 หน่วยการเรียนรู้',
      isDone: courseProgress.lessons_done,
      href: '/student/lessons',
    },
    {
      step: 3,
      title: 'ฝึกปฏิบัติโค้ด',
      desc: 'Code Lab ประจำหน่วย',
      isDone: courseProgress.game_done || courseProgress.lessons_done,
      href: '/student/codelab',
    },
    {
      step: 4,
      title: 'ภารกิจพัฒนาเว็บ',
      desc: 'Quests ตะลุยด่าน',
      isDone: courseProgress.quest_done,
      href: '/student/quests',
    },
    {
      step: 5,
      title: 'แบบทดสอบหลังเรียน',
      desc: 'Adaptive Post-test',
      isDone: courseProgress.posttest_done,
      score: courseProgress.posttest_score,
      href: '/student/assessment?type=post_test',
    },
  ];

  return (
    <div className="main-inner enter max-w-[1200px] mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Study Streak */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-bold text-muted bg-surface px-4 py-2 rounded-full border border-line">
          <Terminal className="w-4 h-4 text-primary" /> ~/แดชบอร์ดนักเรียน
        </span>
        <div className="flex gap-2">
          <span className="chip chip-warning chip-mono inline-flex items-center gap-1.5 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>เรียนต่อเนื่อง 3 วัน</span>
          </span>
        </div>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-1">
          ศูนย์การเรียนรู้ WebAI<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted">
          ติดตามความคืบหน้าการเรียนรู้หลักสูตร HTML แผนผังทักษะ และเวลาการเรียนรู้ของคุณ
        </p>
      </div>

      {/* TOP ROW: Developer Profile + Aesthetic Live Clock Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-stretch">
        {/* Developer Profile & Next Learning Action Card */}
        <div className="card p-6 md:p-7 flex flex-col justify-between border-l-4 border-l-primary bg-gradient-to-br from-surface to-bg-base relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Code2 className="w-56 h-56 text-primary" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <span className="chip chip-primary chip-mono text-xs font-bold">
                <Shield className="w-3.5 h-3.5" /> ระดับ 2 : ผู้สร้าง HTML
              </span>
              <div className="flex items-center gap-1.5 text-highlight font-bold bg-highlight-dim px-3 py-1 rounded-lg border border-highlight-dim text-xs">
                <Sparkles className="w-3.5 h-3.5" /> 1,240 XP
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-ink mb-1">
                สวัสดี, {profile?.full_name?.split(' ')[0] || 'นักเรียน'} 👋
              </h2>
              <p className="text-muted text-xs sm:text-sm leading-relaxed max-w-xl">
                ความคืบหน้าภาพรวมของคุณอยู่ที่ <strong className="text-primary">{overallPercentage}%</strong> พร้อมลุยต่อในบทเรียนถัดไปแล้ว
              </p>
            </div>

            {/* Next Recommended Step Callout */}
            <div className="p-4 rounded-2xl bg-surface/90 border border-line shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
                  {nextAction.badge}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Target className="w-3 h-3" /> แนะนำ
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-ink mb-0.5">{nextAction.title}</h4>
                <p className="text-xs text-muted leading-relaxed m-0">{nextAction.desc}</p>
              </div>
              <Link
                href={nextAction.href}
                className="btn btn-primary w-full text-xs font-bold py-2.5 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{nextAction.btnText}</span>
              </Link>
            </div>

            {/* XP Level Bar */}
            <div className="pt-1">
              <div className="flex justify-between text-xs font-bold text-muted mb-1.5 uppercase tracking-wide">
                <span>ความก้าวหน้าสู่ระดับ 3</span>
                <span className="text-ink">1,240 / 2,000 XP (62%)</span>
              </div>
              <div className="bar">
                <span style={{ width: '62%' }}></span>
              </div>
            </div>
          </div>
        </div>

        {/* Aesthetic Live Clock & Study Time Widget */}
        <div className="card p-6 bg-gradient-to-br from-surface via-surface to-primary/[0.04] border-line flex flex-col justify-between relative overflow-hidden shadow-xs">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            {/* Top Greeting Badge & Live Indicator */}
            <div className="flex items-center justify-between">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${greeting.badge}`}
              >
                <span>{greeting.icon}</span>
                <span>{greeting.title}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>LIVE</span>
              </div>
            </div>

            {/* Digital Clock Display */}
            <div className="my-2">
              <div className="flex items-baseline justify-center sm:justify-start gap-1 font-mono">
                <span className="text-4xl sm:text-5xl font-black text-ink tracking-tight font-mono">
                  {hours}:{minutes}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-primary animate-pulse font-mono">
                  :{seconds}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-muted flex items-center justify-center sm:justify-start gap-1.5 mt-2">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <span>{thaiDateString}</span>
              </div>
            </div>
          </div>

          {/* Session Timer & Motivation Quote */}
          <div className="relative z-10 pt-4 mt-3 border-t border-line/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>เวลาเรียนรู้เซสชันนี้</span>
              </span>
              <span className="font-mono font-bold text-ink bg-bg-base px-2.5 py-1 rounded-lg border border-line text-xs">
                {formatStudyTime(studySeconds)}
              </span>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-xs text-muted">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <p className="m-0 italic text-[11px] leading-snug">"{greeting.quote}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Course Learning Steps Stepper */}
      <div className="card p-6 border-line bg-surface rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
          <div>
            <h3 className="text-base sm:text-lg font-black text-ink flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span>ลำดับขั้นตอนการเรียนรู้หลักสูตร HTML</span>
            </h3>
            <p className="text-xs text-muted mt-0.5">
              ระบบเรียนรู้ต่อเนื่อง 5 ขั้นตอน (Sequential Gating) ของหน่วยที่ 3 งานสร้างหน้าเว็บด้วย HTML
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted">ความคืบหน้ารวม</span>
            <span className="text-sm font-mono font-black text-primary bg-primary/10 px-3 py-1 rounded-xl border border-primary/20">
              {overallPercentage}%
            </span>
          </div>
        </div>

        {/* Overall Stepper Progress Bar */}
        <div className="w-full bg-line/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {courseSteps.map((st) => (
            <Link
              key={st.step}
              href={st.href}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between group ${
                st.isDone
                  ? 'border-emerald-500/30 bg-emerald-500/[0.04] hover:border-emerald-500'
                  : 'border-line bg-surface hover:border-primary/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-surface border border-line text-xs font-bold flex items-center justify-center text-ink">
                    {st.step}
                  </span>
                  {st.isDone ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      ✓
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-muted">รอทำ</span>
                  )}
                </div>
                <b className="text-xs text-ink block mb-0.5 group-hover:text-primary transition-colors">
                  {st.title}
                </b>
                <small className="text-muted text-[11px] block">{st.desc}</small>
              </div>

              {st.score !== undefined && (
                <div className="mt-2 pt-2 border-t border-line/60 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  คะแนน: {st.score}%
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* 5 CURRICULUM LESSONS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-ink flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>เนื้อหาบทเรียน 5 หน่วยการเรียนรู้</span>
            </h3>
            <p className="text-xs text-muted mt-0.5">
              ศึกษาเนื้อหา สไลด์ วิดีโอ และแบบฝึกหัดท้ายหน่วยตามหลักสูตร
            </p>
          </div>
          <Link
            href="/student/lessons"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>ดูบทเรียนทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM_UNITS.map((unit, idx) => {
            const up = unitProgressList[unit.id];
            const isDone = up?.lesson_done && up?.unit_quiz_done;
            const isInProgress = up?.lesson_done && !up?.unit_quiz_done;

            return (
              <div
                key={unit.id}
                className="card p-5 border-line bg-surface hover:border-primary/40 transition-all flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border ${unit.color}`}
                    >
                      <unit.icon className="w-4 h-4" />
                    </div>
                    {isDone ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3" /> ผ่านแล้ว
                      </span>
                    ) : isInProgress ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">
                        กำลังเรียน
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-surface border border-line text-muted text-[11px] font-medium">
                        หน่วยที่ {idx + 1}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-ink mb-1 group-hover:text-primary transition-colors">
                    {unit.code}: {unit.title}
                  </h4>
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-4">
                    {unit.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-line/60">
                  <Link
                    href={`/student/lessons/${unit.id}`}
                    className="w-full btn btn-ghost text-xs font-bold flex items-center justify-between py-2 px-3 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                  >
                    <span>{isDone ? 'ทบทวนบทเรียน' : 'เข้าสู่บทเรียนนี้'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK LEARNING LINKS (No Game Clutter) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/student/assessment?type=pre_test"
          className="card card-hover flex items-center gap-4 p-4 border-line"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <b className="text-[14px] block text-ink">แบบทดสอบก่อนเรียน</b>
            <small className="text-muted text-[12px]">Pre-test ชุด 20 ข้อ</small>
          </div>
        </Link>

        <Link
          href="/student/lessons"
          className="card card-hover flex items-center gap-4 p-4 border-line"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-dim text-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <b className="text-[14px] block text-ink">บทเรียน HTML 5 หน่วย</b>
            <small className="text-muted text-[12px]">ดูสไลด์และวิดีโอ</small>
          </div>
        </Link>

        <Link
          href="/student/codelab"
          className="card card-hover flex items-center gap-4 p-4 border-line"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary-dim text-secondary flex items-center justify-center shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <b className="text-[14px] block text-ink">ห้องฝึกปฏิบัติ (Lab)</b>
            <small className="text-muted text-[12px]">เขียนโค้ดแก้โจทย์จริง</small>
          </div>
        </Link>

        <Link
          href="/student/assessment?type=post_test"
          className="card card-hover flex items-center gap-4 p-4 border-line"
        >
          <div className="w-12 h-12 rounded-xl bg-accent-dim text-accent flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <b className="text-[14px] block text-ink">ประเมินทักษะ (CAT)</b>
            <small className="text-muted text-[12px]">วัดระดับทักษะ θ หลังเรียน</small>
          </div>
        </Link>
      </div>

      {/* SKILL MAP & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
        {/* Skill Map */}
        <div className="card border-line">
          <div className="card-head">
            <h3>แผนผังทักษะ HTML รายหน่วย</h3>
            <span className="chip chip-mono text-xs">ระดับความเชี่ยวชาญ</span>
          </div>
          <div className="card-body flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div> H1 โครงสร้าง HTML
                </span>
                <span className="text-success text-xs">ชำนาญแล้ว (100%)</span>
              </div>
              <div className="bar success">
                <span style={{ width: '100%' }}></span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div> H2 ข้อความและลิงก์
                </span>
                <span className="text-success text-xs">ชำนาญแล้ว (90%)</span>
              </div>
              <div className="bar success">
                <span style={{ width: '90%' }}></span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div> H3 รูปภาพและตาราง
                </span>
                <span className="text-primary text-xs">กำลังเรียนรู้ (65%)</span>
              </div>
              <div className="bar">
                <span style={{ width: '65%' }}></span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div> H4 Semantic HTML
                </span>
                <span className="text-primary text-xs">กำลังเรียนรู้ (50%)</span>
              </div>
              <div className="bar">
                <span style={{ width: '50%' }}></span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div> H5 การสร้างฟอร์ม
                </span>
                <span className="text-amber-500 text-xs">ควรฝึกฝนเพิ่ม (35%)</span>
              </div>
              <div className="bar warning">
                <span style={{ width: '35%' }}></span>
              </div>
            </div>

            <Link href="/student/lessons" className="btn btn-ghost w-full mt-2 text-xs font-bold">
              ดูบทเรียนทั้งหมดและฝึกฝนต่อ
            </Link>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="card flex-1 border-line">
          <div className="card-head">
            <h3>ประวัติกิจกรรมล่าสุด</h3>
            <span className="chip chip-mono text-xs">บันทึกความคืบหน้า</span>
          </div>
          <div className="card-body pt-2 space-y-1">
            <div className="flex gap-4 py-3 border-b border-dashed border-line">
              <div className="w-10 h-10 rounded-lg bg-success-dim text-success flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm block text-ink">ปลดล็อกความสำเร็จ!</b>
                <small className="text-muted text-xs block mb-1">
                  "HTML Builder" (ผ่านแบบทดสอบก่อนเรียน 20 ข้อ)
                </small>
                <span className="text-[10px] text-highlight font-bold">+100 XP</span>
              </div>
            </div>

            <div className="flex gap-4 py-3 border-b border-dashed border-line">
              <div className="w-10 h-10 rounded-lg bg-primary-dim text-primary flex items-center justify-center shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm block text-ink">ศึกษาบทเรียน: โครงสร้างเอกสาร HTML5</b>
                <small className="text-muted text-xs block mb-1">
                  เรียนจบบทเรียนหน่วยที่ 1 (H1)
                </small>
                <span className="text-[10px] text-highlight font-bold">+50 XP</span>
              </div>
            </div>

            <div className="flex gap-4 py-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-dim text-secondary flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm block text-ink">แบบทดสอบปรับเหมาะ (CAT)</b>
                <small className="text-muted text-xs block mb-1">ระดับความสามารถ θ อัปเดต</small>
                <span className="text-[10px] text-muted font-bold">ล่าสุด</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
