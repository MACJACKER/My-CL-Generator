import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'Cover Letter Generator',
  description: 'AI-powered cover letter generator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-0"></div>
        <div className="relative z-10">
          <SessionProvider>{children}</SessionProvider>
        </div>
      </body>
    </html>
  )
}
