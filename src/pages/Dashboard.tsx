import { useAuth } from '@/contexts/AuthContext'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNav } from '@/components/layout/BottomNav'
import { MoodCheckIn } from '@/components/dashboard/MoodCheckIn'
import { TherapistCard } from '@/components/dashboard/TherapistCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { InsightBanner } from '@/components/dashboard/InsightBanner'
import { ConversationHistory } from '@/components/dashboard/ConversationHistory'
import { MoodCalendar } from '@/components/mood/MoodCalendar'
import { Lock } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="page-container pb-20 md:pb-0">
      <AppHeader />
      
      <main className="pt-24 pb-8">
        <div className="section-container max-w-7xl">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-muted-foreground text-lg">
              How can I support you today?
            </p>
          </div>

          {/* Mood Check-In */}
          <div className="mb-6">
            <MoodCheckIn />
          </div>

          {/* Mood Calendar - Full Width, Compact */}
          <div className="mb-6">
            <MoodCalendar />
          </div>

          {/* Therapist Card - Full Width */}
          <div className="mb-6">
            <TherapistCard />
          </div>

          {/* Quick Actions - 2x2 Grid */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Quick Actions
            </h2>
            <QuickActions />
          </div>

          {/* Insight Banner */}
          <div className="mb-6">
            <InsightBanner 
              insight="You've been making great progress with managing work stress. Your last conversation showed real insight into boundary-setting."
            />
          </div>

          {/* Conversation History Table */}
          <div className="mb-8">
            <ConversationHistory />
          </div>

          {/* Privacy Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>
              Your conversations are private and encrypted.{' '}
              All data is securely stored and only accessible by you.
            </span>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}