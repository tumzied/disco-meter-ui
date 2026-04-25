import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const meterId = parseInt(id, 10);

  const meter = await db.meter.findFirst({
    where: { id: meterId, userId: session.userId },
  });
  if (!meter) return Response.json({ error: "Not found" }, { status: 404 });

  await db.meter.delete({ where: { id: meterId } });
  return Response.json({ ok: true });
}
