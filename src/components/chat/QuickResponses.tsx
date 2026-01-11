import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface QuickResponsesProps {
  onSelect: (response: string) => void
  prompts: string[]
  isLoading?: boolean
}

export function QuickResponses({ onSelect, prompts, isLoading }: QuickResponsesProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2 items-center justify-center py-2">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Thinking of responses...</span>
      </div>
    )
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {prompts.map((prompt, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(prompt)}
          className="whitespace-nowrap flex-shrink-0 text-sm"
        >
          {prompt}
        </Button>
      ))}
    </div>
  )
}