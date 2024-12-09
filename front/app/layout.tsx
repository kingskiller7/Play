import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
})

export const metadata: Metadata = {
  title: 'CyberAuth',
  description: 'A futuristic authentication system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} font-mono`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

