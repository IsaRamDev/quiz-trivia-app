'use client'
import { useState } from 'react'
import { fetchQuestions } from '../lib/trivia'

const DIFFICULTIES = [
  { id: '',       label: 'Any',    emoji: '🎲' },
  { id: 'easy',   label: 'Easy',   emoji: '🌱' },
  { id: 'medium', label: 'Medium', emoji: '🔥' },
  { id: 'hard',   label: 'Hard',   emoji: '💀' },
]

const AMOUNTS = [5, 10, 15, 20]
const TIMES   = [10, 15, 20, 30]

export default function SetupScreen({ categories, onStart, onLoading, onError, playerName, onNameChange }) {
  const [category,   setCategory]   = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [amount,     setAmount]     = useState(10)
  const [timeLimit,  setTimeLimit]  = useState(20)

  const handleStart = async () => {
    if (!playerName.trim()) return
    onLoading()
    const { questions, error } = await fetchQuestions({ amount, category, difficulty })
    if (error) { onError(error); return }
    onStart({ questions, category, difficulty, timeLimit })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg animate-slide-up">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🧠</div>
          <h1 className="text-4xl font-bold text-white mb-2">Quizly</h1>
          <p className="text-indigo-300 text-sm">Test your knowledge. Beat your score.</p>
        </div>

        <div className="bg-quiz-surface border border-quiz-border rounded-3xl p-6 space-y-5 shadow-2xl">

          {/* Player name */}
          <div>
            <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              Your Name
            </label>
            <input
              value={playerName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter your name…"
              maxLength={20}
              className="w-full bg-quiz-card border border-quiz-border rounded-xl px-4 py-3 text-white placeholder-indigo-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-all text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-quiz-card border border-quiz-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-400 transition-all text-sm appearance-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    difficulty === d.id
                      ? 'border-indigo-400 bg-indigo-600 text-white'
                      : 'border-quiz-border text-indigo-300 hover:border-indigo-500 hover:bg-quiz-card'
                  }`}
                >
                  <span className="block text-lg mb-0.5">{d.emoji}</span>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
                Questions
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {AMOUNTS.map((a) => (
                  <button key={a} onClick={() => setAmount(a)}
                    className={`py-2 rounded-xl border text-sm font-mono font-semibold transition-all ${
                      amount === a ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-quiz-border text-indigo-300 hover:border-indigo-500'
                    }`}
                  >{a}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
                Seconds / Q
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {TIMES.map((t) => (
                  <button key={t} onClick={() => setTimeLimit(t)}
                    className={`py-2 rounded-xl border text-sm font-mono font-semibold transition-all ${
                      timeLimit === t ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-quiz-border text-indigo-300 hover:border-indigo-500'
                    }`}
                  >{t}s</button>
                ))}
              </div>
            </div>
          </div>

          {/* Start */}
          <button
            onClick={handleStart}
            disabled={!playerName.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:from-indigo-400 hover:to-purple-500 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
          >
            Start Quiz 🚀
          </button>
        </div>
      </div>
    </div>
  )
}
