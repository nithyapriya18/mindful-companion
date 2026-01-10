import { UserPlus, Users, Sliders, MessageCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up in seconds. Tell us a bit about yourself and what you\'re hoping to work on.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Choose Your Therapist',
    description: 'Browse our directory of AI therapists. Each has unique specializations and approaches.',
  },
  {
    number: '03',
    icon: Sliders,
    title: 'Customize Your Experience',
    description: 'Fine-tune how your therapist communicates—more nurturing or more direct, as you prefer.',
  },
  {
    number: '04',
    icon: MessageCircle,
    title: 'Start Your Journey',
    description: 'Begin meaningful conversations that help you understand yourself and grow.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Getting Started is <span className="text-gradient">Simple</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From sign-up to your first conversation in just a few minutes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex items-start gap-8 ${
                index !== steps.length - 1 ? 'pb-12 relative' : ''
              }`}
            >
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div className="absolute left-7 top-16 w-0.5 h-full bg-border" />
              )}

              {/* Step Number */}
              <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-medium">
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <step.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
