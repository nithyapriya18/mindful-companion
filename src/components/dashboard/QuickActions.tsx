import { Card } from '@/components/ui/card'
import { MessageSquare, FileText, Calendar, Lightbulb } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      icon: MessageSquare,
      title: 'Start Chat',
      description: 'Talk with your therapist',
      status: 'Available',
      statusColor: 'text-green-600',
      onClick: () => navigate('/chat'),
    },
    {
      icon: FileText,
      title: 'Session Notes',
      description: 'Prepare for your next session',
      status: 'Available',
      statusColor: 'text-green-600',
      onClick: () => navigate('/notes'),
    },
    {
      icon: Calendar,
      title: 'Schedule',
      description: 'Book an appointment',
      status: 'Coming Soon',
      statusColor: 'text-blue-600',
      onClick: () => {},
    },
    {
      icon: Lightbulb,
      title: 'Insights',
      description: 'Patterns & resources',
      status: 'Available',
      statusColor: 'text-green-600',
      onClick: () => navigate('/insights'),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <Card
          key={action.title}
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors group relative overflow-hidden"
          onClick={action.onClick}
        >
          {/* Status Badge */}
          <div className={`absolute top-3 right-3 text-xs font-medium ${action.statusColor}`}>
            {action.status}
          </div>

          {/* Icon */}
          <div className="mb-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <action.icon className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Content */}
          <h3 className="font-semibold mb-1 text-foreground">{action.title}</h3>
          <p className="text-sm text-muted-foreground">{action.description}</p>
        </Card>
      ))}
    </div>
  )
}