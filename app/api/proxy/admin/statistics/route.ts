/**
 * Proxy route for admin statistics
 * GET /api/proxy/admin/statistics - Get user and token counts
 */

import { backendGet } from "@/lib/api/backendClient";
import { ApiError, Statistics } from "@/lib/api/types";
import { getAuthToken } from "@/lib/auth/cookies";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get admin token from cookies
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Call backend admin statistics endpoint
    const response = await backendGet<Statistics | ApiError>(
      "/api/admin/statistics",
      token
    );

    // Check for auth failure
    if ("error" in response && response.error === "Auth failed") {
      return NextResponse.json(
        { error: "Auth failed" },
        { status: 401 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
