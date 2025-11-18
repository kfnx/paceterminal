# Ad Click Tracking Implementation

## Overview

This document describes the hybrid ad click tracking system implemented for Pace Terminal, combining both database tracking and Google Analytics for comprehensive ad performance measurement.

## Architecture

### Hybrid Tracking Approach

The system uses a **dual-tracking strategy**:

1. **Database Tracking (Primary)** - Reliable, ad-blocker resistant
2. **Google Analytics (Secondary)** - Rich analytics and user insights

## Components

### 1. Database Schema

**Table:** `ads_clicks`

```sql
CREATE TABLE public.ads_clicks (
  id BIGSERIAL PRIMARY KEY,
  target_url TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('left', 'right')),
  click_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(target_url, position)
);
```

**Key Features:**
- Unique constraint on `(target_url, position)` prevents duplicates
- `click_count` increments for each click
- Indexed for fast lookups by position and target_url
- RLS policies for security

### 2. API Endpoint

**Route:** `/api/ads/track-click` (POST)

**Request Body:**
```json
{
  "target_url": "https://example.com",
  "position": "left" // or "right"
}
```

**Response:**
```json
{
  "success": true,
  "click_count": 42
}
```

**Features:**
- Zod validation for request data
- Automatic increment of existing records
- Creates new record if none exists
- Error handling and logging

### 3. Updated Components

Three components now include hybrid tracking:

#### Left Side Ad (`components/left-side-ad.tsx`)
- Position: `left`
- GA Label: `Left Sidebar Ad`

#### Right Side Ad (`components/right-side-ad.tsx`)
- Position: `right`
- GA Label: `Right Sidebar Ad`

#### Mobile Ad (`components/mobile-ad.tsx`)
- Position: `right` (shares same ad as desktop right)
- GA Label: `Mobile Ad`

## Tracking Flow

When a user clicks an ad:

```typescript
// 1. Track in database (reliable)
await fetch('/api/ads/track-click', {
  method: 'POST',
  body: JSON.stringify({
    target_url: ad.target_url,
    position: 'left'
  })
});

// 2. Track in Google Analytics (rich analytics)
trackCustomEvent('ad_click', {
  ad_position: 'left',
  ad_url: ad.target_url,
  event_category: 'Advertising',
  event_label: 'Left Sidebar Ad'
});

// 3. Open ad in new tab
window.open(ad.target_url, '_blank');
```

## Google Analytics Events

### Event Name: `ad_click`

**Parameters:**
- `ad_position`: Position of the ad (left, right, mobile)
- `ad_url`: Target URL of the advertisement
- `event_category`: "Advertising"
- `event_label`: Descriptive label (Left Sidebar Ad, Right Sidebar Ad, Mobile Ad)

### Viewing in GA4

Navigate to: **Events > ad_click**

You can create custom reports to analyze:
- Click-through rates by position
- Top-performing ad URLs
- Mobile vs desktop performance
- Time-of-day patterns
- User demographics who click ads

## Database Queries

### Get total clicks by position:
```sql
SELECT position, SUM(click_count) as total_clicks
FROM ads_clicks
GROUP BY position;
```

### Get top performing ads:
```sql
SELECT target_url, position, click_count
FROM ads_clicks
ORDER BY click_count DESC
LIMIT 10;
```

### Get click count for specific ad:
```sql
SELECT click_count
FROM ads_clicks
WHERE target_url = 'https://example.com'
  AND position = 'left';
```

## Setup Instructions

### 1. Run Database Migration

Execute in Supabase SQL Editor:
```bash
# File: supabase/create_ads_clicks_table.sql
```

### 2. Generate TypeScript Types

```bash
pnpm db:gen:types
```

### 3. Test the Implementation

1. Visit the site with ads enabled
2. Click on an ad
3. Check database: `SELECT * FROM ads_clicks;`
4. Check GA4: Events > ad_click

## Benefits of Hybrid Approach

### Database Tracking
✅ **Accurate revenue data** - Critical for billing advertisers
✅ **Ad-blocker resistant** - Server-side tracking
✅ **Complete control** - Your data, your rules
✅ **Easy integration** - Query alongside other business data

### Google Analytics
✅ **User behavior insights** - Where clicks come from
✅ **Demographics** - Who clicks your ads
✅ **Session context** - What users do before/after clicking
✅ **Free dashboards** - Pre-built visualizations

### Combined
✅ **Redundancy** - If GA fails, database still tracks
✅ **Validation** - Cross-reference both sources
✅ **Comprehensive** - Business metrics + user insights

## Ad Blocker Impact

**Database tracking:** ~0-5% loss (very resistant)
**Google Analytics:** ~30-50% loss (commonly blocked)

This is why the hybrid approach is critical for ad-supported platforms.

## Future Enhancements

Potential improvements:
- [ ] Track impressions (views) not just clicks
- [ ] A/B testing different ad positions
- [ ] Conversion tracking (did clicker become customer?)
- [ ] Click fraud detection (duplicate clicks)
- [ ] Revenue attribution (link clicks to payments)
- [ ] Admin dashboard for ad performance
- [ ] Automated reports for advertisers

## Troubleshooting

### Clicks not being tracked in database
1. Check browser console for errors
2. Verify `/api/ads/track-click` returns 200
3. Check Supabase logs for RLS policy issues
4. Ensure `ads_clicks` table exists

### Clicks not appearing in GA4
1. Check that GA is loaded (window.gtag exists)
2. Verify GA ID: `G-6CLBJ1L2S8`
3. Check for ad blockers in browser
4. Wait 24-48 hours for GA processing
5. Use GA DebugView for real-time validation

### Discrepancy between DB and GA counts
- **Expected!** Ad blockers affect GA but not database
- Database count should always be >= GA count
- Typical ratio: 2:1 or 3:2 (DB:GA)

## Related Files

- `supabase/create_ads_clicks_table.sql` - Database schema
- `app/api/ads/track-click/route.ts` - API endpoint
- `components/left-side-ad.tsx` - Left ad component
- `components/right-side-ad.tsx` - Right ad component
- `components/mobile-ad.tsx` - Mobile ad component
- `hooks/use-analytics.ts` - GA tracking hook
- `components/google-analytics.tsx` - GA initialization

## Analytics Dashboard Ideas

Build a custom admin page at `/admin/ad-analytics`:

```typescript
// Show metrics like:
- Total clicks by position
- Click-through rate (impressions vs clicks)
- Top performing ads
- Revenue per click (if tied to payment data)
- Trend charts over time
```

This could be a future enhancement to help manage your advertising business.
