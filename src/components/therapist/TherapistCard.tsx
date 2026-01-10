import { Therapist } from '@/data/therapists';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface TherapistCardProps {
  therapist: Therapist;
  onSelect: (therapist: Therapist) => void;
  onViewProfile: (therapist: Therapist) => void;
}

export function TherapistCard({ therapist, onSelect, onViewProfile }: TherapistCardProps) {
  return (
    <div className="card-elevated p-6 flex gap-6 hover:shadow-medium transition-all duration-300">
      <img
        src={therapist.photoUrl}
        alt={therapist.name}
        className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="text-lg font-semibold">{therapist.name}</h3>
            <p className="text-sm text-muted-foreground">{therapist.credentials}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {therapist.personalityTraits.map((trait) => (
            <Badge key={trait} variant="secondary" className="text-xs">
              {trait}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {therapist.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {therapist.specializations.slice(0, 4).map((spec) => (
            <span key={spec} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
              {spec}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => onSelect(therapist)}
            className="btn-primary"
          >
            Select This Therapist
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onViewProfile(therapist)}
            className="text-muted-foreground"
          >
            View Profile
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
