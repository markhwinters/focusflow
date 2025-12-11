import {
  Mail,
  BookOpen,
  MessageCircle,
  HelpCircle,
  Zap,
  Clock,
  Shield,
  Database,
} from "lucide-react";
import Link from "next/link";

// Simple reusable FAQ item component
const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <details className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 transition-colors duration-200 cursor-pointer">
    <summary className="font-semibold text-gray-900 dark:text-gray-100 flex justify-between items-center hover:text-indigo-600 dark:hover:text-indigo-400">
      {question}
    </summary>
    <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-3">
      {answer}
    </p>
  </details>
);

export default function SupportPage() {
  return (
    <div className="min-h-[calc(100vh-14rem)] bg-gray-50 dark:bg-gray-950 py-12 md:py-20 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            FocusFlow Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find quick answers or get in touch with our dedicated support team.
          </p>
        </header>

        {/* Quick Access Options */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
              Documentation
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Read in-depth guides on every feature.
            </p>
            <Link
              href="/docs"
              className="mt-3 inline-block text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
            >
              Go to Docs &rarr;
            </Link>
          </div>

          <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <MessageCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
              Live Chat
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get instant help during business hours.
            </p>
            <button
              disabled
              className="mt-3 inline-block text-gray-400 dark:text-gray-600 text-sm cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

          <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Mail className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
              Email Us
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Send us a detailed message.
            </p>
            <a
              href="mailto:support@focusflow.app"
              className="mt-3 inline-block text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
            >
              support@focusflow.app
            </a>
          </div>
        </section>

        {/* Getting Started Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Getting Started
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    Create Your Account
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sign up for FocusFlow and get lifetime access to all
                    features as an early-bird member. Simply click "Get
                    Early-Bird Access" and fill in your details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    Track Your First Day
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start logging your daily progress in just 20 seconds. Enter
                    your highlights, challenges, and improvements to build a
                    comprehensive record of your journey.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    Review Your Progress
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Use the dashboard to view trends and identify patterns in
                    your daily tracking. Set goals and monitor your achievements
                    over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <Clock className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                20-Second Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Quick and effortless daily logging. No complex forms or
                time-consuming entries required.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Smart Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Track patterns and trends in your daily progress with
                comprehensive analytics and visualizations.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Your data is encrypted and protected. Full data ownership with
                export capabilities anytime.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <Database className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Data Export
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Export your data anytime in standard formats. You own your data
                and can use it however you want.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="What is FocusFlow.ai?"
              answer="FocusFlow.ai is an intelligent daily progress tracker that helps you monitor your achievements, challenges, and improvements in just 20 seconds per day. Track your patterns and build better habits through consistent daily logging."
            />
            <FAQItem
              question="How does the early-bird access work?"
              answer="Early-bird members get lifetime access to all FocusFlow.ai features, including premium features. This is a limited-time offer for our initial users who join during the beta period. Sign up now to lock in your lifetime access."
            />
            <FAQItem
              question="How long does it take to track my day?"
              answer="Just 20 seconds! FocusFlow.ai is designed for speed and simplicity. You can quickly log your daily entries without sacrificing the quality of your tracking record."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Yes. We take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and never share your personal information with third parties. You maintain full ownership of your data and can export or delete it at any time."
            />
            <FAQItem
              question="Can I access FocusFlow on mobile devices?"
              answer="Yes! FocusFlow.ai is fully responsive and works seamlessly on desktop, tablet, and mobile devices. Track your progress wherever you are."
            />
            <FAQItem
              question="What kind of analytics does FocusFlow provide?"
              answer="FocusFlow analyzes your daily entries to identify patterns in your productivity, mood, challenges, and achievements. It highlights trends over time and helps you understand what's working and what needs improvement through clear visualizations and reports."
            />
            <FAQItem
              question="Can I export my data?"
              answer="Absolutely. You own your data and can export it at any time in standard formats (CSV, JSON). This ensures you're never locked in and can use your data however you see fit."
            />
            <FAQItem
              question="What happens after the beta period?"
              answer="Early-bird members retain lifetime access to all features, including any premium features we add in the future. Regular pricing will apply to new members after the beta period ends."
            />
            <FAQItem
              question="How do I start a Deep Work session?"
              answer="Navigate to the Dashboard, ensure you have a task selected, and click the 'Start Focus' button. The timer will begin, and the interface will minimize distractions."
            />
            <FAQItem
              question="Where can I find my performance analytics?"
              answer="All your metrics, including focus time trends and task completion rates, are available under the 'Analytics' tab within your main dashboard."
            />
          </div>
        </section>

        {/* Support Hours */}
        <section className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 rounded-xl p-8 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Support Hours
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our support team is available Monday through Friday, 9:00 AM -
                5:00 PM EST. We aim to respond to all inquiries within 24 hours
                during business days.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                For urgent issues outside business hours, please email us at{" "}
                <a
                  href="mailto:support@focusflow.app"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  support@focusflow.app
                </a>{" "}
                and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
