import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Therapist, therapists } from '@/data/therapists';

export interface TherapistSettings {
  warmth: number;
  directness: number;
  humor: 'none' | 'rare' | 'occasional' | 'frequent';
  responseLength: number;
}

interface TherapistContextType {
  selectedTherapist: Therapist | null;
  settings: TherapistSettings;
  selectTherapist: (therapist: Therapist) => void;
  updateSettings: (settings: Partial<TherapistSettings>) => void;
  clearTherapist: () => void;
}

const defaultSettings: TherapistSettings = {
  warmth: 50,
  directness: 50,
  humor: 'occasional',
  responseLength: 50,
};

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export function TherapistProvider({ children }: { children: ReactNode }) {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [settings, setSettings] = useState<TherapistSettings>(defaultSettings);

  const selectTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
  };

  const updateSettings = (newSettings: Partial<TherapistSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const clearTherapist = () => {
    setSelectedTherapist(null);
    setSettings(defaultSettings);
  };

  return (
    <TherapistContext.Provider value={{ 
      selectedTherapist, 
      settings, 
      selectTherapist, 
      updateSettings,
      clearTherapist 
    }}>
      {children}
    </TherapistContext.Provider>
  );
}

export function useTherapist() {
  const context = useContext(TherapistContext);
  if (context === undefined) {
    throw new Error('useTherapist must be used within a TherapistProvider');
  }
  return context;
}
