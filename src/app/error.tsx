'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          
          {/* Error message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified.
          </p>
          
          {/* Error details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-8 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto text-red-600 dark:text-red-400">
                {error.message}
              </pre>
            </details>
          )}
          
          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </button>
            
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Go home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}