'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as LabelPrimitive from '@radix-ui/react-label';
import {
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLock2Line,
  RiMailLine,
  RiUserFill,
} from '@remixicon/react';

import {
  ANALYTICS_CATEGORIES,
  ANALYTICS_EVENTS,
  ANALYTICS_LABELS,
} from '@/lib/analytics-events';
import { cn } from '@/utils/cn';
import { useAnalytics } from '@/hooks/use-analytics';
import { useAuth } from '@/hooks/use-auth';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';

function PasswordInput(
  props: React.ComponentPropsWithoutRef<typeof Input.Input>,
) {
  const [showPassword, setShowPassword] = React.useState(false);
  const { trackEvent } = useAnalytics();

  const handleTogglePassword = () => {
    setShowPassword((s) => !s);
    trackEvent(
      ANALYTICS_EVENTS.BUTTON_CLICK,
      ANALYTICS_CATEGORIES.USER_INTERACTION,
      showPassword ? 'hide_password' : 'show_password',
    );
  };

  return (
    <Input.Root>
      <Input.Wrapper>
        <Input.Icon as={RiLock2Line} />
        <Input.Input
          type={showPassword ? 'text' : 'password'}
          placeholder='••••••••••'
          {...props}
        />
        <button type='button' onClick={handleTogglePassword}>
          {showPassword ? (
            <RiEyeOffLine className='size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300' />
          ) : (
            <RiEyeLine className='size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300' />
          )}
        </button>
      </Input.Wrapper>
    </Input.Root>
  );
}

export default function PageLogin() {
  const router = useRouter();
  const { trackEvent, trackCustomEvent } = useAnalytics();
  const { signIn, user, loading } = useAuth();

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    keepLoggedIn: false,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user && !loading) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Track login attempt
    trackEvent(
      ANALYTICS_EVENTS.LOGIN_ATTEMPT,
      ANALYTICS_CATEGORIES.AUTHENTICATION,
      ANALYTICS_LABELS.LOGIN_FORM,
    );

    // Track custom event with form data (without sensitive info)
    trackCustomEvent('login_form_submitted', {
      has_email: !!formData.email,
      has_password: !!formData.password,
      keep_logged_in: formData.keepLoggedIn,
    });

    try {
      const { error: signInError } = await signIn({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setError(signInError.message);

        // Track login failure
        trackEvent(
          ANALYTICS_EVENTS.LOGIN_FAILURE,
          ANALYTICS_CATEGORIES.AUTHENTICATION,
          signInError.message,
        );
      } else {
        // Track successful login
        trackEvent(
          ANALYTICS_EVENTS.LOGIN_SUCCESS,
          ANALYTICS_CATEGORIES.AUTHENTICATION,
          ANALYTICS_LABELS.LOGIN_FORM,
        );

        // Redirect to admin dashboard
        router.push('/admin');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordClick = () => {
    trackEvent(
      ANALYTICS_EVENTS.LINK_CLICK,
      ANALYTICS_CATEGORIES.USER_INTERACTION,
      'forgot_password_link',
    );
  };

  const handleKeepLoggedInChange = (checked: boolean) => {
    handleInputChange('keepLoggedIn', checked);
    trackEvent(
      ANALYTICS_EVENTS.BUTTON_CLICK,
      ANALYTICS_CATEGORIES.USER_INTERACTION,
      checked ? 'keep_logged_in_enabled' : 'keep_logged_in_disabled',
    );
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className='w-full max-w-[472px] px-4'>
        <div className='flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:p-8'>
          <div className='flex items-center justify-center py-8'>
            <div className='text-paragraph-md text-text-sub-600'>
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-[472px] px-4'>
      <form
        onSubmit={handleFormSubmit}
        className='flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:p-8'
      >
        <div className='flex flex-col items-center gap-2'>
          {/* icon */}
          <div
            className={cn(
              'relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-24',
              // bg
              'before:absolute before:inset-0 before:rounded-full',
              'before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10',
            )}
          >
            <div className='relative z-10 flex size-12 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 lg:size-16'>
              <RiUserFill className='size-6 text-text-sub-600 lg:size-8' />
            </div>
          </div>

          <div className='space-y-1 text-center'>
            <div className='text-title-h6 lg:text-title-h5'>
              Login to your account
            </div>
            <div className='text-paragraph-sm text-text-sub-600 lg:text-paragraph-md'>
              Enter your details to login.
            </div>
          </div>
        </div>

        <Divider.Root />

        {/* Error Message */}
        {error && (
          <div className='flex items-center gap-2 rounded-lg bg-error-lighter p-3 text-paragraph-sm text-error-base'>
            <RiErrorWarningLine className='size-4 shrink-0' />
            <span>{error}</span>
          </div>
        )}

        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='email'>
              Email Address <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiMailLine} />
                <Input.Input
                  id='email'
                  type='email'
                  placeholder='intern@paceterminal.com'
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isSubmitting}
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='password'>
              Password <Label.Asterisk />
            </Label.Root>
            <PasswordInput
              id='password'
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-start gap-2'>
            <Checkbox.Root
              id='agree'
              checked={formData.keepLoggedIn}
              onCheckedChange={handleKeepLoggedInChange}
              disabled={isSubmitting}
            />
            <LabelPrimitive.Root
              htmlFor='agree'
              className='block cursor-pointer text-paragraph-sm'
            >
              Keep me logged in
            </LabelPrimitive.Root>
          </div>
          <LinkButton.Root variant='gray' size='medium' underline asChild>
            <Link href='/reset-password' onClick={handleForgotPasswordClick}>
              Forgot password?
            </Link>
          </LinkButton.Root>
        </div>

        <FancyButton.Root
          variant='primary'
          size='medium'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </FancyButton.Root>
      </form>
    </div>
  );
}
