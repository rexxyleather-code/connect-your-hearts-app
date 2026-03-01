import { Heart, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-warm">
      <div className="container mx-auto px-6">
        <div className="relative max-w-3xl mx-auto text-center bg-gradient-primary rounded-3xl p-12 md:p-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-6 left-8 opacity-20">
            <Heart className="w-8 h-8 text-primary-foreground fill-primary-foreground animate-pulse-soft" />
          </div>
          <div className="absolute bottom-8 right-10 opacity-20">
            <Heart className="w-6 h-6 text-primary-foreground fill-primary-foreground animate-float" />
          </div>

          <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Your Love Story <br />
            <span className="italic">Starts Here</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-md mx-auto">
            Join millions who've found meaningful connections on Amor.
          </p>
          <button className="group bg-primary-foreground text-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary-foreground/90 transition-all inline-flex items-center gap-2">
            Create Free Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
