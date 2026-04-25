export default function RechargesLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-100 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-100 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>

      <div className="h-8 w-44 bg-gray-200 rounded mb-6" />

      {/* Date range bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex gap-4 items-end flex-wrap">
        <div className="space-y-1.5">
          <div className="h-3 w-8 bg-gray-200 rounded" />
          <div className="h-9 w-36 bg-gray-200 rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-6 bg-gray-200 rounded" />
          <div className="h-9 w-36 bg-gray-200 rounded-lg" />
        </div>
        <div className="ml-auto flex gap-2">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-9 w-12 bg-gray-100 rounded-lg" />)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-5 w-28 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-6">
          {[30, 70, 140, 60, 55, 55, 55, 55, 65].map((w, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b border-gray-50 px-4 py-3.5 flex gap-6 items-center">
            {[30, 60, 140, 50, 55, 55, 55, 55, 60].map((w, j) => (
              <div key={j} className="h-3 bg-gray-100 rounded" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
