import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTherapist } from '@/contexts/TherapistContext'
import { useAuth } from '@/contexts/AuthContext'
import { 
  generateTherapeuticResponse, 
  detectCrisis,
  generateQuickResponses 
} from '@/services/aiService'
import {
  getOrCreateSession,
  getSessionMessages,
  saveMessage,
  startNewSession,
  endSession,
} from '@/services/sessionService'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { QuickResponses } from '@/components/chat/QuickResponses'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { SessionModal } from '@/components/chat/SessionModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MoreVertical, ArrowLeft, AlertCircle, Phone, MessageSquare, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
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
import { format, isToday, isYesterday } from 'date-fns'

interface UIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Chat() {
  const { user } = useAuth()
  const { selectedTherapist, settings } = useTherapist()
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showCrisisModal, setShowCrisisModal] = useState(false)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false)
  const [selectedSentiment, setSelectedSentiment] = useState<string>('')
  const [endingSession, setEndingSession] = useState(false)
  const [crisisLevel, setCrisisLevel] = useState<'none' | 'moderate' | 'severe' | 'immediate'>('none')
  const [quickPrompts, setQuickPrompts] = useState<string[]>([
    "I'm not sure where to start",
    "I need to talk about something",
    "This is hard to share",
    "How can you help me?",
  ])
  const [loadingPrompts, setLoadingPrompts] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [hasExistingSession, setHasExistingSession] = useState(false)
  const [lastSessionDate, setLastSessionDate] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Get session ID from URL if present
  const searchParams = new URLSearchParams(window.location.search)
  const sessionIdFromUrl = searchParams.get('session')
  const newSessionParam = searchParams.get('new') === 'true'

  // Check for existing session on mount
  useEffect(() => {
    if (user && selectedTherapist) {
      if (sessionIdFromUrl) {
        // Load specific session from URL
        loadSpecificSession(sessionIdFromUrl)
      } else if (newSessionParam) {
        // Create new session
        handleNewSession()
      } else {
        // Check for existing session
        checkForExistingSession()
      }
    }
  }, [user, selectedTherapist])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Generate new quick prompts after assistant responds
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    
    if (
      messages.length > 1 && 
      lastMessage?.role === 'assistant' && 
      lastMessage?.content &&
      !isTyping
    ) {
      updateQuickPrompts()
    }
  }, [messages, isTyping])

  async function loadSpecificSession(sessionId: string) {
    setLoadingSession(true)
    try {
      const existingMessages = await getSessionMessages(sessionId)
      
      const formattedMessages: UIMessage[] = existingMessages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at),
      }))

      setMessages(formattedMessages)
      setSessionId(sessionId)
    } catch (error) {
      console.error('Error loading session:', error)
      navigate('/dashboard')
    } finally {
      setLoadingSession(false)
    }
  }

  async function checkForExistingSession() {
    if (!user || !selectedTherapist) {
      console.log('Missing user or therapist:', { user: !!user, therapist: !!selectedTherapist })
      return
    }

    console.log('Checking for session...', { userId: user.id, therapistId: selectedTherapist.id })
    setLoadingSession(true)
    
    try {
      const session = await getOrCreateSession(user.id, selectedTherapist.id)
      console.log('Session loaded:', session)
      
      const existingMessages = await getSessionMessages(session.id)
      console.log('Existing messages:', existingMessages.length)
      
      if (existingMessages.length > 0) {
        setHasExistingSession(true)
        setLastSessionDate(session.updated_at || session.started_at)
        setSessionId(session.id)
        setShowSessionModal(true)
      } else {
        setSessionId(session.id)
        console.log('Starting fresh with session ID:', session.id)
        
        // Save initial greeting to database
        const greeting = selectedTherapist.sampleGreeting
        await saveMessage(session.id, 'assistant', greeting)
        
        setMessages([
          {
            id: 'init',
            role: 'assistant',
            content: greeting,
            timestamp: new Date(),
          },
        ])
        setLoadingSession(false)
      }
    } catch (error) {
      console.error('Error loading session:', error)
      setLoadingSession(false)
    }
  }

  async function handleContinueSession() {
    if (!sessionId) return

    try {
      const existingMessages = await getSessionMessages(sessionId)
      
      const formattedMessages: UIMessage[] = existingMessages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at),
      }))

      setMessages(formattedMessages)
      setShowSessionModal(false)
      setLoadingSession(false)
    } catch (error) {
      console.error('Error loading messages:', error)
      setLoadingSession(false)
    }
  }

  async function handleNewSession() {
    if (!user || !selectedTherapist) return

    try {
      const newSession = await startNewSession(user.id, selectedTherapist.id)
      setSessionId(newSession.id)
      
      // Save initial greeting to database
      const greeting = selectedTherapist.sampleGreeting
      await saveMessage(newSession.id, 'assistant', greeting)
      
      setMessages([
        {
          id: 'init',
          role: 'assistant',
          content: greeting,
          timestamp: new Date(),
        },
      ])
      
      setShowSessionModal(false)
      setLoadingSession(false)
    } catch (error) {
      console.error('Error creating new session:', error)
      setLoadingSession(false)
    }
  }

  async function handleEndSession() {
    if (!sessionId) return

    setEndingSession(true)
    try {
      await endSession(sessionId, selectedSentiment || undefined)
      setShowEndSessionDialog(false)
      setSelectedSentiment('')
      
      // Navigate back to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to end session:', error)
      alert('Failed to end session. Please try again.')
    } finally {
      setEndingSession(false)
    }
  }

  async function updateQuickPrompts() {
    setLoadingPrompts(true)
    try {
      const convo = messages.map(m => ({
        role: m.role,
        content: m.content,
      }))
      
      const newPrompts = await generateQuickResponses(convo)
      setQuickPrompts(newPrompts)
    } catch (error) {
      console.error('Failed to generate prompts:', error)
    } finally {
      setLoadingPrompts(false)
    }
  }

  async function handleSend(content: string) {
    console.log('handleSend called with:', content)
    console.log('Current sessionId:', sessionId)
    
    if (!sessionId) {
      console.error('No active session!')
      alert('No active session. Please refresh the page.')
      return
    }

    const userMsg: UIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    // Check for crisis keywords
    const crisis = detectCrisis(content)
    if (crisis.level === 'immediate' || crisis.level === 'severe') {
      setCrisisLevel(crisis.level)
      setShowCrisisModal(true)
    }

    // Save user message to database
    try {
      await saveMessage(sessionId, 'user', content, crisis.level !== 'none')
    } catch (error) {
      console.error('Failed to save user message:', error)
    }

    setMessages(prev => [
      ...prev,
      userMsg,
      {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      },
    ])

    setIsTyping(true)

    try {
      const convo = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }))

      let fullResponse = ''

      await generateTherapeuticResponse(convo, settings, chunk => {
        fullResponse += chunk
        setMessages(curr => {
          const copy = [...curr]
          copy[copy.length - 1].content += chunk
          return copy
        })
      })

      // Save assistant message to database
      if (fullResponse) {
        try {
          await saveMessage(sessionId, 'assistant', fullResponse)
        } catch (error) {
          console.error('Failed to save assistant message:', error)
        }
      }
    } catch (err) {
      console.error('GPT error:', err)
      const errorMessage = "I'm having trouble responding right now. Please try again in a moment, or if this is urgent, please reach out to a crisis helpline."
      
      setMessages(curr => {
        const copy = [...curr]
        copy[copy.length - 1].content = errorMessage
        return copy
      })

      try {
        await saveMessage(sessionId, 'assistant', errorMessage)
      } catch (error) {
        console.error('Failed to save error message:', error)
      }
    } finally {
      setIsTyping(false)
    }
  }

  if (!selectedTherapist) {
    navigate('/therapist-selection')
    return null
  }

  if (loadingSession) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your conversation...</p>
        </div>
      </div>
    )
  }

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'EEEE, MMMM d')
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Session Selection Modal */}
      {showSessionModal && hasExistingSession && (
        <SessionModal
          therapistName={selectedTherapist.name}
          therapistPhoto={selectedTherapist.photoUrl}
          onContinue={handleContinueSession}
          onNewSession={handleNewSession}
          lastSessionDate={lastSessionDate || undefined}
        />
      )}

      {/* End Session Dialog */}
      <Dialog open={showEndSessionDialog} onOpenChange={setShowEndSessionDialog}>
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
            <Button variant="outline" onClick={() => setShowEndSessionDialog(false)} disabled={endingSession}>
              Cancel
            </Button>
            <Button onClick={handleEndSession} disabled={endingSession}>
              {endingSession ? 'Ending...' : 'End Session'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Crisis Modal */}
      {showCrisisModal && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6 bg-card shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2 text-foreground">You're Not Alone</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  What you're feeling is serious. Please reach out to trained crisis counselors who are available right now to help.
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <a 
                href="tel:+919152987821"
                className="flex items-center gap-3 p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors w-full"
              >
                <Phone className="h-5 w-5" />
                <div className="text-left flex-1">
                  <div className="font-semibold">Call +91 9152987821</div>
                  <div className="text-sm opacity-90">Suicide & Crisis Lifeline India (24/7)</div>
                </div>
              </a>

              <a 
                href="tel:+912227546669"
                className="flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full"
              >
                <Phone className="h-5 w-5" />
                <div className="text-left flex-1">
                  <div className="font-semibold">Call +91 22 2754 6669</div>
                  <div className="text-sm opacity-90">AASRA (24/7)</div>
                </div>
              </a>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-sm text-orange-900 dark:text-orange-200">
                  <strong>Need more help?</strong> Visit <a href="https://findahelpline.com" target="_blank" rel="noopener" className="underline">findahelpline.com</a> for international crisis resources.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCrisisModal(false)}
            >
              I'm Safe, Continue Chat
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              I'll stay here with you. The conversation will continue after you close this.
            </p>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="flex-shrink-0 bg-background border-b border-border shadow-sm z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <img
                src={selectedTherapist.photoUrl}
                alt={selectedTherapist.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-foreground">{selectedTherapist.name}</h2>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setCrisisLevel('immediate')
                setShowCrisisModal(true)
              }}
              className="hidden sm:flex gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Crisis Help
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => {
                    setCrisisLevel('immediate')
                    setShowCrisisModal(true)
                  }}
                  className="text-red-600 sm:hidden"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Crisis Help
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/customize-therapist')}>
                  Adjust Tone
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNewSession()}>
                  Start New Session
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowEndSessionDialog(true)}
                  className="text-orange-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  End Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <span className="px-4 py-1 bg-muted rounded-full text-xs text-muted-foreground">
              {getDateLabel(new Date())}
            </span>
          </div>

          <div className="space-y-6">
            {messages.map(m => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Bottom Input */}
      <div className="flex-shrink-0 bg-background border-t border-border shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
          <QuickResponses 
            onSelect={handleSend}
            prompts={quickPrompts}
            isLoading={loadingPrompts}
          />
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  )
}