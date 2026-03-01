import { Shield, Zap, Globe, Lock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Smart Matching",
    description: "AI-powered compatibility scoring that goes beyond surface-level attraction to find deep, lasting connections.",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Every profile is photo-verified so you always know who you're talking to. No catfishing, ever.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Connect with people across 150+ countries. Love knows no borders.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is encrypted and never shared. You control who sees your profile.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">Features</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            Built for <span className="italic text-gradient">Real Love</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
