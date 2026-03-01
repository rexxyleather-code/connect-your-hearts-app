import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart, ArrowLeft, ArrowRight, Camera, X, Loader2 } from "lucide-react";

const INTEREST_OPTIONS = [
  "Travel", "Music", "Cooking", "Fitness", "Reading", "Photography",
  "Art", "Movies", "Gaming", "Hiking", "Dancing", "Yoga",
  "Coffee", "Wine", "Pets", "Sports", "Fashion", "Tech",
];

const GENDER_OPTIONS = ["Woman", "Man", "Non-binary"];

const CreateProfile = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [preferredGenders, setPreferredGenders] = useState<string[]>([]);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(45);
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 8
        ? [...prev, interest]
        : prev
    );
  };

  const togglePreferredGender = (g: string) => {
    setPreferredGenders((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let avatarUrl: string | null = null;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const filePath = `${user.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(filePath, photoFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("profile-photos")
          .getPublicUrl(filePath);
        avatarUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        display_name: displayName,
        bio,
        date_of_birth: dateOfBirth || null,
        gender,
        interests,
        preferred_genders: preferredGenders,
        min_age: minAge,
        max_age: maxAge,
        location,
        avatar_url: avatarUrl,
      });
      if (error) throw error;

      toast({ title: "Profile created!", description: "Welcome to Amor ❤️" });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const canAdvance = [
    () => displayName.trim().length > 0 && gender !== "",
    () => true, // photo + bio are optional
    () => interests.length >= 3,
    () => preferredGenders.length > 0,
  ];

  const steps = [
    // Step 0: Basics
    <div key="basics" className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Display Name *</label>
        <input
          type="text"
          maxLength={50}
          placeholder="What should we call you?"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">I am a *</label>
        <div className="flex gap-3">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                gender === g
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Location</label>
        <input
          type="text"
          maxLength={100}
          placeholder="City, Country"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>
    </div>,

    // Step 1: Photo & Bio
    <div key="photo-bio" className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Profile Photo</label>
        <div className="flex justify-center">
          {photoPreview ? (
            <div className="relative">
              <img src={photoPreview} alt="Preview" className="w-36 h-36 rounded-2xl object-cover border-2 border-primary/20" />
              <button
                onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="w-36 h-36 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <Camera className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Add photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
            </label>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
        <textarea
          maxLength={500}
          rows={4}
          placeholder="Tell people about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">{bio.length}/500</p>
      </div>
    </div>,

    // Step 2: Interests
    <div key="interests" className="space-y-4">
      <p className="text-sm text-muted-foreground">Pick at least 3 interests (max 8)</p>
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((interest) => (
          <button
            key={interest}
            type="button"
            onClick={() => toggleInterest(interest)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              interests.includes(interest)
                ? "bg-gradient-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {interest}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{interests.length}/8 selected</p>
    </div>,

    // Step 3: Preferences
    <div key="preferences" className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">I'm interested in *</label>
        <div className="flex gap-3">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => togglePreferredGender(g)}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                preferredGenders.includes(g)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Age Range: {minAge} – {maxAge}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={18}
            max={80}
            value={minAge}
            onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
            className="flex-1 accent-primary"
          />
          <input
            type="range"
            min={18}
            max={80}
            value={maxAge}
            onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
            className="flex-1 accent-primary"
          />
        </div>
      </div>
    </div>,
  ];

  const stepTitles = ["About You", "Your Photo & Bio", "Your Interests", "Your Preferences"];

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="w-7 h-7 text-primary fill-primary" />
          <span className="font-heading text-2xl font-bold text-foreground">Amor</span>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-lg shadow-primary/5">
          {/* Progress bar */}
          <div className="flex gap-2 mb-6">
            {stepTitles.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  i <= step ? "bg-gradient-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
            {stepTitles[step]}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Step {step + 1} of {stepTitles.length}
          </p>

          {steps[step]}

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance[step]()}
                className="bg-gradient-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canAdvance[step]()}
                className="bg-gradient-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Creating..." : "Complete Profile"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
