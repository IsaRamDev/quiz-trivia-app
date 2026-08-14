import { fetchCategories } from '../lib/trivia'
import QuizApp            from '../components/QuizApp'

/**
 * Root page — server component.
 *
 * Fetches the category list from Open Trivia DB at request time,
 * cached for 24 hours (`next: { revalidate: 86400 }`).
 *
 * This means the category dropdown is populated server-side —
 * no loading spinner, no client-side fetch on mount.
 * The result is passed down to QuizApp as a prop.
 */
export default async function Page() {
  const categories = await fetchCategories()

  return <QuizApp categories={categories} />
}
