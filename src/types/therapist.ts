export interface TherapistSettings {
  name: string
  approach: string
  warmth: number        // 0–100 (UI)
  directness: number   // 0–100 (UI)
  humor: 'none' | 'rare' | 'occasional' | 'frequent'
  responseLength: number // 0–100 (UI)
  specializations: string[]
  personalityTraits: string[]
}
