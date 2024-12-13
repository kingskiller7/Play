import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import type { Metadata } from 'next'
import { Comfortaa } from 'next/font/google'

const comfortaa = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-comfortaa',
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
      <body className={comfortaa.variable}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}