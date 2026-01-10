import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { TherapistCard } from '@/components/therapist/TherapistCard';
import { TherapistProfile } from '@/components/therapist/TherapistProfile';
import { therapists, approachFilters, specialtyFilters, Therapist } from '@/data/therapists';
import { Search, Filter } from 'lucide-react';
import { useTherapist } from '@/contexts/TherapistContext';

export default function TherapistSelection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApproach, setSelectedApproach] = useState('All Approaches');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [viewingProfile, setViewingProfile] = useState<Therapist | null>(null);
  
  const { selectTherapist } = useTherapist();
  const navigate = useNavigate();

  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSearch = 
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesApproach = 
      selectedApproach === 'All Approaches' || therapist.approach === selectedApproach;
    
    const matchesSpecialty = 
      selectedSpecialty === 'All Specialties' || 
      therapist.specializations.includes(selectedSpecialty);

    return matchesSearch && matchesApproach && matchesSpecialty;
  });

  const handleSelect = (therapist: Therapist) => {
    selectTherapist(therapist);
    navigate('/customize-therapist');
  };

  if (viewingProfile) {
    return (
      <div className="min-h-screen bg-surface py-8">
        <div className="section-container">
          <div className="mb-8">
            <Logo size="md" linkTo="/therapist-selection" />
          </div>
          <TherapistProfile
            therapist={viewingProfile}
            onSelect={handleSelect}
            onBack={() => setViewingProfile(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="section-container py-8">
        <div className="mb-8">
          <Logo size="md" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Find Your Therapist</h1>
            <p className="text-muted-foreground text-lg">
              Each AI therapist has a unique approach and personality. Browse our directory to find your match.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="card-elevated p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedApproach}
                  onChange={(e) => setSelectedApproach(e.target.value)}
                  className="input-field min-w-[200px]"
                >
                  {approachFilters.map((approach) => (
                    <option key={approach} value={approach}>{approach}</option>
                  ))}
                </select>
                
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="input-field min-w-[160px]"
                >
                  {specialtyFilters.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredTherapists.length} therapist{filteredTherapists.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="space-y-4">
            {filteredTherapists.map((therapist) => (
              <TherapistCard
                key={therapist.id}
                therapist={therapist}
                onSelect={handleSelect}
                onViewProfile={setViewingProfile}
              />
            ))}
          </div>

          {filteredTherapists.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No therapists match your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedApproach('All Approaches');
                  setSelectedSpecialty('All Specialties');
                }}
                className="text-primary hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
