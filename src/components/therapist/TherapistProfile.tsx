import { Therapist } from '@/data/therapists';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Volume2 } from 'lucide-react';

interface TherapistProfileProps {
  therapist: Therapist;
  onSelect: (therapist: Therapist) => void;
  onBack: () => void;
}

export function TherapistProfile({ therapist, onSelect, onBack }: TherapistProfileProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </button>

      <div className="card-elevated p-8">
        <div className="flex gap-8 mb-8">
          <img
            src={therapist.photoUrl}
            alt={therapist.name}
            className="w-40 h-40 rounded-2xl object-cover flex-shrink-0"
          />
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{therapist.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{therapist.credentials}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {therapist.personalityTraits.map((trait) => (
                <Badge key={trait} variant="secondary">
                  {trait}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">{therapist.experience}</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              About
            </h3>
            <p className="text-foreground leading-relaxed">{therapist.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Therapeutic Approach
            </h3>
            <p className="text-foreground">{therapist.approach}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Specializations
            </h3>
            <div className="flex flex-wrap gap-2">
              {therapist.specializations.map((spec) => (
                <span key={spec} className="text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Sample Greeting
            </h3>
            <div className="bg-surface rounded-xl p-4 border border-border/50">
              <p className="text-foreground italic">"{therapist.sampleGreeting}"</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={() => onSelect(therapist)}
            size="lg"
            className="btn-primary flex-1"
          >
            Select This Therapist
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Volume2 className="w-4 h-4" />
            Preview Voice
          </Button>
        </div>
      </div>
    </div>
  );
}
