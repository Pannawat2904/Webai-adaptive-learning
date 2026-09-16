'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_QUESTIONS } from '@/lib/mock-data';
import { Question, SubDomainCode, QuestionDifficulty, SUB_DOMAINS } from '@/types/database';
import { evaluateItemQuality } from '@/lib/psychometrics';
import {
  FileQuestion,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Info,
  Award,
} from 'lucide-react';

export default function TeacherQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(() => {
    // Load modified questions if any in localStorage or defaults
    try {
      const stored = localStorage.getItem('webai_teacher_questions');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return MOCK_QUESTIONS;
  });

  const [selectedSubDomain, setSelectedSubDomain] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedValidation, setSelectedValidation] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New question form state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newSubDomain, setNewSubDomain] = useState<SubDomainCode>('H1');
  const [newDifficulty, setNewDifficulty] = useState<QuestionDifficulty>('medium');
  const [choiceA, setChoiceA] = useState('');
  const [choiceB, setChoiceB] = useState('');
  const [choiceC, setChoiceC] = useState('');
  const [choiceD, setChoiceD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');
  const [newIocScore, setNewIocScore] = useState<number>(1.0);
  const [newValidated, setNewValidated] = useState<boolean>(true);

  // Save to state and localStorage
  const updateQuestionsState = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    try {
      localStorage.setItem('webai_teacher_questions', JSON.stringify(newQuestions));
    } catch {
      // ignore
    }
  };

  const toggleQuestionStatus = (id: string) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, active: !q.active } : q
    );
    updateQuestionsState(updated);
  };

  const toggleValidationStatus = (id: string) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, validated: !(q.validated ?? true) } : q
    );
    updateQuestionsState(updated);
  };

  const updateIocScore = (id: string, newScore: number) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, ioc_score: newScore } : q
    );
    updateQuestionsState(updated);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !choiceA.trim() || !choiceB.trim()) {
      alert('กรุณากรอกข้อความคำถามและตัวเลือกอย่างน้อย 2 ตัวเลือก');
      return;
    }

    const pVal = newDifficulty === 'easy' ? 0.75 : newDifficulty === 'medium' ? 0.52 : 0.35;
    const dVal = newDifficulty === 'easy' ? 0.38 : newDifficulty === 'medium' ? 0.46 : 0.42;

    const created: Question = {
      id: 'q-custom-' + Date.now(),
      sub_domain_code: newSubDomain,
      difficulty: newDifficulty,
      cognitive_level: 'application',
      answer_type: 'single_choice',
      question_text: newQuestionText,
      choices: {
        A: choiceA,
        B: choiceB,
        C: choiceC,
        D: choiceD,
      },
      correct_option: correctOption,
      explanation,
      active: true,
      ioc_score: newIocScore,
      validated: newValidated,
      difficulty_index: pVal,
      discrimination_index: dVal,
      total_attempts: 0,
    };

    updateQuestionsState([created, ...questions]);
    setIsAddingNew(false);

    // Reset form
    setNewQuestionText('');
    setChoiceA('');
    setChoiceB('');
    setChoiceC('');
    setChoiceD('');
    setExplanation('');
    setNewIocScore(1.0);
    setNewValidated(true);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSub = selectedSubDomain === 'all' || q.sub_domain_code === selectedSubDomain;
    const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const isValid = q.validated !== false;
    const matchesVal =
      selectedValidation === 'all' ||
      (selectedValidation === 'validated' && isValid) ||
      (selectedValidation === 'unvalidated' && !isValid);
    const matchesSearch =
      q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.sub_domain_code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSub && matchesDiff && matchesVal && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in">
      {/* Back Link */}
      <Link
        href="/teacher"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>กลับไปยังแดชบอร์ดครูผู้สอน</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <FileQuestion className="w-3.5 h-3.5" />
            การควบคุมคุณภาพคลังข้อสอบ (Item Quality & IOC Control)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            คลังข้อสอบโครงสร้างภาษา HTML ({questions.length} ข้อ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            จัดการข้อสอบ ตรวจสอบค่า IOC และสถิติจิตมิติ (p-value, D-value) สำหรับ Rule-based Adaptive Testing
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingNew ? 'ปิดฟอร์ม' : 'เพิ่มข้อสอบใหม่'}</span>
        </button>
      </div>

      {/* Academic Safety Rule Callout */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">กฎความปลอดภัยเชิงวิชาการ (Academic Gatekeeper Constraint):</span>
          <p className="leading-relaxed">
            ข้อสอบที่มีสถานะ <strong>Validated = false</strong> หรือมีค่า <strong>IOC &lt; 0.67</strong> จะถูกจัดเป็นข้อสอบร่าง/อยู่ระหว่างพัฒนา และ{' '}
            <strong>อัลกอริทึม Rule-based Adaptive Testing จะตัดออกจากการสุ่มให้นักเรียนทำในข้อสอบจริงโดยอัตโนมัติ</strong> เพื่อประกันว่าผู้เรียนจะได้รับเฉพาะเครื่องมือวัดที่ได้มาตรฐาน
          </p>
        </div>
      </div>

      {/* Add New Question Form (if active) */}
      {isAddingNew && (
        <form
          onSubmit={handleCreateQuestion}
          className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4 border border-indigo-500/30 animate-in fade-in"
        >
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-500" />
            เพิ่มข้อสอบใหม่ในคลังข้อสอบ
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Sub-domain</label>
              <select
                value={newSubDomain}
                onChange={(e) => setNewSubDomain(e.target.value as SubDomainCode)}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
              >
                {(Object.keys(SUB_DOMAINS) as SubDomainCode[]).map((c) => (
                  <option key={c} value={c}>
                    [{c}] {SUB_DOMAINS[c].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">ระดับความยากเริ่มต้น</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as QuestionDifficulty)}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
              >
                <option value="easy">ง่าย (Easy)</option>
                <option value="medium">ปานกลาง (Medium - Starting)</option>
                <option value="hard">ยาก/ท้าทาย (Hard)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">ค่า IOC จากผู้เชี่ยวชาญ (0.0 - 1.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1.0"
                value={newIocScore}
                onChange={(e) => setNewIocScore(parseFloat(e.target.value) || 0)}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">ข้อความคำถาม</label>
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              rows={3}
              placeholder="กรอกข้อความโจทย์คำถามภาษาไทย..."
              className="w-full mt-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500">ตัวเลือก A</label>
              <input
                type="text"
                value={choiceA}
                onChange={(e) => setChoiceA(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                placeholder="ตัวเลือก A..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">ตัวเลือก B</label>
              <input
                type="text"
                value={choiceB}
                onChange={(e) => setChoiceB(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                placeholder="ตัวเลือก B..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">ตัวเลือก C</label>
              <input
                type="text"
                value={choiceC}
                onChange={(e) => setChoiceC(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                placeholder="ตัวเลือก C..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">ตัวเลือก D</label>
              <input
                type="text"
                value={choiceD}
                onChange={(e) => setChoiceD(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                placeholder="ตัวเลือก D..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-500">ตัวเลือกที่ถูกต้อง (เฉลย)</label>
              <select
                value={correctOption}
                onChange={(e) => setCorrectOption(e.target.value as 'A' | 'B' | 'C' | 'D')}
                className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-emerald-600"
              >
                <option value="A">ข้อ A</option>
                <option value="B">ข้อ B</option>
                <option value="C">ข้อ C</option>
                <option value="D">ข้อ D</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={newValidated}
                  onChange={(e) => setNewValidated(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>ผ่านการตรวจสอบคุณภาพ (Validated = true)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500">คำอธิบายเฉลย</label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="คำอธิบายเหตุผลของข้อที่ถูกต้อง..."
              className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md transition-all"
            >
              บันทึกลงคลังข้อสอบ
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Controls */}
      <div className="liquid-glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-domain filter */}
          <select
            value={selectedSubDomain}
            onChange={(e) => setSelectedSubDomain(e.target.value)}
            className="text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
          >
            <option value="all">ทุก Sub-domain (H1 - H8)</option>
            {(Object.keys(SUB_DOMAINS) as SubDomainCode[]).map((code) => (
              <option key={code} value={code}>
                [{code}] {SUB_DOMAINS[code].name}
              </option>
            ))}
          </select>

          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
          >
            <option value="all">ทุกระดับความยาก</option>
            <option value="easy">ง่าย (Easy)</option>
            <option value="medium">ปานกลาง (Medium)</option>
            <option value="hard">ยาก/ท้าทาย (Hard)</option>
          </select>

          {/* Validation filter */}
          <select
            value={selectedValidation}
            onChange={(e) => setSelectedValidation(e.target.value)}
            className="text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
          >
            <option value="all">สถานะ Validated ทั้งหมด</option>
            <option value="validated">เฉพาะที่ผ่านเกณฑ์ (Validated = true)</option>
            <option value="unvalidated">ข้อสอบร่าง/ยังไม่ผ่าน (Validated = false)</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาข้อความข้อสอบ..."
            className="pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs w-60 font-medium"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isValid = q.validated !== false;
          const ioc = q.ioc_score ?? 1.0;
          const pVal = q.difficulty_index ?? (q.difficulty === 'easy' ? 0.74 : q.difficulty === 'medium' ? 0.52 : 0.36);
          const dVal = q.discrimination_index ?? (q.difficulty === 'easy' ? 0.38 : q.difficulty === 'medium' ? 0.46 : 0.44);
          const evalQuality = evaluateItemQuality(pVal, dVal, ioc);

          return (
            <div
              key={q.id}
              className={`liquid-card p-6 rounded-3xl border transition-all space-y-4 ${
                !isValid
                  ? 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/20'
                  : q.active
                  ? 'border-white/60 dark:border-white/10'
                  : 'opacity-60 bg-slate-100/50 dark:bg-slate-900/50'
              }`}
            >
              {/* Card Header & Validation Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/40 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                    {q.sub_domain_code}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                      q.difficulty === 'easy'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                        : q.difficulty === 'medium'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    ความยาก: {q.difficulty}
                  </span>

                  {/* Validated Indicator Badge */}
                  {isValid ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Validated (พร้อมใช้ใน Adaptive Test)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Unvalidated (ระบบกันไม่ให้สุ่มให้นักเรียน)
                    </span>
                  )}
                </div>

                {/* Quick Toggle Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleValidationStatus(q.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isValid
                        ? 'bg-white/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-500/10 hover:text-rose-600'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    }`}
                  >
                    {isValid ? 'ระงับชั่วคราว (Set Unvalidated)' : 'อนุมัติข้อสอบ (Validate)'}
                  </button>

                  <button
                    onClick={() => toggleQuestionStatus(q.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      q.active
                        ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-slate-300 text-slate-500'
                    }`}
                  >
                    {q.active ? 'เปิดใช้งานอยู่' : 'ปิดใช้งาน'}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                  {idx + 1}. {q.question_text}
                </h3>

                {q.code_snippet && (
                  <pre className="p-3 rounded-xl bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-w-2xl border border-slate-800">
                    {q.code_snippet}
                  </pre>
                )}

                {/* Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <div className={`p-2 rounded-xl ${q.correct_option === 'A' ? 'bg-emerald-500/10 font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-500/30' : 'bg-white/40 dark:bg-slate-800/40'}`}>
                    A: {q.choices.A} {q.correct_option === 'A' && '✓ (เฉลย)'}
                  </div>
                  <div className={`p-2 rounded-xl ${q.correct_option === 'B' ? 'bg-emerald-500/10 font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-500/30' : 'bg-white/40 dark:bg-slate-800/40'}`}>
                    B: {q.choices.B} {q.correct_option === 'B' && '✓ (เฉลย)'}
                  </div>
                  {q.choices.C && (
                    <div className={`p-2 rounded-xl ${q.correct_option === 'C' ? 'bg-emerald-500/10 font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-500/30' : 'bg-white/40 dark:bg-slate-800/40'}`}>
                      C: {q.choices.C} {q.correct_option === 'C' && '✓ (เฉลย)'}
                    </div>
                  )}
                  {q.choices.D && (
                    <div className={`p-2 rounded-xl ${q.correct_option === 'D' ? 'bg-emerald-500/10 font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-500/30' : 'bg-white/40 dark:bg-slate-800/40'}`}>
                      D: {q.choices.D} {q.correct_option === 'D' && '✓ (เฉลย)'}
                    </div>
                  )}
                </div>

                {q.explanation && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1">
                    💡 คำอธิบาย: {q.explanation}
                  </p>
                )}
              </div>

              {/* Psychometrics & IOC Bar */}
              <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-white/40 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-500">ค่า IOC:</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1.0"
                      value={ioc}
                      onChange={(e) => updateIocScore(q.id, parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[11px] text-slate-400">(เกณฑ์ &ge; 0.67)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-500">ความยาก (p):</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{pVal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-500">อำนาจจำแนก (D):</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{dVal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  คุณภาพ: <span className="text-slate-900 dark:text-white font-bold">{evalQuality}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
