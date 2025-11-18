-- Create ads_clicks table to track ad click statistics
CREATE TABLE IF NOT EXISTS public.ads_clicks (
  id BIGSERIAL PRIMARY KEY,
  target_url TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('left', 'right')),
  click_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(target_url, position)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ads_clicks_position ON public.ads_clicks(position);
CREATE INDEX IF NOT EXISTS idx_ads_clicks_target_url ON public.ads_clicks(target_url);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.ads_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read click stats (for analytics)
CREATE POLICY "Allow public read access to ads_clicks"
  ON public.ads_clicks
  FOR SELECT
  USING (true);

-- Allow service role to insert/update (via API)
CREATE POLICY "Allow service role to manage ads_clicks"
  ON public.ads_clicks
  FOR ALL
  USING (true);

-- Add comment for documentation
COMMENT ON TABLE public.ads_clicks IS 'Tracks click statistics for advertisements by position and target URL';
COMMENT ON COLUMN public.ads_clicks.position IS 'Position of the ad: left or right';
COMMENT ON COLUMN public.ads_clicks.click_count IS 'Total number of clicks for this ad position and URL combination';
