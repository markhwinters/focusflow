import { Shield } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto p-6 md:p-12">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-8">Effective Date: December 6, 2025</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        1. Agreement to Terms
      </h2>
      <p className="mb-4">
        By accessing or using our Service, you agree to be bound by these Terms.
        If you disagree with any part of the terms, then you may not access the
        Service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
      <p className="mb-4">
        You must be at least 18 years of age to use the Service. You are
        responsible for maintaining the confidentiality of your account and
        password and for restricting access to your computer.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Termination</h2>
      <p className="mb-4">
        We may terminate or suspend your account immediately, without prior
        notice or liability, for any reason whatsoever, including without
        limitation if you breach the Terms.
      </p>

      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 flex items-center">
        <Shield className="w-6 h-6 mr-3 flex-shrink-0" />
        <p className="text-sm">
          Please read these Terms carefully before using the FocusFlow service.
        </p>
      </div>
    </div>
  );
}
