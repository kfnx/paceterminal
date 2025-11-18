# Ad Clicks Troubleshooting Guide

## Issue: Admin Page Showing Zero Clicks

### Problem
The `/admin/ad-clicks` page was showing zero clicks even though data existed in the database.

### Root Cause
**Next.js Route Caching** - The API route `/api/ads/clicks` was being cached by Next.js, returning stale/empty data.

### Solution
Added route segment config to force dynamic rendering:

```typescript
// app/api/ads/clicks/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

### What These Do
- `dynamic = 'force-dynamic'` - Forces the route to be rendered dynamically on every request
- `revalidate = 0` - Disables caching completely

### Testing
You can verify the API works by visiting:
```bash
curl http://localhost:3000/api/ads/clicks
```

Expected response:
```json
{
  "adsClicks": [
    {
      "id": 1,
      "target_url": "https://example.com",
      "position": "right",
      "click_count": 2,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "stats": {
    "totalClicks": 3,
    "leftClicks": 1,
    "rightClicks": 2,
    "uniqueAds": 2
  }
}
```

## Common Issues & Solutions

### Issue: Page still shows zero after fix

**Solutions:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache for localhost
3. Restart Next.js dev server
4. Check browser console for errors
5. Verify API endpoint returns data (use curl or browser DevTools Network tab)

### Issue: Data not updating in real-time

**Expected Behavior:**
- The page auto-refreshes every 1 minute (TanStack Query stale time)
- Manual refresh button updates immediately
- New clicks may take up to 1 minute to appear

**To see changes immediately:**
Click the "Refresh" button in the top-right of the page.

### Issue: API returns error

**Check:**
1. Supabase connection is working
2. `SUPABASE_SERVICE_ROLE_KEY` environment variable is set
3. `ads_clicks` table exists in database
4. RLS policies are configured correctly

**Test database connection:**
```typescript
// Use the test endpoint (if still exists)
curl http://localhost:3000/api/ads/clicks/test
```

### Issue: RLS (Row Level Security) blocking access

**Verify policies exist:**
```sql
-- In Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'ads_clicks';
```

**Should show:**
1. `Allow public read access to ads_clicks` - FOR SELECT
2. `Allow service role to manage ads_clicks` - FOR ALL

**If missing, re-run:**
```sql
-- See: supabase/create_ads_clicks_table.sql
```

## Performance Considerations

### Caching Strategy
- **API Route:** No caching (`dynamic = 'force-dynamic'`)
- **React Query:** 1 minute stale time, 5 minute garbage collection
- **Why:** Balance between real-time data and server load

### When to Adjust Caching

**More real-time (decrease stale time):**
```typescript
// hooks/use-ads-clicks.ts
staleTime: 30 * 1000, // 30 seconds instead of 1 minute
```

**Less server load (increase stale time):**
```typescript
staleTime: 5 * 60 * 1000, // 5 minutes
```

## Database Performance

### Check Query Performance
```sql
EXPLAIN ANALYZE
SELECT * FROM ads_clicks
ORDER BY click_count DESC;
```

### Add Missing Indexes
Already added:
- `idx_ads_clicks_position` on `position`
- `idx_ads_clicks_target_url` on `target_url`

### Monitor Table Size
```sql
SELECT 
  pg_size_pretty(pg_total_relation_size('ads_clicks')) as total_size,
  COUNT(*) as row_count
FROM ads_clicks;
```

## Browser DevTools Debugging

### Check API Response
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh the `/admin/ad-clicks` page
4. Look for `clicks` request
5. Verify response has data

### Check React Query Cache
1. Install React Query DevTools (already included)
2. Look for `['ads-clicks']` query
3. Verify data is populated
4. Check `dataUpdatedAt` timestamp

### Check Console Errors
Look for:
- Network errors (CORS, 404, 500)
- JavaScript errors
- Supabase connection errors

## Environment Variables

Required in `.env`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Verify they're loaded:
```bash
# In terminal
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

## Related Documentation

- [ad-tracking-implementation.md](./ad-tracking-implementation.md) - Full implementation guide
- [ad-clicks-admin-page.md](./ad-clicks-admin-page.md) - Admin page documentation
- [Next.js Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [TanStack Query Caching](https://tanstack.com/query/latest/docs/framework/react/guides/caching)

## Future Improvements

- [ ] Add loading skeleton for better UX
- [ ] Implement optimistic updates
- [ ] Add error retry logic
- [ ] Real-time updates with Supabase Realtime
- [ ] Performance monitoring with Sentry/LogRocket
