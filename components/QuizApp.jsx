'use client'
import { useState } from 'react'
import { useQuiz }      from '../hooks/useQuiz'
import SetupScreen      from './SetupScreen'
import QuizScreen       from './QuizScreen'
import ResultsScreen    from './ResultsScreen'

/**
 * QuizApp — the client-side shell.
 *
 * Receives `categories` from the server component (pre-fetched at request time),
 * then drives the full quiz flow as a client-side state machine:
 *
 *   setup → loading → question → results → setup (play again)
 *
 * This is the correct Next.js App Router pattern:
 * - Server component: fetch the category list once (cached for 24h)
 * - Client component: handle all interactivity, API calls triggered by user actions
 */
export default function QuizApp({ categories }) {
  const quiz = useQuiz()
  const [config,      setConfig]      = useState({ timeLimit: 20, category: '', difficulty: '' })
  const [playerName,  setPlayerName]  = useState('')

  const handleStart = ({ questions, category, difficulty, timeLimit }) => {
    setConfig({ timeLimit, category, difficulty })
    quiz.loadSuccess(questions)
  }

  const handleError = (error) => {
    quiz.loadError(error)
  }

  /* ── Loading ── */
  if (quiz.phase === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-700 border-t-indigo-400 rounded-full animate-spin" />
        <p className="text-indigo-300 text-sm animate-pulse">Loading questions…</p>
      </div>
    )
  }

  /* ── Results ── */
  if (quiz.phase === 'results') {
    return (
      <ResultsScreen
        score={quiz.score}
        total={quiz.total}
        history={quiz.history}
        playerName={playerName || 'Anonymous'}
        category={config.category}
        difficulty={config.difficulty}
        onRestart={quiz.reset}
      />
    )
  }

  /* ── Active quiz ── */
  if (quiz.phase === 'question' && quiz.currentQuestion) {
    return (
      <QuizScreen
        question={quiz.currentQuestion}
        current={quiz.current}
        total={quiz.total}
        score={quiz.score}
        selected={quiz.selected}
        revealed={quiz.revealed}
        timeLimit={config.timeLimit}
        onSelect={quiz.selectAnswer}
        onNext={quiz.nextQuestion}
        onTimeUp={quiz.timeUp}
      />
    )
  }

  /* ── Setup (default) ── */
  return (
    <>
      {quiz.error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900 border border-red-600 text-red-200 text-sm px-4 py-3 rounded-2xl shadow-xl animate-fade-in max-w-sm text-center">
          {quiz.error}
        </div>
      )}
      <SetupScreen
        categories={categories}
        onStart={handleStart}
        onLoading={quiz.startLoading}
        onError={handleError}
        playerName={playerName}
        onNameChange={setPlayerName}
      />
    </>
  )
}
