import { Question, SubDomainCode, Attempt } from '@/types/database';
import { MOCK_QUESTIONS } from '../mock-data';
import { selectNextItem, checkStoppingRule, AvailableItem } from './cat-engine';
import { estimateThetaMLE, ItemResponse } from './estimator';
import { calculateStandardError, calculateItemInformation } from './core';

export interface IRTEngineState {
  currentTheta: number;
  standardError: number;
  questionIndex: number;
  usedQuestionIds: string[];
  answeredDomains: SubDomainCode[];
  attempts: Attempt[];
  targetSubDomain?: SubDomainCode | null;
}

export function createInitialIRTState(targetSubDomain?: SubDomainCode | null): IRTEngineState {
  return {
    currentTheta: 0.0,
    standardError: 1.0, // Initial high uncertainty
    questionIndex: 0,
    usedQuestionIds: [],
    answeredDomains: [],
    attempts: [],
    targetSubDomain: targetSubDomain || null,
  };
}

// Convert DB/Mock Questions to AvailableItem for CAT Engine
function mapToAvailableItems(questions: Question[]): AvailableItem[] {
  return questions.map(q => ({
    id: q.id,
    irt_a: q.irt_a ?? null,
    irt_b: q.irt_b ?? null,
    irt_c: q.irt_c ?? null,
    sub_domain_code: q.sub_domain_code,
    irt_calibration_status: q.irt_calibration_status,
    active: q.active,
  }));
}

export function getNextIRTQuestion(
  state: IRTEngineState,
  questionPool: Question[] = MOCK_QUESTIONS
): Question | null {
  // Check stopping rule
  const totalInfo = state.attempts.reduce((sum, att) => sum + (att as any).item_information || 0, 0);
  if (checkStoppingRule(totalInfo, state.questionIndex)) {
    return null; // Stop CAT
  }

  // Filter available
  const availablePool = questionPool.filter(q => !state.usedQuestionIds.includes(q.id));
  if (availablePool.length === 0) return null;

  // Convert to CAT format
  let availableItems = mapToAvailableItems(availablePool);

  // If retaking a specific domain, restrict pool
  if (state.targetSubDomain) {
    availableItems = availableItems.filter(i => i.sub_domain_code === state.targetSubDomain);
  }

  // Select next item using MFI & Content Balancing
  const bestItem = selectNextItem(state.currentTheta, availableItems, state.answeredDomains);

  if (!bestItem) return null;

  return questionPool.find(q => q.id === bestItem.id) || null;
}

export function recordIRTAnswerAndUpdateState(
  state: IRTEngineState,
  question: Question,
  selectedOption: string,
  responseTime: number
): { newState: IRTEngineState; isCorrect: boolean } {
  const isCorrect = selectedOption === question.correct_option;
  
  // Create IRT parameter fallbacks if not calibrated
  const a = question.irt_a ?? 1.0;
  const b = question.irt_b ?? 0.0;
  const c = question.irt_c ?? 0.2;

  // Calculate Information from this item
  const info = calculateItemInformation(state.currentTheta, a, b, c);

  const attempt: Attempt = {
    id: `att-${Date.now()}`,
    session_id: 'temp', // will be replaced
    question_id: question.id,
    answer: selectedOption,
    correct: isCorrect,
    response_time: responseTime,
    sequence: state.questionIndex + 1,
    sub_domain_code: question.sub_domain_code,
    difficulty: question.difficulty,
    created_at: new Date().toISOString(),
    // Custom IRT fields injected for tracking
    ...( { 
      theta_before: state.currentTheta,
      item_information: info 
    } as any)
  };

  const newAttempts = [...state.attempts, attempt];

  // Re-estimate Theta based on ALL responses so far using MLE
  const responses: ItemResponse[] = newAttempts.map(att => {
    const q = MOCK_QUESTIONS.find(mq => mq.id === att.question_id); // In real app, we need the actual Q
    return {
      a: q?.irt_a ?? 1.0,
      b: q?.irt_b ?? 0.0,
      c: q?.irt_c ?? 0.2,
      isCorrect: att.correct
    };
  });

  const newTheta = estimateThetaMLE(responses, 0.0);
  
  // Calculate new SE
  const totalInfo = newAttempts.reduce((sum, att) => sum + ((att as any).item_information || 0), 0);
  const newSE = calculateStandardError(totalInfo);

  const newState: IRTEngineState = {
    ...state,
    currentTheta: newTheta,
    standardError: newSE,
    questionIndex: state.questionIndex + 1,
    usedQuestionIds: [...state.usedQuestionIds, question.id],
    answeredDomains: [...state.answeredDomains, question.sub_domain_code],
    attempts: newAttempts
  };

  return { newState, isCorrect };
}
