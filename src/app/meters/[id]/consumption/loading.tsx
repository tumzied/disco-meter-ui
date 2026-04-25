export default function ConsumptionLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-100 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-100 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>

      <div className="h-8 w-40 bg-gray-200 rounded mb-6" />

      {/* Tab toggle skeleton */}
      <div className="h-9 w-40 bg-gray-100 rounded-xl mb-6" />

      {/* Date range bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex gap-4 items-end">
        <div className="space-y-1.5">
          <div className="h-3 w-8 bg-gray-200 rounded" />
          <div className="h-9 w-36 bg-gray-200 rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-6 bg-gray-200 rounded" />
          <div className="h-9 w-36 bg-gray-200 rounded-lg" />
        </div>
        <div className="ml-auto flex gap-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-9 w-12 bg-gray-100 rounded-lg" />)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-5 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
        <div className="h-[300px] flex items-end gap-1.5 px-2">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gray-100 rounded-t"
              style={{ height: `${25 + (i % 5) * 15}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
