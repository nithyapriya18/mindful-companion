import { Users, Sliders, Shield, MessageCircle, Brain, Clock } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Choose Your Therapist',
    description: 'Select from AI therapists with different specializations, approaches, and communication styles.',
  },
  {
    icon: Sliders,
    title: 'Customize Your Experience',
    description: 'Adjust warmth, directness, and response style to match your preferences.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your conversations are encrypted and never shared. Control what stays private.',
  },
  {
    icon: MessageCircle,
    title: 'Natural Conversations',
    description: 'Engage in meaningful dialogue that feels authentic and supportive.',
  },
  {
    icon: Brain,
    title: 'Evidence-Based Approaches',
    description: 'Grounded in CBT, mindfulness, and other proven therapeutic methods.',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: '24/7 access to support when you need it, without scheduling barriers.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-surface">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Therapy on <span className="text-gradient">Your Terms</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've reimagined what therapeutic support can be—accessible, personalized, and always there for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-elevated p-8 hover:shadow-medium transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
