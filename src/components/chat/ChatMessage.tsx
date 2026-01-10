import { useTherapist } from '@/contexts/TherapistContext';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { selectedTherapist } = useTherapist();
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && selectedTherapist && (
        <img
          src={selectedTherapist.photoUrl}
          alt={selectedTherapist.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && selectedTherapist && (
          <p className="text-xs text-muted-foreground mb-1">{selectedTherapist.name}</p>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {format(message.timestamp, 'h:mm a')}
        </p>
      </div>
    </div>
  );
}
