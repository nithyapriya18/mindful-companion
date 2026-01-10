import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "I was skeptical about AI therapy, but the personalization is incredible. My therapist remembers our conversations and builds on them naturally.",
    author: "Sarah M.",
    role: "Marketing Manager",
    rating: 5,
  },
  {
    content: "Having support available at 3am when anxiety hits hardest has been life-changing. No scheduling, no waiting—just help when I need it.",
    author: "James L.",
    role: "Software Engineer",
    rating: 5,
  },
  {
    content: "The ability to customize how direct or gentle my therapist is made all the difference. It feels like they really understand how I process things.",
    author: "Maria K.",
    role: "Graduate Student",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-surface">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Stories of <span className="text-gradient">Growth</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from people who've found meaningful support through MyT+.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-elevated p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
