import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { logMood, MoodType } from '@/services/moodService'
import { SessionContinuationModal } from './SessionContinuationModal'
import { useTherapist } from '@/contexts/TherapistContext'
import { getOrCreateSession, getSessionMessages } from '@/services/sessionService'

const moods = [
  { value: 'struggling' as MoodType, emoji: '😰', label: 'Struggling' },
  { value: 'low' as MoodType, emoji: '😕', label: 'Low' },
  { value: 'okay' as MoodType, emoji: '😐', label: 'Okay' },
  { value: 'good' as MoodType, emoji: '🙂', label: 'Good' },
  { value: 'great' as MoodType, emoji: '😊', label: 'Great' },
]

export function MoodCheckIn() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { selectedTherapist } = useTherapist()
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [note, setNote] = useState('')
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [showContinuationModal, setShowContinuationModal] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleMoodSelect(mood: MoodType) {
    setSelectedMood(mood)
    
    if (user) {
      try {
        // Log mood for today with optional note
        await logMood(user.id, mood, undefined, note || undefined)
      } catch (error) {
        console.error('Failed to log mood:', error)
      }
    }

    setShowFollowUp(true)
  }

  async function handleLetsTalk() {
    if (!user) return

    setLoading(true)
    
    try {
      // Check if user has an active session with selected therapist
      if (selectedTherapist) {
        const session = await getOrCreateSession(user.id, selectedTherapist.id)
        
        // Check if session has messages (ongoing conversation)
        const messages = await getSessionMessages(session.id)

        if (messages && messages.length > 0) {
          // Has ongoing conversation - show modal
          setShowContinuationModal(true)
          setLoading(false)
          return
        }
      }

      // No active session or no therapist selected - go to therapist selection or chat
      if (selectedTherapist) {
        navigate('/chat')
      } else {
        navigate('/therapist-selection')
      }
    } catch (error) {
      console.error('Error checking session:', error)
      // On error, still navigate to appropriate page
      if (selectedTherapist) {
        navigate('/chat')
      } else {
        navigate('/therapist-selection')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleContinueCurrent() {
    navigate('/chat')
  }

  function handleNewWithSame() {
    navigate('/chat?new=true')
  }

  function handleNewWithDifferent() {
    navigate('/therapist-selection')
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div className="flex justify-between gap-2">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                  hover:scale-105 hover:bg-muted
                  ${selectedMood === mood.value ? 'ring-2 ring-primary bg-muted' : ''}
                `}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className="text-sm text-muted-foreground">{mood.label}</span>
              </button>
            ))}
          </div>

          {/* Follow-up Question */}
          {showFollowUp && (
            <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
              <p className="text-foreground">
                Thanks for sharing. Would you like to talk about what's contributing to this feeling?
              </p>

              <Textarea
                placeholder="Add a note about how you're feeling (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[80px]"
              />

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleLetsTalk}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Loading...' : "Yes, let's talk"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFollowUp(false)}
                  className="flex-1"
                >
                  Not right now
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowFollowUp(false)
                    setSelectedMood(null)
                    setNote('')
                  }}
                >
                  Just checking in
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Continuation Modal */}
      {showContinuationModal && selectedTherapist && (
        <SessionContinuationModal
          therapistName={selectedTherapist.name}
          therapistPhoto={selectedTherapist.photoUrl}
          onContinueCurrent={handleContinueCurrent}
          onNewWithSame={handleNewWithSame}
          onNewWithDifferent={handleNewWithDifferent}
          onCancel={() => setShowContinuationModal(false)}
        />
      )}
    </>
  )
}