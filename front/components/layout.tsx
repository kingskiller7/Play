'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (!user && !isAuthPage) {
    return <div className="flex h-screen items-center justify-center bg-background">{children}</div>;
  }

  if (isAuthPage) {
    return <div className="flex h-screen items-center justify-center bg-background">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}

