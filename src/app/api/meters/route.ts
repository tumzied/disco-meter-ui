import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCustomerInfo } from "@/lib/desco";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const meters = await db.meter.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "asc" },
  });

  return Response.json(meters);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { accountNo, meterNo, nickname } = await request.json();

  if (!accountNo || !meterNo) {
    return Response.json({ error: "accountNo and meterNo are required" }, { status: 400 });
  }

  // validate meter exists on DESCO
  const info = await getCustomerInfo(String(accountNo), String(meterNo));
  if (info.code !== 200 || !info.data) {
    return Response.json({ error: "Meter not found in DESCO system" }, { status: 404 });
  }

  const existing = await db.meter.findFirst({
    where: { userId: session.userId, accountNo: String(accountNo) },
  });
  if (existing) {
    return Response.json({ error: "Meter already registered" }, { status: 409 });
  }

  const meter = await db.meter.create({
    data: {
      userId: session.userId,
      accountNo: String(accountNo),
      meterNo: String(meterNo),
      nickname: nickname ? String(nickname) : null,
    },
  });

  return Response.json(meter, { status: 201 });
}
