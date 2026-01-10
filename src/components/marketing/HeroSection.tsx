import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Heart, Clock } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      
      <div className="section-container relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Heart className="w-4 h-4" />
            Personalized mental health support
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Your AI Therapist,{' '}
            <span className="text-gradient">Tailored to You</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Experience personalized therapeutic support that adapts to your unique needs, 
            available whenever you need it most.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/signup">
              <Button size="lg" className="btn-primary text-lg px-8 py-6 shadow-medium">
                Begin Your Journey
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                I have an account
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Available 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-crisis" />
              <span>Crisis Support</span>
            </div>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 relative">
          <div className="aspect-video max-w-5xl mx-auto rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border shadow-elevated overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-12 h-12 text-primary" />
                </div>
                <p className="text-muted-foreground">Platform Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
