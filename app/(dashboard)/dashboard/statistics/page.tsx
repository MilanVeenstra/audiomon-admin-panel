"use client";

/**
 * Statistics Page
 * Phase 4 - Display user and token counts
 */

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Statistics {
  users: number;
  tokens: number;
}

export default function StatisticsPage() {
  const router = useRouter();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch statistics on mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/proxy/admin/statistics");
      const data = await response.json();

      if (!response.ok) {
        // Handle auth failure
        if (data.error === "Auth failed") {
          handleAuthFailure();
          return;
        }
        throw new Error(data.error || "Failed to fetch statistics");
      }

      setStatistics(data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch statistics"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthFailure = () => {
    // Clear cookies by calling logout endpoint
    fetch("/api/auth/logout", { method: "POST" })
      .then(() => {
        router.push("/login");
        router.refresh();
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        router.push("/login");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Overview of system metrics
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Loading Skeleton */}
            <div className="animate-pulse rounded-lg bg-white p-6 shadow">
              <div className="h-4 w-20 rounded bg-gray-200"></div>
              <div className="mt-4 h-12 w-32 rounded bg-gray-200"></div>
            </div>
            <div className="animate-pulse rounded-lg bg-white p-6 shadow">
              <div className="h-4 w-20 rounded bg-gray-200"></div>
              <div className="mt-4 h-12 w-32 rounded bg-gray-200"></div>
            </div>
          </div>
        ) : statistics ? (
          /* Statistics Cards */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {/* Users Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Total Users
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {statistics.users.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-500">
                    Registered users in the system
                  </span>
                </div>
              </div>
            </div>

            {/* Tokens Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Active Tokens
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {statistics.tokens.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-500">
                    Authentication tokens issued
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Refresh Button */}
        {!isLoading && statistics && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={fetchStatistics}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Statistics
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
