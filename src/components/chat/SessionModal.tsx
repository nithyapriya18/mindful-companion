import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'

interface SessionModalProps {
  therapistName: string
  therapistPhoto: string
  onContinue: () => void
  onNewSession: () => void
  lastSessionDate?: string
}

export function SessionModal({
  therapistName,
  therapistPhoto,
  onContinue,
  onNewSession,
  lastSessionDate,
}: SessionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="max-w-md w-full p-6 bg-background">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={therapistPhoto}
            alt={therapistName}
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            You last spoke with <strong>{therapistName}</strong>
            {lastSessionDate && (
              <> on {format(new Date(lastSessionDate), 'MMM d')}</>
            )}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onContinue}
            className="w-full h-12 text-base"
          >
            Continue Our Conversation
          </Button>

          <Button
            onClick={onNewSession}
            variant="outline"
            className="w-full h-12 text-base"
          >
            Start Fresh Session
          </Button>

          <Button
            onClick={() => window.location.href = '/therapist-selection'}
            variant="ghost"
            className="w-full"
          >
            Choose Different Therapist
          </Button>
        </div>
      </Card>
    </div>
  )
}