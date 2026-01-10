import { useState } from 'react';
import { Button } from '@/components/ui/button';

const moods = [
  { emoji: '😰', label: 'Struggling', value: 1 },
  { emoji: '😕', label: 'Low', value: 2 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😊', label: 'Great', value: 5 },
];

interface MoodCheckInProps {
  onMoodSelected: (mood: number) => void;
}

export function MoodCheckIn({ onMoodSelected }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
    setShowFollowUp(true);
    onMoodSelected(value);
  };

  return (
    <div className="card-elevated p-6">
      <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>
      
      <div className="flex justify-between gap-2 mb-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelect(mood.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 flex-1 ${
              selectedMood === mood.value
                ? 'bg-primary/10 ring-2 ring-primary'
                : 'hover:bg-muted'
            }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs text-muted-foreground">{mood.label}</span>
          </button>
        ))}
      </div>

      {showFollowUp && (
        <div className="animate-slide-up pt-4 border-t border-border">
          <p className="text-muted-foreground mb-4">
            Thanks for sharing. Would you like to talk about what's contributing to this feeling?
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="btn-primary">
              Yes, let's talk
            </Button>
            <Button size="sm" variant="outline">
              Not right now
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground">
              Just checking in
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
