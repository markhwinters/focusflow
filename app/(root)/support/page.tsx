import { Mail, BookOpen, MessageCircle } from "lucide-react";
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
    // Uses the high-contrast background from the previous dashboard update
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

        {/* --- 1. Quick Access Options --- */}
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

        {/* --- 2. Frequently Asked Questions --- */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="How do I start a Deep Work session?"
              answer="Navigate to the Dashboard, ensure you have a task selected, and click the 'Start Focus' button. The timer will begin, and the interface will minimize distractions."
            />
            <FAQItem
              question="Where can I find my performance analytics?"
              answer="All your metrics, including focus time trends and task completion rates, are available under the 'Analytics' tab within your main dashboard."
            />
            <FAQItem
              question="What is the difference between free and premium accounts?"
              answer="The free account offers basic timers and task management. Premium unlocks unlimited deep work sessions, custom timer lengths, and advanced integrations (e.g., calendar sync)."
            />
          </div>
        </section>
      </div>
    </div>
  );
}
