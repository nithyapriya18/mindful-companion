import { useTherapist } from '@/contexts/TherapistContext';

export function TypingIndicator() {
  const { selectedTherapist } = useTherapist();
  
  return (
    <div className="flex items-center gap-3">
      {selectedTherapist && (
        <img
          src={selectedTherapist.photoUrl}
          alt={selectedTherapist.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedTherapist?.name.split(' ')[0]} is thinking
          </span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
