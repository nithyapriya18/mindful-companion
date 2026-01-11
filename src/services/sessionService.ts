import { supabase } from '@/lib/supabase'

export interface SessionPreview {
  id: string
  therapist_id: string
  therapist_name: string
  last_message: string
  updated_at: string
  message_count: number
}

export interface TherapistPreferences {
  therapist_id: string
  warmth: number
  directness: number
  humor: 'none' | 'rare' | 'occasional' | 'frequent'
  response_length: number
}

// Get or create active session for a therapist
export async function getOrCreateSession(userId: string, therapistId: string) {
  // Check for existing active session
  const { data: existingSession, error: fetchError } = await supabase
    .from('conversation_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('therapist_id', therapistId)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (existingSession && !fetchError) {
    return existingSession
  }

  // Create new session
  const { data: newSession, error: createError } = await supabase
    .from('conversation_sessions')
    .insert({
      user_id: userId,
      therapist_id: therapistId,
      status: 'active',
      is_active: true,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (createError) throw createError
  return newSession
}

// Get all messages for a session
export async function getSessionMessages(sessionId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

// Save a message
export async function saveMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  crisisFlag: boolean = false
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      session_id: sessionId,
      role,
      content,
      crisis_flag: crisisFlag,
    })
    .select()
    .single()

  // Update session timestamp
  await supabase
    .from('conversation_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) throw error
  return data
}

// Get user's therapist preferences
export async function getTherapistPreferences(
  userId: string,
  therapistId: string
): Promise<TherapistPreferences | null> {
  const { data, error } = await supabase
    .from('user_therapist_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('therapist_id', therapistId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  
  if (!data) return null
  
  return {
    therapist_id: data.therapist_id,
    warmth: data.warmth,
    directness: data.directness,
    humor: data.humor,
    response_length: data.response_length,
  }
}

// Save therapist preferences
export async function saveTherapistPreferences(
  userId: string,
  therapistId: string,
  preferences: Omit<TherapistPreferences, 'therapist_id'>
) {
  const { data, error } = await supabase
    .from('user_therapist_preferences')
    .upsert({
      user_id: userId,
      therapist_id: therapistId,
      warmth: preferences.warmth,
      directness: preferences.directness,
      humor: preferences.humor,
      response_length: preferences.response_length,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get last used therapist
export async function getLastTherapist(userId: string) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .select('therapist_id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data?.therapist_id || null
}

// Archive current session and start new one
export async function startNewSession(userId: string, therapistId: string) {
  // Archive existing active sessions
  await supabase
    .from('conversation_sessions')
    .update({ 
      is_active: false,
      ended_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('therapist_id', therapistId)
    .eq('is_active', true)

  // Create new session
  return getOrCreateSession(userId, therapistId)
}

// Add to existing sessionService.ts

export interface ConversationHistoryItem {
  id: string
  therapist_id: string
  therapist_name: string
  started_at: string
  ended_at: string | null
  status: 'active' | 'ended'
  is_active: boolean
  sentiment?: string
  message_count: number
  last_message: string
  action_items: string[]
}

// Get all conversations with details
export async function getConversationHistory(userId: string): Promise<ConversationHistoryItem[]> {
  const { data: sessions, error } = await supabase
    .from('conversation_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })

  if (error) throw error

  const history = await Promise.all(
    (sessions || []).map(async (session) => {
      // Get message count
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', session.id)

      // Get last message
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('content')
        .eq('session_id', session.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Get all action items from messages
      const { data: actionItemsData } = await supabase
        .from('messages')
        .select('action_items')
        .eq('session_id', session.id)
        .not('action_items', 'is', null)

      const allActionItems = (actionItemsData || [])
        .flatMap(m => m.action_items || [])
        .filter(Boolean)

      return {
        id: session.id,
        therapist_id: session.therapist_id,
        therapist_name: '', // Will be filled from therapist data
        started_at: session.started_at,
        ended_at: session.ended_at,
        status: session.status || 'active',
        is_active: session.is_active,
        sentiment: session.sentiment,
        message_count: count || 0,
        last_message: lastMsg?.content?.substring(0, 100) || 'No messages',
        action_items: allActionItems,
      }
    })
  )

  return history
}

// End a session
export async function endSession(sessionId: string, sentiment?: string) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .update({
      status: 'ended',
      is_active: false,
      ended_at: new Date().toISOString(),
      sentiment,
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get list of past sessions for a therapist
export async function getPastSessions(
  userId: string,
  therapistId: string
): Promise<SessionPreview[]> {
  const { data: sessions, error } = await supabase
    .from('conversation_sessions')
    .select(`
      id,
      therapist_id,
      updated_at,
      is_active,
      started_at
    `)
    .eq('user_id', userId)
    .eq('therapist_id', therapistId)
    .order('updated_at', { ascending: false })

  if (error) throw error

  // Get message count and last message for each session
  const previews = await Promise.all(
    (sessions || []).map(async (session) => {
      const { data: messages, count } = await supabase
        .from('messages')
        .select('content, created_at', { count: 'exact' })
        .eq('session_id', session.id)
        .order('created_at', { ascending: false })
        .limit(1)

      return {
        id: session.id,
        therapist_id: session.therapist_id,
        therapist_name: '', // Will be filled from context
        last_message: messages?.[0]?.content?.substring(0, 100) || 'New session',
        updated_at: session.updated_at || session.started_at,
        message_count: count || 0,
      }
    })
  )

  return previews
}
