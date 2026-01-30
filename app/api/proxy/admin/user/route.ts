/**
 * Proxy route for admin user management
 * GET /api/proxy/admin/user - List all users
 */

import { backendGet } from "@/lib/api/backendClient";
import { ApiError, User } from "@/lib/api/types";
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

    // Call backend admin endpoint
    const response = await backendGet<User[] | ApiError>(
      "/api/admin/user",
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
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
