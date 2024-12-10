'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Users, ShieldAlert } from 'lucide-react'
import api from '@/lib/api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserActivityLog } from '@/components/user-activity-log'

interface AdminStats {
  userCount: number;
  adminCount: number;
  lastLoginDate: string;
}

interface User {
  role: string;
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const users: User[] = await api.getUsers(token)
          const adminStats: AdminStats = {
            userCount: users.length,
            adminCount: users.filter((user: User) => user.role === 'admin').length,
            lastLoginDate: new Date().toISOString()
          }
          setStats(adminStats)
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchAdminStats()
    }
  }, [isAdmin])

  if (!isAdmin) {
    return <Layout>You do not have permission to view this page.</Layout>
  }

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="neon-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary neon-text">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : stats ? (
              <div className="space-y-2">
                <p className="text-lg">Total Users: <span className="font-bold text-primary">{stats.userCount}</span></p>
                <p className="text-lg">Admin Users: <span className="font-bold text-primary">{stats.adminCount}</span></p>
                <p className="text-lg">Last Login: <span className="font-bold text-primary">{new Date(stats.lastLoginDate).toLocaleString()}</span></p>
              </div>
            ) : (
              <p>Failed to load stats</p>
            )}
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/admin/security">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Security Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">All systems operational</p>
            <p className="text-sm text-muted-foreground">Last checked: {new Date().toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="neon-border lg:col-span-3">
          <UserActivityLog />
        </Card>
      </div>
    </Layout>
  )
}

