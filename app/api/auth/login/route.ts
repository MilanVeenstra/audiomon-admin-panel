/**
 * Login API route
 * POST /api/auth/login
 *
 * Flow:
 * 1. Receive username/password from client
 * 2. Call backend GET /api/login with query params
 * 3. Set cookies (am_token, am_role)
 * 4. Return success/error
 */

import { backendPost } from "@/lib/api/backendClient";
import { ApiError, LoginResponse } from "@/lib/api/types";
import { setAuthCookies } from "@/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Call backend login endpoint (POST with JSON body)
    try {
      const response = await backendPost<LoginResponse | ApiError>(
        "/api/login",
        { username, password }
      );

      // Check for error response
      if ("error" in response) {
        return NextResponse.json(
          { error: response.error },
          { status: 401 }
        );
      }

      // Success - set cookies
      const { token, role } = response;
      await setAuthCookies(token, role);

      return NextResponse.json({
        success: true,
        role,
      });
    } catch (error) {
      console.error("Backend login failed:", error);
      return NextResponse.json(
        { error: "Failed to connect to authentication server" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Login request failed:", error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
