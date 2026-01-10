import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/contexts/TherapistContext';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

export function TherapistCard() {
  const { selectedTherapist } = useTherapist();
  const navigate = useNavigate();

  if (!selectedTherapist) {
    return (
      <div 
        onClick={() => navigate('/therapist-selection')}
        className="card-elevated p-6 cursor-pointer hover:shadow-medium transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Choose Your Therapist</h3>
            <p className="text-sm text-muted-foreground">
              Browse our directory and find the right fit for you
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Your Therapist
      </h3>
      
      <div className="flex gap-4">
        <img
          src={selectedTherapist.photoUrl}
          alt={selectedTherapist.name}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold">{selectedTherapist.name}</h4>
          <p className="text-sm text-muted-foreground mb-2">{selectedTherapist.credentials}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {selectedTherapist.personalityTraits.slice(0, 2).map((trait) => (
              <Badge key={trait} variant="secondary" className="text-xs">
                {trait}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Specializes in {selectedTherapist.specializations.slice(0, 2).join(', ')}
          </p>
        </div>
      </div>

      <button 
        onClick={() => navigate('/therapist-selection')}
        className="mt-4 flex items-center gap-1 text-sm text-primary hover:underline"
      >
        View Profile & Change Therapist
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
