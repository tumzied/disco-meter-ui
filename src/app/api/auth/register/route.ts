import { db } from "@/lib/db";
import { signToken, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password || password.length < 6) {
    return Response.json({ error: "Valid email and password (min 6 chars) required" }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Email already registered" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await db.user.create({ data: { email, password: hash } });

  const token = signToken({ userId: user.id, email: user.email });
  await setSessionCookie(token);

  return Response.json({ id: user.id, email: user.email }, { status: 201 });
}
