import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
}

export function UserActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const fetchedLogs = await api.getActivityLogs(token)
          setLogs(fetchedLogs)
        }
      } catch (error) {
        console.error('Failed to fetch activity logs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivityLogs()
  }, [])

  return (
    <Card className="neon-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">User Activity Log</CardTitle>
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
                <TableHead>User ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.userId}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

