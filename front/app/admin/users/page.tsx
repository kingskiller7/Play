'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserManagement() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const fetchedUsers = await api.getUsers(token)
          setUsers(fetchedUsers)
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setName(user.name)
    setEmail(user.email)
    setRole(user.role)
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      if (token && editingUser) {
        await api.updateUser(token, editingUser.id, { name, email, role })
        setUsers(users.map(user => user.id === editingUser.id ? { ...user, name, email, role } : user))
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (userId: string) => {
    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await api.deleteUser(token, userId)
        setUsers(users.filter(user => user.id !== userId))
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (!isAdmin) {
    return <Layout>You do not have permission to view this page.</Layout>
  }

  return (
    <Layout>
      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary neon-text">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => handleEdit(user)}>Edit</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="role">Role</Label>
                              <Input
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="bg-background"
                              />
                            </div>
                            <Button onClick={handleUpdate} disabled={updating}>
                              {updating ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                'Update User'
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" onClick={() => handleDelete(user.id)} className="ml-2" disabled={deleting}>
                        {deleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}