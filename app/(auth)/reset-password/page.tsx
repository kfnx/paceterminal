'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiMailLine,
} from '@remixicon/react';

import { ANALYTICS_CATEGORIES, ANALYTICS_EVENTS } from '@/lib/analytics-events';
import { cn } from '@/utils/cn';
import { useAnalytics } from '@/hooks/use-analytics';
import { useAuth } from '@/hooks/use-auth';
import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';

export default function ResetPasswordPage() {
  const { trackEvent } = useAnalytics();
  const { resetPassword, user } = useAuth();

  const [email, setEmail] = React.useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Track password reset attempt
    trackEvent(
      ANALYTICS_EVENTS.BUTTON_CLICK,
      ANALYTICS_CATEGORIES.AUTHENTICATION,
      'password_reset_request',
    );

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message);

        // Track password reset failure
        trackEvent(
          ANALYTICS_EVENTS.LOGIN_FAILURE,
          ANALYTICS_CATEGORIES.AUTHENTICATION,
          'password_reset_failed',
        );
      } else {
        setIsSuccess(true);

        // Track successful password reset request
        trackEvent(
          ANALYTICS_EVENTS.LOGIN_SUCCESS,
          ANALYTICS_CATEGORIES.AUTHENTICATION,
          'password_reset_sent',
        );
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    trackEvent(
      ANALYTICS_EVENTS.LINK_CLICK,
      ANALYTICS_CATEGORIES.USER_INTERACTION,
      'back_to_login',
    );
  };

  const handleBackToDashboard = () => {
    trackEvent(
      ANALYTICS_EVENTS.LINK_CLICK,
      ANALYTICS_CATEGORIES.USER_INTERACTION,
      'back_to_dashboard',
    );
  };

  if (isSuccess) {
    return (
      <div className='w-full max-w-[472px] px-4'>
        <div className='flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:p-8'>
          <div className='flex flex-col items-center gap-2'>
            {/* Success icon */}
            <div className='flex size-16 items-center justify-center rounded-full bg-success-lighter'>
              <RiCheckLine className='size-8 text-success-base' />
            </div>

            <div className='space-y-1 text-center'>
              <div className='text-title-h6 lg:text-title-h5'>
                Check your email
              </div>
              <div className='text-paragraph-sm text-text-sub-600 lg:text-paragraph-md'>
                We&apos;ve sent a password reset link to{' '}
                <strong>{email}</strong>
              </div>
            </div>
          </div>

          <Divider.Root />

          <div className='text-center'>
            <p className='mb-4 text-paragraph-sm text-text-sub-600'>
              Didn&apos;t receive the email? Check your spam folder or try
              again.
            </p>

            <LinkButton.Root variant='gray' size='medium' underline asChild>
              <Link
                href={user ? '/admin' : '/login'}
                onClick={user ? handleBackToDashboard : handleBackToLogin}
              >
                <RiArrowLeftLine className='size-4' />
                {user ? 'Back to dashboard' : 'Back to login'}
              </Link>
            </LinkButton.Root>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-[472px] px-4'>
      <form
        onSubmit={handleSubmit}
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
              <RiMailLine className='size-6 text-text-sub-600 lg:size-8' />
            </div>
          </div>

          <div className='space-y-1 text-center'>
            <div className='text-title-h6 lg:text-title-h5'>
              Reset your password
            </div>
            <div className='text-paragraph-sm text-text-sub-600 lg:text-paragraph-md'>
              {user
                ? 'Enter your email address and we&apos;ll send you a link to reset your password.'
                : 'Enter your email address and we&apos;ll send you a link to reset your password.'}
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
                placeholder='hello@alignui.com'
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isSubmitting}
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <FancyButton.Root
          variant='primary'
          size='medium'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </FancyButton.Root>

        <div className='text-center'>
          <LinkButton.Root variant='gray' size='medium' underline asChild>
            <Link
              href={user ? '/admin' : '/login'}
              onClick={user ? handleBackToDashboard : handleBackToLogin}
            >
              <RiArrowLeftLine className='size-4' />
              {user ? 'Back to dashboard' : 'Back to login'}
            </Link>
          </LinkButton.Root>
        </div>
      </form>
    </div>
  );
}
