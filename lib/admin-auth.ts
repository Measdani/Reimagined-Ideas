import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminSessionCookieName = "ri_admin_session";

const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;

function getAdminConfig() {
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!password || !sessionSecret) {
    return null;
  }

  return {
    password,
    sessionSecret,
  };
}

function createSignature(value: string, sessionSecret: string) {
  return createHmac("sha256", sessionSecret).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function validateSessionToken(token: string) {
  const config = getAdminConfig();

  if (!config) {
    return false;
  }

  try {
    const decodedToken = Buffer.from(token, "base64url").toString("utf8");
    const parsedToken = JSON.parse(decodedToken) as {
      payload?: string;
      signature?: string;
    };

    if (typeof parsedToken.payload !== "string" || typeof parsedToken.signature !== "string") {
      return false;
    }

    const expectedSignature = createSignature(parsedToken.payload, config.sessionSecret);

    if (!safeEqual(parsedToken.signature, expectedSignature)) {
      return false;
    }

    const payload = JSON.parse(parsedToken.payload) as {
      issuedAt?: number;
    };

    if (typeof payload.issuedAt !== "number") {
      return false;
    }

    const sessionAge = Date.now() - payload.issuedAt;

    return sessionAge >= 0 && sessionAge <= sessionMaxAgeSeconds * 1000;
  } catch {
    return false;
  }
}

export function isAdminConfigured() {
  return getAdminConfig() !== null;
}

export function verifyAdminPassword(password: string) {
  const config = getAdminConfig();

  if (!config) {
    return false;
  }

  return safeEqual(password, config.password);
}

export function createAdminSessionToken() {
  const config = getAdminConfig();

  if (!config) {
    throw new Error("Admin authentication is not configured.");
  }

  const payload = JSON.stringify({
    issuedAt: Date.now(),
  });

  const signature = createSignature(payload, config.sessionSecret);

  return Buffer.from(JSON.stringify({ payload, signature }), "utf8").toString("base64url");
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  };
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(adminSessionCookieName)?.value;

  if (!sessionToken) {
    return false;
  }

  return validateSessionToken(sessionToken);
}
