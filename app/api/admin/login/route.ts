import { NextResponse } from "next/server";
import {
  adminSessionCookieName,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  isAdminConfigured,
  verifyAdminPassword,
} from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  const loginUrl = new URL("/admin", request.url);

  if (!isAdminConfigured()) {
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl);
  }

  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!verifyAdminPassword(password)) {
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));

  response.cookies.set(
    adminSessionCookieName,
    createAdminSessionToken(),
    getAdminSessionCookieOptions(),
  );

  return response;
}
