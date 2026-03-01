import heroBg from "@/assets/hero-bg.jpg";
import { Heart, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Romantic couple at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center pt-24">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8 animate-fade-up">
          <Heart className="w-4 h-4 fill-primary" />
          <span>Where real connections begin</span>
        </div>

        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Find Your <br />
          <span className="text-gradient italic">Perfect Match</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Amor connects hearts through meaningful conversations,
          shared passions, and genuine compatibility.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <button className="group bg-gradient-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/25">
            Start Matching
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="text-foreground px-8 py-4 rounded-full text-lg font-medium border border-border hover:bg-secondary transition-colors">
            Learn More
          </button>
        </div>

        <p className="text-sm text-muted-foreground mt-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          Join 2M+ people finding love every day
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
