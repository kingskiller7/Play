'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Settings, Shield, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const userLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const adminLinks = [
  { name: 'Admin Dashboard', href: '/admin', icon: Shield },
  { name: 'User Management', href: '/admin/users', icon: User },
  { name: 'Security Settings', href: '/admin/security', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isAdmin, logout } = useAuth()

  const links = isAdmin ? [...userLinks, ...adminLinks] : userLinks

  return (
    <div className="flex h-full w-64 flex-col bg-card">
      <div className="flex h-20 items-center justify-center border-b border-border">
        <h1 className="text-2xl font-bold text-primary neon-text">CyberAuth</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={cn(
                  'flex items-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === link.href && 'bg-accent text-accent-foreground'
                )}
              >
                <link.icon className="mr-3 h-4 w-4" />
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <button 
          onClick={logout}
          className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

