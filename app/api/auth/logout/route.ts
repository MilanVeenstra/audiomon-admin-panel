/**
 * Logout API route
 * POST /api/auth/logout
 *
 * Clears authentication cookies
 */

import { clearAuthCookies } from "@/lib/auth/cookies";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await clearAuthCookies();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Logout failed:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
