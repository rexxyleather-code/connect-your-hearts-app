import { Heart, MessageCircle, Sparkles, Users } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Create Your Profile",
    description: "Share your story, passions, and what makes you unique.",
  },
  {
    icon: Sparkles,
    title: "Get Matched",
    description: "Our algorithm finds people who truly complement you.",
  },
  {
    icon: MessageCircle,
    title: "Start Talking",
    description: "Break the ice with prompts designed to spark real conversations.",
  },
  {
    icon: Heart,
    title: "Fall in Love",
    description: "Take it offline and let your story unfold naturally.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-warm">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            Four Steps to <span className="italic text-gradient">Love</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-xs font-bold text-primary/60 mb-2">0{i + 1}</div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
