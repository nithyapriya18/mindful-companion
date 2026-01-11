import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageSquare, UserPlus, RefreshCw } from 'lucide-react'

interface SessionContinuationModalProps {
  therapistName: string
  therapistPhoto: string
  onContinueCurrent: () => void
  onNewWithSame: () => void
  onNewWithDifferent: () => void
  onCancel: () => void
}

export function SessionContinuationModal({
  therapistName,
  therapistPhoto,
  onContinueCurrent,
  onNewWithSame,
  onNewWithDifferent,
  onCancel,
}: SessionContinuationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="max-w-md w-full p-6 bg-card">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={therapistPhoto}
            alt={therapistName}
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Ready to talk?
          </h2>
          <p className="text-muted-foreground">
            You have an ongoing conversation with <strong>{therapistName}</strong>
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onContinueCurrent}
            className="w-full h-14 text-base flex items-center justify-start gap-3"
          >
            <MessageSquare className="w-5 h-5" />
            <div className="text-left flex-1">
              <div className="font-semibold">Continue Current Session</div>
              <div className="text-xs opacity-80">Pick up where you left off</div>
            </div>
          </Button>

          <Button
            onClick={onNewWithSame}
            variant="outline"
            className="w-full h-14 text-base flex items-center justify-start gap-3"
          >
            <RefreshCw className="w-5 h-5" />
            <div className="text-left flex-1">
              <div className="font-semibold">Start Fresh with {therapistName.split(' ')[1]}</div>
              <div className="text-xs opacity-80">New session, same therapist</div>
            </div>
          </Button>

          <Button
            onClick={onNewWithDifferent}
            variant="outline"
            className="w-full h-14 text-base flex items-center justify-start gap-3"
          >
            <UserPlus className="w-5 h-5" />
            <div className="text-left flex-1">
              <div className="font-semibold">Choose Different Therapist</div>
              <div className="text-xs opacity-80">Start with someone new</div>
            </div>
          </Button>

          <Button
            onClick={onCancel}
            variant="ghost"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}