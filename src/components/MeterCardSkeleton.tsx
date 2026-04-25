export default function MeterCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-48 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-7 w-20 bg-gray-200 rounded" />
        </div>
        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-7 w-24 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
      <div className="h-4 w-20 bg-gray-100 rounded mt-auto" />
    </div>
  );
}
