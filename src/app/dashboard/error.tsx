"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <p className="text-4xl mb-4">⚡</p>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Failed to load dashboard</h2>
      <p className="text-sm text-gray-500 mb-6">Could not connect to the database or DESCO API.</p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
