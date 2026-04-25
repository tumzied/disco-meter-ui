"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function MeterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-4xl mb-4">⚡</p>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Failed to load meter data</h2>
      <p className="text-sm text-gray-500 mb-6">Could not fetch data from DESCO. Check your connection and try again.</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
