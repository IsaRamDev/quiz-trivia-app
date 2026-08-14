const BASE = 'https://opentdb.com'

/**
 * Decodes HTML entities returned by the Open Trivia DB API.
 * The API encodes special characters like &amp; &quot; &#039;
 * We decode without using the DOM (works in both server and client contexts).
 */
export function decodeHTML(str) {
  if (!str) return ''
  return str
    .replace(/&amp;/g,   '&')
    .replace(/&lt;/g,    '<')
    .replace(/&gt;/g,    '>')
    .replace(/&quot;/g,  '"')
    .replace(/&#039;/g,  "'")
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&hellip;/g,'\u2026')
    .replace(/&eacute;/g,'\u00E9')
    .replace(/&egrave;/g,'\u00E8')
    .replace(/&ntilde;/g,'\u00F1')
    .replace(/&uuml;/g,  '\u00FC')
    .replace(/&ouml;/g,  '\u00F6')
    .replace(/&aacute;/g,'\u00E1')
    .replace(/&iacute;/g,'\u00ED')
    .replace(/&oacute;/g,'\u00F3')
    .replace(/&uacute;/g,'\u00FA')
}

/** Fisher-Yates shuffle — returns a new array. */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Fetches all available trivia categories from the API.
 * Called in the server component so it renders instantly.
 */
export async function fetchCategories() {
  try {
    const res  = await fetch(`${BASE}/api_category.php`, { next: { revalidate: 86400 } })
    const data = await res.json()
    return [{ id: '', name: 'Any Category' }, ...(data.trivia_categories ?? [])]
  } catch {
    return [{ id: '', name: 'Any Category' }]
  }
}

/**
 * Fetches quiz questions from the Open Trivia DB.
 * Returns normalized question objects with shuffled answer options.
 *
 * Response codes:
 *   0 = success
 *   1 = not enough questions for query
 *   5 = rate limit (too many requests)
 *
 * @returns {{ questions: Question[], error: string|null }}
 */
export async function fetchQuestions({ amount = 10, category = '', difficulty = '', type = 'multiple' }) {
  const params = new URLSearchParams({
    amount,
    type,
    encode: 'url3986',
    ...(category   && { category }),
    ...(difficulty && { difficulty }),
  })

  try {
    const res  = await fetch(`${BASE}/api.php?${params}`)
    const data = await res.json()

    if (data.response_code === 5) {
      return { questions: [], error: 'Too many requests. Wait a moment and try again.' }
    }
    if (data.response_code === 1) {
      return { questions: [], error: 'Not enough questions for this combination. Try fewer questions or a different category.' }
    }
    if (data.response_code !== 0 || !data.results?.length) {
      return { questions: [], error: 'Could not load questions. Please try again.' }
    }

    const questions = data.results.map((q, i) => {
      const correct   = decodeURIComponent(q.correct_answer)
      const incorrect = q.incorrect_answers.map(decodeURIComponent)
      const options   = shuffle([correct, ...incorrect])

      return {
        id:         i,
        question:   decodeURIComponent(q.question),
        category:   decodeHTML(decodeURIComponent(q.category)),
        difficulty: q.difficulty,
        type:       q.type,
        correct,
        options,
      }
    })

    return { questions, error: null }
  } catch {
    return { questions: [], error: 'Network error. Check your connection and try again.' }
  }
}
