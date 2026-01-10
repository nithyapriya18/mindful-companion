import { Shield, Lock, Phone, Eye } from 'lucide-react';

const safetyFeatures = [
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'We meet all healthcare privacy standards to protect your sensitive information.',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Your conversations are encrypted and only accessible to you.',
  },
  {
    icon: Phone,
    title: '24/7 Crisis Support',
    description: 'Immediate access to human crisis counselors when you need them most.',
  },
  {
    icon: Eye,
    title: 'Privacy Controls',
    description: 'You decide what\'s stored, shared, or deleted. Full control over your data.',
  },
];

export function SafetySection() {
  return (
    <section id="safety" className="py-24">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Your Safety is Our{' '}
              <span className="text-gradient">Priority</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              We understand that mental health support requires trust. That's why we've built 
              comprehensive safety measures into every aspect of MyT+.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {safetyFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-success/20 flex items-center justify-center">
                <Shield className="w-16 h-16 text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
