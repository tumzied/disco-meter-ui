import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDailyConsumption } from "@/lib/desco";
import type { NextRequest } from "next/server";

type RawDailyEntry = {
  date: string;
  consumedTaka: number;
  consumedUnit: number;
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
  const from = sp.get("from") ?? formatDate(daysAgo(30));
  const to = sp.get("to") ?? formatDate(new Date());

  const result = await getDailyConsumption(meter.accountNo, from, to);
  const raw = (result.data ?? []) as RawDailyEntry[];

  // consumedUnit is a cumulative meter reading — compute daily deltas
  const data = raw.map((entry, i) => {
    const prevUnit = i === 0 ? entry.consumedUnit : raw[i - 1].consumedUnit;
    const prevTaka = i === 0 ? entry.consumedTaka : raw[i - 1].consumedTaka;
    return {
      date: entry.date,
      kWh: parseFloat(Math.max(0, entry.consumedUnit - prevUnit).toFixed(3)),
      taka: parseFloat(Math.max(0, entry.consumedTaka - prevTaka).toFixed(2)),
    };
  });

  // Drop the first entry since its delta is always 0 (no previous day)
  return Response.json({ data: data.length > 1 ? data.slice(1) : data });
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
