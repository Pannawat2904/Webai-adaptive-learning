'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getQuestions,
  saveQuestion,
  deleteQuestion,
  subscribeToDatabase,
  resetToDefaultCurriculum,
} from '@/lib/database-service';
import { Question, SubDomainCode, SUB_DOMAINS, QuestionDifficulty } from '@/types/database';
import {
  FileQuestion,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Edit,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  RefreshCw,
  Eye,
  Check,
  Code,
} from 'lucide-react';
import { useTeacherContext } from '@/components/teacher/TeacherContext';

const DEFAULT_EMPTY_QUESTION: Question = {
  id: '',
  sub_domain_code: 'H1',
  difficulty: 'medium',
  cognitive_level: 'understand',
  answer_type: 'single_choice',
  question_text: '',
  code_snippet: '',
  choices: {
    A: '',
    B: '',
    C: '',
    D: '',
  },
  correct_option: 'A',
  explanation: '',
  active: true,
  validated: true,
  ioc_score: 1.0,
  irt_a: 1.2,
  irt_b: 0.0,
  irt_c: 0.25,
  irt_calibration_status: 'calibrated',
};

export default function QuestionBankPage() {
  const { isResearchMode } = useTeacherContext();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubDomain, setSelectedSubDomain] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Editor Modal State
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question>(DEFAULT_EMPTY_QUESTION);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    setQuestions(getQuestions());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToDatabase((event) => {
      if (event.type === 'question' || event.type === 'reset') {
        loadData();
      }
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingQuestion({
      ...DEFAULT_EMPTY_QUESTION,
      id: `q-custom-${Date.now()}`,
    });
    setIsNewQuestion(true);
    setShowEditor(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion({
      ...q,
      choices: {
        A: q.choices?.A || '',
        B: q.choices?.B || '',
        C: q.choices?.C || '',
        D: q.choices?.D || '',
      },
    });
    setIsNewQuestion(false);
    setShowEditor(true);
  };

  const handleDelete = (id: string) => {
    const target = questions.find((q) => q.id === id);
    if (!target) return;

    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อสอบ:\n"${target.question_text.slice(0, 60)}..." ?\n\nการลบจะมีผลทันทีต่อระบบการสอบของผู้เรียนแบบ Real-time`)) {
      deleteQuestion(id);
      showToast('ลบข้อสอบออกจากคลังและฐานข้อมูลสำเร็จ (Real-time)');
    }
  };

  const handleToggleActive = (q: Question) => {
    const updated = { ...q, active: !q.active };
    saveQuestion(updated);
    showToast(`${updated.active ? 'เปิดใช้งาน' : 'ระงับการใช้งาน'} ข้อสอบ ${q.id} เรียบร้อย`);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion.question_text.trim()) {
      alert('กรุณากรอกข้อความคำถาม');
      return;
    }
    if (!editingQuestion.choices.A || !editingQuestion.choices.B) {
      alert('กรุณากรอกตัวเลือกอย่างน้อยตัวเลือก A และ B');
      return;
    }

    saveQuestion(editingQuestion);
    setShowEditor(false);
    showToast(isNewQuestion ? 'เพิ่มข้อสอบใหม่สู่คลังสำเร็จ! นักเรียนจะเห็นในการสอบทันที' : 'บันทึกการแก้ไขข้อสอบสำเร็จ (Real-time)');
  };

  const handleReset = () => {
    if (window.confirm('คุณต้องการรีเซ็ตคลังข้อสอบทั้งหมดกลับเป็น 40 ข้อมาตรฐานตามหลักสูตรทางการใช่หรือไม่?')) {
      resetToDefaultCurriculum();
      showToast('รีเซ็ตคลังข้อสอบกลับเป็น 40 ข้อมาตรฐานเรียบร้อย');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSub = selectedSubDomain === 'all' || q.sub_domain_code === selectedSubDomain;
    const matchesSearch =
      q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSub && matchesSearch;
  });

  const totalQuestions = questions.length;
  const readyQuestions = questions.filter((q) => q.validated && q.active).length;
  const waitingCalibration = questions.filter((q) => !q.active).length;
  const needsImprovement = questions.filter((q) => q.validated === false).length;

  return (
    <div className="space-y-8 pb-16 px-4 md:px-0 enter max-w-[1200px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link
            href="/teacher"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับไปยังภาพรวมชั้นเรียน</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white drop-shadow-sm mb-1 flex items-center gap-3">
            <FileQuestion className="w-8 h-8 text-[#d97706] dark:text-[#00ff9d]" />
            คลังข้อสอบ (Question Bank)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            จัดการข้อสอบ เชื่อมโยงระบบ Adaptive Testing (CAT) ของผู้เรียนแบบ Real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl border border-line bg-surface text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all"
            title="รีเซ็ตกลับเป็น 40 ข้อมาตรฐาน"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>รีเซ็ต 40 ข้อ</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-[#d97706] dark:bg-[#00ff9d] text-white dark:text-black text-xs font-bold shadow-sm hover:opacity-90 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> เพิ่มข้อสอบใหม่
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-sm font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">ข้อสอบทั้งหมดในฐานข้อมูล</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalQuestions} ข้อ</div>
        </div>
        <div className="card p-4 border-[#16a34a]/30 bg-[#16a34a]/5">
          <div className="text-xs text-[#16a34a] dark:text-[#00ff9d] mb-1">พร้อมใช้งานในระบบ CAT (Active)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{readyQuestions} ข้อ</div>
        </div>
        <div className="card p-4 border-[#d97706]/30 bg-[#d97706]/5">
          <div className="text-xs text-[#d97706] dark:text-[#ffaa00] mb-1">ปิดใช้งานชั่วคราว (Inactive)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{waitingCalibration} ข้อ</div>
        </div>
        <div className="card p-4 border-[#e11d48]/30 bg-[#e11d48]/5">
          <div className="text-xs text-[#e11d48] dark:text-[#ff3366] mb-1">รอการตรวจสอบ (Invalidated)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{needsImprovement} ข้อ</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาข้อความ หรือ ID ข้อสอบ..."
              className="pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-line text-xs text-ink focus:outline-none focus:border-primary w-full sm:w-72"
            />
          </div>
          <select
            value={selectedSubDomain}
            onChange={(e) => setSelectedSubDomain(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-surface border border-line text-xs font-semibold text-ink focus:outline-none focus:border-primary"
          >
            <option value="all">ทุก Sub-domain (H1 - H5)</option>
            {(Object.keys(SUB_DOMAINS) as SubDomainCode[]).map((c) => (
              <option key={c} value={c}>{c} - {SUB_DOMAINS[c].name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-muted font-mono">
          แสดงผล {filteredQuestions.length} จาก {totalQuestions} ข้อ
        </div>
      </div>

      {/* Questions Table */}
      <div className="card p-0 overflow-hidden border-line shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 border-b border-line">
              <tr>
                <th className="px-5 py-3.5 font-bold uppercase">ID</th>
                <th className="px-5 py-3.5 font-bold uppercase">ข้อความคำถาม</th>
                <th className="px-5 py-3.5 text-center font-bold uppercase">Domain</th>
                <th className="px-5 py-3.5 text-center font-bold uppercase">ความยาก</th>
                <th className="px-5 py-3.5 text-center font-bold uppercase">เฉลย</th>
                {isResearchMode && (
                  <>
                    <th className="px-4 py-3.5 text-center font-bold uppercase">a (Discrim)</th>
                    <th className="px-4 py-3.5 text-center font-bold uppercase">b (Diff θ)</th>
                    <th className="px-4 py-3.5 text-center font-bold uppercase">c (Guess)</th>
                  </>
                )}
                <th className="px-5 py-3.5 text-center font-bold uppercase">สถานะใช้งาน</th>
                <th className="px-5 py-3.5 text-right font-bold uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {filteredQuestions.map((q) => {
                return (
                  <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500 font-bold">
                      {q.id}
                    </td>
                    <td className="px-5 py-3.5 max-w-md">
                      <div className="text-ink font-semibold truncate" title={q.question_text}>
                        {q.question_text}
                      </div>
                      {q.code_snippet && (
                        <div className="text-[10px] text-indigo-500 font-mono flex items-center gap-1 mt-0.5">
                          <Code className="w-3 h-3" /> มี Code Snippet
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {q.sub_domain_code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center capitalize">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.difficulty === 'hard'
                            ? 'bg-rose-500/10 text-rose-600'
                            : q.difficulty === 'medium'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 font-bold font-mono inline-flex items-center justify-center text-xs">
                        {q.correct_option}
                      </span>
                    </td>

                    {isResearchMode && (
                      <>
                        <td className="px-4 py-3.5 text-center font-mono text-slate-700 dark:text-slate-300">
                          {q.irt_a !== undefined && q.irt_a !== null ? Number(q.irt_a).toFixed(2) : '1.00'}
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono text-slate-700 dark:text-slate-300">
                          {q.irt_b !== undefined && q.irt_b !== null ? Number(q.irt_b).toFixed(2) : '0.00'}
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono text-slate-700 dark:text-slate-300">
                          {q.irt_c !== undefined && q.irt_c !== null ? Number(q.irt_c).toFixed(2) : '0.25'}
                        </td>
                      </>
                    )}

                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleActive(q)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer ${
                          q.active
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-line'
                        }`}
                        title="คลิกเพื่อสลับสถานะเปิด/ปิด"
                      >
                        {q.active ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{q.active ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(q)}
                          className="p-1.5 rounded-lg border border-line hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                          title="แก้ไขข้อสอบ"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                          title="ลบข้อสอบ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-line flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <h2 className="text-lg font-bold text-ink flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#d97706] dark:text-[#00ff9d]" />
                <span>{isNewQuestion ? 'เพิ่มข้อสอบใหม่สู่คลัง (Real-time)' : `แก้ไขข้อสอบ: ${editingQuestion.id}`}</span>
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="text-slate-400 hover:text-ink text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Row 1: Sub-domain, Difficulty, Cognitive */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sub-domain
                  </label>
                  <select
                    value={editingQuestion.sub_domain_code}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        sub_domain_code: e.target.value as SubDomainCode,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line bg-bg-base text-xs font-bold"
                  >
                    {(Object.keys(SUB_DOMAINS) as SubDomainCode[]).map((c) => (
                      <option key={c} value={c}>{c} - {SUB_DOMAINS[c].name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ระดับความยาก (Difficulty)
                  </label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        difficulty: e.target.value as QuestionDifficulty,
                        irt_b: e.target.value === 'easy' ? -1.0 : e.target.value === 'hard' ? 1.0 : 0.0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line bg-bg-base text-xs font-bold"
                  >
                    <option value="easy">Easy (ง่าย / b = -1.0)</option>
                    <option value="medium">Medium (ปานกลาง / b = 0.0)</option>
                    <option value="hard">Hard (ยาก / b = +1.0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ระดับพุทธิพิสัย (Cognitive Level)
                  </label>
                  <select
                    value={editingQuestion.cognitive_level}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        cognitive_level: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line bg-bg-base text-xs font-bold"
                  >
                    <option value="remember">ความจำ (Remember)</option>
                    <option value="understand">ความเข้าใจ (Understand)</option>
                    <option value="apply">การประยุกต์ใช้ (Apply)</option>
                    <option value="analyze">การวิเคราะห์ (Analyze)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Question Text & Code Snippet */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ข้อความคำถาม (Question Text) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingQuestion.question_text}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question_text: e.target.value,
                      })
                    }
                    placeholder="พิมพ์โจทย์คำถามที่ต้องการให้นักเรียนตอบ..."
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg-base text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-indigo-500" />
                    <span>ตัวอย่างโค้ดประกอบโจทย์ (Code Snippet - ถ้ามี)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={editingQuestion.code_snippet || ''}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        code_snippet: e.target.value,
                      })
                    }
                    placeholder="เช่น <p>Hello World</p>"
                    className="w-full px-4 py-2 rounded-xl border border-line bg-bg-base text-xs font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Choices A, B, C, D and Correct Option */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ตัวเลือกคำตอบและเฉลย (กำหนดตัวเลือกที่ถูกต้องด้วยปุ่มวงกลม) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                    <div
                      key={opt}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                        editingQuestion.correct_option === opt
                          ? 'border-emerald-500 bg-emerald-500/5'
                          : 'border-line bg-bg-base'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setEditingQuestion({
                            ...editingQuestion,
                            correct_option: opt,
                          })
                        }
                        className={`w-7 h-7 rounded-full font-bold font-mono text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                          editingQuestion.correct_option === opt
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                        }`}
                      >
                        {opt}
                      </button>
                      <input
                        type="text"
                        required
                        value={editingQuestion.choices[opt] || ''}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            choices: {
                              ...editingQuestion.choices,
                              [opt]: e.target.value,
                            },
                          })
                        }
                        placeholder={`ข้อความตัวเลือก ${opt}`}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-line bg-surface text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 4: Explanation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  คำอธิบายเฉลย (Explanation - แสดงเมื่อผู้เรียนทำข้อสอบเสร็จ)
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation || ''}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      explanation: e.target.value,
                    })
                  }
                  placeholder="อธิบายเหตุผลว่าทำไมคำตอบนี้จึงถูกต้อง..."
                  className="w-full px-4 py-2 rounded-xl border border-line bg-bg-base text-xs"
                />
              </div>

              {/* Row 5: IRT 3PL Parameters & Active Status */}
              <div className="p-4 rounded-xl border border-line bg-surface/50 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    a (Discrimination)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingQuestion.irt_a ?? 1.2}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        irt_a: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-line bg-bg-base text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    b (Difficulty θ)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingQuestion.irt_b ?? 0.0}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        irt_b: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-line bg-bg-base text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    c (Pseudo-guessing)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingQuestion.irt_c ?? 0.25}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        irt_c: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-line bg-bg-base text-xs font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4 sm:pt-0">
                  <input
                    type="checkbox"
                    id="active-check"
                    checked={editingQuestion.active}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        active: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <label htmlFor="active-check" className="text-xs font-bold text-ink cursor-pointer">
                    เปิดใช้งานข้อสอบทันที (Active)
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="px-5 py-2.5 rounded-xl border border-line text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  บันทึกข้อสอบ (Real-time)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
