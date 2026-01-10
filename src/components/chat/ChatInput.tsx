import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className="input-field resize-none pr-12 min-h-[48px] max-h-32"
          style={{ height: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 128) + 'px';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-2 bottom-2 w-8 h-8 text-muted-foreground hover:text-foreground"
        >
          <Mic className="w-4 h-4" />
        </Button>
      </div>
      
      {message.trim() && (
        <Button 
          type="submit" 
          size="icon" 
          className="w-12 h-12 rounded-full btn-primary flex-shrink-0"
          disabled={disabled}
        >
          <Send className="w-5 h-5" />
        </Button>
      )}
    </form>
  );
}
