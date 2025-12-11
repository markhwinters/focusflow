import {
  Clock,
  Focus,
  Coffee,
  TrendingUp,
  PlayCircle,
  PauseCircle,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

const DocSection = ({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="mb-12 scroll-mt-20">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
    </div>
    <div className="space-y-4 text-gray-600 dark:text-gray-400">{children}</div>
  </section>
);

export default function DocsPage() {
  return (
    <div className="min-h-[calc(100vh-14rem)] bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            FocusFlow Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Learn how to make the most of FocusFlow's productivity features.
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-20 space-y-1 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Contents
              </p>
              <a
                href="#getting-started"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Getting Started
              </a>
              <a
                href="#dashboard"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Dashboard Overview
              </a>
              <a
                href="#focus-sessions"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Focus Sessions
              </a>
              <a
                href="#break-sessions"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Break Sessions
              </a>
              <a
                href="#analytics"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Analytics & Stats
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
              {/* Getting Started */}
              <DocSection
                id="getting-started"
                icon={PlayCircle}
                title="Getting Started"
              >
                <p>
                  Welcome to FocusFlow! This documentation will help you
                  understand and use all the features available in the
                  application.
                </p>
                <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mt-4">
                  <p className="text-sm text-indigo-900 dark:text-indigo-100">
                    <strong>First time here?</strong> Start by exploring your
                    dashboard and launching your first focus session.
                  </p>
                </div>
              </DocSection>

              {/* Dashboard Overview */}
              <DocSection
                id="dashboard"
                icon={BarChart3}
                title="Dashboard Overview"
              >
                <p>
                  The dashboard is your central hub for tracking productivity.
                  It provides a quick overview of your recent activity and
                  statistics.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Dashboard Statistics
                </h3>
                <p>
                  Your dashboard displays four key metrics for the current week:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>
                    <strong className="text-gray-900 dark:text-white">
                      Total Sessions:
                    </strong>{" "}
                    The number of focus and break sessions you've completed this
                    week
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">
                      Focus Time:
                    </strong>{" "}
                    Total time spent in focus sessions this week
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">
                      Break Time:
                    </strong>{" "}
                    Total time spent in break sessions this week
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">
                      Average Session:
                    </strong>{" "}
                    Your average session duration for the week
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Quick Start Panel
                </h3>
                <p>
                  Use the Quick Start panel to immediately begin a focus or
                  break session without navigating through menus.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Recent Sessions
                </h3>
                <p>
                  View your five most recent sessions, showing the session type
                  (Focus or Break) and duration. This helps you quickly review
                  your latest activity.
                </p>
              </DocSection>

              {/* Focus Sessions */}
              <DocSection
                id="focus-sessions"
                icon={Focus}
                title="Focus Sessions"
              >
                <p>
                  Focus sessions are dedicated time blocks for deep,
                  concentrated work. During a focus session, you can minimize
                  distractions and track your productive time.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Starting a Focus Session
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Navigate to the Dashboard</li>
                  <li>
                    Click the "Start Focus Session" button in the Quick Start
                    panel
                  </li>
                  <li>
                    Alternatively, go to{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                      /dashboard/focus
                    </code>
                  </li>
                  <li>Your focus timer will begin tracking your session</li>
                </ol>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  During a Focus Session
                </h3>
                <p>
                  While in a focus session, the interface helps you maintain
                  concentration by providing a clean, distraction-free
                  environment. Your session time is automatically tracked.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Ending a Focus Session
                </h3>
                <p>
                  When you're ready to end your focus session, use the controls
                  provided in the focus interface. Your session data will be
                  saved automatically and will appear in your dashboard
                  statistics and recent sessions list.
                </p>
              </DocSection>

              {/* Break Sessions */}
              <DocSection
                id="break-sessions"
                icon={Coffee}
                title="Break Sessions"
              >
                <p>
                  Break sessions help you maintain a healthy work-life balance
                  by tracking your rest periods. Taking regular breaks is
                  essential for sustained productivity.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Starting a Break Session
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>From the Dashboard, click the "Start Break" button</li>
                  <li>
                    Or navigate directly to{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                      /dashboard/break
                    </code>
                  </li>
                  <li>Your break timer will start tracking</li>
                </ol>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Break Session Tracking
                </h3>
                <p>
                  Just like focus sessions, your break time is automatically
                  recorded and contributes to your weekly statistics. This helps
                  you maintain awareness of your rest-to-work ratio.
                </p>
              </DocSection>

              {/* Analytics */}
              <DocSection
                id="analytics"
                icon={TrendingUp}
                title="Analytics & Stats"
              >
                <p>
                  FocusFlow provides comprehensive analytics to help you
                  understand your productivity patterns and improve your
                  workflow.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Weekly Statistics
                </h3>
                <p>
                  All statistics on your dashboard are calculated for the
                  current week, giving you a clear picture of your recent
                  productivity. The week resets automatically, allowing you to
                  track progress over time.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Session History
                </h3>
                <p>
                  Your recent sessions list shows your last five completed
                  sessions. Each entry displays:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Session type (Focus or Break)</li>
                  <li>Session duration in a human-readable format</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Accessing Full Analytics
                </h3>
                <p>
                  For more detailed analytics, navigate to the Analytics tab
                  from your main dashboard. Here you can view trends, patterns,
                  and detailed breakdowns of your productivity metrics.
                </p>
              </DocSection>

              {/* Help Section */}
              <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Need More Help?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you have questions that aren't covered in this
                  documentation, we're here to help.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/support"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Visit Support Center
                  </Link>
                  <a
                    href="mailto:support@focusflow.app"
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Email Support
                  </a>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
