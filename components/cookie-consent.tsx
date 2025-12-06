"use client";

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

// Key for localStorage to check if user has accepted
const CONSENT_KEY = "focusflow_cookie_consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent !== "granted") {
      // Delay showing the banner slightly to ensure non-blocking load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    setShowBanner(false);
    // Future step: Initialize PostHog/Analytics here
    console.log("Cookie Consent: Granted. Analytics can now be initialized.");
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "denied");
    setShowBanner(false);
    // Future step: Ensure PostHog/Analytics remain disabled
    console.log("Cookie Consent: Denied. Analytics should remain disabled.");
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 text-white z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-3 md:mb-0">
          <Cookie className="w-6 h-6 mr-3 flex-shrink-0 text-yellow-400" />
          <p className="text-sm">
            We use cookies to improve performance and analytics. See our{" "}
            <Link
              href="/legal/privacy"
              className="underline font-medium hover:text-blue-400"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex space-x-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 border border-gray-600 rounded-md text-sm hover:bg-gray-700 transition"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
