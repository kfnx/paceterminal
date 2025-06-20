# Umami Analytics Setup

This project includes Umami analytics integration for privacy-focused website analytics.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://paceterminal.com

# Umami Analytics Configuration
# Get these values from your Umami dashboard
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
NEXT_PUBLIC_UMAMI_URL=https://your-umami-instance.com/script.js

# Optional Umami Settings
NEXT_PUBLIC_UMAMI_AUTO_TRACK=true
NEXT_PUBLIC_UMAMI_DO_NOT_TRACK=false
```

## Configuration

The analytics are automatically enabled in production when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set. In development, analytics are disabled by default.

## Usage

### Basic Event Tracking

```tsx
import { useAnalytics } from '@/hooks/use-analytics';

function MyComponent() {
  const { track, trackButtonClick, trackPageView } = useAnalytics();

  const handleButtonClick = () => {
    trackButtonClick('signup_button', { location: 'header' });
  };

  useEffect(() => {
    trackPageView();
  }, []);

  return <button onClick={handleButtonClick}>Sign Up</button>;
}
```

### Custom Events

```tsx
import { trackEvent } from '@/components/analytics';

// Track custom events
trackEvent('user_action', {
  action: 'wallet_connected',
  wallet_type: 'phantom',
});
```

### Form Tracking

```tsx
import { useAnalytics } from '@/hooks/use-analytics';

function ContactForm() {
  const { trackFormSubmission } = useAnalytics();

  const handleSubmit = async (data: FormData) => {
    try {
      await submitForm(data);
      trackFormSubmission('contact_form', true, {
        form_type: 'contact',
        user_type: 'new',
      });
    } catch (error) {
      trackFormSubmission('contact_form', false, {
        error: error.message,
      });
    }
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

## Privacy Features

- Respects `Do Not Track` browser settings
- No cookies used by default
- GDPR compliant
- Privacy-focused analytics

## Available Hooks and Functions

### `useAnalytics()` Hook

Returns an object with the following methods:

- `track(eventName, eventData)` - Track custom events
- `trackPageView(pageName?)` - Track page views
- `trackButtonClick(buttonName, additionalData?)` - Track button clicks
- `trackFormSubmission(formName, success, additionalData?)` - Track form submissions
- `trackError(errorType, errorMessage, additionalData?)` - Track errors
- `isLoaded` - Check if Umami is loaded

### Direct Functions

- `trackEvent(eventName, eventData)` - Direct event tracking
- `isUmamiLoaded()` - Check if Umami is loaded

## Troubleshooting

1. **Analytics not working**: Check that `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set correctly
2. **Events not showing**: Ensure you're in production mode or have enabled analytics in development
3. **Script loading issues**: Verify the `NEXT_PUBLIC_UMAMI_URL` is correct and accessible

## Development

In development mode, analytics are disabled by default. To enable them for testing, set:

```bash
NODE_ENV=production
```

Or modify the `config.analytics.umami.enabled` condition in `lib/config.ts`.
