import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Profile = {
  id: string
  full_name: string
  email: string
  date_of_birth?: string
  gender?: string
  phone?: string
  address?: string
  postal_code?: string
  country?: string
  created_at: string
  updated_at: string
}

export type TherapistProfile = {
  id: string
  name: string
  title: string
  credentials?: string
  bio: string
  specializations: string[]
  personality_traits: string[]
  therapeutic_approach: string
  avatar_url?: string
  voice_id?: string
  is_active: boolean
}

export type Message = {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  crisis_flag: boolean
}