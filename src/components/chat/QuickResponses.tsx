interface QuickResponsesProps {
  onSelect: (response: string) => void;
}

const responses = [
  "Tell me more",
  "That's hard to explain",
  "Can we change topics?",
  "I need a moment",
];

export function QuickResponses({ onSelect }: QuickResponsesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {responses.map((response) => (
        <button
          key={response}
          onClick={() => onSelect(response)}
          className="px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
        >
          {response}
        </button>
      ))}
    </div>
  );
}
