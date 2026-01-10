import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, BookOpen } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
