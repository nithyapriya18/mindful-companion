import { useNavigate } from 'react-router-dom';
import { MessageCircle, FileText, Calendar, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const actions = [
  {
    id: 'chat',
    icon: MessageCircle,
    title: 'Start Chat',
    subtitle: 'Talk with your therapist',
    path: '/chat',
    available: true,
  },
  {
    id: 'notes',
    icon: FileText,
    title: 'Session Notes',
    subtitle: 'Prepare for your next session',
    path: '/notes',
    available: true,
  },
  {
    id: 'schedule',
    icon: Calendar,
    title: 'Schedule',
    subtitle: 'Book an appointment',
    path: '/schedule',
    available: false,
    comingSoon: true,
  },
  {
    id: 'insights',
    icon: Lightbulb,
    title: 'Insights',
    subtitle: 'Patterns & resources',
    path: '/insights',
    available: true,
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => action.available && navigate(action.path)}
          disabled={!action.available}
          className={`card-elevated p-6 text-left transition-all duration-200 ${
            action.available 
              ? 'hover:shadow-medium hover:border-primary/30 cursor-pointer' 
              : 'opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <action.icon className="w-6 h-6 text-primary" />
            </div>
            {action.comingSoon && (
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            )}
            {action.available && !action.comingSoon && (
              <Badge className="bg-success/10 text-success text-xs border-0">
                Available
              </Badge>
            )}
          </div>
          <h3 className="font-semibold mb-1">{action.title}</h3>
          <p className="text-sm text-muted-foreground">{action.subtitle}</p>
        </button>
      ))}
    </div>
  );
}
