'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { trackEvent } from '@/components/analytics';

export function AnalyticsExample() {
  const {
    trackPageView,
    trackButtonClick,
    trackFormSubmission,
    trackError,
    isLoaded
  } = useAnalytics();

  useEffect(() => {
    // Track page view when component mounts
    trackPageView('analytics-example-page');
  }, [trackPageView]);

  const handleDemoButtonClick = () => {
    trackButtonClick('demo_button', {
      location: 'example_page',
      button_type: 'primary'
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      trackFormSubmission('demo_form', true, {
        form_type: 'contact',
        fields_count: 3
      });

      alert('Form submitted successfully!');
    } catch (error) {
      trackFormSubmission('demo_form', false, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      trackError('form_submission_error', 'Failed to submit form', {
        form_name: 'demo_form'
      });
    }
  };

  const handleCustomEvent = () => {
    trackEvent('custom_user_action', {
      action: 'demo_interaction',
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    });
  };

  return (
    <div className="shadow-md mx-auto max-w-md rounded-lg bg-white p-6">
      <h2 className="text-xl mb-4 font-semibold">Analytics Demo</h2>

      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          Analytics Status: {isLoaded() ? '✅ Loaded' : '❌ Not Loaded'}
        </div>

        <button
          onClick={handleDemoButtonClick}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Track Button Click
        </button>

        <form onSubmit={handleFormSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            className="border-gray-300 w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Your email"
            className="border-gray-300 w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          >
            Submit Form
          </button>
        </form>

        <button
          onClick={handleCustomEvent}
          className="w-full rounded bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
        >
          Track Custom Event
        </button>
      </div>

      <div className="bg-gray-50 text-sm mt-6 rounded p-3">
        <p className="mb-2 font-medium">Events being tracked:</p>
        <ul className="text-gray-600 list-inside list-disc space-y-1">
          <li>Page view on component mount</li>
          <li>Button clicks with metadata</li>
          <li>Form submissions (success/error)</li>
          <li>Custom events with detailed data</li>
        </ul>
      </div>
    </div>
  );
} 