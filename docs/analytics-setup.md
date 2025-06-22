# Google Analytics Setup

This project has been configured with Google Analytics 4 (GA4) using the `@next/third-parties` package for optimal performance and SEO.

## Configuration

- **GA4 Property ID**: `G-6CLBJ1L2S8`
- **Package**: `@next/third-parties`
- **Implementation**: Server-side optimized with client-side tracking

## Components

### 1. GoogleAnalyticsWrapper (`components/google-analytics.tsx`)

The main Google Analytics component that initializes GA4 tracking.

### 2. AnalyticsPageTracker (`components/analytics-page-tracker.tsx`)

Automatically tracks page views when routes change in the Next.js app.

### 3. useAnalytics Hook (`hooks/use-analytics.ts`)

Custom hook providing functions to track custom events and page views.

### 4. Analytics Events (`lib/analytics-events.ts`)

Predefined constants for consistent event tracking across the application.

## Usage

### Basic Event Tracking

```typescript
import { useAnalytics } from '@/hooks/use-analytics';
import { ANALYTICS_EVENTS, ANALYTICS_CATEGORIES } from '@/lib/analytics-events';

function MyComponent() {
  const { trackEvent, trackCustomEvent } = useAnalytics();

  const handleButtonClick = () => {
    // Track a standard event
    trackEvent(
      ANALYTICS_EVENTS.BUTTON_CLICK,
      ANALYTICS_CATEGORIES.USER_INTERACTION,
      'my_button'
    );

    // Track a custom event with parameters
    trackCustomEvent('custom_action', {
      action_type: 'button_click',
      component: 'my_component',
      value: 100,
    });
  };

  return <button onClick={handleButtonClick}>Click me</button>;
}
```

### Page View Tracking

Page views are automatically tracked by the `AnalyticsPageTracker` component. For manual page view tracking:

```typescript
const { trackPageView } = useAnalytics();

// Track a specific page view
trackPageView('/custom-page');
```

### Form Tracking

```typescript
const handleFormSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  trackEvent(
    ANALYTICS_EVENTS.FORM_SUBMIT,
    ANALYTICS_CATEGORIES.USER_INTERACTION,
    'contact_form',
  );

  // Track form data (without sensitive information)
  trackCustomEvent('form_submitted', {
    form_type: 'contact',
    has_email: !!email,
    has_message: !!message,
  });
};
```

### Error Tracking

```typescript
try {
  // Your code here
} catch (error) {
  trackEvent(
    ANALYTICS_EVENTS.ERROR_OCCURRED,
    ANALYTICS_CATEGORIES.ERROR,
    error.message,
  );

  trackCustomEvent('api_error', {
    endpoint: '/api/users',
    error_code: error.status,
    error_message: error.message,
  });
}
```

## Available Events

### User Interactions

- `BUTTON_CLICK` - Button clicks
- `FORM_SUBMIT` - Form submissions
- `LINK_CLICK` - Link clicks
- `MODAL_OPEN` - Modal openings
- `MODAL_CLOSE` - Modal closings

### Authentication

- `LOGIN_ATTEMPT` - Login attempts
- `LOGIN_SUCCESS` - Successful logins
- `LOGIN_FAILURE` - Failed logins
- `REGISTER_ATTEMPT` - Registration attempts
- `REGISTER_SUCCESS` - Successful registrations
- `REGISTER_FAILURE` - Failed registrations
- `LOGOUT` - User logout

### Wallet Interactions

- `WALLET_CONNECT` - Wallet connections
- `WALLET_DISCONNECT` - Wallet disconnections
- `TRANSACTION_INITIATED` - Transaction starts
- `TRANSACTION_SUCCESS` - Successful transactions
- `TRANSACTION_FAILURE` - Failed transactions

### Feature Usage

- `FEATURE_ACCESS` - Feature access
- `WIDGET_INTERACTION` - Widget interactions
- `SEARCH_PERFORMED` - Search actions

### Error Tracking

- `ERROR_OCCURRED` - General errors
- `API_ERROR` - API errors

### Performance

- `PAGE_LOAD_TIME` - Page load times
- `COMPONENT_LOAD_TIME` - Component load times

## Categories

- `USER_INTERACTION` - General user interactions
- `AUTHENTICATION` - Authentication-related events
- `WALLET` - Wallet-related events
- `FEATURE` - Feature usage events
- `ERROR` - Error tracking
- `PERFORMANCE` - Performance metrics

## Best Practices

1. **Consistent Naming**: Use the predefined constants from `analytics-events.ts`
2. **Privacy First**: Never track sensitive information like passwords or personal data
3. **Meaningful Labels**: Use descriptive labels for better analytics insights
4. **Error Handling**: Always wrap analytics calls in try-catch blocks
5. **Performance**: Analytics calls should not block the main thread

## Testing

To test analytics in development:

1. Open browser developer tools
2. Go to the Network tab
3. Filter by "google-analytics" or "collect"
4. Perform actions on your site
5. Verify that analytics requests are being sent

## Production Verification

1. Check Google Analytics Real-Time reports
2. Verify events are appearing in GA4 dashboard
3. Monitor for any console errors related to analytics

## Troubleshooting

### Analytics not working

1. Check if `@next/third-parties` is installed
2. Verify GA4 property ID is correct
3. Check browser console for errors
4. Ensure components are properly imported in layout

### Events not appearing

1. Check network tab for failed requests
2. Verify event names and parameters
3. Check GA4 property settings
4. Ensure ad blockers are disabled for testing

## Privacy Compliance

This implementation respects user privacy by:

- Not tracking sensitive information
- Using GA4's privacy-friendly features
- Following GDPR and CCPA guidelines
- Providing opt-out mechanisms where required
