import Link from "next/link";
import { Focus } from "lucide-react";
import { Button } from "../ui/button";
import { auth } from "@clerk/nextjs/server";

export default async function Header() {
  const { isAuthenticated } = await auth();
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand/Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-gray-50"
        >
          <Focus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>FocusFlow</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
