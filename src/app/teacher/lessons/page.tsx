'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getUnits,
  saveUnit,
  getLesson,
  saveLesson,
  getYoutubeEmbedUrl,
  subscribeToDatabase,
  resetToDefaultCurriculum,
} from '@/lib/database-service';
import { getCanvaEmbedUrl, getCanvaShareUrl } from '@/lib/mock-data';
import { Unit, LessonMedia, Lesson } from '@/types/database';
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
  Eye,
  RefreshCw,
  Video,
  FileCode,
} from 'lucide-react';

export default function TeacherLessonsManagerPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('u-h1');
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);

  // Lesson fields
  const [unitTitle, setUnitTitle] = useState('');
  const [unitDescription, setUnitDescription] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [mediaList, setMediaList] = useState<LessonMedia[]>([]);

  // Canva and Video URLs
  const [canvaUrl, setCanvaUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isResetToast, setIsResetToast] = useState(false);

  // New media modal/state
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'slide' | 'video' | 'document'>('slide');
  const [newUrl, setNewUrl] = useState('');

  // Load units and current lesson on mount and when unit changes
  const loadData = () => {
    const loadedUnits = getUnits();
    setUnits(loadedUnits);

    const activeUnit = loadedUnits.find((u) => u.id === selectedUnitId) || loadedUnits[0];
    if (activeUnit) {
      setCurrentUnit(activeUnit);
      setUnitTitle(activeUnit.title);
      setUnitDescription(activeUnit.description || '');

      const activeLesson = getLesson(activeUnit.id);
      setLessonTitle(activeLesson.title);
      setLessonContent(activeLesson.content || '');
      setMediaList(activeLesson.media || []);

      const slide = activeLesson.media?.find((m) => m.media_type === 'slide');
      const video = activeLesson.media?.find((m) => m.media_type === 'video');

      setCanvaUrl(slide?.meta?.share_url as string || slide?.external_url || getCanvaEmbedUrl(null, activeUnit.id));
      setVideoUrl(video?.external_url || 'https://www.youtube.com/embed/kUMe1FH4CHE');
    }
  };

  useEffect(() => {
    loadData();
    // Subscribe to database changes (e.g. from other tabs or actions)
    const unsubscribe = subscribeToDatabase((event) => {
      if (event.type === 'unit' || event.type === 'lesson' || event.type === 'reset') {
        loadData();
      }
    });
    return () => unsubscribe();
  }, [selectedUnitId]);

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

  const handleDeleteMedia = (index: number) => {
    const items = mediaList.filter((_, i) => i !== index);
    setMediaList(items);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let finalUrl = newUrl.trim();
    if (newType === 'slide') {
      finalUrl = getCanvaEmbedUrl(finalUrl, selectedUnitId);
    } else if (newType === 'video') {
      finalUrl = getYoutubeEmbedUrl(finalUrl);
    }

    const newMediaItem: LessonMedia = {
      id: `m-custom-${Date.now()}`,
      lesson_id: currentUnit?.id || 'l-custom',
      media_type: newType,
      title: newTitle.trim(),
      external_url: finalUrl,
      order_no: mediaList.length + 1,
    };

    setMediaList([...mediaList, newMediaItem]);
    setShowAddMedia(false);
    setNewTitle('');
    setNewUrl('');
  };

  const handleSaveAll = () => {
    if (!currentUnit) return;

    // 1. Update Unit
    saveUnit({
      id: currentUnit.id,
      title: unitTitle.trim() || currentUnit.title,
      description: unitDescription.trim(),
    });

    // 2. Prepare media list with updated Canva and Video URLs
    const formattedCanva = getCanvaEmbedUrl(canvaUrl, currentUnit.id);
    const formattedVideo = getYoutubeEmbedUrl(videoUrl);

    let updatedMedia = [...mediaList];

    // Ensure slide media has the latest URL
    const slideIdx = updatedMedia.findIndex((m) => m.media_type === 'slide');
    if (slideIdx !== -1) {
      updatedMedia[slideIdx] = {
        ...updatedMedia[slideIdx],
        external_url: formattedCanva,
        meta: {
          ...updatedMedia[slideIdx].meta,
          share_url: canvaUrl,
        },
      };
    } else if (canvaUrl.trim()) {
      updatedMedia.unshift({
        id: `m-${currentUnit.id}-slide`,
        lesson_id: `l-${currentUnit.sub_domain_code.toLowerCase()}`,
        media_type: 'slide',
        title: `สไลด์การสอน: ${unitTitle}`,
        external_url: formattedCanva,
        meta: { share_url: canvaUrl },
        order_no: 1,
      });
    }

    // Ensure video media has the latest URL
    const videoIdx = updatedMedia.findIndex((m) => m.media_type === 'video');
    if (videoIdx !== -1) {
      updatedMedia[videoIdx] = {
        ...updatedMedia[videoIdx],
        external_url: formattedVideo,
      };
    } else if (videoUrl.trim()) {
      updatedMedia.push({
        id: `m-${currentUnit.id}-video`,
        lesson_id: `l-${currentUnit.sub_domain_code.toLowerCase()}`,
        media_type: 'video',
        title: `วิดีโอสอน: ${unitTitle}`,
        external_url: formattedVideo,
        order_no: updatedMedia.length + 1,
      });
    }

    // 3. Update Lesson
    saveLesson(currentUnit.id, {
      title: lessonTitle.trim() || unitTitle,
      content: lessonContent,
      media: updatedMedia,
      canvaUrl: formattedCanva,
      videoUrl: formattedVideo,
    });

    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleResetCurriculum = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลบทเรียน สไลด์ วิดีโอ และข้อสอบทั้งหมดกลับเป็นค่ามาตรฐานทางการใช่หรือไม่?')) {
      resetToDefaultCurriculum();
      setIsResetToast(true);
      setTimeout(() => setIsResetToast(false), 3000);
    }
  };

  if (!currentUnit) {
    return (
      <div className="p-8 text-center text-slate-500">
        กำลังโหลดข้อมูลบทเรียน...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 enter max-w-[1200px] mx-auto">
      {/* Top Nav & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/teacher"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับไปยังภาพรวมชั้นเรียน</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/student/lessons/${selectedUnitId}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span>ดูมุมมองของผู้เรียน</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
          <button
            onClick={handleResetCurriculum}
            title="รีเซ็ตกลับเป็นค่ามาตรฐานหลักสูตร 5 หน่วย"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>รีเซ็ตหลักสูตร</span>
          </button>
        </div>
      </div>

      {/* Main Glass Header */}
      <div className="card p-6 sm:p-8 space-y-4 border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>ระบบจัดการบทเรียนเชื่อมโยงฐานข้อมูลแบบ Real-time</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              จัดการเนื้อหา สไลด์ และวิดีโอการสอน
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              แก้ไขชื่อหน่วย คำอธิบาย สไลด์ Canva ลิงก์วิดีโอ YouTube และเนื้อหาบทเรียน เมื่อครูบันทึก หน้าจอของผู้เรียนจะอัปเดตตรงกันทันที
            </p>
          </div>

          <button
            onClick={handleSaveAll}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการเปลี่ยนแปลงทันที (Real-time)</span>
          </button>
        </div>
      </div>

      {/* Toast Alerts */}
      {isSavedToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-sm font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>บันทึกข้อมูลเข้าสู่ฐานข้อมูลสำเร็จ! ข้อมูลในหน้าจอของผู้เรียนถูกอัปเดตแบบ Real-time เรียบร้อยแล้ว</span>
        </div>
      )}

      {isResetToast && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-sm font-bold flex items-center gap-3 animate-in fade-in">
          <RefreshCw className="w-5 h-5 text-amber-600 shrink-0" />
          <span>รีเซ็ตข้อมูลบทเรียนและข้อสอบทั้งหมดกลับเป็นมาตรฐานทางการ 5 หน่วยการเรียนรู้แล้ว</span>
        </div>
      )}

      {/* Unit Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-line">
        {units.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUnitId(u.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
              selectedUnitId === u.id
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-surface border border-line text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <span className="font-mono">{u.sub_domain_code}</span>
            <span>{u.title}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Unit Metadata & Media List (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Unit & Lesson Basics */}
          <div className="card p-6 space-y-4 border-line">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-500" />
              <span>ข้อมูลหน่วยการเรียนรู้ ({currentUnit.sub_domain_code})</span>
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ชื่อหน่วยการเรียนรู้ (Unit Title)
                </label>
                <input
                  type="text"
                  value={unitTitle}
                  onChange={(e) => {
                    setUnitTitle(e.target.value);
                    if (!lessonTitle || lessonTitle === unitTitle) {
                      setLessonTitle(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="เช่น โครงสร้างพื้นฐานของภาษา HTML"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  คำอธิบายหน่วยการเรียนรู้ (Description)
                </label>
                <textarea
                  rows={2}
                  value={unitDescription}
                  onChange={(e) => setUnitDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
                  placeholder="รายละเอียดหัวข้อย่อยและสมรรถนะการเรียนรู้"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Canva Slides Link & Preview */}
          <div className="card p-6 space-y-4 border-line">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Presentation className="w-4 h-4 text-indigo-500" />
                <span>สไลด์การสอน Canva (Canva Presentation)</span>
              </h2>
              {canvaUrl && (
                <a
                  href={getCanvaShareUrl(canvaUrl, currentUnit.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  เปิดสไลด์ใน Canva <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500">
                Canva Share Link หรือ Embed Link
              </label>
              <input
                type="text"
                value={canvaUrl}
                onChange={(e) => setCanvaUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="https://canva.link/... หรือ https://www.canva.com/design/.../view?embed"
              />
              <p className="text-[11px] text-slate-500">
                * รองรับทั้งลิงก์แชร์สั้น Canva (เช่น https://canva.link/...) และ Embed iframe URL
              </p>

              {/* Preview */}
              {canvaUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-line aspect-video bg-black relative shadow-inner">
                  <iframe
                    loading="lazy"
                    className="w-full h-full border-0"
                    src={getCanvaEmbedUrl(canvaUrl, currentUnit.id)}
                    allowFullScreen
                    allow="fullscreen"
                    title="ตัวอย่างสไลด์ Canva"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Card 3: YouTube Video Link & Preview */}
          <div className="card p-6 space-y-4 border-line">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-rose-500" />
              <span>วิดีโอบทเรียน (YouTube / Video Stream)</span>
            </h2>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500">
                YouTube URL หรือ Video Embed URL
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                placeholder="https://www.youtube.com/watch?v=... หรือ https://youtu.be/..."
              />
              <p className="text-[11px] text-slate-500">
                * รองรับทั้งลิงก์ YouTube ปกติ, ลิงก์ย่อ youtu.be หรือ embed URL ระบบจะแปลงให้อัตโนมัติ
              </p>

              {/* Preview */}
              {videoUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-line aspect-video bg-black relative shadow-inner">
                  <iframe
                    className="w-full h-full border-0"
                    src={getYoutubeEmbedUrl(videoUrl)}
                    title="ตัวอย่างวิดีโอการสอน"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Detailed Lesson Content */}
          <div className="card p-6 space-y-4 border-line">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>เนื้อหาคำอธิบายประกอบบทเรียน (Lesson Text & Code Guide)</span>
            </h2>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500">
                เนื้อหาบทเรียน (Markdown / HTML)
              </label>
              <textarea
                rows={10}
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-line bg-surface text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed resize-y"
                placeholder="เขียนเนื้อหาหรือคำอธิบายประกอบบทเรียน..."
              />
            </div>
          </div>
        </div>

        {/* Right Column: Media Organizer & Quick Actions */}
        <div className="space-y-6">
          <div className="card p-6 space-y-4 border-line sticky top-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-500" />
                <span>จัดลำดับสื่อในบทเรียน</span>
              </h3>
              <button
                onClick={() => setShowAddMedia(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-500/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่ม</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              นักเรียนจะเห็นสื่อเรียงตามลำดับนี้ สามารถสลับตำแหน่งหรือลบได้
            </p>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {mediaList.map((item, idx) => {
                const isSlide = item.media_type === 'slide';
                const isVideo = item.media_type === 'video';

                return (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-xl border border-line bg-surface/70 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </div>
                      <div className="p-1 rounded bg-bg-base shrink-0">
                        {isSlide ? (
                          <Presentation className="w-3.5 h-3.5 text-indigo-500" />
                        ) : isVideo ? (
                          <Tv className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                        title="เลื่อนขึ้น"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === mediaList.length - 1}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                        title="เลื่อนลง"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(idx)}
                        className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500 cursor-pointer"
                        title="ลบ"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-line">
              <button
                onClick={handleSaveAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกทั้งหมดสู่ฐานข้อมูล</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Custom Media */}
      {showAddMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="card p-6 max-w-md w-full border-line space-y-4 bg-surface shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              เพิ่มสื่อการสอนใหม่
            </h3>
            <form onSubmit={handleAddMedia} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ประเภทสื่อ
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-bg-base text-xs font-bold"
                >
                  <option value="slide">สไลด์การสอน (Canva/Presentation)</option>
                  <option value="video">วิดีโอการสอน (YouTube/Video)</option>
                  <option value="document">เอกสารประกอบการเรียน (PDF/Document)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อสื่อ
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="เช่น สไลด์สรุปเนื้อหา หรือ วิดีโออธิบายเพิ่มเติม"
                  className="w-full px-3 py-2 rounded-xl border border-line bg-bg-base text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL / ลิงก์
                </label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-line bg-bg-base text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedia(false)}
                  className="px-4 py-2 rounded-xl border border-line text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs"
                >
                  เพิ่มสื่อ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
