'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_QUESTIONS } from '@/lib/mock-data';
import { Question, SubDomainCode, QuestionDifficulty, SUB_DOMAINS } from '@/types/database';
import {
  FileQuestion,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';

export default function TeacherQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [selectedSubDomain, setSelectedSubDomain] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
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

  const filteredQuestions = questions.filter((q) => {
    const matchesSub = selectedSubDomain === 'all' || q.sub_domain_code === selectedSubDomain;
    const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchesSearch =
      q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.sub_domain_code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSub && matchesDiff && matchesSearch;
  });

  const toggleQuestionStatus = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !choiceA.trim() || !choiceB.trim()) {
      alert('กรุณากรอกข้อความคำถามและตัวเลือกให้ครบถ้วน');
      return;
    }

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
    };

    setQuestions([created, ...questions]);
    setIsAddingNew(false);
    // Reset form
    setNewQuestionText('');
    setChoiceA('');
    setChoiceB('');
    setChoiceC('');
    setChoiceD('');
    setExplanation('');
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <FileQuestion className="w-4 h-4" />
            <span>Question Bank Management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            คลังข้อสอบโครงสร้างภาษา HTML (40+ ข้อ)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            จัดการข้อสอบและ metadata สำหรับอัลกอริทึม Adaptive Assessment Engine
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingNew ? 'ปิดฟอร์มเพิ่มข้อสอบ' : 'เพิ่มข้อสอบใหม่'}</span>
        </button>
      </div>

      {/* Form: Add New Question */}
      {isAddingNew && (
        <form
          onSubmit={handleCreateQuestion}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/40 shadow-lg space-y-4 animate-in fade-in"
        >
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>สร้างข้อสอบใหม่ในระบบ Adaptive</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Sub-domain ของโครงสร้าง HTML:
              </label>
              <select
                value={newSubDomain}
                onChange={(e) => setNewSubDomain(e.target.value as SubDomainCode)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                {(Object.keys(SUB_DOMAINS) as SubDomainCode[]).map((code) => (
                  <option key={code} value={code}>
                    [{code}] {SUB_DOMAINS[code].title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                ระดับความยาก (Difficulty):
              </label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as QuestionDifficulty)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="easy">ง่าย (Easy)</option>
                <option value="medium">ปานกลาง (Medium)</option>
                <option value="hard">ท้าทาย (Hard)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              คำถาม (โจทย์):
            </label>
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="กรอกข้อความคำถามเกี่ยวกับแท็กหรือโครงสร้าง HTML..."
              className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none h-20"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">ตัวเลือก A:</label>
              <input
                type="text"
                value={choiceA}
                onChange={(e) => setChoiceA(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">ตัวเลือก B:</label>
              <input
                type="text"
                value={choiceB}
                onChange={(e) => setChoiceB(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">ตัวเลือก C:</label>
              <input
                type="text"
                value={choiceC}
                onChange={(e) => setChoiceC(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">ตัวเลือก D:</label>
              <input
                type="text"
                value={choiceD}
                onChange={(e) => setChoiceD(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                เฉลยข้อที่ถูกต้อง:
              </label>
              <select
                value={correctOption}
                onChange={(e) => setCorrectOption(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              >
                <option value="A">ข้อ A</option>
                <option value="B">ข้อ B</option>
                <option value="C">ข้อ C</option>
                <option value="D">ข้อ D</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                คำอธิบายเฉลย (แสดงให้นักเรียนเรียนรู้):
              </label>
              <input
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="อธิบายเหตุผลหรือไวยากรณ์..."
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-sm"
            >
              บันทึกลงคลังข้อสอบ
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-domain filter */}
          <select
            value={selectedSubDomain}
            onChange={(e) => setSelectedSubDomain(e.target.value)}
            className="text-xs p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
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
            className="text-xs p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="all">ทุกระดับความยาก</option>
            <option value="easy">ง่าย (Easy)</option>
            <option value="medium">ปานกลาง (Medium)</option>
            <option value="hard">ท้าทาย (Hard)</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาข้อสอบ..."
            className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs w-56"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
              q.active
                ? 'border-slate-200 dark:border-slate-800 shadow-xs'
                : 'border-slate-200/60 dark:border-slate-800/60 opacity-60 bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {q.sub_domain_code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      q.difficulty === 'easy'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : q.difficulty === 'medium'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="text-slate-400">
                    เฉลย: <strong>ข้อ {q.correct_option}</strong>
                  </span>
                </div>

                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed">
                  {idx + 1}. {q.question_text}
                </h3>

                {q.code_snippet && (
                  <pre className="p-3 rounded-lg bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-w-xl">
                    {q.code_snippet}
                  </pre>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <div>A: {q.choices.A}</div>
                  <div>B: {q.choices.B}</div>
                  {q.choices.C && <div>C: {q.choices.C}</div>}
                  {q.choices.D && <div>D: {q.choices.D}</div>}
                </div>

                {q.explanation && (
                  <p className="text-[11px] text-slate-500 pt-1 italic">
                    💡 คำอธิบาย: {q.explanation}
                  </p>
                )}
              </div>

              {/* Status Action */}
              <button
                onClick={() => toggleQuestionStatus(q.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                  q.active
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {q.active ? 'เปิดใช้งานอยู่ ✓' : 'ปิดใช้งาน'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
