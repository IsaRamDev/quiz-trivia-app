'use client'
import { useState, useEffect, useRef } from 'react'

/**
 * Countdown timer for each question.
 *
 * Returns the remaining seconds and a CSS animation duration string
 * for the visual progress bar.
 *
 * Resets automatically whenever `questionId` changes — so each new
 * question gets a fresh countdown without extra reset logic in the parent.
 *
 * @param {number}   seconds    - total seconds per question
 * @param {boolean}  active     - false = paused (e.g. answer revealed)
 * @param {number}   questionId - changes when a new question loads
 * @param {Function} onExpire   - called when timer hits 0
 */
export function useTimer({ seconds, active, questionId, onExpire }) {
  const [remaining, setRemaining] = useState(seconds)
  const expiredRef                = useRef(false)

  // Reset on new question
  useEffect(() => {
    setRemaining(seconds)
    expiredRef.current = false
  }, [questionId, seconds])

  useEffect(() => {
    if (!active || remaining <= 0) return

    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (!expiredRef.current) {
            expiredRef.current = true
            onExpire()
          }
          return 0
        }
        return r - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [active, remaining, onExpire])

  const pct      = (remaining / seconds) * 100
  const color    = pct > 50 ? '#22c55e' : pct > 25 ? '#f59e0b' : '#ef4444'
  const urgent   = remaining <= 5

  return { remaining, pct, color, urgent }
}
