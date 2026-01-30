/**
 * Proxy route for audio list
 * GET /api/proxy/audio/list - List all audio items
 */

import { backendGet } from "@/lib/api/backendClient";
import { ApiError, AudioItem } from "@/lib/api/types";
import { getAuthToken } from "@/lib/auth/cookies";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get token from cookies
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Call backend audioList endpoint
    const response = await backendGet<AudioItem[] | ApiError>(
      "/api/audioList",
      token
    );

    // Check for auth failure
    if ("error" in response) {
      if (response.error === "Auth failed" || response.error === "Auth failed1") {
        return NextResponse.json(
          { error: "Auth failed" },
          { status: 401 }
        );
      }
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch audio list:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio list" },
      { status: 500 }
    );
  }
}
