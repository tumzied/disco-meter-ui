import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCustomerInfo, getCustomerLocation } from "@/lib/desco";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const meter = await db.meter.findFirst({
    where: { id: parseInt(id, 10), userId: session.userId },
  });
  if (!meter) return Response.json({ error: "Not found" }, { status: 404 });

  const [info, loc] = await Promise.allSettled([
    getCustomerInfo(meter.accountNo, meter.meterNo),
    getCustomerLocation(meter.accountNo),
  ]);

  return Response.json({
    info: info.status === "fulfilled" ? info.value : null,
    location: loc.status === "fulfilled" ? loc.value : null,
  });
}
