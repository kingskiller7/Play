'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import api from '@/lib/api'

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const [userCount, setUserCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const users = await api.getUsers(token)
          setUserCount(users.length)
        }
      } catch (error) {
        console.error('Failed to fetch user count:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchUserCount()
    }
  }, [isAdmin])

  if (!isAdmin) {
    return <Layout>You do not have permission to view this page.</Layout>
  }

  return (
    <Layout>
      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary neon-text">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <p className="text-lg">Total Users: <span className="font-bold text-primary">{userCount}</span></p>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}

