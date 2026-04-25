"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteMeterButton({ meterId }: { meterId: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/meters/${meterId}`, { method: "DELETE" });
    router.push("/dashboard");
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-sm px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Removing…" : "Confirm remove"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-red-500 hover:text-red-700 font-medium"
    >
      Remove meter
    </button>
  );
}
