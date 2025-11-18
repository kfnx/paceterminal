# Ad Clicks Admin Page

## Overview

A new admin page has been added at `/admin/ad-clicks` to view and analyze advertisement click performance data.

## Location

**URL:** `/admin/ad-clicks`

**File:** `app/admin/ad-clicks/page.tsx`

## Features

### 1. Statistics Dashboard

Four key metric cards at the top:

- **Total Clicks** - Aggregate count of all ad clicks
- **Left Ad Clicks** - Clicks on left sidebar ad with percentage
- **Right Ad Clicks** - Clicks on right sidebar ad with percentage  
- **Unique Ads** - Number of unique ad URLs being tracked

### 2. Data Table

Comprehensive table showing:

| Column | Description |
|--------|-------------|
| Position | Left or Right ad position (color-coded badge) |
| Target URL | The destination URL of the ad |
| Click Count | Total number of clicks for this ad |
| % of Total | Percentage of total clicks |
| Last Updated | Most recent click timestamp |
| Actions | Link to visit the target URL |

### 3. Features

- **Auto-refresh** - Data updates every minute (configurable)
- **Manual Refresh** - Refresh button to get latest data on demand
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Empty State** - Friendly message when no clicks exist yet
- **Color-coded Badges** - Left (blue), Right (green) for easy identification
- **Sorting** - Data sorted by click count (highest first)

## Navigation

The page is accessible from the admin sidebar:

- **Menu Item:** "Ad Click Analytics"
- **Icon:** Bar Chart (RiBarChartBoxLine)
- **Position:** Between "Manage Ads" and "Burn Screener"

## API Integration

### Endpoint

**GET** `/api/ads/clicks`

Returns:
```json
{
  "adsClicks": [
    {
      "id": 1,
      "target_url": "https://example.com",
      "position": "left",
      "click_count": 42,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-15T12:30:00Z"
    }
  ],
  "stats": {
    "totalClicks": 100,
    "leftClicks": 60,
    "rightClicks": 40,
    "uniqueAds": 2
  }
}
```

### Hook

**File:** `hooks/use-ads-clicks.ts`

```typescript
import { useAdsClicks } from '@/hooks/use-ads-clicks';

const { adsClicks, stats, loading, error, refetch } = useAdsClicks();
```

**Properties:**
- `adsClicks` - Array of click records
- `stats` - Aggregated statistics
- `loading` - Boolean loading state
- `error` - Error message if failed
- `refetch` - Function to manually refresh data

## User Experience

### Loading State
Shows a centered loading message while data is being fetched.

### Error State
Displays an error alert if data fetching fails.

### Empty State
When no ad clicks exist:
- Icon: Money Dollar Circle
- Message: "No ad clicks yet"
- Description: "Ad clicks will appear here once users interact with your ads"

### Data State
Full table with stats cards and sortable data.

## Color Scheme

- **Left Ad:** Blue (`color='blue'`)
- **Right Ad:** Green (`color='green'`)
- **Unique Ads:** Purple (`color='purple'`)
- **Total Clicks:** Primary brand color

## Responsive Breakpoints

- **Mobile:** Single column stats, scrollable table
- **Tablet (md):** 2 column stats grid
- **Desktop (lg):** 4 column stats grid, full table view

## Performance

- **Cache Duration:** 1 minute stale time
- **Garbage Collection:** 5 minutes
- **Query Key:** `['ads-clicks']`
- **Auto-refetch:** On window focus (TanStack Query default)

## Future Enhancements

Potential improvements:
- [ ] Date range filter (last 7 days, 30 days, custom)
- [ ] Export to CSV functionality
- [ ] Click trend charts (daily/weekly/monthly)
- [ ] Click-through rate (CTR) if impressions tracked
- [ ] Comparison view (current vs previous period)
- [ ] Real-time updates with WebSockets
- [ ] Delete individual click records
- [ ] Reset all statistics button
- [ ] Revenue attribution (if monetization data available)

## Access Control

The page inherits admin authentication from `/app/admin/layout.tsx`:
- Requires authenticated user with admin privileges
- Redirects to login if unauthenticated
- Server-side validation for security

## Related Files

**Core Files:**
- `app/admin/ad-clicks/page.tsx` - Main page component
- `hooks/use-ads-clicks.ts` - Data fetching hook
- `app/api/ads/clicks/route.ts` - API endpoint
- `app/admin/sidebar.tsx` - Navigation (updated)

**Database:**
- Table: `ads_clicks`
- Columns: `id`, `target_url`, `position`, `click_count`, `created_at`, `updated_at`

**Types:**
- `lib/database.types.ts` - TypeScript types for `ads_clicks` table

## Testing Checklist

- [ ] Page loads without errors
- [ ] Stats cards show correct totals
- [ ] Table displays all click records
- [ ] Percentages calculate correctly
- [ ] Refresh button updates data
- [ ] Empty state displays when no data
- [ ] Error state displays on API failure
- [ ] Links to target URLs work correctly
- [ ] Responsive design works on all screen sizes
- [ ] Data auto-refreshes every minute
- [ ] Navigation link appears in sidebar
- [ ] Badge colors match position (left=blue, right=green)

## Analytics Queries

### Most Clicked Ad
```sql
SELECT target_url, position, click_count
FROM ads_clicks
ORDER BY click_count DESC
LIMIT 1;
```

### Position Performance
```sql
SELECT 
  position,
  COUNT(*) as unique_ads,
  SUM(click_count) as total_clicks,
  AVG(click_count) as avg_clicks_per_ad
FROM ads_clicks
GROUP BY position;
```

### Recent Activity
```sql
SELECT *
FROM ads_clicks
WHERE updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;
```

## Screenshots Locations

Recommended screenshots to document:
1. Full page view with stats and table
2. Empty state
3. Mobile responsive view
4. Sidebar navigation with new menu item

## Troubleshooting

### Data not showing
1. Check database has `ads_clicks` table
2. Verify API endpoint returns 200: `/api/ads/clicks`
3. Check browser console for errors
4. Ensure user has admin access

### Incorrect statistics
1. Verify database query in API route
2. Check calculation logic in frontend
3. Ensure `click_count` is incrementing correctly

### Page not accessible
1. Confirm admin authentication is working
2. Check Next.js routing configuration
3. Verify no conflicting routes exist

## Maintenance

- **Data Growth:** Monitor `ads_clicks` table size
- **Performance:** Add database indexes if queries slow down
- **Archiving:** Consider archiving old click data periodically
- **Monitoring:** Set up alerts for unusual click patterns (fraud detection)

## Integration with Other Features

- **Manage Ads Page:** Link to view which ads are getting clicks
- **Google Analytics:** Cross-reference with GA4 `ad_click` events
- **Member Management:** Could track if members click ads differently
- **Revenue Tracking:** Could calculate CPM/CPC if pricing known

This page provides valuable insights into ad performance and helps make data-driven decisions about advertisement placement and pricing.
