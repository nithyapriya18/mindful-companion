import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/AuthContext'
import { getConversationHistory, endSession, ConversationHistoryItem } from '@/services/sessionService'
import { therapists } from '@/data/therapists'
import { format } from 'date-fns'
import { MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ConversationHistory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<ConversationHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [endingSession, setEndingSession] = useState<string | null>(null)
  const [selectedSentiment, setSelectedSentiment] = useState<string>('')

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  async function loadConversations() {
    if (!user) return

    setLoading(true)
    try {
      const history = await getConversationHistory(user.id)
      
      // Add therapist names and limit to last 10
      const withNames = history
        .map(conv => ({
          ...conv,
          therapist_name: therapists.find(t => t.id === conv.therapist_id)?.name || 'Unknown',
        }))
        .slice(0, 10) // Only keep last 10 conversations
      
      setConversations(withNames)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleEndSession() {
    if (!endingSession) return

    try {
      await endSession(endingSession, selectedSentiment || undefined)
      setEndingSession(null)
      setSelectedSentiment('')
      loadConversations()
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }

  function openConversation(sessionId: string) {
    // Navigate to chat with this session ID
    navigate(`/chat?session=${sessionId}`)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No conversations yet. Start your first chat!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
          <p className="text-sm text-muted-foreground">Last 10 conversations</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Ended</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Action Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations.map((conv) => (
                  <TableRow key={conv.id}>
                    <TableCell className="font-medium">
                      {conv.therapist_name}
                    </TableCell>
                    <TableCell>
                      {format(new Date(conv.started_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>
                      {conv.ended_at 
                        ? format(new Date(conv.ended_at), 'MMM d, yyyy h:mm a')
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {conv.status === 'ended' ? (
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="default" className="flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          In Progress
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{conv.message_count}</TableCell>
                    <TableCell>
                      {conv.sentiment ? (
                        <Badge variant="outline" className="capitalize">
                          {conv.sentiment}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {conv.action_items.length > 0 ? (
                        <div className="max-w-xs">
                          <ul className="text-xs space-y-1">
                            {conv.action_items.slice(0, 2).map((item, idx) => (
                              <li key={idx} className="truncate">• {item}</li>
                            ))}
                          </ul>
                          {conv.action_items.length > 2 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              +{conv.action_items.length - 2} more
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openConversation(conv.id)}
                          className="w-full"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {conv.status !== 'ended' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEndingSession(conv.id)}
                            className="w-full text-destructive hover:text-destructive border-destructive/50 hover:bg-destructive/10"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            End
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* End Session Dialog */}
      <Dialog open={!!endingSession} onOpenChange={() => setEndingSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Session</DialogTitle>
            <DialogDescription>
              How would you describe your overall feeling about this session?
            </DialogDescription>
          </DialogHeader>
          
          <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
            <SelectTrigger>
              <SelectValue placeholder="Select sentiment (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-helpful">Very Helpful</SelectItem>
              <SelectItem value="helpful">Helpful</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="not-helpful">Not Helpful</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEndingSession(null)}>
              Cancel
            </Button>
            <Button onClick={handleEndSession}>
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
