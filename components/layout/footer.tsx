import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        {/* Copyright and Brand */}
        <div className="text-sm">
          &copy; {currentYear} FocusFlow. All rights reserved.
        </div>

        {/* Legal and Information Links */}
        <div className="flex space-x-4 mt-3 md:mt-0 text-sm">
          <Link
            href="/legal/privacy"
            className="hover:text-blue-400 transition duration-150"
          >
            Privacy Policy
          </Link>
          <Link
            href="/legal/terms"
            className="hover:text-blue-400 transition duration-150"
          >
            Terms of Service
          </Link>
          <Link
            href="/support"
            className="hover:text-blue-400 transition duration-150"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
