'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
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

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const { updatePassword, user, loading } = useAuth();

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Redirect if user is not authenticated or if not coming from password reset
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsSubmitting(false);
      return;
    }

    // Track password update attempt
    trackEvent(
      ANALYTICS_EVENTS.BUTTON_CLICK,
      ANALYTICS_CATEGORIES.AUTHENTICATION,
      'password_update_attempt',
    );

    try {
      const { error: updateError } = await updatePassword({ password });

      if (updateError) {
        setError(updateError.message);

        // Track password update failure
        trackEvent(
          ANALYTICS_EVENTS.LOGIN_FAILURE,
          ANALYTICS_CATEGORIES.AUTHENTICATION,
          'password_update_failed',
        );
      } else {
        setIsSuccess(true);

        // Track successful password update
        trackEvent(
          ANALYTICS_EVENTS.LOGIN_SUCCESS,
          ANALYTICS_CATEGORIES.AUTHENTICATION,
          'password_update_success',
        );
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password update error:', err);
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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className='w-full max-w-[472px] px-4'>
        <div className='flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:p-8'>
          <div className='flex flex-col items-center gap-2'>
            <div className='text-paragraph-sm text-text-sub-600'>
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Password updated successfully
              </div>
              <div className='text-paragraph-sm text-text-sub-600 lg:text-paragraph-md'>
                Your password has been updated. You can now sign in with your
                new password.
              </div>
            </div>
          </div>

          <Divider.Root />

          <div className='text-center'>
            <LinkButton.Root variant='gray' size='medium' underline asChild>
              <Link href='/login' onClick={handleBackToLogin}>
                <RiArrowLeftLine className='size-4' />
                Back to login
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
              <RiLockLine className='size-6 text-text-sub-600 lg:size-8' />
            </div>
          </div>

          <div className='space-y-1 text-center'>
            <div className='text-title-h6 lg:text-title-h5'>
              Update your password
            </div>
            <div className='text-paragraph-sm text-text-sub-600 lg:text-paragraph-md'>
              Enter your new password below. Make sure it&apos;s strong and
              secure.
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
          <Label.Root htmlFor='password'>
            New Password <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiLockLine} />
              <Input.Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your new password'
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isSubmitting}
              />
              <Input.Affix>
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='hover:text-text-base flex items-center justify-center p-1 text-text-sub-600'
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <RiEyeOffLine className='size-4' />
                  ) : (
                    <RiEyeLine className='size-4' />
                  )}
                </button>
              </Input.Affix>
            </Input.Wrapper>
          </Input.Root>
          <div className='text-paragraph-xs text-text-sub-600'>
            Password must be at least 8 characters with uppercase, lowercase,
            and number
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='confirmPassword'>
            Confirm New Password <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiLockLine} />
              <Input.Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm your new password'
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isSubmitting}
              />
              <Input.Affix>
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='hover:text-text-base flex items-center justify-center p-1 text-text-sub-600'
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <RiEyeOffLine className='size-4' />
                  ) : (
                    <RiEyeLine className='size-4' />
                  )}
                </button>
              </Input.Affix>
            </Input.Wrapper>
          </Input.Root>
        </div>

        <FancyButton.Root
          variant='primary'
          size='medium'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update password'}
        </FancyButton.Root>

        <div className='text-center'>
          <LinkButton.Root variant='gray' size='medium' underline asChild>
            <Link href='/login' onClick={handleBackToLogin}>
              <RiArrowLeftLine className='size-4' />
              Back to login
            </Link>
          </LinkButton.Root>
        </div>
      </form>
    </div>
  );
}
