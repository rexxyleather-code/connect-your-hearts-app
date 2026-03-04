
-- Likes table: records when a user likes or passes on another
CREATE TABLE public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  liked_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_like boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(liker_id, liked_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Users can insert their own likes
CREATE POLICY "Users can insert own likes"
  ON public.likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = liker_id);

-- Users can read their own likes
CREATE POLICY "Users can read own likes"
  ON public.likes FOR SELECT TO authenticated
  USING (auth.uid() = liker_id);

-- Matches table: created when two users mutually like each other
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Users can see their own matches
CREATE POLICY "Users can view own matches"
  ON public.matches FOR SELECT TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Security definer function to check for mutual like and create match
CREATE OR REPLACE FUNCTION public.handle_new_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  mutual_exists boolean;
  match_id uuid;
BEGIN
  -- Only process actual likes, not passes
  IF NEW.is_like = false THEN
    RETURN NEW;
  END IF;

  -- Check if the other person already liked this user
  SELECT EXISTS (
    SELECT 1 FROM public.likes
    WHERE liker_id = NEW.liked_id
      AND liked_id = NEW.liker_id
      AND is_like = true
  ) INTO mutual_exists;

  -- If mutual like, create a match
  IF mutual_exists THEN
    INSERT INTO public.matches (user1_id, user2_id)
    VALUES (
      LEAST(NEW.liker_id, NEW.liked_id),
      GREATEST(NEW.liker_id, NEW.liked_id)
    )
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to auto-create matches on mutual likes
CREATE TRIGGER on_new_like
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_like();

-- Enable realtime for matches so users get notified
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
