'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_UNITS, MOCK_LESSONS, getCanvaEmbedUrl, getCanvaShareUrl } from '@/lib/mock-data';
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
  ExternalLink,
} from 'lucide-react';

export default function TeacherLessonsManagerPage() {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(MOCK_UNITS[0].id);
  const currentUnit = MOCK_UNITS.find((u) => u.id === selectedUnitId) || MOCK_UNITS[0];
  const lesson = MOCK_LESSONS[selectedUnitId] || MOCK_LESSONS['u-h1'];

  const [mediaList, setMediaList] = useState<LessonMedia[]>(lesson.media || []);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const defaultCanva = getCanvaEmbedUrl(lesson.media?.find((m) => m.media_type === 'slide')?.external_url, selectedUnitId);
  const [canvaUrl, setCanvaUrl] = useState(defaultCanva);
  const [lessonContent, setLessonContent] = useState(lesson.content || '');

  // Real-time: Load saved data from localStorage
  React.useEffect(() => {
    const currentLesson = MOCK_LESSONS[selectedUnitId] || MOCK_LESSONS['u-h1'];
    setMediaList(currentLesson.media || []);

    const unitDefaultCanva = getCanvaEmbedUrl(currentLesson.media?.find((m) => m.media_type === 'slide')?.external_url, selectedUnitId);
    const saved = localStorage.getItem(`webai_lesson_data_${selectedUnitId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCanvaUrl(parsed.canvaUrl ? getCanvaEmbedUrl(parsed.canvaUrl, selectedUnitId) : unitDefaultCanva);
        setLessonContent(parsed.content || currentLesson.content || '');
      } catch {
        setCanvaUrl(unitDefaultCanva);
        setLessonContent(currentLesson.content || '');
      }
    } else {
      setCanvaUrl(unitDefaultCanva);
      setLessonContent(currentLesson.content || '');
    }
  }, [selectedUnitId]);

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

  const handleSaveLessonData = () => {
    const formattedCanva = getCanvaEmbedUrl(canvaUrl, selectedUnitId);
    localStorage.setItem(`webai_lesson_data_${selectedUnitId}`, JSON.stringify({
      canvaUrl: formattedCanva,
      content: lessonContent
    }));
    setCanvaUrl(formattedCanva);
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

      {/* Header in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Learning Management & Media Organizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              จัดการบทเรียนและจัดลำดับสื่อการสอน
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              ครูผู้สอนสามารถสลับลำดับสไลด์ วิดีโอ และเอกสารประกอบการเรียนได้ตามแผนการสอน
            </p>
          </div>

          <button
            onClick={handleSaveLessonData}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการเปลี่ยนแปลงทั้งหมด (Real-time)</span>
          </button>
        </div>
      </div>

      {isSavedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>บันทึกข้อมูลเรียบร้อย ข้อมูลอัปเดตไปยังหน้านักเรียนแบบ Real-time แล้ว</span>
        </div>
      )}

      {/* Unit Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {MOCK_UNITS.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUnitId(u.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedUnitId === u.id
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                : 'liquid-glass text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-500/30'
            }`}
          >
            {u.sub_domain_code}: {u.title}
          </button>
        ))}
      </div>

      {/* Media Organizer in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              สื่อการสอนใน {currentUnit.title}
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              นักเรียนจะเห็นสื่อเรียงตามลำดับ 1, 2, 3 ตามที่ครูกำหนดไว้
            </span>
          </div>

          <button
            onClick={() => setShowAddMedia(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-500/20 transition-colors cursor-pointer"
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
                className="p-4 rounded-2xl border border-white/60 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 flex items-center justify-between gap-4 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 shadow-2xs">
                    {isSlide ? (
                      <Presentation className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    ) : isVideo ? (
                      <Tv className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    ) : (
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <div className="text-[11px] text-slate-400 font-medium">
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
                    className="p-2 rounded-xl liquid-glass border border-white/60 dark:border-white/10 hover:border-indigo-500/40 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 cursor-pointer transition-all"
                    title="เลื่อนขึ้น"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === mediaList.length - 1}
                    className="p-2 rounded-xl liquid-glass border border-white/60 dark:border-white/10 hover:border-indigo-500/40 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 cursor-pointer transition-all"
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

      {/* Real-time Content Editor in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Presentation className="w-4 h-4 text-indigo-500" /> แก้ไขเนื้อหาและ Canva สไลด์
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              การเปลี่ยนแปลงที่นี่จะแสดงผลไปยังหน้านักเรียนแบบ Real-time
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Canva Presentation URL / Embed URL
              </label>
              {canvaUrl && (
                <a
                  href={getCanvaShareUrl(canvaUrl, selectedUnitId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  เปิดสไลด์ใน Canva <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="https://canva.link/... หรือ https://www.canva.com/design/.../view?embed"
              value={canvaUrl}
              onChange={(e) => setCanvaUrl(e.target.value)}
            />
            <p className="text-[11px] text-slate-500">
              รองรับทั้งลิงก์ Canva แบบแชร์ (เช่น https://canva.link/...) และ Embed URL (ระบบจะแปลงให้อัตโนมัติเมื่อบันทึก)
            </p>

            {/* Live Preview of Canva presentation */}
            {canvaUrl && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-video relative max-w-xl">
                <iframe
                  loading="lazy"
                  className="w-full h-full border-0"
                  src={getCanvaEmbedUrl(canvaUrl, selectedUnitId)}
                  allowFullScreen
                  allow="fullscreen"
                  title="ตัวอย่างสไลด์ Canva"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              เนื้อหาบทเรียน (HTML / Markdown)
            </label>
            <textarea
              className="w-full h-48 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono resize-none leading-relaxed"
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
