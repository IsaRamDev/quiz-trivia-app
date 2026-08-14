'use client'
import { useState, useEffect } from 'react'
import { addToLeaderboard, getLeaderboard, clearLeaderboard, timeAgo } from '../lib/leaderboard'

function getRank(pct) {
  if (pct === 100) return { label: 'Perfect!',    emoji: '🏆', color: 'text-yellow-400' }
  if (pct >= 80)  return { label: 'Excellent!',   emoji: '⭐', color: 'text-emerald-400' }
  if (pct >= 60)  return { label: 'Good Job!',    emoji: '👍', color: 'text-blue-400'   }
  if (pct >= 40)  return { label: 'Not Bad',      emoji: '🤔', color: 'text-amber-400'  }
  return              { label: 'Keep Trying!',  emoji: '💪', color: 'text-red-400'     }
}

export default function ResultsScreen({ score, total, history, playerName, category, difficulty, onRestart }) {
  const pct  = Math.round((score / total) * 100)
  const rank = getRank(pct)
  const [board,  setBoard]  = useState([])
  const [tab,    setTab]    = useState('review') // 'review' | 'leaderboard'
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    if (!saved) {
      addToLeaderboard({ name: playerName, score, total, pct, category: category || 'Any', difficulty: difficulty || 'Any', date: Date.now() })
      setSaved(true)
    }
    setBoard(getLeaderboard())
  }, [saved])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-bounce-in">

        {/* Score card */}
        <div className="bg-quiz-surface border border-quiz-border rounded-3xl p-6 shadow-2xl mb-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">{rank.emoji}</div>
            <h2 className={`text-2xl font-bold mb-1 ${rank.color}`}>{rank.label}</h2>
            <p className="text-indigo-300 text-sm">{playerName}</p>
          </div>

          {/* Score ring */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <StatBox label="Score" value={`${score}/${total}`} big />
            <StatBox label="Accuracy" value={`${pct}%`} big />
            <StatBox label="Wrong" value={total - score} />
          </div>

          {/* Tab switcher */}
          <div className="flex bg-quiz-card rounded-xl p-0.5 mb-4">
            {['review', 'leaderboard'].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  tab === t ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:text-indigo-200'
                }`}
              >
                {t === 'review' ? '📋 Review' : '🏅 Leaderboard'}
              </button>
            ))}
          </div>

          {/* Review */}
          {tab === 'review' && (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {history.map((entry, i) => {
                const correct = entry.selected === entry.correct
                const skipped = entry.selected === null
                return (
                  <div key={i} className={`rounded-xl p-3 border text-xs ${
                    skipped ? 'border-slate-700 bg-slate-900/50' :
                    correct ? 'border-emerald-800 bg-emerald-950/50' : 'border-red-800 bg-red-950/50'
                  }`}>
                    <p className="text-white font-medium mb-1 line-clamp-2">{entry.question.question}</p>
                    <div className="flex gap-3 flex-wrap">
                      {!skipped && (
                        <span className={correct ? 'text-emerald-400' : 'text-red-400'}>
                          {correct ? '✓' : '✗'} {entry.selected}
                        </span>
                      )}
                      {skipped && <span className="text-slate-400">⏱ Time's up</span>}
                      {!correct && (
                        <span className="text-emerald-400">✓ {entry.correct}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Leaderboard */}
          {tab === 'leaderboard' && (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {board.length === 0 ? (
                <p className="text-indigo-400 text-sm text-center py-6">No scores yet.</p>
              ) : (
                board.map((entry, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border text-xs ${
                    entry.name === playerName && entry.pct === pct
                      ? 'border-indigo-500 bg-indigo-900/50'
                      : 'border-quiz-border bg-quiz-card'
                  }`}>
                    <span className="font-mono font-bold text-indigo-400 w-5 text-center">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}
                    </span>
                    <span className="text-white font-medium flex-1 truncate">{entry.name}</span>
                    <span className="text-indigo-300 text-[10px] hidden sm:block">{entry.category}</span>
                    <span className="font-mono font-bold text-yellow-400">{entry.pct}%</span>
                    <span className="text-indigo-500 font-mono text-[10px]">{timeAgo(entry.date)}</span>
                  </div>
                ))
              )}
              {board.length > 0 && (
                <button onClick={() => { clearLeaderboard(); setBoard([]) }}
                  className="text-[10px] text-indigo-500 hover:text-indigo-300 transition-colors w-full text-center pt-1">
                  Clear leaderboard
                </button>
              )}
            </div>
          )}
        </div>

        {/* Play again */}
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:from-indigo-400 hover:to-purple-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/30"
        >
          Play Again 🔄
        </button>
      </div>
    </div>
  )
}

function StatBox({ label, value, big }) {
  return (
    <div className="text-center">
      <p className={`font-bold font-mono text-white ${big ? 'text-3xl' : 'text-xl'}`}>{value}</p>
      <p className="text-xs text-indigo-400 mt-0.5">{label}</p>
    </div>
  )
}
