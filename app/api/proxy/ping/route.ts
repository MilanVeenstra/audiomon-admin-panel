/**
 * Proxy route for backend ping endpoint
 * GET /api/proxy/ping -> backend GET /api/ping
 */

import { backendGet } from "@/lib/api/backendClient";
import { PingResponse } from "@/lib/api/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await backendGet<PingResponse>("/api/ping");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Ping failed:", error);
    return NextResponse.json(
      { error: "Failed to ping backend" },
      { status: 500 }
    );
  }
}
