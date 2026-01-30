// Middleware - Beschermt dashboard routes (alleen admins)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAMES = {
  TOKEN: "am_token",
  ROLE: "am_role",
} as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Alleen /dashboard/** routes beschermen
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Haal cookies op
  const token = request.cookies.get(COOKIE_NAMES.TOKEN)?.value;
  const role = request.cookies.get(COOKIE_NAMES.ROLE)?.value;

  // Geen cookies → redirect naar login
  if (!token || !role) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Role is "user" → weiger toegang
  if (role !== "admin") {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);

    // Verwijder cookies
    response.cookies.delete(COOKIE_NAMES.TOKEN);
    response.cookies.delete(COOKIE_NAMES.ROLE);

    return response;
  }

  // Role is "admin" → toegang toegestaan
  return NextResponse.next();
}

// Configureer welke routes middleware gebruiken
export const config = {
  matcher: ["/dashboard/:path*"],
};
