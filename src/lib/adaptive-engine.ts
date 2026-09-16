import {
  Question,
  QuestionDifficulty,
  SubDomainCode,
  Attempt,
  SkillProfile,
  MasteryStatus,
} from '@/types/database';
import { MOCK_QUESTIONS } from './mock-data';

export interface AdaptiveEngineState {
  currentDifficulty: QuestionDifficulty;
  questionIndex: number; // 1 to 20
  usedQuestionIds: string[];
  subDomainCounts: Record<SubDomainCode, number>;
  attempts: Attempt[];
  targetSubDomain?: SubDomainCode | null; // For Re-test mode
}

const ALL_SUB_DOMAINS: SubDomainCode[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];

export function createInitialAdaptiveState(targetSubDomain?: SubDomainCode | null): AdaptiveEngineState {
  return {
    currentDifficulty: 'medium', // Rule 1: Starts at medium
    questionIndex: 0,
    usedQuestionIds: [],
    subDomainCounts: {
      H1: 0,
      H2: 0,
      H3: 0,
      H4: 0,
      H5: 0,
      H6: 0,
      H7: 0,
      H8: 0,
    },
    attempts: [],
    targetSubDomain: targetSubDomain || null,
  };
}

/**
 * Select the next question based on Adaptive rules:
 * 1. If Re-test: prioritize targetSubDomain.
 * 2. If standard Adaptive:
 *    - Check which subdomains haven't been tested yet (Coverage Rule 3)
 *    - Match with current difficulty (medium -> hard / easy)
 */
export function getNextAdaptiveQuestion(
  state: AdaptiveEngineState,
  questionPool: Question[] = MOCK_QUESTIONS
): Question | null {
  // Check stop rules (Rule 4: Stop at 20 questions or pool exhausted)
  if (state.questionIndex >= 20) {
    return null;
  }

  const unusedQuestions = questionPool.filter(
    (q) => !state.usedQuestionIds.includes(q.id) && q.active
  );

  if (unusedQuestions.length === 0) {
    return null;
  }

  // If specific target sub-domain for Re-test
  if (state.targetSubDomain) {
    const targetPool = unusedQuestions.filter(
      (q) => q.sub_domain_code === state.targetSubDomain
    );
    // Find matching difficulty
    const diffMatch = targetPool.find((q) => q.difficulty === state.currentDifficulty);
    if (diffMatch) return diffMatch;
    if (targetPool.length > 0) return targetPool[0];
  }

  // Rule 3: Find sub-domains that haven't been covered yet
  const uncoveredSubDomains = ALL_SUB_DOMAINS.filter(
    (sub) => (state.subDomainCounts[sub] || 0) === 0
  );

  let candidateSubDomains: SubDomainCode[];
  if (uncoveredSubDomains.length > 0) {
    candidateSubDomains = uncoveredSubDomains;
  } else {
    // Pick the subdomains with the least attempts so far to ensure balanced rounds
    const minCount = Math.min(...ALL_SUB_DOMAINS.map((s) => state.subDomainCounts[s] || 0));
    candidateSubDomains = ALL_SUB_DOMAINS.filter(
      (s) => (state.subDomainCounts[s] || 0) === minCount
    );
  }

  // Try to find a question in candidate sub-domains matching current difficulty
  let matchedQuestion = unusedQuestions.find(
    (q) =>
      candidateSubDomains.includes(q.sub_domain_code) &&
      q.difficulty === state.currentDifficulty
  );

  // If no exact match for difficulty in preferred sub-domains, relax difficulty
  if (!matchedQuestion) {
    matchedQuestion = unusedQuestions.find((q) =>
      candidateSubDomains.includes(q.sub_domain_code)
    );
  }

  // Fallback to any matching difficulty in unused pool
  if (!matchedQuestion) {
    matchedQuestion = unusedQuestions.find(
      (q) => q.difficulty === state.currentDifficulty
    );
  }

  // Last fallback: any unused question
  if (!matchedQuestion) {
    matchedQuestion = unusedQuestions[0];
  }

  return matchedQuestion || null;
}

/**
 * Update adaptive state after a student answers a question:
 * Rule 2:
 *  - Correct -> harder (medium -> hard)
 *  - Incorrect -> easier (medium -> easy)
 */
export function recordAnswerAndUpdateState(
  state: AdaptiveEngineState,
  question: Question,
  selectedAnswer: string,
  responseTimeSec: number
): { newState: AdaptiveEngineState; isCorrect: boolean } {
  const isCorrect = selectedAnswer === question.correct_option;

  // Determine next difficulty level
  let nextDifficulty: QuestionDifficulty = state.currentDifficulty;
  if (isCorrect) {
    if (state.currentDifficulty === 'easy') nextDifficulty = 'medium';
    else if (state.currentDifficulty === 'medium') nextDifficulty = 'hard';
  } else {
    if (state.currentDifficulty === 'hard') nextDifficulty = 'medium';
    else if (state.currentDifficulty === 'medium') nextDifficulty = 'easy';
  }

  const attempt: Attempt = {
    id: 'att-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    session_id: 'session-curr',
    question_id: question.id,
    answer: selectedAnswer,
    correct: isCorrect,
    response_time: responseTimeSec,
    sequence: state.questionIndex + 1,
    sub_domain_code: question.sub_domain_code,
    difficulty: question.difficulty,
    created_at: new Date().toISOString(),
  };

  const newSubDomainCounts = {
    ...state.subDomainCounts,
    [question.sub_domain_code]: (state.subDomainCounts[question.sub_domain_code] || 0) + 1,
  };

  const newState: AdaptiveEngineState = {
    ...state,
    currentDifficulty: nextDifficulty,
    questionIndex: state.questionIndex + 1,
    usedQuestionIds: [...state.usedQuestionIds, question.id],
    subDomainCounts: newSubDomainCounts,
    attempts: [...state.attempts, attempt],
  };

  return { newState, isCorrect };
}

/**
 * Diagnostic Analytics (Module D):
 * Compute skill profiles per sub-domain H1-H8 from test attempts.
 * Status:
 *  >=80% -> mastery
 *  60-79% -> good
 *  <60% -> needs_improvement
 */
export function computeSkillProfiles(
  studentId: string,
  attempts: Attempt[]
): Record<SubDomainCode, SkillProfile> {
  const stats: Record<SubDomainCode, { total: number; correct: number }> = {
    H1: { total: 0, correct: 0 },
    H2: { total: 0, correct: 0 },
    H3: { total: 0, correct: 0 },
    H4: { total: 0, correct: 0 },
    H5: { total: 0, correct: 0 },
    H6: { total: 0, correct: 0 },
    H7: { total: 0, correct: 0 },
    H8: { total: 0, correct: 0 },
  };

  for (const att of attempts) {
    if (att.sub_domain_code && stats[att.sub_domain_code]) {
      stats[att.sub_domain_code].total += 1;
      if (att.correct) {
        stats[att.sub_domain_code].correct += 1;
      }
    }
  }

  const profiles: Partial<Record<SubDomainCode, SkillProfile>> = {};

  for (const code of ALL_SUB_DOMAINS) {
    const data = stats[code];
    let percentage = 0;
    if (data.total > 0) {
      percentage = Math.round((data.correct / data.total) * 100);
    } else {
      // Default baseline if not yet tested
      percentage = 70;
    }

    let status: MasteryStatus = 'good';
    if (percentage >= 80) status = 'mastery';
    else if (percentage < 60) status = 'needs_improvement';

    profiles[code] = {
      student_id: studentId,
      sub_domain_code: code,
      estimated_level: percentage,
      evidence_count: data.total,
      mastery_status: status,
      updated_at: new Date().toISOString(),
    };
  }

  return profiles as Record<SubDomainCode, SkillProfile>;
}
