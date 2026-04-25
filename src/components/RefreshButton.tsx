"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
      setLastRefreshed(new Date().toLocaleTimeString());
    });
  }

  return (
    <div className="flex items-center gap-3">
      {lastRefreshed && (
        <span className="text-xs text-gray-400 hidden sm:block">
          Refreshed {lastRefreshed}
        </span>
      )}
      <button
        onClick={handleRefresh}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <svg
          className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {isPending ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}
