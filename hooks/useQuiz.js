'use client'
import { useReducer, useCallback } from 'react'

/**
 * Quiz state machine.
 *
 * States:  'setup' → 'loading' → 'question' → 'results'
 *
 * The hook manages:
 * - Which question is active
 * - Which answer the user selected (null = unanswered)
 * - Whether the answer has been revealed (correct/wrong feedback shown)
 * - Running score
 * - Full answer history for the results review screen
 */

function reducer(state, action) {
  switch (action.type) {

    case 'START_LOADING':
      return { ...state, phase: 'loading', error: null }

    case 'LOAD_SUCCESS':
      return {
        ...state,
        phase:     'question',
        questions: action.questions,
        current:   0,
        score:     0,
        selected:  null,
        revealed:  false,
        history:   [],
        error:     null,
      }

    case 'LOAD_ERROR':
      return { ...state, phase: 'setup', error: action.error }

    case 'SELECT_ANSWER': {
      if (state.revealed) return state   // already answered
      const q       = state.questions[state.current]
      const correct = action.answer === q.correct
      return {
        ...state,
        selected: action.answer,
        revealed: true,
        score:    correct ? state.score + 1 : state.score,
      }
    }

    case 'NEXT_QUESTION': {
      const q       = state.questions[state.current]
      const entry   = { question: q, selected: state.selected, correct: q.correct }
      const history = [...state.history, entry]
      const next    = state.current + 1

      if (next >= state.questions.length) {
        return { ...state, phase: 'results', history, selected: null, revealed: false }
      }
      return { ...state, current: next, selected: null, revealed: false, history }
    }

    case 'TIME_UP': {
      if (state.revealed) return state
      const q     = state.questions[state.current]
      const entry = { question: q, selected: null, correct: q.correct }
      const history = [...state.history, entry]
      const next  = state.current + 1
      if (next >= state.questions.length) {
        return { ...state, phase: 'results', history, selected: null, revealed: true }
      }
      return { ...state, current: next, selected: null, revealed: false, history }
    }

    case 'RESET':
      return { ...state, phase: 'setup', questions: [], error: null }

    default:
      return state
  }
}

const INITIAL = {
  phase:     'setup',   // 'setup' | 'loading' | 'question' | 'results'
  questions: [],
  current:   0,
  score:     0,
  selected:  null,
  revealed:  false,
  history:   [],
  error:     null,
}

export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, INITIAL)

  const startLoading   = ()         => dispatch({ type: 'START_LOADING' })
  const loadSuccess    = (questions) => dispatch({ type: 'LOAD_SUCCESS', questions })
  const loadError      = (error)    => dispatch({ type: 'LOAD_ERROR', error })
  const selectAnswer   = (answer)   => dispatch({ type: 'SELECT_ANSWER', answer })
  const nextQuestion   = ()         => dispatch({ type: 'NEXT_QUESTION' })
  const timeUp         = ()         => dispatch({ type: 'TIME_UP' })
  const reset          = ()         => dispatch({ type: 'RESET' })

  const currentQuestion = state.questions[state.current] ?? null

  return {
    ...state,
    currentQuestion,
    total: state.questions.length,
    startLoading, loadSuccess, loadError,
    selectAnswer, nextQuestion, timeUp, reset,
  }
}
