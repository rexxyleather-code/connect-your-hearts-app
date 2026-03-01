import { Quote } from "lucide-react";
import couple1 from "@/assets/couple-1.jpg";
import couple2 from "@/assets/couple-2.jpg";
import couple3 from "@/assets/couple-3.jpg";

const stories = [
  {
    image: couple1,
    names: "Aisha & Marcus",
    location: "New York, USA",
    quote: "We matched on a rainy Tuesday and talked for 6 hours straight. Three years later, we're engaged. Amor didn't just find me a partner — it found me my person.",
  },
  {
    image: couple2,
    names: "Sophie & Daniel",
    location: "London, UK",
    quote: "I was skeptical about online dating, but Amor's conversation prompts made it so natural. Our first date felt like catching up with an old friend.",
  },
  {
    image: couple3,
    names: "Camila & Alejandro",
    location: "Barcelona, Spain",
    quote: "We lived 10 minutes apart for years and never crossed paths. Amor brought us together, and now we can't imagine life without each other.",
  },
];

const SuccessStories = () => {
  return (
    <section id="stories" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">Success Stories</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            Real People, <span className="italic text-gradient">Real Love</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stories.map((story) => (
            <div
              key={story.names}
              className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={story.image}
                  alt={story.names}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <Quote className="w-6 h-6 text-primary/30 mb-3" />
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  "{story.quote}"
                </p>
                <div>
                  <p className="font-heading font-semibold text-foreground">{story.names}</p>
                  <p className="text-xs text-muted-foreground">{story.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
