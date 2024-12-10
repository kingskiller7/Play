'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Settings, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { user, isAdmin } = useAuth()

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="neon-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary neon-text">Welcome, {user?.name}</CardTitle>
            <CardDescription>Here&apos;s an overview of your account</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Role: <span className="font-bold text-primary">{user?.role}</span></p>
            <p className="text-lg">Email: <span className="font-bold text-primary">{user?.email}</span></p>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Change Password
              </Link>
            </Button>
            {isAdmin && (
              <Button asChild className="w-full">
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">All systems operational</p>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

