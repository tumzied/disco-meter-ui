import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMonthlyConsumption } from "@/lib/desco";
import type { NextRequest } from "next/server";

type RawMonthlyEntry = {
  month: string;
  consumedTaka: number;
  consumedUnit: number;
  maximumDemand: number;
  APF: number;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const meter = await db.meter.findFirst({
    where: { id: parseInt(id, 10), userId: session.userId },
  });
  if (!meter) return Response.json({ error: "Not found" }, { status: 404 });

  const sp = request.nextUrl.searchParams;
  const from = sp.get("from") ?? monthsAgo(12);
  const to = sp.get("to") ?? currentMonth();

  const result = await getMonthlyConsumption(meter.accountNo, from, to);
  const raw = (result.data ?? []) as RawMonthlyEntry[];

  const data = raw.map((entry) => ({
    month: entry.month,
    kWh: parseFloat((entry.consumedUnit ?? 0).toFixed(2)),
    taka: parseFloat((entry.consumedTaka ?? 0).toFixed(2)),
    maxDemand: entry.maximumDemand ?? null,
    apf: entry.APF ?? null,
  }));

  return Response.json({ data });
}

function monthsAgo(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
