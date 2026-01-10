import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

export function MarketingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" />
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
            <a href="#safety" className="text-muted-foreground hover:text-foreground transition-colors">
              Safety
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/signin">
              <Button variant="ghost" className="font-medium">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="btn-primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
