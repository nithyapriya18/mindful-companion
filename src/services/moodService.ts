import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

export type MoodType = 'struggling' | 'low' | 'okay' | 'good' | 'great'

export interface MoodLog {
  id: string
  user_id: string
  mood: MoodType
  note?: string
  logged_at: string
  created_at: string
}

export async function logMood(userId: string, mood: MoodType, date?: Date, note?: string) {
  // Use the exact date provided, or today in local timezone
  const logDate = date || new Date()
  
  // Format as YYYY-MM-DD in LOCAL timezone (not UTC)
  const year = logDate.getFullYear()
  const month = String(logDate.getMonth() + 1).padStart(2, '0')
  const day = String(logDate.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  console.log('Logging mood for date:', dateStr, 'from Date object:', logDate)
  
  const { data, error } = await supabase
    .from('mood_logs')
    .upsert({
      user_id: userId,
      mood,
      note,
      logged_at: dateStr,
    }, {
      onConflict: 'user_id,logged_at'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMoodLogs(userId: string, startDate?: Date, endDate?: Date) {
  let query = supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })

  if (startDate) {
    const year = startDate.getFullYear()
    const month = String(startDate.getMonth() + 1).padStart(2, '0')
    const day = String(startDate.getDate()).padStart(2, '0')
    const startStr = `${year}-${month}-${day}`
    query = query.gte('logged_at', startStr)
  }

  if (endDate) {
    const year = endDate.getFullYear()
    const month = String(endDate.getMonth() + 1).padStart(2, '0')
    const day = String(endDate.getDate()).padStart(2, '0')
    const endStr = `${year}-${month}-${day}`
    query = query.lte('logged_at', endStr)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getMoodForDate(userId: string, date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('logged_at', dateStr)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function deleteMoodLog(userId: string, date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  const { error } = await supabase
    .from('mood_logs')
    .delete()
    .eq('user_id', userId)
    .eq('logged_at', dateStr)

  if (error) throw error
}

export async function updateMoodLog(userId: string, date: Date, mood: MoodType, note?: string) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  const { data, error } = await supabase
    .from('mood_logs')
    .update({
      mood,
      note,
    })
    .eq('user_id', userId)
    .eq('logged_at', dateStr)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMoodStats(userId: string, startDate: Date, endDate: Date) {
  const startYear = startDate.getFullYear()
  const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
  const startDay = String(startDate.getDate()).padStart(2, '0')
  const startStr = `${startYear}-${startMonth}-${startDay}`
  
  const endYear = endDate.getFullYear()
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0')
  const endDay = String(endDate.getDate()).padStart(2, '0')
  const endStr = `${endYear}-${endMonth}-${endDay}`
  
  const { data, error } = await supabase
    .from('mood_logs')
    .select('mood')
    .eq('user_id', userId)
    .gte('logged_at', startStr)
    .lte('logged_at', endStr)

  if (error) throw error

  const logs = data || []
  
  // Calculate stats
  const moodCounts = logs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const moodValues = {
    struggling: 1,
    low: 2,
    okay: 3,
    good: 4,
    great: 5,
  }

  const totalScore = logs.reduce((sum, log) => {
    return sum + (moodValues[log.mood as keyof typeof moodValues] || 0)
  }, 0)

  const avgScore = logs.length > 0 ? totalScore / logs.length : 0

  const mostCommonMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] as MoodType | undefined

  return {
    totalLogs: logs.length,
    moodCounts,
    avgScore,
    mostCommonMood,
  }
}