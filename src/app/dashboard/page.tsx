import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import MeterCard from "@/components/MeterCard";
import MeterCardSkeleton from "@/components/MeterCardSkeleton";
import RefreshButton from "@/components/RefreshButton";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const meters = await db.meter.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <Navbar email={session.email} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Meters</h1>
          <div className="flex items-center gap-3">
            {meters.length > 0 && <RefreshButton />}
            <Link
              href="/meters/add"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add meter
            </Link>
          </div>
        </div>

        {meters.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">⚡</p>
            <p className="text-lg font-medium text-gray-600 mb-1">No meters yet</p>
            <p className="text-sm mb-6">Add your first DESCO prepaid meter to get started.</p>
            <Link
              href="/meters/add"
              className="inline-flex px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add meter
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {meters.map((meter) => (
              <Suspense key={meter.id} fallback={<MeterCardSkeleton />}>
                <MeterCard meter={meter} />
              </Suspense>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
