import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Heart, X, MapPin, Loader2, Sparkles, RefreshCw } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const SWIPE_THRESHOLD = 120;

const ProfileCard = ({
  profile,
  onSwipe,
  isTop,
}: {
  profile: Profile;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      animate(x, 500, { duration: 0.3 });
      setTimeout(() => onSwipe("right"), 300);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      animate(x, -500, { duration: 0.3 });
      setTimeout(() => onSwipe("left"), 300);
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  const handleButtonSwipe = (direction: "left" | "right") => {
    const target = direction === "right" ? 500 : -500;
    animate(x, target, { duration: 0.35 });
    setTimeout(() => onSwipe(direction), 350);
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 rounded-3xl bg-card border border-border/50 overflow-hidden shadow-lg scale-[0.96] translate-y-2 opacity-70">
        <div className="absolute inset-0 bg-muted" />
      </div>
    );
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-card border border-border/50 shadow-xl">
        {/* Photo */}
        <div className="relative h-[60%] bg-muted">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <span className="text-6xl font-heading font-bold text-muted-foreground/30">
                {profile.display_name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}

          {/* Like / Nope overlays */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 border-4 border-primary rounded-xl px-4 py-2 rotate-[-15deg]"
          >
            <span className="text-primary font-bold text-2xl tracking-wider">LIKE</span>
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 border-4 border-destructive rounded-xl px-4 py-2 rotate-[15deg]"
          >
            <span className="text-destructive font-bold text-2xl tracking-wider">NOPE</span>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent" />
        </div>

        {/* Info */}
        <div className="p-6 h-[40%] flex flex-col">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {profile.display_name}
            </h2>
            {profile.date_of_birth && (
              <span className="text-lg text-muted-foreground">
                {new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()}
              </span>
            )}
          </div>

          {profile.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-sm text-foreground/80 line-clamp-2 mb-3">{profile.bio}</p>
          )}

          {profile.interests?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto overflow-hidden max-h-16">
              {profile.interests.slice(0, 5).map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  {interest}
                </span>
              ))}
              {profile.interests.length > 5 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                  +{profile.interests.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute -bottom-20 left-0 right-0 flex items-center justify-center gap-6">
        <button
          onClick={() => handleButtonSwipe("left")}
          className="w-16 h-16 rounded-full border-2 border-destructive/30 bg-card flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
        >
          <X className="w-7 h-7 text-destructive" />
        </button>
        <button
          onClick={() => handleButtonSwipe("right")}
          className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform active:scale-95"
        >
          <Heart className="w-9 h-9 text-primary-foreground" />
        </button>
      </div>
    </motion.div>
  );
};

const Discover = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .neq("user_id", user.id)
      .limit(50);

    if (!error && data) {
      // Shuffle
      const shuffled = data.sort(() => Math.random() - 0.5);
      setProfiles(shuffled);
      setCurrentIndex(0);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) fetchProfiles();
  }, [user, authLoading, navigate, fetchProfiles]);

  const handleSwipe = (direction: "left" | "right") => {
    // For now just advance; matching logic can be added later
    setCurrentIndex((prev) => prev + 1);
  };

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];
  const allSwiped = currentIndex >= profiles.length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span className="font-heading text-xl font-bold text-foreground">Discover</span>
        </button>
        <button
          onClick={() => navigate("/create-profile")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          My Profile
        </button>
      </div>

      {/* Card stack */}
      <div className="flex items-center justify-center px-6 pt-4 pb-32">
        <div className="relative w-full max-w-sm" style={{ height: "520px" }}>
          {allSwiped ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <Sparkles className="w-16 h-16 text-primary/40 mb-4" />
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                That's everyone!
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                You've seen all available profiles. Check back later for new people.
              </p>
              <button
                onClick={fetchProfiles}
                className="bg-gradient-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </motion.div>
          ) : profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="w-16 h-16 text-primary/40 mb-4" />
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                No profiles yet
              </h3>
              <p className="text-muted-foreground text-sm">
                Be the first to create a profile!
              </p>
            </div>
          ) : (
            <>
              {nextProfile && (
                <ProfileCard
                  key={nextProfile.id}
                  profile={nextProfile}
                  onSwipe={() => {}}
                  isTop={false}
                />
              )}
              {currentProfile && (
                <ProfileCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  onSwipe={handleSwipe}
                  isTop={true}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
