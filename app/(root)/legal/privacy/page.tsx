import { ExternalLink } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto p-6 md:p-12">
      <h1 className="text-4xl font-bold mb-6 ">Privacy Policy</h1>
      <p className="mb-8">Last updated: December 6, 2025</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        1. Information We Collect
      </h2>
      <p className="mb-4">
        We collect both **Personal Data** (such as email address during
        registration) and **Non-Personal Data** (usage metrics, browser
        information) to operate and improve the FocusFlow service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc list-inside space-y-2">
        <li>To provide and maintain our Service.</li>
        <li>To notify you about changes to our Service.</li>
        <li>
          For analytics and performance monitoring (using Web Vitals, and later
          PostHog).
        </li>
        <li>To improve customer service.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Retention</h2>
      <p className="mb-4">
        We will retain your Personal Data only for as long as is necessary for
        the purposes set out in this Privacy Policy. We will also retain Usage
        Data for internal analysis purposes.
      </p>

      <p className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">
        **Note on GDPR:** If you are a resident of the European Economic Area
        (EEA), you have certain data protection rights. Please contact us to
        exercise these rights.
      </p>
    </div>
  );
}
