'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_UNITS, MOCK_LESSONS } from '@/lib/mock-data';
import { Unit, LessonMedia, SUB_DOMAINS } from '@/types/database';
import {
  BookOpen,
  ArrowLeft,
  Presentation,
  Tv,
  FileText,
  Plus,
  MoveUp,
  MoveDown,
  Trash2,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function TeacherLessonsManagerPage() {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(MOCK_UNITS[0].id);
  const currentUnit = MOCK_UNITS.find((u) => u.id === selectedUnitId) || MOCK_UNITS[0];
  const lesson = MOCK_LESSONS[selectedUnitId] || MOCK_LESSONS['u-h1'];

  const [mediaList, setMediaList] = useState<LessonMedia[]>(lesson.media || []);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // New media modal/state
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'slide' | 'video' | 'document'>('slide');
  const [newUrl, setNewUrl] = useState('');

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...mediaList];
    const temp = items[index - 1];
    items[index - 1] = items[index];
    items[index] = temp;
    setMediaList(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === mediaList.length - 1) return;
    const items = [...mediaList];
    const temp = items[index + 1];
    items[index + 1] = items[index];
    items[index] = temp;
    setMediaList(items);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMediaItem: LessonMedia = {
      id: 'm-custom-' + Date.now(),
      lesson_id: lesson.id,
      media_type: newType,
      title: newTitle,
      external_url: newUrl,
      order_no: mediaList.length + 1,
    };

    setMediaList([...mediaList, newMediaItem]);
    setShowAddMedia(false);
    setNewTitle('');
    setNewUrl('');
  };

  const handleSaveOrder = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
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
            <BookOpen className="w-4 h-4" />
            <span>Learning Management & Media Organizer</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            จัดการบทเรียนและจัดลำดับสื่อการสอน
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ครูผู้สอนสามารถสลับลำดับสไลด์ วิดีโอ และเอกสารประกอบการเรียนได้
          </p>
        </div>

        <button
          onClick={handleSaveOrder}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>บันทึกลำดับสื่อการสอน</span>
        </button>
      </div>

      {isSavedToast && (
        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>บันทึกลำดับสื่อการสอนเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* Unit Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {MOCK_UNITS.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUnitId(u.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              selectedUnitId === u.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {u.sub_domain_code}: {u.title}
          </button>
        ))}
      </div>

      {/* Media Organizer */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              สื่อการสอนใน {currentUnit.title}
            </h2>
            <span className="text-xs text-slate-500">
              นักเรียนจะเห็นสื่อเรียงตามลำดับ 1, 2, 3 ตามที่ครูกำหนดไว้
            </span>
          </div>

          <button
            onClick={() => setShowAddMedia(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มสื่อใหม่</span>
          </button>
        </div>

        {/* Media Items with Reordering Buttons */}
        <div className="space-y-3">
          {mediaList.map((item, idx) => {
            const isSlide = item.media_type === 'slide';
            const isVideo = item.media_type === 'video';

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-600">
                    {idx + 1}
                  </div>

                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-2xs">
                    {isSlide ? (
                      <Presentation className="w-4 h-4 text-indigo-600" />
                    ) : isVideo ? (
                      <Tv className="w-4 h-4 text-violet-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <div className="text-[11px] text-slate-400">
                      ประเภท:{' '}
                      {isSlide
                        ? 'สไลด์การสอน (PDF/Slide Viewer)'
                        : isVideo
                        ? 'วิดีโอบรรยาย (HTML5/YouTube)'
                        : 'เอกสารดาวน์โหลด'}
                    </div>
                  </div>
                </div>

                {/* Reorder actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
                    title="เลื่อนขึ้น"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === mediaList.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
                    title="เลื่อนลง"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
