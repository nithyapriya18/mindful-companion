import { Logo } from '@/components/layout/Logo';
import { Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-16 bg-foreground text-background">
      <div className="section-container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <div className="text-2xl font-bold">
                <span className="text-primary">MyT</span>
                <span className="text-background">+</span>
              </div>
            </div>
            <p className="text-background/70 mb-6 max-w-md">
              Personalized AI therapy that adapts to your unique needs. 
              Available 24/7, designed with your privacy and safety in mind.
            </p>
            <div className="flex items-center gap-2 text-crisis">
              <Phone className="w-4 h-4" />
              <span className="font-semibold">Crisis Line: 988</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-background/70">
              <li><a href="#features" className="hover:text-background transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-background transition-colors">How It Works</a></li>
              <li><a href="#safety" className="hover:text-background transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © 2024 MyT+. All rights reserved.
          </p>
          <p className="text-background/50 text-sm">
            If you're in crisis, please call 988 or go to your nearest emergency room.
          </p>
        </div>
      </div>
    </footer>
  );
}
