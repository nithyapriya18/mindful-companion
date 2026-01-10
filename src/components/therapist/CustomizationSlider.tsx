import { Slider } from '@/components/ui/slider';

interface CustomizationSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

export function CustomizationSlider({
  label,
  leftLabel,
  rightLabel,
  description,
  value,
  onChange,
}: CustomizationSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{label}</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
      
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
