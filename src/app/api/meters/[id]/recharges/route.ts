import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRechargeHistory } from "@/lib/desco";
import type { NextRequest } from "next/server";

type RawEntry = {
  orderID: string;
  token: string;
  sequence: string;
  totalAmount: number;
  energyAmount: number;
  chargeAmount: number;
  VAT: number;
  rebate: number;
  rechargeDate: string;
  rechargeOperator: string;
  orderStatus: string;
};

const OPERATOR_LABELS: Record<string, string> = {
  bkash: "bKash",
  opupay: "uPay",
  nagad: "Nagad",
  rocket: "Rocket",
  dbbl: "DBBL",
  cash: "Cash",
};

function normalizeOperator(raw: string): string {
  return OPERATOR_LABELS[raw.toLowerCase()] ?? raw;
}

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
  const from = sp.get("from") ?? daysAgo(90);
  const to = sp.get("to") ?? today();

  const result = await getRechargeHistory(meter.accountNo, from, to);
  const raw = (result.data ?? []) as RawEntry[];

  const data = raw.map((r) => ({
    orderID: r.orderID,
    token: r.token,
    sequence: r.sequence,
    totalAmount: r.totalAmount,
    energyAmount: r.energyAmount,
    chargeAmount: r.chargeAmount,
    vat: r.VAT,
    rebate: r.rebate,
    date: r.rechargeDate,
    operator: normalizeOperator(r.rechargeOperator),
    status: r.orderStatus,
  }));

  return Response.json({ data, total: data.length });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
