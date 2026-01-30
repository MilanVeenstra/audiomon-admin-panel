// Cookie management voor authenticatie

import { cookies } from "next/headers";

export const COOKIE_NAMES = {
  TOKEN: "am_token",
  ROLE: "am_role",
} as const;

// Zet authenticatie cookies
export async function setAuthCookies(token: string, role: string) {
  const cookieStore = await cookies();

  // Zet token (HttpOnly voor beveiliging)
  cookieStore.set(COOKIE_NAMES.TOKEN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dagen
    path: "/",
  });

  // Zet role (ook HttpOnly)
  cookieStore.set(COOKIE_NAMES.ROLE, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dagen
    path: "/",
  });
}

// Haal authenticatie token op uit cookies
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.TOKEN)?.value;
}

// Haal user role op uit cookies
export async function getAuthRole(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.ROLE)?.value;
}

// Verwijder alle authenticatie cookies
export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAMES.TOKEN);
  cookieStore.delete(COOKIE_NAMES.ROLE);
}

// Controleer of user geauthenticeerd is
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  const role = await getAuthRole();
  return !!token && !!role;
}

// Controleer of user admin is
export async function isAdmin(): Promise<boolean> {
  const role = await getAuthRole();
  return role === "admin";
}
