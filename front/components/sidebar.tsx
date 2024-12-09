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
    <div className="flex h-full w-64 flex-col bg-gray-800">
      <div className="flex h-20 items-center justify-center">
        <h1 className="text-2xl font-bold text-white">My App</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={cn(
                  'flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700',
                  pathname === link.href && 'bg-gray-700 text-white'
                )}
              >
                <link.icon className="mr-3 h-5 w-5" />
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <button 
          onClick={logout}
          className="flex w-full items-center px-4 py-2 text-gray-300 hover:bg-gray-700"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}

