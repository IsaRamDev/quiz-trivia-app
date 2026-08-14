import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Quizly — Trivia Challenge',
  description: 'Test your knowledge across dozens of categories. Built with Next.js + Open Trivia DB.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-quiz-bg`}>
        {children}
      </body>
    </html>
  )
}
