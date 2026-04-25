import MeterCardSkeleton from "@/components/MeterCardSkeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <MeterCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
