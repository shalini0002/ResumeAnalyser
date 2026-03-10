import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'A Next.js application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex">
        {/* sidebar */}
        <div className="w-64 h-screen bg-gray-900 text-white p-6">
          <h1 className="text-xl font-bold mb-10">AI Resume Tool</h1>

          <nav className="space-y-4">
            <a href="/" className="block hover:text-blue-400 px-4">Dashboard</a>
            <a href="/upload" className="block hover:text-blue-400 px-4">Upload Resume</a>
            <a href="/match" className="block hover:text-blue-400 px-4">Job Match</a>
            <a href="/improve" className="block hover:text-blue-400 px-4">Improve Resume</a>
            <a href="/rewrite" className="block hover:text-blue-400 px-4">Bullet Rewriter</a>
          </nav>
        </div>

        {/* main content */}
        <div className="flex-1 p-10 bg-gray-100">
          {children}
        </div>
      </body>
    </html>
  )
}