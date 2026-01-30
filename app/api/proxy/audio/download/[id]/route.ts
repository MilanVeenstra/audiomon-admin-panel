/**
 * Proxy route for audio download
 * GET /api/proxy/audio/download/:id - Download audio file
 */

import { API_CONFIG } from "@/lib/api/config";
import { getAuthToken } from "@/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get token from cookies
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch audio file from backend
    const url = `${API_CONFIG.BACKEND_BASE_URL}/api/audioDownload/${id}`;
    const response = await fetch(url, {
      headers: {
        [API_CONFIG.AUTH_HEADER_NAME]: token,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Download failed:", text);
      return NextResponse.json(
        { error: "Failed to download audio" },
        { status: response.status }
      );
    }

    // Get the audio blob
    const blob = await response.blob();

    // Forward the response with appropriate headers
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
        "Content-Disposition":
          response.headers.get("Content-Disposition") ||
          `attachment; filename="audio-${id}.mp3"`,
      },
    });
  } catch (error) {
    console.error("Failed to download audio:", error);
    return NextResponse.json(
      { error: "Failed to download audio" },
      { status: 500 }
    );
  }
}
