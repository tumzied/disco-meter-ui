export default function MeterDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-100 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
            <div className="h-3 w-28 bg-gray-200 rounded" />
            <div className="h-10 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
