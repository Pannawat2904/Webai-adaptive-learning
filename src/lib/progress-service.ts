import { SubDomainCode } from '@/types/database';

export type CourseStepKey =
  | 'pretest'
  | 'lessons'
  | 'game'
  | 'quest'
  | 'posttest';

export interface CourseProgress {
  pretest_done: boolean;
  pretest_score?: number;
  lessons_done: boolean;
  completed_lessons: string[];
  game_done: boolean;
  quest_done: boolean;
  posttest_done: boolean;
  posttest_score?: number;
  updated_at: string;
}

export const COURSE_STEPS_CONFIG = [
  {
    key: 'pretest' as CourseStepKey,
    stepNumber: 1,
    title: 'แบบทดสอบก่อนเรียน',
    subtitle: 'Pre-test (ชุดข้อสอบคงที่เฉลี่ยทุกหน่วย)',
    icon: 'ClipboardList',
    href: '/student/assessment?type=pre_test',
    requiredStepName: '',
  },
  {
    key: 'lessons' as CourseStepKey,
    stepNumber: 2,
    title: 'บทเรียน HTML',
    subtitle: 'เนื้อหา 5 เรื่องย่อย + แบบฝึกหัดท้ายหน่วย',
    icon: 'BookOpen',
    href: '/student/lessons',
    requiredStepName: '1. แบบทดสอบก่อนเรียน (Pre-test)',
  },
  {
    key: 'game' as CourseStepKey,
    stepNumber: 3,
    title: 'เกมกู้เว็บพัง',
    subtitle: 'HTML5 Code Rescue (กู้เว็บพัง 5 ด่าน)',
    icon: 'Gamepad2',
    href: '/student/game',
    requiredStepName: '2. บทเรียน HTML',
  },
  {
    key: 'quest' as CourseStepKey,
    stepNumber: 4,
    title: 'ภารกิจเขียนโค้ด',
    subtitle: 'Code Lab (ตะลุยด่านปฏิบัติการ)',
    icon: 'Terminal',
    href: '/student/quests',
    requiredStepName: '3. เกมกู้เว็บพัง',
  },
  {
    key: 'posttest' as CourseStepKey,
    stepNumber: 5,
    title: 'แบบทดสอบหลังเรียน',
    subtitle: 'Post-test (Adaptive CAT ประเมินผลรวม)',
    icon: 'Trophy',
    href: '/student/assessment?type=post_test',
    requiredStepName: '4. ภารกิจเขียนโค้ด',
  },
];

// Backwards-compatible Unit Step Keys
export type UnitStepKey =
  | 'pretest'
  | 'lesson'
  | 'unit_quiz'
  | 'game'
  | 'quest'
  | 'posttest';

export interface UnitProgress {
  unitId: string;
  subDomain: SubDomainCode;
  pretest_done: boolean;
  lesson_done: boolean;
  unit_quiz_done: boolean;
  game_done: boolean;
  quest_done: boolean;
  posttest_done: boolean;
  pretest_score?: number;
  quiz_score?: number;
  posttest_score?: number;
  updated_at: string;
}

export const UNIT_STEPS_CONFIG = [
  {
    key: 'pretest' as UnitStepKey,
    stepNumber: 1,
    title: 'แบบทดสอบก่อนเรียน',
    subtitle: 'Pre-test (ชุดข้อสอบคงที่เฉลี่ยทุกหน่วย)',
    icon: 'ClipboardList',
  },
  {
    key: 'lesson' as UnitStepKey,
    stepNumber: 2,
    title: 'บทเรียน HTML',
    subtitle: 'Slide & Video Tutorial',
    icon: 'BookOpen',
  },
  {
    key: 'unit_quiz' as UnitStepKey,
    stepNumber: 3,
    title: 'แบบฝึกหัดท้ายหน่วย',
    subtitle: 'Unit Quiz (วัดผลประจำหน่วย)',
    icon: 'CheckSquare',
  },
  {
    key: 'game' as UnitStepKey,
    stepNumber: 4,
    title: 'มินิเกมกู้เว็บ',
    subtitle: 'Arcade Code Rescue Game',
    icon: 'Gamepad2',
  },
  {
    key: 'quest' as UnitStepKey,
    stepNumber: 5,
    title: 'ภารกิจเขียนโค้ด',
    subtitle: 'Code Lab Quest Assignment',
    icon: 'Terminal',
  },
  {
    key: 'posttest' as UnitStepKey,
    stepNumber: 6,
    title: 'แบบทดสอบหลังเรียน',
    subtitle: 'Post-test (Adaptive CAT)',
    icon: 'Trophy',
  },
];

export function normalizeUnit(input?: string | null): { unitId: string; subDomain: SubDomainCode } {
  if (!input) return { unitId: 'u-h1', subDomain: 'H1' };
  const upper = input.toUpperCase().trim();

  if (upper.includes('H5') || upper === '5') return { unitId: 'u-h5', subDomain: 'H5' };
  if (upper.includes('H4') || upper === '4') return { unitId: 'u-h4', subDomain: 'H4' };
  if (upper.includes('H3') || upper === '3') return { unitId: 'u-h3', subDomain: 'H3' };
  if (upper.includes('H2') || upper === '2') return { unitId: 'u-h2', subDomain: 'H2' };
  return { unitId: 'u-h1', subDomain: 'H1' };
}

const COURSE_STORAGE_KEY = 'webai_course_progress';
const STORAGE_KEY_PREFIX = 'webai_unit_progress_';

/**
 * ดึงความคืบหน้าระดับหลักสูตร HTML ทั้งหมด
 */
export function getCourseProgress(): CourseProgress {
  if (typeof window === 'undefined') {
    return {
      pretest_done: false,
      lessons_done: false,
      completed_lessons: [],
      game_done: false,
      quest_done: false,
      posttest_done: false,
      updated_at: new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(COURSE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        pretest_done: Boolean(parsed.pretest_done),
        pretest_score: parsed.pretest_score,
        lessons_done: Boolean(parsed.lessons_done),
        completed_lessons: Array.isArray(parsed.completed_lessons) ? parsed.completed_lessons : [],
        game_done: Boolean(parsed.game_done),
        quest_done: Boolean(parsed.quest_done),
        posttest_done: Boolean(parsed.posttest_done),
        posttest_score: parsed.posttest_score,
        updated_at: parsed.updated_at || new Date().toISOString(),
      };
    }
  } catch (e) {
    console.error('Failed to parse course progress:', e);
  }

  return {
    pretest_done: false,
    lessons_done: false,
    completed_lessons: [],
    game_done: false,
    quest_done: false,
    posttest_done: false,
    updated_at: new Date().toISOString(),
  };
}

/**
 * บันทึกความคืบหน้าระดับหลักสูตร HTML
 */
export function setCourseStepCompleted(step: CourseStepKey, score?: number): CourseProgress {
  const current = getCourseProgress();
  const updated: CourseProgress = {
    ...current,
    updated_at: new Date().toISOString(),
  };

  if (step === 'pretest') {
    updated.pretest_done = true;
    if (score !== undefined) updated.pretest_score = score;
    // Sync to all units so unit-level pretest checks also pass
    ['u-h1', 'u-h2', 'u-h3', 'u-h4', 'u-h5'].forEach((u) => {
      setUnitStepCompleted(u, 'pretest', score, false);
    });
  } else if (step === 'lessons') {
    updated.lessons_done = true;
  } else if (step === 'game') {
    updated.game_done = true;
  } else if (step === 'quest') {
    updated.quest_done = true;
  } else if (step === 'posttest') {
    updated.posttest_done = true;
    if (score !== undefined) updated.posttest_score = score;
    ['u-h1', 'u-h2', 'u-h3', 'u-h4', 'u-h5'].forEach((u) => {
      setUnitStepCompleted(u, 'posttest', score, false);
    });
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent('webai_progress_sync', { detail: { courseStep: step, updated } })
      );
    } catch (e) {
      console.error('Failed to save course progress:', e);
    }
  }

  return updated;
}

/**
 * ตรวจสอบสถานะการปลดล็อกระดับหลักสูตร (Sequential Gating)
 */
export function isCourseStepUnlocked(step: CourseStepKey): boolean {
  const progress = getCourseProgress();

  switch (step) {
    case 'pretest':
      // ขั้นที่ 1: ปลดล็อกเสมอ
      return true;
    case 'lessons':
      // ขั้นที่ 2: ต้องผ่าน Pre-test ก่อน
      return progress.pretest_done;
    case 'game':
      // ขั้นที่ 3: ต้องทำ Pre-test และเรียนบทเรียนแล้ว
      return progress.pretest_done && progress.lessons_done;
    case 'quest':
      // ขั้นที่ 4: ต้องเล่นเกมผ่านแล้ว
      return progress.game_done;
    case 'posttest':
      // ขั้นที่ 5: ต้องทำภารกิจเขียนโค้ดเสร็จแล้ว
      return progress.quest_done;
    default:
      return false;
  }
}

export function getCurrentCourseStep(): CourseStepKey {
  const p = getCourseProgress();
  if (!p.pretest_done) return 'pretest';
  if (!p.lessons_done) return 'lessons';
  if (!p.game_done) return 'game';
  if (!p.quest_done) return 'quest';
  return 'posttest';
}

// ==========================================
// Unit-level Progress (For Lessons & Quizzes)
// ==========================================

export function getUnitProgress(input?: string | null): UnitProgress {
  const { unitId, subDomain } = normalizeUnit(input);
  const course = getCourseProgress();

  if (typeof window === 'undefined') {
    return {
      unitId,
      subDomain,
      pretest_done: course.pretest_done,
      lesson_done: false,
      unit_quiz_done: false,
      game_done: course.game_done,
      quest_done: course.quest_done,
      posttest_done: course.posttest_done,
      updated_at: new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${unitId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        unitId,
        subDomain,
        pretest_done: course.pretest_done || Boolean(parsed.pretest_done),
        lesson_done: Boolean(parsed.lesson_done),
        unit_quiz_done: Boolean(parsed.unit_quiz_done),
        game_done: course.game_done || Boolean(parsed.game_done),
        quest_done: course.quest_done || Boolean(parsed.quest_done),
        posttest_done: course.posttest_done || Boolean(parsed.posttest_done),
        pretest_score: parsed.pretest_score,
        quiz_score: parsed.quiz_score,
        posttest_score: parsed.posttest_score,
        updated_at: parsed.updated_at || new Date().toISOString(),
      };
    }
  } catch (e) {
    console.error('Failed to parse unit progress:', e);
  }

  return {
    unitId,
    subDomain,
    pretest_done: course.pretest_done,
    lesson_done: false,
    unit_quiz_done: false,
    game_done: course.game_done,
    quest_done: course.quest_done,
    posttest_done: course.posttest_done,
    updated_at: new Date().toISOString(),
  };
}

export function setUnitStepCompleted(
  input: string | null | undefined,
  step: UnitStepKey,
  score?: number,
  syncCourse: boolean = true
): UnitProgress {
  const { unitId, subDomain } = normalizeUnit(input);
  const current = getUnitProgress(unitId);

  const updated: UnitProgress = {
    ...current,
    unitId,
    subDomain,
    updated_at: new Date().toISOString(),
  };

  if (step === 'pretest') {
    updated.pretest_done = true;
    if (score !== undefined) updated.pretest_score = score;
    if (syncCourse) setCourseStepCompleted('pretest', score);
  } else if (step === 'lesson') {
    updated.lesson_done = true;
    if (syncCourse) setCourseStepCompleted('lessons');
  } else if (step === 'unit_quiz') {
    updated.unit_quiz_done = true;
    updated.lesson_done = true;
    if (score !== undefined) updated.quiz_score = score;
    if (syncCourse) setCourseStepCompleted('lessons');
  } else if (step === 'game') {
    updated.game_done = true;
    if (syncCourse) setCourseStepCompleted('game');
  } else if (step === 'quest') {
    updated.quest_done = true;
    if (syncCourse) setCourseStepCompleted('quest');
  } else if (step === 'posttest') {
    updated.posttest_done = true;
    if (score !== undefined) updated.posttest_score = score;
    if (syncCourse) setCourseStepCompleted('posttest', score);
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${unitId}`, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent('webai_progress_sync', { detail: { unitId, step, updated } })
      );
    } catch (e) {
      console.error('Failed to save unit progress:', e);
    }
  }

  return updated;
}

export function isStepUnlocked(input: string | null | undefined, step: UnitStepKey): boolean {
  const course = getCourseProgress();
  const progress = getUnitProgress(input);

  switch (step) {
    case 'pretest':
      return true;
    case 'lesson':
      return course.pretest_done || progress.pretest_done;
    case 'unit_quiz':
      return (course.pretest_done || progress.pretest_done) && progress.lesson_done;
    case 'game':
      return course.lessons_done || progress.unit_quiz_done;
    case 'quest':
      return course.game_done || progress.game_done;
    case 'posttest':
      return course.quest_done || progress.quest_done;
    default:
      return false;
  }
}

export function getCurrentStep(input: string | null | undefined): UnitStepKey {
  const p = getUnitProgress(input);
  if (!p.pretest_done) return 'pretest';
  if (!p.lesson_done) return 'lesson';
  if (!p.unit_quiz_done) return 'unit_quiz';
  if (!p.game_done) return 'game';
  if (!p.quest_done) return 'quest';
  return 'posttest';
}

export function getStepUrl(input: string | null | undefined, step: UnitStepKey): string {
  const { unitId, subDomain } = normalizeUnit(input);
  const stageNum = subDomain === 'H1' ? 1 : subDomain === 'H2' ? 2 : subDomain === 'H3' ? 3 : subDomain === 'H4' ? 4 : 5;
  const questId = `asg-${stageNum}`;

  switch (step) {
    case 'pretest':
      return `/student/assessment?type=pre_test`;
    case 'lesson':
      return `/student/lessons/${unitId}`;
    case 'unit_quiz':
      return `/student/lessons/${unitId}?tab=quiz`;
    case 'game':
      return `/student/game?unit=${unitId}&stage=${stageNum}`;
    case 'quest':
      return `/student/quests/${questId}?unit=${unitId}`;
    case 'posttest':
      return `/student/assessment?type=post_test`;
    default:
      return `/student/lessons/${unitId}`;
  }
}

export function subscribeToProgress(callback: (detail?: any) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e: Event) => {
    callback((e as CustomEvent).detail);
  };
  const handleStorage = (e: StorageEvent) => {
    if (e.key && (e.key.startsWith(STORAGE_KEY_PREFIX) || e.key === COURSE_STORAGE_KEY)) {
      callback();
    }
  };

  window.addEventListener('webai_progress_sync', handleCustom);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('webai_progress_sync', handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}
