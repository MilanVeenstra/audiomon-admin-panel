/**
 * Proxy route for admin user operations
 * PUT /api/proxy/admin/user/:id - Toggle user role
 * DELETE /api/proxy/admin/user/:id - Delete user
 */

import { backendPut, backendDelete } from "@/lib/api/backendClient";
import { ApiError } from "@/lib/api/types";
import { getAuthToken } from "@/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Toggle user role (admin ↔ user)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get admin token from cookies
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Call backend toggle endpoint
    const response = await backendPut<{ success?: string } | ApiError>(
      `/api/admin/user/${id}`,
      undefined,
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
    console.error("Failed to toggle user role:", error);
    return NextResponse.json(
      { error: "Failed to toggle user role" },
      { status: 500 }
    );
  }
}

/**
 * Delete user
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get admin token from cookies
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Call backend delete endpoint
    const response = await backendDelete<{ success?: string } | ApiError>(
      `/api/admin/user/${id}`,
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
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
