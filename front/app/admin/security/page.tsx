'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Loader2, ShieldAlert } from 'lucide-react'
import api from '@/lib/api'

interface SecuritySettings {
  passwordMinLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  maxLoginAttempts: number;
}

export default function SecuritySettings() {
  const { isAdmin } = useAuth()
  const [settings, setSettings] = useState<SecuritySettings>({
    passwordMinLength: 8,
    requireSpecialChars: false,
    requireNumbers: false,
    requireUppercase: false,
    maxLoginAttempts: 5,
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const fetchedSettings = await api.getSecuritySettings(token)
          setSettings(fetchedSettings)
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
        await api.updateSecuritySettings(token, settings)
        alert('Security settings updated successfully')
      }
    } catch (error) {
      console.error('Failed to update security settings:', error)
      alert('Failed to update security settings')
    } finally {
      setUpdating(false)
    }
  }

  const handleChange = (key: keyof SecuritySettings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (!isAdmin) {
    return <Layout>You do not have permission to view this page.</Layout>
  }

  return (
    <Layout>
      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary neon-text flex items-center">
            <ShieldAlert className="mr-2 h-6 w-6" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">Minimum Password Length: {settings.passwordMinLength}</Label>
                <Slider
                  id="passwordMinLength"
                  min={6}
                  max={20}
                  step={1}
                  value={[settings.passwordMinLength]}
                  onValueChange={(value) => handleChange('passwordMinLength', value[0])}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireSpecialChars"
                  checked={settings.requireSpecialChars}
                  onCheckedChange={(checked) => handleChange('requireSpecialChars', checked)}
                />
                <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireNumbers"
                  checked={settings.requireNumbers}
                  onCheckedChange={(checked) => handleChange('requireNumbers', checked)}
                />
                <Label htmlFor="requireNumbers">Require Numbers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireUppercase"
                  checked={settings.requireUppercase}
                  onCheckedChange={(checked) => handleChange('requireUppercase', checked)}
                />
                <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts: {settings.maxLoginAttempts}</Label>
                <Slider
                  id="maxLoginAttempts"
                  min={1}
                  max={10}
                  step={1}
                  value={[settings.maxLoginAttempts]}
                  onValueChange={(value) => handleChange('maxLoginAttempts', value[0])}
                />
              </div>
              <Button type="submit" disabled={updating} className="w-full">
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

