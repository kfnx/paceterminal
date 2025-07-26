# Translation Guide

This guide explains how to use the internationalization system in the Pace Terminal application.

## Overview

The application supports English (en) and Indonesian (id) languages with:
- Route-based locale detection (`/` for English, `/id/` for Indonesian)
- Comprehensive translation files
- React Context for easy translation access
- Automatic locale switching

## Translation Files

Translation files are located in `/locales/[locale]/common.json`:

- `/locales/en/common.json` - English translations
- `/locales/id/common.json` - Indonesian translations

### Translation Structure

```json
{
  "navigation": {
    "home": "Home",
    "tokens": "Tokens"
  },
  "actions": {
    "login": "Login",
    "save": "Save"
  },
  "common": {
    "loading": "Loading...",
    "error": "Error"
  }
}
```

## Using Translations in Components

### 1. Import the Hook

```tsx
import { useTranslation } from '@/contexts/translation-context';
```

### 2. Use in Component

```tsx
export function MyComponent() {
  const { t, locale, isLoading } = useTranslation();

  return (
    <div>
      <h1>{t('navigation.home')}</h1>
      <button>{t('actions.save')}</button>
      <p>Current language: {locale}</p>
    </div>
  );
}
```

### 3. Available Properties

- `t(key)` - Translation function
- `locale` - Current locale ('en' or 'id')
- `isLoading` - Whether translations are loading

## Translation Keys

Use dot notation to access nested translations:

```tsx
t('navigation.home')     // "Home" or "Beranda"
t('actions.login')       // "Login" or "Masuk"
t('common.loading')      // "Loading..." or "Memuat..."
t('wallet.connect')      // "Connect Wallet" or "Hubungkan Dompet"
```

## Adding New Translations

1. Add the key to both `/locales/en/common.json` and `/locales/id/common.json`
2. Use the same structure in both files
3. Access via the `t()` function

Example:
```json
// English
{
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel"
  }
}

// Indonesian  
{
  "buttons": {
    "submit": "Kirim",
    "cancel": "Batal"
  }
}
```

Usage:
```tsx
<button>{t('buttons.submit')}</button>
<button>{t('buttons.cancel')}</button>
```

## Route Structure

- English routes: `/`, `/admin`, `/solana/[address]`
- Indonesian routes: `/id/`, `/id/admin`, `/id/solana/[address]`

## Language Switching

The `LanguageSelect` component automatically handles language switching:

```tsx
import { LanguageSelect } from '@/components/language-select';

<LanguageSelect className="..." />
```

## Dynamic Content

For content that comes from database or API:
- Store translations in your database
- Use locale parameter to fetch appropriate content
- Fallback to English if translation missing

## Best Practices

1. Always add translations to both language files
2. Use descriptive, hierarchical keys
3. Keep translations consistent across the app
4. Test both languages during development
5. Use loading states while translations load
6. Provide fallbacks for missing translations

## Examples

### Simple Button
```tsx
function SaveButton() {
  const { t } = useTranslation();
  return <button>{t('actions.save')}</button>;
}
```

### Complex Component
```tsx
function TokenCard({ token }) {
  const { t, locale } = useTranslation();
  
  return (
    <div>
      <h3>{t('token.name')}: {token.name}</h3>
      <p>{t('token.price')}: ${token.price}</p>
      <button>{t('actions.viewDetails')}</button>
      {locale === 'id' && <p>Harga dalam Rupiah: {token.priceIDR}</p>}
    </div>
  );
}
```

### Form with Validation
```tsx
function LoginForm() {
  const { t } = useTranslation();
  
  return (
    <form>
      <label>{t('auth.email')}</label>
      <input placeholder={t('auth.enterEmail')} />
      
      <label>{t('auth.password')}</label>
      <input placeholder={t('auth.enterPassword')} />
      
      <button>{t('auth.signIn')}</button>
    </form>
  );
}
```