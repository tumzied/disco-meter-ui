import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, createdAt: true },
  });

  if (!user) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(user);
}
