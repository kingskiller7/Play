'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from 'lucide-react'
import api from '@/lib/api'

export default function SecuritySettings() {
  const { isAdmin } = useAuth()
  const [passwordMinLength, setPasswordMinLength] = useState(8)
  const [requireSpecialChars, setRequireSpecialChars] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const settings = await api.getSecuritySettings(token)
          setPasswordMinLength(settings.passwordMinLength)
          setRequireSpecialChars(settings.requireSpecialChars)
        }
      } catch (error) {
        console.error('Failed to fetch security settings:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchSecuritySettings()
    }
  }, [isAdmin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await api.updateSecuritySettings(token, { passwordMinLength, requireSpecialChars })
        alert('Security settings updated successfully')
      }
    } catch (error) {
      console.error('Failed to update security settings:', error)
      alert('Failed to update security settings')
    } finally {
      setUpdating(false)
    }
  }

  if (!isAdmin) {
    return <Layout>You do not have permission to view this page.</Layout>
  }

  return (
    <Layout>
      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary neon-text">Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={passwordMinLength}
                  onChange={(e) => setPasswordMinLength(Number(e.target.value))}
                  min={6}
                  className="bg-background"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireSpecialChars"
                  checked={requireSpecialChars}
                  onCheckedChange={setRequireSpecialChars}
                />
                <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
              </div>
              <Button type="submit" disabled={updating}>
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Security Settings'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}

