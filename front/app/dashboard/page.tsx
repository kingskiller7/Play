'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <Layout>
      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary neon-text">Welcome to Your Dashboard</CardTitle>
          <CardDescription>Here&apos;s an overview of your account</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Hello, <span className="font-bold text-primary">{user?.name}</span>! This is your personalized dashboard.</p>
          <p className="mt-4">Your current role: <span className="font-bold text-primary">{user?.role}</span></p>
        </CardContent>
      </Card>
    </Layout>
  )
}