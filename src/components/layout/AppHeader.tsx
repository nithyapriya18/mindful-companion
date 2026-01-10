import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, LogOut, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';

export function AppHeader() {
  const { user, signOut } = useAuth(); // Changed from logout to signOut
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  // Helper function to get user's full name
  const getFullName = () => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  // Helper function to get initials
  const getInitials = () => {
    if (!user) return 'U';
    
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      const nameParts = fullName.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return fullName.substring(0, 2).toUpperCase();
    }
    
    // Fallback to email
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  const initials = getInitials();
  const fullName = getFullName();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" linkTo="/dashboard" />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <Button 
              variant="destructive" 
              size="sm" 
              className="btn-crisis flex items-center gap-2"
              onClick={() => navigate('/crisis')}
            >
              <AlertTriangle className="w-4 h-4" />
              SOS
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-3">
                  <span className="hidden md:block text-sm font-medium">
                    {fullName}
                  </span>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{fullName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}