import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { HeroSection } from '@/components/marketing/HeroSection';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection';
import { SafetySection } from '@/components/marketing/SafetySection';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';

const Index = () => {
  return (
    <div className="page-container">
      <MarketingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <SafetySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
