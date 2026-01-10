import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { MoodCheckIn } from '@/components/dashboard/MoodCheckIn';
import { TherapistCard } from '@/components/dashboard/TherapistCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { InsightBanner } from '@/components/dashboard/InsightBanner';
import { Lock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleMoodSelected = (mood: number) => {
    console.log('Mood selected:', mood);
  };

  return (
    <div className="page-container pb-20 md:pb-0">
      <AppHeader />
      
      <main className="pt-24 pb-8">
        <div className="section-container max-w-4xl">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.firstName}
            </h1>
            <p className="text-muted-foreground text-lg">
              How can I support you today?
            </p>
          </div>

          {/* Mood Check-In */}
          <div className="mb-8">
            <MoodCheckIn onMoodSelected={handleMoodSelected} />
          </div>

          {/* Therapist Card */}
          <div className="mb-8">
            <TherapistCard />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Quick Actions
            </h2>
            <QuickActions />
          </div>

          {/* Insight Banner */}
          <div className="mb-8">
            <InsightBanner 
              insight="You've been making great progress with managing work stress. Your last conversation showed real insight into boundary-setting."
            />
          </div>

          {/* Privacy Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>
              Your conversations help your therapist understand you better.{' '}
              <a href="#" className="text-primary hover:underline">Start a private chat</a>
            </span>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
