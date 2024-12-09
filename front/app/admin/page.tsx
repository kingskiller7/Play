'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from '@/lib/api'

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const [userCount, setUserCount] = useState(0)

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
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Users: {userCount}</p>
        </CardContent>
      </Card>
    </Layout>
  )
}

