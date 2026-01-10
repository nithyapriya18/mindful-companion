import { Lightbulb } from 'lucide-react';

interface InsightBannerProps {
  insight: string;
}

export function InsightBanner({ insight }: InsightBannerProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-warning/10 rounded-xl p-4 flex items-start gap-3 border border-primary/20">
      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
        <Lightbulb className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-1">Insight</p>
        <p className="text-sm text-muted-foreground">{insight}</p>
      </div>
    </div>
  );
}
