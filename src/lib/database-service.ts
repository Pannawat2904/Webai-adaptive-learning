import { Unit, Lesson, LessonMedia, Question, TestSession, SubDomainCode } from '@/types/database';
import {
  MOCK_UNITS,
  MOCK_LESSONS,
  MOCK_QUESTIONS,
  MOCK_CLASS_STUDENTS,
  getCanvaEmbedUrl,
} from './mock-data';
import { MOCK_TEST_SESSIONS } from './mock-sessions';
import { createClient } from './supabase/client';

// LocalStorage Keys for persistent client-side database
export const DB_KEYS = {
  UNITS: 'webai_db_units_v2',
  LESSONS: 'webai_db_lessons_v2',
  QUESTIONS: 'webai_db_questions_v3',
  STUDENTS: 'webai_db_students_v2',
  SESSIONS: 'webai_db_sessions_v2',
} as const;

export interface StudentRecord {
  id: string;
  name: string;
  scores: Record<string, number>;
  completion: number;
  avgScore: number;
  theta?: number;
  se?: number;
  lastTested?: string;
}

export type DbSyncEventType = 'unit' | 'lesson' | 'question' | 'student' | 'session' | 'reset';

export interface DbSyncEvent {
  type: DbSyncEventType;
  id?: string;
  data?: unknown;
  timestamp: number;
}

// Convert various YouTube URL formats to standard embed URL
export function getYoutubeEmbedUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return 'https://www.youtube.com/embed/kUMe1FH4CHE';
  }
  const clean = url.trim();
  if (clean.includes('/embed/')) return clean;

  const ytMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return clean;
}

// Setup BroadcastChannel for zero-latency cross-tab synchronization
let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('webai_sync_channel');
  } catch (err) {
    console.warn('BroadcastChannel not supported or restricted:', err);
  }
}

// Dispatch event across in-page listeners, cross-tab BroadcastChannel, and LocalStorage
function broadcastChange(type: DbSyncEventType, id?: string, data?: unknown) {
  if (typeof window === 'undefined') return;

  const eventPayload: DbSyncEvent = {
    type,
    id,
    data,
    timestamp: Date.now(),
  };

  // 1. In-page CustomEvent
  window.dispatchEvent(new CustomEvent('webai_db_sync', { detail: eventPayload }));

  // 2. Cross-tab BroadcastChannel
  if (syncChannel) {
    try {
      syncChannel.postMessage(eventPayload);
    } catch {
      // ignore
    }
  }

  // 3. Fallback timestamp in localStorage to trigger storage event
  try {
    localStorage.setItem('webai_last_sync_ts', String(Date.now()));
  } catch {
    // ignore
  }
}

// --- Units Management ---
export function getUnits(): Unit[] {
  if (typeof window === 'undefined') return MOCK_UNITS;
  try {
    const raw = localStorage.getItem(DB_KEYS.UNITS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading units from storage:', e);
  }
  // Initialize default
  try {
    localStorage.setItem(DB_KEYS.UNITS, JSON.stringify(MOCK_UNITS));
  } catch {
    // ignore
  }
  return MOCK_UNITS;
}

export function saveUnit(unitData: Partial<Unit> & { id: string }): Unit {
  const units = getUnits();
  const index = units.findIndex((u) => u.id === unitData.id);
  let updatedUnit: Unit;

  if (index !== -1) {
    updatedUnit = { ...units[index], ...unitData };
    units[index] = updatedUnit;
  } else {
    updatedUnit = unitData as Unit;
    units.push(updatedUnit);
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DB_KEYS.UNITS, JSON.stringify(units));
    } catch (e) {
      console.error('Failed to save units:', e);
    }
  }

  // Asynchronously attempt to sync to Supabase
  try {
    const supabase = createClient();
    if (supabase) {
      supabase.from('units').upsert({
        id: updatedUnit.id,
        title: updatedUnit.title,
        description: updatedUnit.description,
        order_no: updatedUnit.order_no,
      }).then(({ error }) => {
        if (error) console.warn('Supabase unit sync warning:', error.message);
      });
    }
  } catch {
    // ignore
  }

  broadcastChange('unit', updatedUnit.id, updatedUnit);
  return updatedUnit;
}

// --- Lessons Management ---
export function getLessons(): Record<string, Lesson> {
  if (typeof window === 'undefined') return MOCK_LESSONS;
  try {
    const raw = localStorage.getItem(DB_KEYS.LESSONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {
    console.error('Error reading lessons from storage:', e);
  }

  try {
    localStorage.setItem(DB_KEYS.LESSONS, JSON.stringify(MOCK_LESSONS));
  } catch {
    // ignore
  }
  return MOCK_LESSONS;
}

export function getLesson(unitId: string): Lesson {
  const allLessons = getLessons();
  if (allLessons[unitId]) {
    return allLessons[unitId];
  }
  // Fallback to unit-h1
  return allLessons['u-h1'] || MOCK_LESSONS['u-h1'];
}

export function saveLesson(
  unitId: string,
  update: {
    title?: string;
    content?: string;
    media?: LessonMedia[];
    canvaUrl?: string;
    videoUrl?: string;
  }
): Lesson {
  const allLessons = getLessons();
  const current = allLessons[unitId] || MOCK_LESSONS[unitId] || MOCK_LESSONS['u-h1'];

  let newMedia = update.media ? [...update.media] : (current.media ? [...current.media] : []);

  // Update Canva Slide if provided
  if (update.canvaUrl !== undefined) {
    const formattedCanva = getCanvaEmbedUrl(update.canvaUrl, unitId);
    const slideIndex = newMedia.findIndex((m) => m.media_type === 'slide');
    if (slideIndex !== -1) {
      newMedia[slideIndex] = {
        ...newMedia[slideIndex],
        external_url: formattedCanva,
        meta: {
          ...newMedia[slideIndex].meta,
          share_url: update.canvaUrl,
        },
      };
    } else {
      newMedia.push({
        id: `m-${unitId}-slide-${Date.now()}`,
        lesson_id: current.id,
        media_type: 'slide',
        title: `สไลด์การสอน: ${update.title || current.title}`,
        external_url: formattedCanva,
        meta: { share_url: update.canvaUrl },
        order_no: 1,
      });
    }
  }

  // Update Video URL if provided
  if (update.videoUrl !== undefined) {
    const formattedVideo = getYoutubeEmbedUrl(update.videoUrl);
    const videoIndex = newMedia.findIndex((m) => m.media_type === 'video');
    if (videoIndex !== -1) {
      newMedia[videoIndex] = {
        ...newMedia[videoIndex],
        external_url: formattedVideo,
      };
    } else {
      newMedia.push({
        id: `m-${unitId}-video-${Date.now()}`,
        lesson_id: current.id,
        media_type: 'video',
        title: `วิดีโอสอน: ${update.title || current.title}`,
        external_url: formattedVideo,
        order_no: 2,
      });
    }
  }

  const updatedLesson: Lesson = {
    ...current,
    title: update.title !== undefined ? update.title : current.title,
    content: update.content !== undefined ? update.content : current.content,
    media: newMedia,
  };

  allLessons[unitId] = updatedLesson;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DB_KEYS.LESSONS, JSON.stringify(allLessons));
      // Also update legacy key for backward compatibility
      if (update.canvaUrl !== undefined || update.content !== undefined) {
        localStorage.setItem(`webai_lesson_data_${unitId}`, JSON.stringify({
          canvaUrl: update.canvaUrl ? getCanvaEmbedUrl(update.canvaUrl, unitId) : undefined,
          content: updatedLesson.content,
        }));
      }
    } catch (e) {
      console.error('Failed to save lesson:', e);
    }
  }

  // Asynchronously attempt to sync to Supabase
  try {
    const supabase = createClient();
    if (supabase) {
      supabase.from('lessons').upsert({
        id: updatedLesson.id,
        unit_id: updatedLesson.unit_id,
        title: updatedLesson.title,
        content: updatedLesson.content,
        order_no: updatedLesson.order_no,
      }).then(({ error }) => {
        if (error) console.warn('Supabase lesson sync warning:', error.message);
      });
    }
  } catch {
    // ignore
  }

  broadcastChange('lesson', unitId, updatedLesson);
  return updatedLesson;
}

// --- Questions (Question Bank) Management ---
export function getQuestions(): Question[] {
  if (typeof window === 'undefined') return MOCK_QUESTIONS;
  try {
    const raw = localStorage.getItem(DB_KEYS.QUESTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading questions from storage:', e);
  }

  try {
    localStorage.setItem(DB_KEYS.QUESTIONS, JSON.stringify(MOCK_QUESTIONS));
  } catch {
    // ignore
  }
  return MOCK_QUESTIONS;
}

export function saveQuestion(questionData: Question): Question {
  const questions = getQuestions();
  const index = questions.findIndex((q) => q.id === questionData.id);

  if (index !== -1) {
    questions[index] = { ...questions[index], ...questionData };
  } else {
    questions.unshift(questionData);
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DB_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error('Failed to save question:', e);
    }
  }

  // Asynchronously attempt to sync to Supabase
  try {
    const supabase = createClient();
    if (supabase) {
      supabase.from('questions').upsert({
        id: questionData.id,
        sub_domain_code: questionData.sub_domain_code,
        difficulty: questionData.difficulty,
        cognitive_level: questionData.cognitive_level,
        answer_type: questionData.answer_type,
        question_text: questionData.question_text,
        code_snippet: questionData.code_snippet,
        choices: questionData.choices,
        correct_option: questionData.correct_option,
        explanation: questionData.explanation,
        active: questionData.active,
      }).then(({ error }) => {
        if (error) console.warn('Supabase question sync warning:', error.message);
      });
    }
  } catch {
    // ignore
  }

  broadcastChange('question', questionData.id, questionData);
  return questionData;
}

export function deleteQuestion(questionId: string): boolean {
  const questions = getQuestions();
  const filtered = questions.filter((q) => q.id !== questionId);

  if (filtered.length === questions.length) return false;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DB_KEYS.QUESTIONS, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete question from storage:', e);
    }
  }

  try {
    const supabase = createClient();
    if (supabase) {
      supabase.from('questions').delete().eq('id', questionId).then(({ error }) => {
        if (error) console.warn('Supabase question delete warning:', error.message);
      });
    }
  } catch {
    // ignore
  }

  broadcastChange('question', questionId, { deleted: true });
  return true;
}

// --- Students Management ---
export function getStudents(): StudentRecord[] {
  if (typeof window === 'undefined') return MOCK_CLASS_STUDENTS;
  try {
    const raw = localStorage.getItem(DB_KEYS.STUDENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading students from storage:', e);
  }

  try {
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(MOCK_CLASS_STUDENTS));
  } catch {
    // ignore
  }
  return MOCK_CLASS_STUDENTS;
}

export function saveStudentProgress(data: {
  studentId: string;
  name: string;
  scores: Record<string, number>;
  avgScore: number;
  completion: number;
  theta?: number;
  se?: number;
}): void {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === data.studentId || s.name.includes(data.name));

  const record: StudentRecord = {
    id: data.studentId,
    name: data.name,
    scores: data.scores,
    avgScore: Math.round(data.avgScore * 10) / 10,
    completion: data.completion,
    theta: data.theta !== undefined ? Math.round(data.theta * 100) / 100 : undefined,
    se: data.se !== undefined ? Math.round(data.se * 100) / 100 : undefined,
    lastTested: 'วันนี้ ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
  };

  if (index !== -1) {
    students[index] = { ...students[index], ...record };
  } else {
    students.unshift(record);
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save student progress:', e);
    }
  }

  broadcastChange('student', data.studentId, record);
}

// --- Test Sessions Management ---
export function getTestSessions(): TestSession[] {
  if (typeof window === 'undefined') return MOCK_TEST_SESSIONS;
  try {
    const raw = localStorage.getItem(DB_KEYS.SESSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading test sessions:', e);
  }

  try {
    localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify(MOCK_TEST_SESSIONS));
  } catch {
    // ignore
  }
  return MOCK_TEST_SESSIONS;
}

export function saveTestSession(session: TestSession): void {
  const sessions = getTestSessions();
  const index = sessions.findIndex((s) => s.id === session.id);

  if (index !== -1) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save test session:', e);
    }
  }

  broadcastChange('session', session.id, session);
}

// Reset everything to the pristine official 40-question curriculum
export function resetToDefaultCurriculum(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_KEYS.UNITS, JSON.stringify(MOCK_UNITS));
    localStorage.setItem(DB_KEYS.LESSONS, JSON.stringify(MOCK_LESSONS));
    localStorage.setItem(DB_KEYS.QUESTIONS, JSON.stringify(MOCK_QUESTIONS));
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(MOCK_CLASS_STUDENTS));
    localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify(MOCK_TEST_SESSIONS));

    // Clear legacy single-lesson keys
    MOCK_UNITS.forEach((u) => {
      localStorage.removeItem(`webai_lesson_data_${u.id}`);
    });
  } catch (e) {
    console.error('Failed to reset default curriculum:', e);
  }
  broadcastChange('reset');
}

// Subscribe to real-time database changes across all tabs and components
export function subscribeToDatabase(
  callback: (event: DbSyncEvent) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  // Handler for custom in-tab event
  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent<DbSyncEvent>).detail;
    if (detail) callback(detail);
  };

  // Handler for cross-tab BroadcastChannel
  const handleBroadcastMessage = (e: MessageEvent<DbSyncEvent>) => {
    if (e.data) callback(e.data);
  };

  // Handler for storage event
  const handleStorageEvent = (e: StorageEvent) => {
    if (
      e.key === DB_KEYS.UNITS ||
      e.key === DB_KEYS.LESSONS ||
      e.key === DB_KEYS.QUESTIONS ||
      e.key === DB_KEYS.STUDENTS ||
      e.key === DB_KEYS.SESSIONS ||
      e.key === 'webai_last_sync_ts'
    ) {
      callback({
        type: (e.key?.replace('webai_db_', '').replace('_v2', '') as DbSyncEventType) || 'reset',
        timestamp: Date.now(),
      });
    }
  };

  window.addEventListener('webai_db_sync', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);
  if (syncChannel) {
    syncChannel.addEventListener('message', handleBroadcastMessage);
  }

  return () => {
    window.removeEventListener('webai_db_sync', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleBroadcastMessage);
    }
  };
}
