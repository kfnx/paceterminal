## Introduction

paceterminal use Next.js and alignui

## Getting Started

First, install dependencies:

```bash
pnpm i
```

Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Analytics

This project includes Umami analytics integration for privacy-focused website analytics. See [Analytics Setup Documentation](./docs/analytics-setup.md) for detailed configuration and usage instructions.

### Quick Setup

1. Add environment variables to `.env.local`:

```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
NEXT_PUBLIC_UMAMI_URL=https://your-umami-instance.com/script.js
```

2. Analytics are automatically enabled in production when configured.

## Pages

- [Home](http://localhost:3000)
- [Home (empty state widgets)](http://localhost:3000/home-empty-states)
- [My Cards](http://localhost:3000/my-cards)
- [Transactions](http://localhost:3000/transactions)
- [Send Money Flow](http://localhost:3000/send-money)
- [Login](http://localhost:3000/login)
- [Register](http://localhost:3000/register)
- [Reset Password](http://localhost:3000/reset-password)
- [Verification](http://localhost:3000/verification)
- [Profile Settings](http://localhost:3000/settings)
- [Company Settings](http://localhost:3000/settings/company-settings)
- [Notification Settings](http://localhost:3000/settings/notification-settings)
- [Team Settings](http://localhost:3000/settings/team-settings)
- [Privacy & Security](http://localhost:3000/settings/privacy-security)
- [Integrations](http://localhost:3000/settings/integrations)
- [Localization](http://localhost:3000/settings/localization)

## Requests for new components

If you have a request for a new component or a feature, please submit a feature request on our [Roadmap](https://alignui.com/roadmap).

## Support

If you require assistance, we're here to help! For development-related support, please feel free to open an issue on the template repository or contact us directly at [dogukan@alignui.com](mailto:dogukan@alignui.com). For general inquiries, you can reach us at [hi@alignui.com](mailto:hi@alignui.com).

Thank you for choosing AlignUI.
