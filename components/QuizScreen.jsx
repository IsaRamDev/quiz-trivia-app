'use client'
import { useCallback } from 'react'
import { useTimer } from '../hooks/useTimer'

const DIFF_COLOR = { easy: 'text-emerald-400', medium: 'text-amber-400', hard: 'text-red-400' }

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export default function QuizScreen({
  question, current, total, score,
  selected, revealed, timeLimit,
  onSelect, onNext, onTimeUp,
}) {
  const handleExpire = useCallback(() => { onTimeUp() }, [onTimeUp])

  const { remaining, pct, color, urgent } = useTimer({
    seconds:    timeLimit,
    active:     !revealed,
    questionId: current,
    onExpire:   handleExpire,
  })

  const handleNext = () => {
    // Small delay so user sees the feedback before advancing
    setTimeout(onNext, revealed && selected ? 400 : 0)
    onNext()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-slide-up">

        {/* Top bar: progress + score */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-indigo-300 text-sm font-mono">
              {current + 1} <span className="text-indigo-500">/</span> {total}
            </span>
            <div className="w-24 h-1.5 bg-quiz-card rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${((current) / total) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-quiz-surface border border-quiz-border rounded-full px-3 py-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-white font-bold font-mono text-sm">{score}</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-quiz-surface border border-quiz-border rounded-3xl overflow-hidden shadow-2xl">

          {/* Timer bar */}
          <div className="h-1.5 bg-quiz-card">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${urgent ? 'animate-pulse-fast' : ''}`}
              style={{ width: `${pct}%`, background: color }}
            />
          </div>

          <div className="p-6">
            {/* Meta */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-indigo-400 bg-indigo-900/50 px-2.5 py-1 rounded-full border border-indigo-700">
                {question.category}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold capitalize ${DIFF_COLOR[question.difficulty] ?? 'text-indigo-300'}`}>
                  {question.difficulty}
                </span>
                <span className={`text-2xl font-bold font-mono tabular-nums ${urgent ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {remaining}s
                </span>
              </div>
            </div>

            {/* Question */}
            <p className="text-xl font-semibold text-white leading-relaxed mb-6 min-h-[3em]">
              {question.question}
            </p>

            {/* Answers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt, i) => {
                let style = 'border-quiz-border bg-quiz-card text-indigo-100 hover:border-indigo-400 hover:bg-quiz-card'

                if (revealed) {
                  if (opt === question.correct) {
                    style = 'border-emerald-500 bg-emerald-900/50 text-emerald-300 shadow-emerald-500/20 shadow-lg'
                  } else if (opt === selected) {
                    style = 'border-red-500 bg-red-900/50 text-red-300 animate-shake'
                  } else {
                    style = 'border-quiz-border bg-quiz-card text-indigo-400 opacity-50'
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => !revealed && onSelect(opt)}
                    disabled={revealed}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-200 flex items-center gap-3 ${style} ${!revealed ? 'cursor-pointer active:scale-[0.97]' : 'cursor-default'}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {OPTION_LETTERS[i]}
                    </span>
                    {opt}
                    {revealed && opt === question.correct && <span className="ml-auto">✓</span>}
                    {revealed && opt === selected && opt !== question.correct && <span className="ml-auto">✗</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Next button — appears after answering */}
          {revealed && (
            <div className="px-6 pb-6 animate-fade-in">
              <button
                onClick={onNext}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:from-indigo-400 hover:to-purple-500 active:scale-[0.98] transition-all"
              >
                {current + 1 >= total ? 'See Results 🏆' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
