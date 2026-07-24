'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from './GoogleAnalytics';
import { VercelAnalytics } from './VercelAnalytics';

const STORAGE_KEY = 'gtc-consent-v1';

interface ConsentPreferences {
  analytics: boolean;
  advertising: boolean;
}

const REJECTED: ConsentPreferences = {
  analytics: false,
  advertising: false
};

function updateGoogleConsent(preferences: ConsentPreferences) {
  if (typeof window === 'undefined') {
    return;
  }

  const consentState = preferences.advertising ? 'granted' : 'denied';
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  window.gtag('consent', 'update', {
    analytics_storage: preferences.analytics ? 'granted' : 'denied',
    ad_storage: consentState,
    ad_user_data: consentState,
    ad_personalization: consentState
  });
}

export function ConsentManager() {
  const [preferences, setPreferences] = useState<ConsentPreferences>(REJECTED);
  const [hasChoice, setHasChoice] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ConsentPreferences>;
        const nextPreferences = {
          analytics: parsed.analytics === true,
          advertising: parsed.advertising === true
        };
        setPreferences(nextPreferences);
        setHasChoice(true);
        updateGoogleConsent(nextPreferences);
      } else {
        updateGoogleConsent(REJECTED);
      }
    } catch {
      updateGoogleConsent(REJECTED);
    }

    const openSettings = () => setShowSettings(true);
    window.addEventListener('gtc:open-consent', openSettings);
    return () => window.removeEventListener('gtc:open-consent', openSettings);
  }, []);

  function save(nextPreferences: ConsentPreferences) {
    setPreferences(nextPreferences);
    setHasChoice(true);
    setShowSettings(false);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
    updateGoogleConsent(nextPreferences);
  }

  const controls = showSettings ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-settings-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/50 p-4 sm:items-center"
    >
      <div className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-2xl">
        <div>
          <h2 id="privacy-settings-title" className="text-xl font-semibold text-gray-900">
            Privacy choices
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Necessary browser storage keeps your choice. Calculator inputs are never included in analytics.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-4">
            <span>
              <span className="block font-medium text-gray-900">Analytics</span>
              <span className="mt-1 block text-sm text-gray-600">
                Allow Google Analytics and Vercel Analytics to measure aggregate site usage.
              </span>
            </span>
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(event) =>
                setPreferences((current) => ({ ...current, analytics: event.target.checked }))
              }
              className="mt-1 h-5 w-5"
            />
          </label>

          <label className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-4">
            <span>
              <span className="block font-medium text-gray-900">Advertising</span>
              <span className="mt-1 block text-sm text-gray-600">
                Permit advertising storage if advertising is enabled in the future. No ad script is currently loaded.
              </span>
            </span>
            <input
              type="checkbox"
              checked={preferences.advertising}
              onChange={(event) =>
                setPreferences((current) => ({ ...current, advertising: event.target.checked }))
              }
              className="mt-1 h-5 w-5"
            />
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          {hasChoice ? (
            <button
              type="button"
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700"
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() => save(preferences)}
          >
            Save choices
          </button>
        </div>
      </div>
    </div>
  ) : !hasChoice ? (
    <section
      aria-label="Privacy choices"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-700">
          We use optional analytics only with your permission. Calculator inputs stay out of analytics.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            onClick={() => setShowSettings(true)}
          >
            Manage choices
          </button>
          <button
            type="button"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            onClick={() => save(REJECTED)}
          >
            Reject non-essential
          </button>
          <button
            type="button"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() => save({ analytics: true, advertising: true })}
          >
            Accept all
          </button>
        </div>
      </div>
    </section>
  ) : null;

  return (
    <>
      {preferences.analytics && hasChoice ? (
        <>
          <GoogleAnalytics advertisingConsent={preferences.advertising} />
          <VercelAnalytics />
        </>
      ) : null}
      {controls}
    </>
  );
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
