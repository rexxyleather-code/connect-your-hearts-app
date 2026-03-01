import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span className="font-heading text-2xl font-bold text-foreground">Amor</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-body text-sm">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#stories" className="text-muted-foreground hover:text-foreground transition-colors">Stories</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2">
            Sign In
          </button>
          <button className="text-sm font-medium bg-gradient-primary text-primary-foreground px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
