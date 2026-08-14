# 🧠 Quizly — Trivia Challenge

A trivia quiz app with a countdown timer, animated answer feedback, category picker, and a localStorage leaderboard — built with Next.js 14 App Router.

**[Live Demo →](https://your-vercel-url.vercel.app)** · **[Portfolio →](https://isaramdev.com)**

---

## Features

- **50+ categories** — pre-fetched server-side from Open Trivia DB (free, no API key)
- **Countdown timer** — per-question timer (10/15/20/30s), auto-advances on expiry
- **Animated feedback** — correct answers go green, wrong answers shake and go red
- **Difficulty selector** — Easy / Medium / Hard / Any
- **5–20 questions** — configurable per game
- **Results screen** — score, accuracy, full answer review
- **Leaderboard** — top 10 scores stored in localStorage, shown after each game
- **State machine** — clean `setup → loading → question → results` flow via `useReducer`

---

## Getting Started

```bash
npm install
npm run dev   # http://localhost:3000
```

No API key needed — Open Trivia DB is free and public.

---

## Tech Stack

| | Choice | Why |
|---|---|---|
| Framework | Next.js 14 App Router | Server-fetched categories, client quiz interaction |
| API | Open Trivia DB | Free, 50+ categories, no auth required |
| State | `useReducer` (state machine) | Explicit phase transitions, predictable mutations |
| Timer | `useEffect` + `setInterval` | Custom hook with auto-reset on question change |
| Persistence | localStorage | Leaderboard survives page refresh |
| Styling | Tailwind CSS | Utility-first |
| Fonts | `next/font/google` (Inter) | Zero CLS |

---

## Architecture Decisions

### Server + Client component split
`app/page.jsx` is a server component that fetches the category list from Open Trivia DB and passes it as a prop to `<QuizApp>`. The fetch uses `next: { revalidate: 86400 }` — Next.js caches it for 24 hours. This means the category dropdown populates instantly with no client-side loading state.

`QuizApp` is a client component that manages all quiz interactivity, timer logic, and leaderboard writes.

### `useReducer` as a state machine
The quiz has four explicit phases: `setup`, `loading`, `question`, `results`. Using `useReducer` with named action types (`START_LOADING`, `LOAD_SUCCESS`, `SELECT_ANSWER`, `NEXT_QUESTION`, `TIME_UP`) makes every state transition traceable. It's impossible to reach an invalid combination (e.g. showing results when no questions are loaded) because the phase is always set explicitly by an action.

### Timer auto-reset via `questionId` dependency
`useTimer` resets itself whenever `questionId` (the question index) changes. This means the parent component never needs to call a "reset timer" function — the hook handles it automatically. The `expiredRef` prevents `onExpire` from being called twice if the component re-renders while the timer is at zero.

### HTML entity decoding without the DOM
Open Trivia DB encodes question text as HTML entities (`&quot;`, `&#039;`, etc.). On the server, there's no `document.createElement('textarea')` trick available. `lib/trivia.js` uses a manual regex-based decoder that works in both server and client contexts, covering the most common entities returned by the API.

### Answer shuffling on fetch (not on render)
Answers are shuffled once in `fetchQuestions()` using Fisher-Yates and stored in the `options` array. If shuffling happened during render, React's reconciliation could produce a different order on re-renders, causing visual jumps. Shuffling at fetch time means options are stable for the question's lifetime.

---

## Project Structure

```
app/
├── layout.jsx          # Root layout — server component, fonts, metadata
└── page.jsx            # Root page — server component, fetches categories

components/
├── QuizApp.jsx         # Client shell — drives phase state machine
├── SetupScreen.jsx     # Category/difficulty/amount picker + name input
├── QuizScreen.jsx      # Question card, timer bar, answer options
└── ResultsScreen.jsx   # Score, answer review, leaderboard

hooks/
├── useQuiz.js          # State machine (useReducer)
└── useTimer.js         # Countdown timer with auto-reset

lib/
├── trivia.js           # fetchCategories, fetchQuestions, decodeHTML, shuffle
└── leaderboard.js      # localStorage CRUD for top-10 scores
```

---

## License

MIT
