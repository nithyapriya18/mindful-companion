import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react'
import { Therapist } from '@/data/therapists'
import { TherapistSettings } from '@/types/therapist'
import { useAuth } from './AuthContext'
import { 
  getTherapistPreferences, 
  saveTherapistPreferences,
  getLastTherapist 
} from '@/services/sessionService'
import { therapists } from '@/data/therapists'

export interface UISettings {
  warmth: number
  directness: number
  humor: 'none' | 'rare' | 'occasional' | 'frequent'
  responseLength: number
}

const defaultUISettings: UISettings = {
  warmth: 50,
  directness: 50,
  humor: 'occasional',
  responseLength: 50,
}

interface TherapistContextType {
  selectedTherapist: Therapist | null
  settings: TherapistSettings
  uiSettings: UISettings
  updateSettings: (s: Partial<UISettings>) => void
  selectTherapist: (t: Therapist) => void
  clearTherapist: () => void
  lastTherapistId: string | null
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined)

export function TherapistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [uiSettings, setUISettings] = useState<UISettings>(defaultUISettings)
  const [lastTherapistId, setLastTherapistId] = useState<string | null>(null)

  // Load last therapist on mount
  useEffect(() => {
    if (user) {
      loadLastTherapist()
    }
  }, [user])

  // Load preferences when therapist is selected
  useEffect(() => {
    if (user && selectedTherapist) {
      loadTherapistPreferences()
    }
  }, [user, selectedTherapist?.id])

  async function loadLastTherapist() {
    try {
      const therapistId = await getLastTherapist(user!.id)
      setLastTherapistId(therapistId)
    } catch (error) {
      console.error('Failed to load last therapist:', error)
    }
  }

  async function loadTherapistPreferences() {
    if (!user || !selectedTherapist) return

    try {
      const prefs = await getTherapistPreferences(user.id, selectedTherapist.id)
      if (prefs) {
        setUISettings({
          warmth: prefs.warmth,
          directness: prefs.directness,
          humor: prefs.humor,
          responseLength: prefs.response_length,
        })
      } else {
        setUISettings(defaultUISettings)
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    }
  }

  const settings: TherapistSettings = useMemo(() => {
    if (!selectedTherapist) {
      return {
        name: 'Therapist',
        approach: '',
        warmth: uiSettings.warmth,
        directness: uiSettings.directness,
        humor: uiSettings.humor,
        responseLength: uiSettings.responseLength,
        specializations: [],
        personalityTraits: [],
      }
    }

    return {
      name: selectedTherapist.name,
      approach: selectedTherapist.approach,
      warmth: uiSettings.warmth,
      directness: uiSettings.directness,
      humor: uiSettings.humor,
      responseLength: uiSettings.responseLength,
      specializations: selectedTherapist.specializations,
      personalityTraits: selectedTherapist.personalityTraits,
    }
  }, [selectedTherapist, uiSettings])

  async function updateSettings(newSettings: Partial<UISettings>) {
    const updated = { ...uiSettings, ...newSettings }
    setUISettings(updated)

    // Save to database
    if (user && selectedTherapist) {
      try {
        await saveTherapistPreferences(user.id, selectedTherapist.id, {
          warmth: updated.warmth,
          directness: updated.directness,
          humor: updated.humor,
          response_length: updated.responseLength,
        })
      } catch (error) {
        console.error('Failed to save preferences:', error)
      }
    }
  }

  function selectTherapist(therapist: Therapist) {
    setSelectedTherapist(therapist)
  }

  return (
    <TherapistContext.Provider
      value={{
        selectedTherapist,
        settings,
        uiSettings,
        selectTherapist,
        updateSettings,
        clearTherapist: () => {
          setSelectedTherapist(null)
          setUISettings(defaultUISettings)
        },
        lastTherapistId,
      }}
    >
      {children}
    </TherapistContext.Provider>
  )
}

export function useTherapist() {
  const ctx = useContext(TherapistContext)
  if (!ctx) throw new Error('useTherapist must be used within TherapistProvider')
  return ctx
}