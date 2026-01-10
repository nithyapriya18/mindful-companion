import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your{' '}
            <span className="text-gradient">Healing Journey?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Take the first step toward better mental health. Your personalized therapist is waiting.
          </p>
          <Link to="/signup">
            <Button size="lg" className="btn-primary text-lg px-10 py-6 shadow-medium">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • Cancel anytime • 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
}
