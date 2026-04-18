import { NextResponse } from "next/server";
import { adminSessionCookieName, getAdminSessionCookieOptions } from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin", request.url));

  response.cookies.set(adminSessionCookieName, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });

  return response;
}
