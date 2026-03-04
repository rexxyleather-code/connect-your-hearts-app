import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Loader2, MapPin, ArrowLeft, Sparkles } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface MatchWithProfile {
  matchId: string;
  matchedAt: string;
  profile: Profile;
}

const Matches = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) fetchMatches();
  }, [user, authLoading, navigate]);

  // Subscribe to new matches in realtime
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("my-matches")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "matches" },
        () => { fetchMatches(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchMatches = async () => {
    if (!user) return;
    setLoading(true);

    // Get all matches where user is involved
    const { data: matchData, error } = await supabase
      .from("matches")
      .select("*")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error || !matchData) {
      setLoading(false);
      return;
    }

    // Get the other user's IDs
    const otherUserIds = matchData.map((m) =>
      m.user1_id === user.id ? m.user2_id : m.user1_id
    );

    if (otherUserIds.length === 0) {
      setMatches([]);
      setLoading(false);
      return;
    }

    // Fetch profiles of matched users
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", otherUserIds);

    const profileMap = new Map((profileData || []).map((p) => [p.user_id, p]));

    const result: MatchWithProfile[] = matchData
      .map((m) => {
        const otherId = m.user1_id === user.id ? m.user2_id : m.user1_id;
        const profile = profileMap.get(otherId);
        if (!profile) return null;
        return { matchId: m.id, matchedAt: m.created_at, profile };
      })
      .filter(Boolean) as MatchWithProfile[];

    setMatches(result);
    setLoading(false);
  };

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
        <button onClick={() => navigate("/discover")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Discover</span>
        </button>
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span className="font-heading text-xl font-bold text-foreground">Matches</span>
        </div>
        <div className="w-20" />
      </div>

      <div className="px-6 pb-12 max-w-lg mx-auto">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Sparkles className="w-16 h-16 text-primary/30 mb-4" />
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">No matches yet</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Keep swiping on the Discover page. When someone likes you back, they'll appear here!
            </p>
            <button
              onClick={() => navigate("/discover")}
              className="bg-gradient-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start Discovering
            </button>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {matches.map((match, i) => (
              <motion.div
                key={match.matchId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 bg-card rounded-2xl border border-border/50 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {match.profile.avatar_url ? (
                  <img
                    src={match.profile.avatar_url}
                    alt={match.profile.display_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-2xl font-heading font-bold text-muted-foreground/40">
                      {match.profile.display_name?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-heading text-lg font-bold text-foreground truncate">
                      {match.profile.display_name}
                    </h3>
                    {match.profile.date_of_birth && (
                      <span className="text-sm text-muted-foreground">
                        {new Date().getFullYear() - new Date(match.profile.date_of_birth).getFullYear()}
                      </span>
                    )}
                  </div>
                  {match.profile.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{match.profile.location}</span>
                    </div>
                  )}
                  {match.profile.interests?.length > 0 && (
                    <div className="flex gap-1 mt-1.5 overflow-hidden">
                      {match.profile.interests.slice(0, 3).map((interest) => (
                        <span key={interest} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground">
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Heart className="w-5 h-5 text-primary fill-primary shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
