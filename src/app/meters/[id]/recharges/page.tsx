import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import RechargeHistory from "@/components/RechargeHistory";

export default async function RechargesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const meter = await db.meter.findFirst({
    where: { id: parseInt(id, 10), userId: session.userId },
  });
  if (!meter) notFound();

  return (
    <>
      <Navbar email={session.email} />
      <RechargeHistory
        meterId={meter.id}
        meterLabel={meter.nickname ?? meter.accountNo}
      />
    </>
  );
}
