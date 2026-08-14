const KEY = 'quizly-leaderboard'
const MAX  = 10

/**
 * @typedef {{ name:string, score:number, total:number, pct:number, category:string, difficulty:string, date:number }} Entry
 */

export function getLeaderboard() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addToLeaderboard(entry) {
  try {
    const board = getLeaderboard()
    board.push({ ...entry, date: Date.now() })
    board.sort((a, b) => b.pct - a.pct || a.date - b.date)
    localStorage.setItem(KEY, JSON.stringify(board.slice(0, MAX)))
  } catch { /* localStorage unavailable */ }
}

export function clearLeaderboard() {
  try { localStorage.removeItem(KEY) } catch { /**/ }
}

export function timeAgo(ts) {
  const d = Math.floor((Date.now() - ts) / 1000)
  if (d < 60)    return 'just now'
  if (d < 3600)  return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  return `${Math.floor(d / 86400)}d ago`
}
