import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/contexts/TherapistContext';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { QuickResponses } from '@/components/chat/QuickResponses';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { MoreVertical, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, isToday, isYesterday } from 'date-fns';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const mockResponses = [
  "I hear you, and I appreciate you sharing that with me. It sounds like you're dealing with a lot right now. Can you tell me more about what's been weighing on you?",
  "That's really insightful. It takes courage to recognize these patterns in ourselves. What do you think has been contributing to these feelings?",
  "I understand. Work stress can really impact all areas of our lives. Let's explore some strategies that might help you manage these situations more effectively.",
  "It's completely normal to feel that way. Many people experience similar feelings when facing these kinds of challenges. How have you been coping so far?",
  "Thank you for your openness. I can see you've been doing a lot of reflection. What would feel like a good first step forward for you?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedTherapist } = useTherapist();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTherapist && messages.length === 0) {
      // Add initial greeting
      setMessages([{
        id: '0',
        role: 'assistant',
        content: selectedTherapist.sampleGreeting,
        timestamp: new Date(),
      }]);
    }
  }, [selectedTherapist]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      timestamp: new Date(),
    };
    
    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d');
  };

  if (!selectedTherapist) {
    navigate('/therapist-selection');
    return null;
  }

  return (
    <div className="page-container flex flex-col">
      {/* Chat Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
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
                  <h2 className="font-semibold">{selectedTherapist.name}</h2>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="destructive" 
                size="sm" 
                className="btn-crisis"
              >
                🚨 SOS
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>End Chat</DropdownMenuItem>
                  <DropdownMenuItem>Share Transcript</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/customize-therapist')}>
                    Adjust Tone
                  </DropdownMenuItem>
                  <DropdownMenuItem>Report Issue</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 pt-20 pb-40 overflow-y-auto">
        <div className="section-container max-w-3xl py-6">
          {/* Date Separator */}
          <div className="flex items-center justify-center mb-6">
            <span className="px-4 py-1 rounded-full bg-muted text-xs text-muted-foreground">
              {getDateLabel(new Date())}
            </span>
          </div>

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border pb-safe">
        <div className="section-container max-w-3xl py-4 space-y-3">
          <QuickResponses onSelect={handleSend} />
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}
