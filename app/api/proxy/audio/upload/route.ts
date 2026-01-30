// Proxy route voor audio upload

import { API_CONFIG } from "@/lib/api/config";
import { getAuthToken } from "@/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Haal token op uit cookies
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Haal form data op
    const formData = await request.formData();

    // Stuur door naar backend (POST /api/uploadAudio)
    const url = `${API_CONFIG.BACKEND_BASE_URL}/api/uploadAudio`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        [API_CONFIG.AUTH_HEADER_NAME]: token,
      },
      body: formData,
    });

    // Check of response HTML is (404 error)
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("text/html")) {
      return NextResponse.json(
        { error: "Upload endpoint returned HTML (may be 404)" },
        { status: 404 }
      );
    }

    // Parse JSON response
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        data,
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload audio" },
      { status: 500 }
    );
  }
}
