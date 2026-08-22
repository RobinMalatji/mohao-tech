import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import { COOKIE_NAME } from "@/lib/auth-cookie";

const MAX_AGE = 60 * 60 * 24 * 7;

export type AdminSession = {
  sub: string;
  email: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET must be set to a long random value.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: AdminSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function readSessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret(), {
    algorithms: ["HS256"],
  });

  if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
    return null;
  }

  return { sub: payload.sub, email: payload.email } satisfies AdminSession;
}

export async function setSessionCookie(session: AdminSession) {
  const token = await createSessionToken(session);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return await readSessionToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function authenticateAdmin(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!user) return null;

  const matches = await compare(password, user.passwordHash);
  if (!matches) return null;

  return { id: user.id, email: user.email };
}

export { COOKIE_NAME };
