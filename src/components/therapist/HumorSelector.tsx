interface HumorSelectorProps {
  value: 'none' | 'rare' | 'occasional' | 'frequent';
  onChange: (value: 'none' | 'rare' | 'occasional' | 'frequent') => void;
}

const options: Array<{ value: 'none' | 'rare' | 'occasional' | 'frequent'; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'rare', label: 'Rare' },
  { value: 'occasional', label: 'Occasional' },
  { value: 'frequent', label: 'Frequent' },
];

export function HumorSelector({ value, onChange }: HumorSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Use of Humor</h3>
      
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              value === option.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-muted-foreground">
        How often light humor might be used to ease difficult moments
      </p>
    </div>
  );
}
