'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration. Please contact the administrator.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication. Please try again.'
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}